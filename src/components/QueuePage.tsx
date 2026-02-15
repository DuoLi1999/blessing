import { useState, useEffect, useRef } from 'react'

interface QueuePageProps {
  onConfigureKey: () => void
  onClose: () => void
}

type Phase = 'queuing' | 'failed'

export default function QueuePage({ onConfigureKey, onClose }: QueuePageProps) {
  const [phase, setPhase] = useState<Phase>('queuing')
  const [position, setPosition] = useState(() => Math.floor(Math.random() * (342 - 86 + 1)) + 86)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Phase 1: queue animation with decreasing position
  useEffect(() => {
    if (phase !== 'queuing') return

    function tick() {
      const delay = (Math.random() * 1.5 + 0.8) * 1000
      timerRef.current = setTimeout(() => {
        setPosition((prev) => {
          const decrease = Math.floor(Math.random() * 8) + 3
          return Math.max(1, prev - decrease)
        })
        tick()
      }, delay)
    }
    tick()
    return () => clearTimeout(timerRef.current)
  }, [phase])

  // Auto-transition to phase 2 after 5-8 seconds
  useEffect(() => {
    const delay = (Math.random() * 3 + 5) * 1000 // 5-8 seconds
    phaseTimerRef.current = setTimeout(() => {
      setPhase('failed')
    }, delay)
    return () => clearTimeout(phaseTimerRef.current)
  }, [])

  const estimatedMinutes = Math.max(1, Math.round(position * 0.3))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-warm rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center border border-accent-gold/30">
        {phase === 'queuing' ? (
          <>
            {/* Animated queue icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center" style={{ animation: 'queue-pulse 2s ease-in-out infinite' }}>
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-black text-text-main mb-2">排队中</h2>
            <p className="text-text-muted text-sm mb-6">当前使用公共资源需排队等待</p>

            {/* Queue position */}
            <div className="bg-white rounded-xl p-5 mb-6 border border-accent-gold/20">
              <div className="text-4xl font-black text-primary mb-1">{position}</div>
              <div className="text-xs text-text-muted">前方还有 {position} 人排队</div>
              <div className="mt-2 text-xs text-accent-gold font-medium">预计等待 {estimatedMinutes} 分钟</div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-text-muted text-sm hover:text-text-main transition-colors"
            >
              返回
            </button>
          </>
        ) : (
          <>
            {/* Error icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-black text-text-main mb-2">生成失败</h2>
            <p className="text-text-muted text-sm mb-6">服务器繁忙，无法完成生成请求</p>

            {/* CTA */}
            <button
              onClick={onConfigureKey}
              className="shimmer-btn w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide mb-3"
            >
              <span className="relative z-10">配置 API Key，立即生成</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-text-muted text-sm hover:text-text-main transition-colors"
            >
              返回
            </button>
          </>
        )}
      </div>
    </div>
  )
}
