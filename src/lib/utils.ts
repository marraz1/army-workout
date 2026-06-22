import type { Lang, WorkoutLog } from '@/types'

/** Local ISO date (YYYY-MM-DD) — avoids UTC off-by-one from toISOString(). */
export function todayISO(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Pick the English or Lithuanian variant of a bilingual data field. */
export function pickLang(lang: Lang, en: string, lt: string): string {
  return lang === 'LT' ? lt : en
}

/** Tailwind class-name joiner that drops falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Count consecutive days (ending today or yesterday) that were completed.
 * Per requirements, a streak survives skips but breaks on 3 in a row.
 */
export function computeStreak(logs: Record<string, WorkoutLog>): number {
  let streak = 0
  let consecutiveSkips = 0
  const cursor = new Date()

  // Walk backwards up to a year.
  for (let i = 0; i < 366; i++) {
    const key = todayISO(cursor)
    const log = logs[key]
    if (log?.status === 'completed') {
      streak++
      consecutiveSkips = 0
    } else if (log?.status === 'skipped' || log?.status === 'cheat') {
      consecutiveSkips++
      if (consecutiveSkips >= 3) break
    } else if (i > 0) {
      // No entry on a past day breaks the streak (today with no entry is fine).
      break
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
