import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter') // enter → hold → exit

  useEffect(() => {
    // Logo animates in → hold → fade out → call onDone
    const hold  = setTimeout(() => setPhase('exit'), 1800)
    const done  = setTimeout(() => onDone(), 2600)
    return () => { clearTimeout(hold); clearTimeout(done) }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#fff',
        transition: phase === 'exit' ? 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
        opacity: phase === 'exit' ? 0 : 1,
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,150,105,0.07) 0%, transparent 70%)',
      }} />

      {/* Logo mark */}
      <div
        style={{
          animation: 'splashLogoIn 0.75s cubic-bezier(0.34,1.56,0.64,1) both',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Shield */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Pulse ring */}
          <div style={{
            position: 'absolute',
            width: 96, height: 96, borderRadius: '50%',
            background: 'rgba(5,150,105,0.08)',
            animation: 'splashPulse 1.8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(5,150,105,0.12)',
            animation: 'splashPulse 1.8s ease-in-out 0.3s infinite',
          }} />
          {/* Shield icon */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(5,150,105,0.35), 0 2px 8px rgba(5,150,105,0.2)',
            position: 'relative', zIndex: 1,
          }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z"
                fill="rgba(255,255,255,0.25)"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <div style={{ textAlign: 'center', animation: 'splashTextIn 0.6s ease both 0.35s' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--navy)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            FinGuard <span style={{ color: 'var(--emerald)' }}>AI</span>
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: 6,
            fontWeight: 500,
          }}>
            Financial Wellness
          </div>
        </div>

        {/* Loading bar */}
        <div style={{
          width: 160, height: 2, borderRadius: 99,
          background: 'var(--border)',
          overflow: 'hidden',
          marginTop: 8,
          animation: 'splashTextIn 0.4s ease both 0.6s',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--emerald), #34d399)',
            borderRadius: 99,
            animation: 'splashBar 1.4s cubic-bezier(0.4,0,0.2,1) 0.6s both',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.7) translateY(24px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splashTextIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashPulse {
          0%, 100% { transform: scale(0.92); opacity: 0.7; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
        @keyframes splashBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  )
}
