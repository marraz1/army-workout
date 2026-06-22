import type { UserProfile, WorkoutLog, Theme } from '@/types'

const KEYS = {
  profile: 'laf.profile',
  logs: 'laf.logs',
  theme: 'laf.theme',
} as const

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — ignore for MVP */
  }
}

export function loadProfile(): UserProfile | null {
  return read<UserProfile>(KEYS.profile)
}

export function saveProfile(profile: UserProfile): void {
  write(KEYS.profile, profile)
}

export function clearProfile(): void {
  localStorage.removeItem(KEYS.profile)
  localStorage.removeItem(KEYS.logs)
}

export function loadLogs(): Record<string, WorkoutLog> {
  return read<Record<string, WorkoutLog>>(KEYS.logs) ?? {}
}

export function saveLog(log: WorkoutLog): void {
  const logs = loadLogs()
  logs[log.date] = log
  write(KEYS.logs, logs)
}

export function loadTheme(): Theme {
  return read<Theme>(KEYS.theme) ?? 'light'
}

export function saveTheme(theme: Theme): void {
  write(KEYS.theme, theme)
}
