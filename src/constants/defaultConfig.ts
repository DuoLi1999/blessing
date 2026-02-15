import type { ApiConfig } from '../types'

interface DefaultProvider {
  key: string | undefined
  baseUrl: string
  model: string
}

const DEFAULT_PROVIDERS: DefaultProvider[] = [
  {
    key: import.meta.env.VITE_DEFAULT_API_KEY,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
  },
  {
    key: import.meta.env.VITE_DEEPSEEK_API_KEY,
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  {
    key: import.meta.env.VITE_MINIMAX_API_KEY,
    baseUrl: 'https://api.minimax.chat/v1',
    model: 'MiniMax-Text-01',
  },
]

/** All available built-in configs (those with keys set) */
export const defaultConfigs: ApiConfig[] = DEFAULT_PROVIDERS
  .filter((p): p is DefaultProvider & { key: string } => !!p?.key)
  .map((p) => ({
    apiKey: p.key,
    baseUrl: p.baseUrl,
    model: p.model,
  }))

/** Pick a random built-in config, or null if none available */
export function getRandomDefaultConfig(): ApiConfig | null {
  if (defaultConfigs.length === 0) return null
  return defaultConfigs[Math.floor(Math.random() * defaultConfigs.length)]
}
