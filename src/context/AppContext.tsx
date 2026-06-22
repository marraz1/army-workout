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
import {
  clearProfile,
  loadLogs,
  loadProfile,
  loadTheme,
  saveLog,
  saveProfile,
  saveTheme,
} from '@/lib/storage'

interface AppContextValue {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  resetProfile: () => void
  logs: Record<string, WorkoutLog>
  addLog: (log: WorkoutLog) => void
  theme: Theme
  toggleTheme: () => void
  language: Lang
  setLanguage: (lang: Lang) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [profile, setProfileState] = useState<UserProfile | null>(() => loadProfile())
  const [logs, setLogs] = useState<Record<string, WorkoutLog>>(() => loadLogs())
  const [theme, setTheme] = useState<Theme>(() => loadTheme())

  const language: Lang = i18n.language === 'lt' ? 'LT' : 'EN'

  // Apply theme to <html> and persist.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  const setProfile = useCallback(
    (next: UserProfile) => {
      setProfileState(next)
      saveProfile(next)
      void i18n.changeLanguage(next.language === 'LT' ? 'lt' : 'en')
    },
    [i18n],
  )

  const resetProfile = useCallback(() => {
    clearProfile()
    setProfileState(null)
    setLogs({})
  }, [])

  const addLog = useCallback((log: WorkoutLog) => {
    saveLog(log)
    setLogs((prev) => ({ ...prev, [log.date]: log }))
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setLanguage = useCallback(
    (lang: Lang) => {
      void i18n.changeLanguage(lang === 'LT' ? 'lt' : 'en')
      setProfileState((prev) => {
        if (!prev) return prev
        const next = { ...prev, language: lang }
        saveProfile(next)
        return next
      })
    },
    [i18n],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      profile,
      setProfile,
      resetProfile,
      logs,
      addLog,
      theme,
      toggleTheme,
      language,
      setLanguage,
    }),
    [profile, setProfile, resetProfile, logs, addLog, theme, toggleTheme, language, setLanguage],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
