interface QrModalProps {
  first: 'douyin' | 'xiaohongshu'
  onClose: () => void
}

const items = {
  douyin: { label: '抖音', src: '/douyin.jpg' },
  xiaohongshu: { label: '小红书', src: '/xiaohongshu.jpg' },
}

export default function QrModal({ first, onClose }: QrModalProps) {
  const second = first === 'douyin' ? 'xiaohongshu' : 'douyin'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg-warm rounded-2xl shadow-2xl max-w-xs w-full mx-4 p-6 text-center border border-accent-gold/30" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-serif font-black text-text-main mb-5">关注我们</h3>

        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-2">
            <img src={items[first].src} alt={items[first].label} className="w-48 max-w-full rounded-xl border border-accent-gold/20 object-contain" />
            <span className="text-sm text-text-muted font-medium">{items[first].label}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src={items[second].src} alt={items[second].label} className="w-48 max-w-full rounded-xl border border-accent-gold/20 object-contain" />
            <span className="text-sm text-text-muted font-medium">{items[second].label}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 text-text-muted text-sm hover:text-text-main transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  )
}
