import { useState, useEffect, useCallback } from 'react'
import type { ModelInfo } from '../types'
import { fetchModels } from '../services/llm'

const STORAGE_KEY = 'blessing-selected-model'

export function useModelSelect() {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [selectedModel, setSelectedModelState] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchModels()
      .then((list) => {
        if (cancelled) return
        setModels(list)

        // Restore saved selection, or default to first model
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && list.some((m) => m.id === saved)) {
          setSelectedModelState(saved)
        } else if (list.length > 0) {
          setSelectedModelState(list[0].id)
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '获取模型列表失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const setSelectedModel = useCallback((id: string) => {
    setSelectedModelState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch { /* ignore */ }
  }, [])

  return { models, selectedModel, setSelectedModel, loading, error }
}
