import type { ModelInfo } from '../types'

interface Props {
  models: ModelInfo[]
  selectedModel: string
  onModelChange: (id: string) => void
  loading: boolean
  error: string
}

export default function ModelSelector({ models, selectedModel, onModelChange, loading, error }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-sm text-text-muted">
        <span className="animate-spin inline-block">&#x21BB;</span>
        加载模型列表...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-text-muted">暂无可用模型，请联系管理员配置</p>
      </div>
    )
  }

  // Group models by provider
  const grouped = models.reduce<Record<string, ModelInfo[]>>((acc, m) => {
    const key = m.provider
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})
  const providers = Object.keys(grouped)

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-text-main shrink-0">AI 模型</label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg border border-accent-gold/30 bg-[#FBF9F4] text-sm text-text-main focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      >
        {providers.length > 1
          ? providers.map((provider) => (
              <optgroup key={provider} label={provider}>
                {grouped[provider].map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
            ))
          : models.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))
        }
      </select>
    </div>
  )
}
