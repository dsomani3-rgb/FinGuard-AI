import { Link, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function Navbar({ hasProfile, hasSimProfile }) {
  const { pathname } = useLocation()
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0()

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(226,232,240,0.8)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 9,
          textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(5,150,105,0.35)',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z"
                fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.75" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem', color: '#0f172a',
            letterSpacing: '-0.01em',
          }}>
            FinGuard <span style={{ color: '#059669' }}>AI</span>
          </span>
        </Link>

        {/* Nav links + auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* FinGuard links */}
          {hasProfile && isAuthenticated && (
            <>
              <NavLink to="/dashboard" active={pathname === '/dashboard'} label="Dashboard" icon="📊" />
              <NavLink to="/chat"      active={pathname === '/chat'}      label="AI Coach"   icon="💬" />
            </>
          )}

          {/* Simulator — always visible */}
          <NavLink
            to="/simulator"
            active={pathname.startsWith('/simulator')}
            label="Simulator"
            icon="⚡"
            accentColor="#d97706"
            activeBg="rgba(217,119,6,0.08)"
            activeColor="#92400e"
          />
          {hasSimProfile && (
            <NavLink to="/simulator/results" active={pathname === '/simulator/results'} label="Results" icon="" accentColor="#d97706" activeBg="rgba(217,119,6,0.08)" activeColor="#92400e" />
          )}

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: '#e2e8f0', margin: '0 6px' }} />

          {/* Auth */}
          {!isLoading && (
            isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {user?.picture
                  ? <img src={user.picture} alt={user.name} style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(5,150,105,0.25)' }} />
                  : (
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#059669,#047857)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )
                }
                <span style={{ fontSize: '0.8rem', color: '#475569', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.given_name || user?.name?.split(' ')[0] || 'User'}
                </span>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  style={{
                    padding: '5px 12px', borderRadius: 8,
                    background: 'transparent', border: '1px solid #e2e8f0',
                    color: '#64748b', fontSize: '0.8rem', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#0f172a' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => loginWithRedirect()}
                  style={{
                    padding: '6px 14px', borderRadius: 8,
                    background: 'transparent', border: '1px solid #e2e8f0',
                    color: '#0f172a', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  Sign in
                </button>
                <button
                  onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
                  style={{
                    padding: '6px 16px', borderRadius: 8,
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(5,150,105,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(5,150,105,0.3)'}
                >
                  Get Started
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({
  to, active, label, icon,
  accentColor = '#059669',
  activeBg = 'rgba(5,150,105,0.08)',
  activeColor = '#047857',
}) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        textDecoration: 'none',
        padding: '5px 11px', borderRadius: 8,
        fontSize: '0.82rem', fontWeight: 500,
        color: active ? activeColor : '#64748b',
        background: active ? activeBg : 'transparent',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = '#f8fafc' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' } }}
    >
      {icon && <span style={{ fontSize: '0.85rem' }}>{icon}</span>}
      {label}
    </Link>
  )
}
