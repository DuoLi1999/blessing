import type { ModelInfo, ApiConfig } from '../types'

export interface StreamCallbacks {
  onToken: (token: string) => void
  onDone: () => void
  onError: (error: Error) => void
}

/** Fetch available models from the server */
export async function fetchModels(): Promise<ModelInfo[]> {
  const res = await fetch('/api/models')
  if (!res.ok) {
    throw new Error(`获取模型列表失败 (${res.status})`)
  }
  const data = await res.json()
  return data.models || []
}

/** Create a streaming generation request */
export function createGenerateStream(
  model: string,
  options: {
    relationship: string
    style: string
    length: string
    name?: string
    note?: string
    reference?: string
  },
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
  userCredentials?: ApiConfig | null,
): void {
  const body: Record<string, unknown> = { model, ...options }
  if (userCredentials) {
    body.userApiKey = userCredentials.apiKey
    body.userBaseUrl = userCredentials.baseUrl
    body.userModel = userCredentials.model
  }

  fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const body = await response.text().catch(() => '')
        let msg: string
        try {
          msg = JSON.parse(body).error || body
        } catch {
          msg = body
        }
        if (response.status === 401) {
          throw new Error('API Key 无效，请联系管理员')
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
            if (parsed.token) {
              callbacks.onToken(parsed.token)
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
