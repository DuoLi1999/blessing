import type { ApiConfig } from '../types'

/** Built-in default API config using env var, so users can generate without configuring */
export function getDefaultApiConfig(): ApiConfig | null {
  const key = import.meta.env.VITE_DEFAULT_API_KEY
  if (!key) return null
  return {
    apiKey: key,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
  }
}
