import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Navbar from './components/Navbar'
import SplashScreen from './components/SplashScreen'
import SimulatorOnboarding from './pages/SimulatorOnboarding'
import SimulatorDashboard from './pages/SimulatorDashboard'

function ProtectedRoute({ element }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) { loginWithRedirect(); return <LoadingScreen /> }
  return element
}

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: 'calc(100vh - 60px)', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 36, height: 36,
        border: '2.5px solid var(--emerald-light)',
        borderTopColor: 'var(--emerald)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function App() {
  const [profile,    setProfile]    = useState(null)
  const [results,    setResults]    = useState(null)
  const [simProfile, setSimProfile] = useState(null)
  const [simResults, setSimResults] = useState(null)
  const [splashDone, setSplashDone] = useState(false)

  const handleSplashDone = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        opacity: splashDone ? 1 : 0,
        transition: splashDone ? 'opacity 0.5s ease' : 'none',
      }}>
        <Navbar hasProfile={!!profile} hasSimProfile={!!simProfile} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"                  element={<Landing />} />
            <Route path="/onboarding"        element={<Onboarding setProfile={setProfile} setResults={setResults} />} />
            <Route path="/dashboard"         element={results ? <ProtectedRoute element={<Dashboard profile={profile} results={results} />} /> : <Navigate to="/onboarding" replace />} />
            <Route path="/chat"              element={<ProtectedRoute element={<Chat profile={profile} simProfile={simProfile} />} />} />
            <Route path="/simulator"         element={<SimulatorOnboarding setSimProfile={setSimProfile} setSimResults={setSimResults} />} />
            <Route path="/simulator/results" element={simResults ? <SimulatorDashboard simProfile={simProfile} simResults={simResults} /> : <Navigate to="/simulator" replace />} />
            <Route path="*"                  element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  )
}
