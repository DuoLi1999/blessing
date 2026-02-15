import { useState, useCallback } from 'react'
import type { ApiConfig } from '../types'

const STORAGE_KEY = 'blessing-api-config'

function loadConfig(): ApiConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.apiKey && parsed.baseUrl && parsed.model) return parsed
    return null
  } catch {
    return null
  }
}

export function useApiConfig() {
  const [apiConfig, setApiConfigState] = useState<ApiConfig | null>(loadConfig)

  const setApiConfig = useCallback((config: ApiConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    setApiConfigState(config)
  }, [])

  const clearApiConfig = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setApiConfigState(null)
  }, [])

  return { apiConfig, setApiConfig, clearApiConfig }
}
