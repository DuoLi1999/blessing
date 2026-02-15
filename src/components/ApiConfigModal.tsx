import { useState } from 'react'
import type { ApiConfig } from '../types'
import { PROVIDER_PRESETS } from '../constants/providers'

interface ApiConfigModalProps {
  currentConfig: ApiConfig | null
  onSave: (config: ApiConfig) => void
  onClear: () => void
  onClose: () => void
}

export default function ApiConfigModal({ currentConfig, onSave, onClear, onClose }: ApiConfigModalProps) {
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey ?? '')
  const [baseUrl, setBaseUrl] = useState(currentConfig?.baseUrl ?? '')
  const [model, setModel] = useState(currentConfig?.model ?? '')

  const canSave = apiKey.trim() && baseUrl.trim() && model.trim()

  function handleSave() {
    if (!canSave) return
    onSave({ apiKey: apiKey.trim(), baseUrl: baseUrl.trim(), model: model.trim() })
  }

  function handlePreset(presetId: string) {
    const preset = PROVIDER_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setBaseUrl(preset.baseUrl)
      setModel(preset.model)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg-warm rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-accent-gold/30" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-serif font-black text-text-main mb-1">配置 API Key</h2>
        <p className="text-text-muted text-xs mb-5">配置后即可无限次即时生成，Key 仅存储在本地浏览器</p>

        {/* Provider presets */}
        <div className="mb-5">
          <label className="text-xs font-bold text-text-muted mb-2 block">快捷选择服务商</label>
          <div className="flex flex-wrap gap-2">
            {PROVIDER_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePreset(p.id)}
                className="px-3 py-1.5 text-xs rounded-lg border border-accent-gold/30 bg-white hover:border-primary hover:text-primary transition-colors font-medium"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-text-muted mb-1 block">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-accent-gold/30 bg-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted mb-1 block">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.deepseek.com"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-accent-gold/30 bg-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted mb-1 block">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="deepseek-chat"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-accent-gold/30 bg-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {currentConfig && (
            <button
              onClick={onClear}
              className="px-4 py-2.5 text-sm rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors font-medium"
            >
              清除配置
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm rounded-xl border border-accent-gold/30 text-text-muted hover:text-text-main transition-colors font-medium flex-1"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="shimmer-btn px-6 py-2.5 rounded-xl text-white text-sm font-bold flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">保存</span>
          </button>
        </div>
      </div>
    </div>
  )
}
