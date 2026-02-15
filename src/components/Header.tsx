interface HeaderProps {
  hasApiConfig?: boolean
  onOpenConfig?: () => void
}

export default function Header({ hasApiConfig, onOpenConfig }: HeaderProps) {
  return (
    <nav className="w-full px-5 py-5 flex justify-between items-center relative z-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-md border border-accent-gold/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <svg className="w-7 h-7 text-primary relative z-10" viewBox="0 0 100 100" fill="none">
            {/* Horse head silhouette */}
            <path d="M65 20C60 15 50 14 45 18C40 22 38 30 38 38L28 42C26 43 25 45 26 47L30 55C31 57 33 58 35 57L40 55C42 62 45 68 50 72L48 85C48 87 49 89 51 89L57 89C59 89 60 87 60 85L61 75C64 76 67 76 70 75L71 85C71 87 72 89 74 89L80 89C82 89 83 87 83 85L81 72C86 67 88 60 88 52C88 40 82 30 75 24C72 22 68 21 65 20Z" fill="currentColor" />
            <circle cx="58" cy="32" r="3" fill="#d4a528" />
            <path d="M42 18C38 12 30 10 26 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-serif font-black tracking-tight text-primary leading-none">
            新春祝福
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-px w-3 bg-accent-gold" />
            <span className="text-[0.6rem] font-bold tracking-[0.2em] text-accent-gold uppercase font-serif">
              丙午马年
            </span>
            <span className="h-px w-3 bg-accent-gold" />
          </div>
        </div>
      </div>

      {onOpenConfig && (
        <button
          onClick={onOpenConfig}
          className="relative w-10 h-10 rounded-lg bg-white border border-accent-gold/30 flex items-center justify-center hover:border-primary transition-colors shadow-sm"
          title="API 配置"
        >
          <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          {hasApiConfig && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </button>
      )}
    </nav>
  )
}
