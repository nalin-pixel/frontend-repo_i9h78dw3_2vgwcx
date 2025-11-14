import { useEffect, useMemo, useRef, useState } from 'react'

function random(min, max) {
  return Math.random() * (max - min) + min
}

export default function App() {
  const [accepted, setAccepted] = useState(false)
  const [mode, setMode] = useState('cute') // 'cute' | 'cheeky'
  const [noPos, setNoPos] = useState({ x: 50, y: 70 }) // percent-based
  const [hoverCount, setHoverCount] = useState(0)
  const containerRef = useRef(null)

  // Floating hearts in the background
  const hearts = useMemo(() => Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: `${Math.floor(random(0, 100))}%`,
    size: random(10, 26),
    delay: random(0, 6),
    duration: random(8, 16),
    opacity: random(0.2, 0.7)
  })), [])

  const cheekyLines = [
    "Are you sure? I'm extremely adorable.",
    "Wait, think about all the snacks and cuddles.",
    "Error 404: 'No' not found.",
    "Plot twist: The 'No' button runs away.",
    "Careful... this 'No' is slippery!"
  ]

  const cuteLines = [
    "Pretty please?",
    "I brought flowers (in spirit).",
    "I promise to share my fries.",
    "Let's make a tiny forever.",
    "We'd be the cutest story."
  ]

  const line = (mode === 'cute' ? cuteLines : cheekyLines)[hoverCount % (mode === 'cute' ? cuteLines.length : cheekyLines.length)]

  const jumpNoButton = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Keep inside safe margins
    const padding = 16
    const w = rect.width - 120 // approx button width
    const h = rect.height - 48 // approx button height
    const x = Math.max(padding, Math.min(w - padding, random(0, w)))
    const y = Math.max(padding, Math.min(h - padding, random(0, h)))
    setNoPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
    setHoverCount((c) => c + 1)
  }

  useEffect(() => {
    const onResize = () => {
      // keep the "No" button on screen after resize
      setNoPos((p) => ({ x: Math.min(85, Math.max(5, p.x)), y: Math.min(85, Math.max(10, p.y)) }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-pink-50 via-rose-50 to-violet-50 text-gray-800">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(circle at 30% 30%, #f0abfc, transparent 60%)' }} />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(circle at 70% 70%, #93c5fd, transparent 60%)' }} />

      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden">
        {hearts.map(h => (
          <span
            key={h.id}
            className="select-none absolute"
            style={{
              left: h.left,
              bottom: '-2rem',
              fontSize: `${h.size}px`,
              opacity: h.opacity,
              animation: `floatUp ${h.duration}s linear ${h.delay}s infinite`
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Content */}
      <div ref={containerRef} className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/60 p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {accepted ? 'Yay! We are official 🎉' : 'Will you be my person?'}
            </h1>
            <ModeSwitch mode={mode} setMode={setMode} />
          </div>

          {!accepted ? (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                {mode === 'cute' ? (
                  <>
                    I made you a tiny website because you deserve hand-crafted pixels and unlimited hugs.
                  </>
                ) : (
                  <>
                    Look, I triple-checked the vibes. The science says were a 100% match. Dont fight the data.
                  </>
                )}
              </p>

              <div className="text-center text-rose-500 font-medium">{line}</div>

              <div className="relative h-40 sm:h-36">
                <button
                  onClick={() => setAccepted(true)}
                  className="absolute left-1/2 -translate-x-1/2 top-2 sm:top-6 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform active:scale-95"
                >
                  {mode === 'cute' ? 'Yes, a thousand times 💖' : 'Fine. Lets be cute 😏'}
                </button>

                <button
                  onMouseEnter={jumpNoButton}
                  onTouchStart={jumpNoButton}
                  onClick={jumpNoButton}
                  className="absolute bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-5 rounded-full shadow transition-colors"
                  style={{ left: `${noPos.x}%`, top: `${noPos.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  {mode === 'cute' ? 'Nope' : 'Try saying no…'}
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                P.S. If that button keeps running away, maybe its a sign 😉
              </div>
            </div>
          ) : (
            <Celebration mode={mode} />
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-120vh) scale(1.2); }
        }
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function ModeSwitch({ mode, setMode }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-1 rounded-full ${mode === 'cute' ? 'bg-rose-100 text-rose-600' : 'text-gray-400'}`}>cute</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={mode === 'cheeky'} onChange={(e) => setMode(e.target.checked ? 'cheeky' : 'cute')} />
        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-300"></div>
      </label>
      <span className={`text-xs px-2 py-1 rounded-full ${mode === 'cheeky' ? 'bg-violet-100 text-violet-600' : 'text-gray-400'}`}>cheeky</span>
    </div>
  )
}

function Celebration({ mode }) {
  const [showConfetti, setShowConfetti] = useState(true)
  const confetti = useMemo(() => Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    x: random(0, 100),
    delay: random(0, 0.6),
    duration: random(5, 9),
    size: random(14, 26),
    emoji: ['💖','💘','✨','💞','💝','🥰','😍','🌸','🎉'][Math.floor(random(0,9))],
    hue: Math.floor(random(0, 360))
  })), [])

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 7000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative">
      <div className="text-center animate-[popIn_400ms_ease]">
        <div className="text-5xl mb-4">🎉💖</div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">{mode === 'cute' ? 'Yesss! You said yes!' : 'Mission successful. Were a duo now.'}</h2>
        <p className="text-gray-600 mb-6">
          {mode === 'cute' ? 'I cant stop smiling. Date night to celebrate?' : 'Ill allow at least 47% of the blanket. Maybe.'}
        </p>
        <a href="/" className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-full shadow-md">Replay the magic</a>
      </div>

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {confetti.map(c => (
            <span
              key={c.id}
              className="absolute select-none"
              style={{
                left: `${c.x}%`,
                top: '-2rem',
                fontSize: `${c.size}px`,
                filter: `hue-rotate(${c.hue}deg)`,
                animation: `confettiFall ${c.duration}s ease-in ${c.delay}s forwards`
              }}
            >{c.emoji}</span>
          ))}
        </div>
      )}
    </div>
  )
}
