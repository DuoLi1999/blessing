export default function Header() {
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
    </nav>
  )
}
