import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProviderConfigByModel } from '../lib/providers.js'
import { buildPrompt } from '../lib/promptBuilder.js'
import type { FewShotData } from '../lib/promptBuilder.js'
import { getBlessings, pickRandom } from '../lib/blessingStore.js'
import type { Relationship, Style, Length } from '../lib/types.js'

export const config = {
  maxDuration: 60,
}

const VALID_RELATIONSHIPS: Relationship[] = ['elder', 'colleague', 'leader', 'friend', 'partner', 'customer']
const VALID_STYLES: Style[] = ['normal', 'literary', 'abstract']
const VALID_LENGTHS: Length[] = ['short', 'medium', 'long']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { model, relationship, style, length, name, note, reference, userApiKey, userBaseUrl, userModel } = req.body || {}

  // Validate required fields
  const hasUserCredentials = userApiKey && userBaseUrl && userModel
  if ((!model && !hasUserCredentials) || !relationship || !style || !length) {
    return res.status(400).json({ error: '缺少必要参数: model, relationship, style, length' })
  }

  if (!VALID_RELATIONSHIPS.includes(relationship)) {
    return res.status(400).json({ error: `无效的关系类型: ${relationship}` })
  }
  if (!VALID_STYLES.includes(style)) {
    return res.status(400).json({ error: `无效的风格: ${style}` })
  }
  if (!VALID_LENGTHS.includes(length)) {
    return res.status(400).json({ error: `无效的长度: ${length}` })
  }

  // Determine API credentials: user-provided or server-side
  let apiKey: string
  let baseUrl: string
  let actualModel: string

  if (userApiKey && userBaseUrl && userModel) {
    apiKey = userApiKey
    baseUrl = userBaseUrl
    actualModel = userModel
  } else {
    const providerConfig = getProviderConfigByModel(model)
    if (!providerConfig) {
      return res.status(400).json({ error: `模型不可用: ${model}` })
    }
    apiKey = providerConfig.apiKey
    baseUrl = providerConfig.baseUrl
    actualModel = providerConfig.model
  }

  // Get few-shot examples
  const { entries, matchLevel } = getBlessings(relationship, style, length)
  const fewShotExamples = entries.length > 0
    ? pickRandom(entries, 3).map((e) => e.text)
    : []
  const fewShot: FewShotData | undefined = fewShotExamples.length > 0
    ? { examples: fewShotExamples, matchLevel }
    : undefined

  // Build prompt
  const { system, user } = buildPrompt(
    { relationship, style, length, name, note, reference },
    fewShot,
  )

  const url = `${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: actualModel,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.9,
        max_tokens: 1024,
        stream: true,
      }),
    })

    if (!upstream.ok) {
      const body = await upstream.text().catch(() => '')
      return res.status(upstream.status).json({
        error: `上游 API 错误 (${upstream.status}): ${body.slice(0, 300)}`,
      })
    }

    // SSE streaming response
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const reader = (upstream.body as ReadableStream<Uint8Array>).getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)

          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n')
            break
          }

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              res.write(`data: ${JSON.stringify({ token: content })}\n\n`)
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch {
      // Client disconnected or upstream error
    } finally {
      res.end()
    }
  } catch (err) {
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : String(err)
      res.status(502).json({ error: `代理请求失败: ${message}` })
    }
  }
  } catch (outerErr) {
    console.error('Unhandled error in generate handler:', outerErr)
    if (!res.headersSent) {
      const message = outerErr instanceof Error ? outerErr.message : String(outerErr)
      res.status(500).json({ error: `服务器内部错误: ${message}` })
    }
  }
}
