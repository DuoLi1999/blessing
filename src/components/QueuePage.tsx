interface QueuePageProps {
  onConfigureKey: () => void
  onClose: () => void
}

export default function QueuePage({ onConfigureKey, onClose }: QueuePageProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-warm rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center border border-accent-gold/30">
        {/* Error icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-serif font-black text-text-main mb-2">免费额度已用完</h2>
        <p className="text-text-muted text-sm mb-6">公共额度已消耗完毕，配置自己的 API Key 即可继续使用</p>

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
      </div>
    </div>
  )
}
