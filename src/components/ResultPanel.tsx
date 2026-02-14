import { useRef, useEffect, useState, useCallback } from 'react'
import type { StyleResult } from '../hooks/useGenerate'
import type { GenerateStatus } from '../hooks/useGenerate'

interface Props {
  results: StyleResult[]
  overallStatus: GenerateStatus
  onCopy: () => void
  onRegenerate: () => void
  onCancel: () => void
  onReset: () => void
}

export default function ResultPanel({ results, overallStatus, onCopy, onRegenerate, onCancel, onReset }: Props) {
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (overallStatus === 'generating' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [overallStatus])

  return (
    <div ref={resultRef} className="relative animate-fade-in-up">
      <div className="space-y-5">
        {results.map((r) => (
          <StyleCard key={r.style} result={r} onCopy={onCopy} />
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col gap-3">
        {overallStatus === 'generating' ? (
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 text-sm font-semibold"
          >
            <span className="text-lg">&#9724;</span>
            停止生成
          </button>
        ) : (
          <>
            <button
              onClick={onRegenerate}
              className="shimmer-btn w-full py-4 rounded-lg font-serif font-bold text-lg tracking-widest flex items-center justify-center gap-3 border border-red-900/20"
            >
              <span className="text-accent-gold text-xl">&#x21BB;</span>
              重新生成
            </button>
            <button
              onClick={onReset}
              className="self-center flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 text-text-muted hover:text-primary hover:border-primary transition-all duration-300 text-xs font-medium"
            >
              <span className="text-sm">&#x2190;</span>
              返回修改
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function StyleCard({ result, onCopy }: { result: StyleResult; onCopy: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!result.text) return
    try {
      await navigator.clipboard.writeText(result.text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = result.text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    onCopy()
    setTimeout(() => setCopied(false), 2000)
  }, [result.text, onCopy])

  const isDone = result.status === 'done'
  const isGenerating = result.status === 'generating'
  const isError = result.status === 'error'

  return (
    <div
      className="relative rounded-xl"
      style={isDone ? { animation: 'pulse-glow 2s ease-in-out infinite' } : undefined}
    >
      <div className="relative bg-white p-1.5 rounded-xl shadow-xl" style={{ boxShadow: '0 20px 40px -10px rgba(179, 36, 40, 0.12)' }}>
        <div className="relative border border-[#EBE3D0] bg-bg-warm overflow-hidden rounded-lg flex">
          {/* Left style block */}
          <div className="relative shrink-0 w-12 bg-gradient-to-b from-primary to-primary-dark flex flex-col items-center justify-center gap-1 py-4">
            {/* Vertical label */}
            <span
              className="text-white font-serif font-bold text-sm tracking-[0.3em]"
              style={{ writingMode: 'vertical-rl' }}
            >
              {result.label}
            </span>
            {/* Status indicator */}
            <div className="mt-1.5">
              {isGenerating && (
                <span className="inline-block text-xs text-accent-gold animate-spin">&#x21BB;</span>
              )}
              {isDone && (
                <span className="text-xs text-accent-gold">&#10003;</span>
              )}
              {isError && (
                <span className="text-xs text-red-300">&#10007;</span>
              )}
            </div>
            {/* Decorative diamond */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-accent-gold/60" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-accent-gold/60" />
          </div>

          {/* Right content area */}
          <div className="relative flex-1 p-5 sm:p-6 overflow-hidden">
            {/* Corner ornaments (top-right and bottom-right only) */}
            <svg className="absolute top-2 right-2 w-5 h-5 text-primary opacity-60" fill="none" viewBox="0 0 100 100">
              <path d="M0 0 L40 0 L40 10 L10 10 L10 40 L0 40 Z" fill="currentColor" />
            </svg>
            <svg className="absolute bottom-2 right-2 w-5 h-5 text-primary opacity-60 rotate-180" fill="none" viewBox="0 0 100 100">
              <path d="M0 0 L40 0 L40 10 L10 10 L10 40 L0 40 Z" fill="currentColor" />
            </svg>
            {/* Watermark */}
            <div className="absolute inset-0 watermark-pattern opacity-30 pointer-events-none" />

            <div className="relative z-10">
              {/* Copy button */}
              {result.text && !isGenerating && (
                <button
                  onClick={handleCopy}
                  className="absolute top-0 right-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 text-text-muted hover:text-primary hover:bg-primary/5 active:bg-primary active:text-white z-20"
                >
                  {copied ? '\u2713 已复制' : '\u2398 复制'}
                </button>
              )}

              {/* Text content */}
              <div className="min-h-[60px] pr-12">
                {isGenerating ? (
                  <p className="font-serif text-lg sm:text-xl text-text-main leading-relaxed font-medium gala-text-sweep">
                    {result.text}
                    <span className="cursor-blink-gold" />
                  </p>
                ) : isError ? (
                  <div className="flex items-center gap-2 py-3">
                    <span className="text-2xl text-primary/40">&#9888;&#65039;</span>
                    <div>
                      <p className="text-sm text-primary font-medium">生成失败</p>
                      <p className="text-xs text-text-muted">{result.error}</p>
                    </div>
                  </div>
                ) : result.text ? (
                  <p className="font-serif text-lg sm:text-xl text-text-main leading-relaxed font-medium">
                    {result.text}
                  </p>
                ) : (
                  <p className="font-serif text-sm text-text-muted/40 text-center py-6 italic">
                    等待生成...
                  </p>
                )}
              </div>

              {/* Stamp decoration */}
              {isDone && (
                <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none rotate-[-15deg]">
                  <div className="border-3 border-primary rounded-md w-14 h-14 flex items-center justify-center">
                    <span className="font-serif text-primary text-xl font-bold">大吉</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
