import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from '@/context/AppContext'
import { AppLayout } from '@/components/layout/AppLayout'
import Onboarding from '@/pages/Onboarding'
import Home from '@/pages/Home'
import Schedule from '@/pages/Schedule'
import ExerciseGuide from '@/pages/ExerciseGuide'
import Progress from '@/pages/Progress'
import SkipCheatDay from '@/pages/SkipCheatDay'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import Notifications from '@/pages/Notifications'

/** Gate the main app behind a completed onboarding profile. */
function RequireProfile() {
  const { profile } = useApp()
  return profile ? <AppLayout /> : <Navigate to="/onboarding" replace />
}

function AppRoutes() {
  const { profile } = useApp()
  return (
    <Routes>
      <Route
        path="/onboarding"
        element={profile ? <Navigate to="/" replace /> : <Onboarding />}
      />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
