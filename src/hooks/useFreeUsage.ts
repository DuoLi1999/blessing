import { useState, useCallback } from 'react'

const STORAGE_KEY = 'blessing-free-used'

export function useFreeUsage() {
  const [freeUsed, setFreeUsed] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )

  const markFreeUsed = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setFreeUsed(true)
  }, [])

  return { freeUsed, markFreeUsed }
}
