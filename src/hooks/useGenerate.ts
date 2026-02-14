import { useState, useCallback, useRef } from 'react'
import type { Style, GenerateOptions } from '../types'
import { STYLES } from '../types'
import { createGenerateStream } from '../services/llm'

export type GenerateStatus = 'idle' | 'generating' | 'done' | 'error'

export interface StyleResult {
  style: Style
  label: string
  text: string
  status: GenerateStatus
  error: string
}

function makeInitial(): StyleResult[] {
  return STYLES.map((s) => ({
    style: s.id,
    label: s.label,
    text: '',
    status: 'idle' as GenerateStatus,
    error: '',
  }))
}

export function useGenerate(selectedModel: string) {
  const [results, setResults] = useState<StyleResult[]>(makeInitial)
  const abortsRef = useRef<AbortController[]>([])

  const updateOne = useCallback((style: Style, patch: Partial<StyleResult>) => {
    setResults((prev) => prev.map((r) => (r.style === style ? { ...r, ...patch } : r)))
  }, [])

  const generate = useCallback((baseOptions: Omit<GenerateOptions, 'style'>) => {
    // Abort any running streams
    abortsRef.current.forEach((c) => c.abort())
    abortsRef.current = []

    // Reset all results
    setResults(STYLES.map((s) => ({
      style: s.id,
      label: s.label,
      text: '',
      status: 'generating',
      error: '',
    })))

    // Launch 3 parallel streams
    STYLES.forEach((s) => {
      const controller = new AbortController()
      abortsRef.current.push(controller)

      createGenerateStream(
        selectedModel,
        { ...baseOptions, style: s.id },
        {
          onToken: (token) => {
            setResults((prev) => prev.map((r) =>
              r.style === s.id ? { ...r, text: r.text + token } : r
            ))
          },
          onDone: () => {
            updateOne(s.id, { status: 'done' })
          },
          onError: (err) => {
            updateOne(s.id, { status: 'error', error: err.message })
          },
        },
        controller.signal,
      )
    })
  }, [selectedModel, updateOne])

  const cancel = useCallback(() => {
    abortsRef.current.forEach((c) => c.abort())
    abortsRef.current = []
    setResults((prev) => prev.map((r) =>
      r.status === 'generating' ? { ...r, status: 'idle' } : r
    ))
  }, [])

  const reset = useCallback(() => {
    abortsRef.current.forEach((c) => c.abort())
    abortsRef.current = []
    setResults(makeInitial())
  }, [])

  // Overall status
  const allIdle = results.every((r) => r.status === 'idle' && !r.text)
  const anyGenerating = results.some((r) => r.status === 'generating')
  const overallStatus: GenerateStatus = allIdle ? 'idle' : anyGenerating ? 'generating' : 'done'

  return { results, overallStatus, generate, cancel, reset }
}
