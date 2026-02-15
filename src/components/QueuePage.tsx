import { useState, useEffect, useRef } from 'react'

interface QueuePageProps {
  onConfigureKey: () => void
  onClose: () => void
}

export default function QueuePage({ onConfigureKey, onClose }: QueuePageProps) {
  const [position, setPosition] = useState(() => Math.floor(Math.random() * (342 - 86 + 1)) + 86)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    function tick() {
      const delay = (Math.random() * 5 + 3) * 1000 // 3-8 seconds
      timerRef.current = setTimeout(() => {
        setPosition((prev) => {
          const decrease = Math.floor(Math.random() * 3) + 1
          const next = prev - decrease
          return next < 5 ? Math.floor(Math.random() * (342 - 86 + 1)) + 86 : next
        })
        tick()
      }, delay)
    }
    tick()
    return () => clearTimeout(timerRef.current)
  }, [])

  const estimatedMinutes = Math.max(1, Math.round(position * 0.3))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-warm rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center border border-accent-gold/30">
        {/* Animated queue icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center" style={{ animation: 'queue-pulse 2s ease-in-out infinite' }}>
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-serif font-black text-text-main mb-2">排队中</h2>
        <p className="text-text-muted text-sm mb-6">免费额度已用完，当前使用公共资源需排队等待</p>

        {/* Queue position */}
        <div className="bg-white rounded-xl p-5 mb-6 border border-accent-gold/20">
          <div className="text-4xl font-black text-primary mb-1">{position}</div>
          <div className="text-xs text-text-muted">前方还有 {position} 人排队</div>
          <div className="mt-2 text-xs text-accent-gold font-medium">预计等待 {estimatedMinutes} 分钟</div>
        </div>

        {/* CTA */}
        <button
          onClick={onConfigureKey}
          className="shimmer-btn w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide mb-3"
        >
          <span className="relative z-10">配置自己的 API Key，免排队无限生成</span>
        </button>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-text-muted text-sm hover:text-text-main transition-colors"
        >
          返回
        </button>
      </div>
    </div>
  )
}
