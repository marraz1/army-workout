import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Lang, Theme, UserProfile, WorkoutLog } from '@/types'
import { loadTheme, saveLang, saveTheme } from '@/lib/storage'
import { fetchLogs, fetchProfile, upsertLog, upsertProfile } from '@/lib/db'
import { useAuth } from '@/context/AuthContext'

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
  const { user } = useAuth()

  const [profile, setProfileState] = useState<UserProfile | null>(null)
  const [logs, setLogs] = useState<Record<string, WorkoutLog>>({})
  const [dataLoading, setDataLoading] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => loadTheme())

  const language: Lang = i18n.language === 'lt' ? 'LT' : 'EN'

  // Apply theme to <html> and persist (device-level preference).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  // Load this user's profile + logs whenever the session changes.
  useEffect(() => {
    let cancelled = false
    if (!user) {
      setProfileState(null)
      setLogs({})
      return
    }
    setDataLoading(true)
    void Promise.all([fetchProfile(user.id), fetchLogs(user.id)])
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
  }, [user, i18n])

  const setProfile = useCallback(
    async (next: UserProfile) => {
      if (!user) return
      await upsertProfile(user.id, next)
      setProfileState(next)
      void i18n.changeLanguage(next.language === 'LT' ? 'lt' : 'en')
      saveLang(next.language)
    },
    [user, i18n],
  )

  const addLog = useCallback(
    async (log: WorkoutLog) => {
      if (!user) return
      setLogs((prev) => ({ ...prev, [log.date]: log })) // optimistic
      try {
        await upsertLog(user.id, log)
      } catch (err) {
        console.error('Failed to save log', err)
      }
    },
    [user],
  )

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setLanguage = useCallback(
    (lang: Lang) => {
      void i18n.changeLanguage(lang === 'LT' ? 'lt' : 'en')
      saveLang(lang)
      setProfileState((prev) => (prev ? { ...prev, language: lang } : prev))
      if (user) {
        setProfileState((prev) => {
          if (prev) void upsertProfile(user.id, { ...prev, language: lang })
          return prev
        })
      }
    },
    [i18n, user],
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

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
