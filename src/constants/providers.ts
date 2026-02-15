export interface ProviderPreset {
  id: string
  name: string
  baseUrl: string
  model: string
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  // 国内
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  {
    id: 'dashscope',
    name: 'Qwen / 通义',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
  },
  {
    id: 'zhipu',
    name: 'GLM / 智谱',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
  },
  {
    id: 'moonshot',
    name: 'Moonshot / Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k',
  },
  {
    id: 'doubao',
    name: 'Doubao / 豆包',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    model: 'doubao-pro-32k',
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow / 硅基',
    baseUrl: 'https://api.siliconflow.cn/v1',
    model: 'deepseek-ai/DeepSeek-V3',
  },
  {
    id: 'baichuan',
    name: 'Baichuan / 百川',
    baseUrl: 'https://api.baichuan-ai.com/v1',
    model: 'Baichuan4',
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    model: 'MiniMax-Text-01',
  },
  // 海外
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  {
    id: 'gemini',
    name: 'Gemini / Google',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.0-flash',
  },
  {
    id: 'grok',
    name: 'Grok / xAI',
    baseUrl: 'https://api.x.ai/v1',
    model: 'grok-2',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    model: 'mistral-small-latest',
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
  },
]
