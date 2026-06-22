import type { Lang, Theme } from '@/types'

/**
 * Device-level preferences only. User profile and workout logs now live in
 * Supabase (per-user, RLS-protected) — see src/lib/db.ts.
 */
const KEYS = {
  theme: 'laf.theme',
  lang: 'laf.lang',
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
    /* storage full or unavailable — ignore */
  }
}

export function loadTheme(): Theme {
  return read<Theme>(KEYS.theme) ?? 'light'
}

export function saveTheme(theme: Theme): void {
  write(KEYS.theme, theme)
}

export function loadLang(): Lang {
  return read<Lang>(KEYS.lang) ?? 'EN'
}

export function saveLang(lang: Lang): void {
  write(KEYS.lang, lang)
}
