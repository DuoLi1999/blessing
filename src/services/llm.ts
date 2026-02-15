import type { ApiConfig, GenerateOptions, Relationship, Style, Length } from '../types'
import { buildPrompt } from './promptBuilder'
import type { FewShotData } from './promptBuilder'
import { getBlessings, pickRandom } from './blessingStore'

export interface StreamCallbacks {
  onToken: (token: string) => void
  onDone: () => void
  onError: (error: Error) => void
}

/** Create a streaming generation request directly to the user's LLM API */
export function createGenerateStream(
  apiConfig: ApiConfig,
  options: GenerateOptions,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): void {
  // Build few-shot examples from local blessings data
  const { entries, matchLevel } = getBlessings(
    options.relationship as Relationship,
    options.style as Style,
    options.length as Length,
  )
  const fewShotExamples = entries.length > 0
    ? pickRandom(entries, 3).map((e) => e.text)
    : []
  const fewShot: FewShotData | undefined = fewShotExamples.length > 0
    ? { examples: fewShotExamples, matchLevel }
    : undefined

  // Build prompt locally
  const { system, user } = buildPrompt(options, fewShot)

  const url = `${apiConfig.baseUrl.replace(/\/+$/, '')}/chat/completions`

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: apiConfig.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.9,
      max_tokens: 1024,
      stream: true,
    }),
    signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        let msg: string
        try {
          msg = JSON.parse(text).error?.message || JSON.parse(text).error || text
        } catch {
          msg = text
        }
        if (response.status === 401) {
          throw new Error('API Key 无效，请检查配置')
        }
        if (response.status === 429) {
          throw new Error('请求过于频繁，请稍后重试')
        }
        throw new Error(`生成失败 (${response.status}): ${msg.slice(0, 200)}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('无法获取响应流')

      const decoder = new TextDecoder()
      let buffer = ''

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
            callbacks.onDone()
            return
          }
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              callbacks.onToken(content)
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
      callbacks.onDone()
    })
    .catch((err) => {
      if (err.name === 'AbortError') return
      callbacks.onError(err instanceof Error ? err : new Error(String(err)))
    })
}
