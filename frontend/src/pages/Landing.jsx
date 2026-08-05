import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect } from 'react'

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, prefix = '', suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setVal(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target, duration])
  return <>{prefix}{val.toLocaleString()}{suffix}</>
}

// ── Mini dashboard preview (Mercury-style right panel) ────────────────────────
function DashboardPreview() {
  const bars = [
    { label: 'Emergency Fund', score: 62, color: '#d97706' },
    { label: 'Insurance',      score: 48, color: '#dc2626' },
    { label: 'Disaster Prep',  score: 75, color: '#059669' },
    { label: 'Income Safety',  score: 70, color: '#059669' },
  ]
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      border: '1px solid #e2e8f0',
      boxShadow: '0 24px 64px rgba(15,23,42,0.12), 0 4px 16px rgba(15,23,42,0.06)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: 420,
    }}>
      {/* Window chrome */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#fc5c57','#fdbc40','#33c748'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: '#e2e8f0', borderRadius: 6, padding: '3px 12px',
            fontSize: '0.7rem', color: '#64748b', fontWeight: 500,
          }}>
            finguard.ai / dashboard
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div style={{ padding: '20px 20px 16px' }}>
        {/* Overall score row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Overall Health</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#0f172a', lineHeight: 1 }}>
              67<span style={{ fontSize: '1rem', color: '#64748b' }}>/100</span>
            </div>
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'conic-gradient(#d97706 0% 67%, #f1f5f9 67% 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 8px #fff',
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          </div>
        </div>

        {/* Score bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {bars.map(({ label, score, color }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '0.72rem', color, fontWeight: 700 }}>{score}</span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99, background: color,
                  width: `${score}%`,
                  animation: 'previewBarIn 1.2s cubic-bezier(0.4,0,0.2,1) both',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Alert cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            background: '#fef3c7', borderRadius: 8, padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid #fcd34d',
          }}>
            <span style={{ fontSize: '0.75rem' }}>⚠️</span>
            <span style={{ fontSize: '0.72rem', color: '#78350f', fontWeight: 500 }}>2.5-month gap in emergency fund</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#d97706', fontWeight: 700, background: '#fef3c7', borderRadius: 4, padding: '1px 5px' }}>Fix</span>
          </div>
          <div style={{
            background: '#fee2e2', borderRadius: 8, padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid #fca5a5',
          }}>
            <span style={{ fontSize: '0.75rem' }}>🛡️</span>
            <span style={{ fontSize: '0.72rem', color: '#7f1d1d', fontWeight: 500 }}>No renters insurance detected</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#dc2626', fontWeight: 700, background: '#fee2e2', borderRadius: 4, padding: '1px 5px' }}>Gap</span>
          </div>
          <div style={{
            background: '#d1fae5', borderRadius: 8, padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid #6ee7b7',
          }}>
            <span style={{ fontSize: '0.75rem' }}>✅</span>
            <span style={{ fontSize: '0.72rem', color: '#064e3b', fontWeight: 500 }}>Low flood risk in your ZIP code</span>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{
        borderTop: '1px solid #f1f5f9',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fafafa',
      }}>
        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AI Coach ready</span>
        <div style={{
          background: '#059669', color: '#fff',
          borderRadius: 6, padding: '4px 12px',
          fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
        }}>View Action Plan →</div>
      </div>
    </div>
  )
}

// ── Main Landing ──────────────────────────────────────────────────────────────
export default function Landing() {
  const nav = useNavigate()
  const { loginWithRedirect } = useAuth0()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background: '#fff' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex', alignItems: 'center',
        padding: '4rem 1.5rem 5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(5,150,105,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(5,150,105,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 65% 70% at 15% 50%, rgba(5,150,105,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 85% 20%, rgba(16,185,129,0.05) 0%, transparent 60%)
          `,
        }} />

        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
          position: 'relative', zIndex: 1,
          width: '100%',
        }}>

          {/* Left — copy */}
          <div style={{ maxWidth: 540 }}>
            {/* Trust badge */}
            <div
              className="fade-up"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(5,150,105,0.06)',
                border: '1px solid rgba(5,150,105,0.2)',
                borderRadius: 99, padding: '5px 14px 5px 8px',
                fontSize: '0.75rem', fontWeight: 600, color: '#047857',
                marginBottom: '1.75rem',
              }}
            >
              <span style={{
                background: '#059669', color: '#fff',
                borderRadius: 99, padding: '2px 8px',
                fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>State Farm</span>
              Financial Wellness Track 2026
            </div>

            <h1
              className="fade-up"
              style={{ animationDelay: '0.06s', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}
            >
              Your financial
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontStyle: 'italic',
              }}>safety net</span>,
              <br />
              built in minutes.
            </h1>

            <p
              className="fade-up"
              style={{
                fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '2.5rem',
                animationDelay: '0.12s', maxWidth: 460, color: '#475569',
              }}
            >
              FinGuard AI scans your financial profile, spots coverage gaps, and builds a personalized 90-day plan — in plain English.
            </p>

            {/* CTAs */}
            <div
              className="fade-up"
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2.5rem', animationDelay: '0.18s' }}
            >
              <button
                onClick={() => nav('/onboarding')}
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#fff',
                  padding: '15px 32px', borderRadius: 99,
                  fontSize: '1rem', fontWeight: 700,
                  boxShadow: '0 4px 24px rgba(5,150,105,0.4), 0 1px 4px rgba(5,150,105,0.2)',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Get My Free Assessment →
              </button>
              <button
                onClick={() => nav('/chat')}
                style={{
                  background: '#fff', color: '#0f172a',
                  padding: '15px 28px', borderRadius: 99,
                  border: '1.5px solid #e2e8f0',
                  fontSize: '1rem', fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#059669' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a' }}
              >
                Ask AI Coach
              </button>
            </div>

            {/* Social proof */}
            <div
              className="fade-up"
              style={{ display: 'flex', alignItems: 'center', gap: 16, animationDelay: '0.24s' }}
            >
              <div style={{ display: 'flex' }}>
                {['#059669','#047857','#065f46','#064e3b'].map((bg, i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: bg, border: '2px solid #fff',
                    marginLeft: i > 0 ? -8 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', color: '#fff', fontWeight: 700,
                  }}>
                    {['JM','SR','AK','TL'][i]}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Free</span>
                <span style={{ color: '#64748b' }}> · No credit card · Takes 5 min</span>
              </div>
            </div>
          </div>

          {/* Right — dashboard preview */}
          <div
            className="fade-up"
            style={{ display: 'flex', justifyContent: 'center', animationDelay: '0.2s' }}
          >
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section style={{
        background: '#fff',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
        padding: '2.5rem 1.5rem',
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}>
          {[
            { target: 56, suffix: '%',   label: 'of Americans can\'t cover a $1,000 emergency', icon: '⚡' },
            { target: 40, suffix: 'M+',  label: 'renters lack renter\'s insurance',               icon: '🏠' },
            { target: 15, prefix: '~$',  suffix: '/mo', label: 'average cost of renters insurance', icon: '🛡️' },
            { target: 6,  suffix: ' mo', label: 'recommended emergency fund target',               icon: '💰' },
          ].map(({ target, prefix, suffix, label, icon }) => (
            <div key={label}>
              <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.875rem', fontWeight: 700,
                color: '#059669', lineHeight: 1, marginBottom: 4,
              }}>
                {loaded ? <Counter target={target} prefix={prefix || ''} suffix={suffix || ''} /> : `${prefix || ''}0${suffix || ''}`}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 4rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.18)',
              borderRadius: 99, padding: '4px 14px',
              fontSize: '0.72rem', fontWeight: 700, color: '#047857',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>How it works</div>
            <h2 style={{ marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Three steps to financial clarity</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>No jargon, no judgment, no SSN required.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              {
                num: '01', icon: '📋',
                title: '5-Minute Profile',
                desc: 'Tell us about your income, family situation, housing, and savings. Fast and completely private.',
                accent: '#059669',
              },
              {
                num: '02', icon: '📊',
                title: 'See Your Risk Scores',
                desc: 'Get a visual breakdown of your emergency fund gap, insurance gaps, and disaster risk by ZIP code.',
                accent: '#0284c7',
              },
              {
                num: '03', icon: '🗓️',
                title: '90-Day Action Plan',
                desc: 'Week-by-week steps tailored to your exact situation — specific, affordable, and actually doable.',
                accent: '#7c3aed',
              },
            ].map(({ num, icon, title, desc, accent }) => (
              <div
                key={num}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 20,
                  padding: '2rem',
                  position: 'relative',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem', fontWeight: 700,
                  color: `${accent}12`,
                  position: 'absolute', top: 16, right: 20,
                  lineHeight: 1,
                }}>
                  {num}
                </div>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ marginBottom: '0.6rem', fontSize: '1.1rem', color: '#0f172a' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ───────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Built for real people, not finance bros</h2>
            <p style={{ color: '#64748b' }}>Calm, trust-focused design. Everything you need, nothing you don't.</p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem',
          }}>
            {[
              { icon: '🔒', title: 'Private by default', desc: 'No SSN, no bank login, no data sold. Just answers.' },
              { icon: '🤖', title: 'Gemini AI Coach', desc: 'Ask anything in plain English. Get clear, specific guidance.' },
              { icon: '⚡', title: 'Life Impact Simulator', desc: 'Model big decisions — car, job change, loan — before you commit.' },
              { icon: '📍', title: 'ZIP-code aware', desc: 'Flood and disaster risk analysis for your actual neighborhood.' },
              { icon: '📑', title: '90-day plan', desc: 'Concrete weekly actions, not vague advice.' },
              { icon: '🛡️', title: 'Insurance gap scanner', desc: 'Know exactly what coverage you\'re missing and what it costs.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                display: 'flex', gap: 14, padding: '1.25rem',
                borderRadius: 14, border: '1px solid #f1f5f9',
                transition: 'background 0.15s, border-color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = '#f1f5f9' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(5,150,105,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', flexShrink: 0,
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{title}</div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIMULATOR CALLOUT ────────────────────────────────────────────── */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(5,150,105,0.12) 0%, transparent 60%)',
        }} />
        <div className="container" style={{ maxWidth: 760, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)',
            borderRadius: 99, padding: '4px 14px',
            fontSize: '0.72rem', fontWeight: 700, color: '#34d399',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>⚡ New — Life Impact Simulator</div>
          <h2 style={{ color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
            What happens to your finances<br />if you buy a car? Change jobs? Move cities?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.7 }}>
            Model 3 scenarios side-by-side — safe, balanced, and risky — with real stress-test simulations.
          </p>
          <button
            onClick={() => nav('/simulator')}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff', padding: '15px 36px', borderRadius: 99,
              fontSize: '1rem', fontWeight: 700,
              boxShadow: '0 4px 24px rgba(5,150,105,0.45)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Try the Simulator →
          </button>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', background: '#fff' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z"
                fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ marginBottom: '1rem', letterSpacing: '-0.02em' }}>Ready to protect your future?</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.65 }}>
            Free, private, and takes under 5 minutes. No financial knowledge required.
          </p>
          <button
            onClick={() => nav('/onboarding')}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff', padding: '16px 40px', borderRadius: 99,
              fontSize: '1.05rem', fontWeight: 700,
              boxShadow: '0 4px 24px rgba(5,150,105,0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start My Assessment →
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #f1f5f9',
        padding: '2rem 1.5rem',
        background: '#fff',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669, #047857)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z"
                  fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>FinGuard AI</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
            Built for State Farm Financial Wellness Track · Not financial advice —{' '}
            <span style={{ color: '#059669' }}>consult a licensed professional</span>
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes previewBarIn {
          from { width: 0%; }
          to   { width: var(--target-width, 100%); }
        }
      `}</style>
    </div>
  )
}
