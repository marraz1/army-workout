import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { AppProvider, useApp } from '@/context/AppContext'
import { AppLayout } from '@/components/layout/AppLayout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Onboarding from '@/pages/Onboarding'
import Home from '@/pages/Home'
import Schedule from '@/pages/Schedule'
import ExerciseGuide from '@/pages/ExerciseGuide'
import Progress from '@/pages/Progress'
import SkipCheatDay from '@/pages/SkipCheatDay'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import Notifications from '@/pages/Notifications'

function Splash() {
  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-navy to-forest text-white">
      <div className="text-center">
        <div className="text-3xl font-extrabold">🇱🇹 LAF Fit</div>
        <div className="mt-2 text-sm opacity-80">Loading…</div>
      </div>
    </div>
  )
}

/** Auth pages: bounce signed-in users back into the app. */
function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Splash />
  return user ? <Navigate to="/" replace /> : <>{children}</>
}

/** Require a signed-in session for everything below. */
function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) return <Splash />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

/** Require a completed onboarding profile; otherwise route to onboarding. */
function RequireProfile() {
  const { profile, dataLoading } = useApp()
  if (dataLoading) return <Splash />
  return profile ? <AppLayout /> : <Navigate to="/onboarding" replace />
}

/** Onboarding is auth-gated but available only before a profile exists. */
function OnboardingGate() {
  const { profile, dataLoading } = useApp()
  if (dataLoading) return <Splash />
  return profile ? <Navigate to="/" replace /> : <Onboarding />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      <Route element={<RequireAuth />}>
        <Route path="/onboarding" element={<OnboardingGate />} />
        <Route element={<RequireProfile />}>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/guide" element={<ExerciseGuide />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/skip" element={<SkipCheatDay />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}
