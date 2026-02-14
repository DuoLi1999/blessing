type Shape = 'hoofprint' | 'coin' | 'plum' | 'lantern'

const PARTICLES: { left: string; size: number; dur: number; delay: number; shape: Shape }[] = [
  { left: '8%',  size: 18, dur: 7,   delay: 0,   shape: 'hoofprint' },
  { left: '18%', size: 14, dur: 9,   delay: 1.5, shape: 'coin' },
  { left: '28%', size: 20, dur: 6,   delay: 3,   shape: 'plum' },
  { left: '38%', size: 16, dur: 8,   delay: 0.5, shape: 'hoofprint' },
  { left: '48%', size: 12, dur: 7,   delay: 4,   shape: 'lantern' },
  { left: '58%', size: 22, dur: 10,  delay: 2,   shape: 'hoofprint' },
  { left: '68%', size: 15, dur: 6,   delay: 3.5, shape: 'coin' },
  { left: '78%', size: 18, dur: 8,   delay: 5,   shape: 'hoofprint' },
  { left: '85%', size: 24, dur: 9,   delay: 1,   shape: 'plum' },
  { left: '5%',  size: 16, dur: 7,   delay: 2.5, shape: 'hoofprint' },
  { left: '42%', size: 14, dur: 8,   delay: 4.5, shape: 'lantern' },
  { left: '72%', size: 20, dur: 6.5, delay: 0.8, shape: 'coin' },
]

function SvgIcon({ shape, size }: { shape: Shape; size: number }) {
  switch (shape) {
    case 'hoofprint':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M5 3Q4 10 6 18" stroke="#d4a528" strokeWidth="3" strokeLinecap="round" />
          <path d="M19 3Q20 10 18 18" stroke="#d4a528" strokeWidth="3" strokeLinecap="round" />
          <circle cx="7" cy="19.5" r="2.5" fill="#d4a528" />
          <circle cx="17" cy="19.5" r="2.5" fill="#d4a528" />
        </svg>
      )
    case 'coin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#d4a528" />
          <circle cx="12" cy="12" r="8" fill="none" stroke="#b8860b" strokeWidth="0.5" />
          <rect x="9" y="9" width="6" height="6" rx="0.5" fill="#FEFCF8" />
        </svg>
      )
    case 'plum':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="6.5" r="4" fill="#c41e2a" />
          <circle cx="17.3" cy="10.4" r="4" fill="#c41e2a" />
          <circle cx="15.3" cy="16.5" r="4" fill="#c41e2a" />
          <circle cx="8.7" cy="16.5" r="4" fill="#c41e2a" />
          <circle cx="6.7" cy="10.4" r="4" fill="#c41e2a" />
          <circle cx="12" cy="12" r="2" fill="#FFD700" />
        </svg>
      )
    case 'lantern':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="9.5" y="2" width="5" height="2.5" rx="1" fill="#d4a528" />
          <line x1="12" y1="0.5" x2="12" y2="2" stroke="#d4a528" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="12" cy="13" rx="7" ry="8.5" fill="#c41e2a" />
          <ellipse cx="12" cy="13" rx="4" ry="8.5" fill="none" stroke="#a01822" strokeWidth="0.5" opacity="0.5" />
          <line x1="12" y1="21.5" x2="12" y2="24" stroke="#d4a528" strokeWidth="1" strokeLinecap="round" />
        </svg>
      )
  }
}

export default function Particles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `float-up ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          <SvgIcon shape={p.shape} size={p.size} />
        </div>
      ))}
    </div>
  )
}
