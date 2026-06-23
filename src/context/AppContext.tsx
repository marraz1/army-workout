'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import type { Lang, Theme, UserProfile, WorkoutLog } from '@/types'
import { loadTheme, saveLang, saveTheme } from '@/lib/storage'
import { getLogs, getProfile, postLog, putProfile } from '@/lib/db'

interface AppContextValue {
  /** True while the signed-in user's profile + logs are loading. */
  dataLoading: boolean
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => Promise<void>
  logs: Record<string, WorkoutLog>
  addLog: (log: WorkoutLog) => Promise<void>
  theme: Theme
  toggleTheme: () => void
  language: Lang
  setLanguage: (lang: Lang) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const { status } = useSession()

  const [profile, setProfileState] = useState<UserProfile | null>(null)
  const [logs, setLogs] = useState<Record<string, WorkoutLog>>({})
  // Start true: until the session resolves and the profile fetch completes we
  // don't yet know if the user has onboarded, so callers must show a loading
  // state rather than assume "no profile" and redirect to onboarding.
  const [dataLoading, setDataLoading] = useState(true)
  const [theme, setTheme] = useState<Theme>('light')

  const language: Lang = i18n?.language === 'lt' ? 'LT' : 'EN'

  // Initialize theme from storage on mount (client only).
  useEffect(() => {
    setTheme(loadTheme())
  }, [])

  // Apply theme to <html> and persist (device-level preference).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  // Load this user's profile + logs whenever auth status changes.
  useEffect(() => {
    let cancelled = false
    // While NextAuth is still resolving the session, keep dataLoading true so
    // the UI shows a splash instead of prematurely redirecting to onboarding.
    if (status === 'loading') return
    if (status !== 'authenticated') {
      setProfileState(null)
      setLogs({})
      setDataLoading(false)
      return
    }
    setDataLoading(true)
    void Promise.all([getProfile(), getLogs()])
      .then(([p, l]) => {
        if (cancelled) return
        setProfileState(p)
        setLogs(l)
        if (p?.language) {
          void i18n.changeLanguage(p.language === 'LT' ? 'lt' : 'en')
          saveLang(p.language)
        }
      })
      .catch((err) => console.error('Failed to load user data', err))
      .finally(() => {
        if (!cancelled) setDataLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [status, i18n])

  const setProfile = useCallback(
    async (next: UserProfile) => {
      await putProfile(next)
      setProfileState(next)
      void i18n.changeLanguage(next.language === 'LT' ? 'lt' : 'en')
      saveLang(next.language)
    },
    [i18n],
  )

  const addLog = useCallback(async (log: WorkoutLog) => {
    setLogs((prev) => ({ ...prev, [log.date]: log })) // optimistic
    try {
      await postLog(log)
    } catch (err) {
      console.error('Failed to save log', err)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setLanguage = useCallback(
    (lang: Lang) => {
      void i18n.changeLanguage(lang === 'LT' ? 'lt' : 'en')
      saveLang(lang)
      setProfileState((prev) => {
        if (!prev) return prev
        const next = { ...prev, language: lang }
        void putProfile(next)
        return next
      })
    },
    [i18n],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      dataLoading,
      profile,
      setProfile,
      logs,
      addLog,
      theme,
      toggleTheme,
      language,
      setLanguage,
    }),
    [dataLoading, profile, setProfile, logs, addLog, theme, toggleTheme, language, setLanguage],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
