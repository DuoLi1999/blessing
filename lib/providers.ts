import type { ModelInfo } from './types'

interface ProviderConfig {
  id: string
  label: string
  baseUrl: string
  defaultModel: string
  apiKeyEnv: string
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'deepseek',
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com',
    defaultModel: 'gpt-4o-mini',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  {
    id: 'zhipu',
    label: '智谱 GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas',
    defaultModel: 'glm-4-flash',
    apiKeyEnv: 'ZHIPU_API_KEY',
  },
  {
    id: 'moonshot',
    label: '月之暗面 Kimi',
    baseUrl: 'https://api.moonshot.cn',
    defaultModel: 'moonshot-v1-8k',
    apiKeyEnv: 'MOONSHOT_API_KEY',
  },
  {
    id: 'dashscope',
    label: '阿里通义',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode',
    defaultModel: 'qwen-plus',
    apiKeyEnv: 'DASHSCOPE_API_KEY',
  },
  {
    id: 'siliconflow',
    label: '硅基流动',
    baseUrl: 'https://api.siliconflow.cn',
    defaultModel: 'Qwen/Qwen3-8B',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
]

/** Returns only models whose API key is configured in environment variables */
export function getAvailableModels(): ModelInfo[] {
  return PROVIDERS
    .filter((p) => {
      const key = process.env[p.apiKeyEnv]
      return key && key.trim().length > 0
    })
    .map((p) => ({
      id: p.defaultModel,
      name: `${p.label} (${p.defaultModel})`,
      provider: p.id,
    }))
}

/** Returns full provider config including the server-side API key */
export function getProviderConfigByModel(modelId: string): {
  baseUrl: string
  model: string
  apiKey: string
} | null {
  const provider = PROVIDERS.find((p) => p.defaultModel === modelId)
  if (!provider) return null

  const apiKey = process.env[provider.apiKeyEnv]
  if (!apiKey || !apiKey.trim()) return null

  return {
    baseUrl: provider.baseUrl,
    model: provider.defaultModel,
    apiKey: apiKey.trim(),
  }
}
