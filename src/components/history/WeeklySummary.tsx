'use client'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { todayISO } from '@/lib/utils'
import type { WorkoutSession } from '@/types'

interface WeeklySummaryProps {
  sessions: WorkoutSession[]
}

interface WeekStats {
  volume: number
  completed: number
  skipped: number
}

function statsForRange(sessions: WorkoutSession[], from: string, to: string): WeekStats {
  let volume = 0
  let completed = 0
  let skipped = 0
  for (const s of sessions) {
    if (s.date < from || s.date > to) continue
    volume += s.sets.reduce((sum, set) => sum + set.actualReps, 0)
    if (s.status === 'completed' || s.status === 'partial') completed++
    if (s.status === 'skipped') skipped++
  }
  return { volume, completed, skipped }
}

function isoDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return todayISO(d)
}

/** This-week volume / completed / skipped, with delta vs the prior week. */
export function WeeklySummary({ sessions }: WeeklySummaryProps) {
  const { t } = useTranslation()

  const { thisWeek, lastWeek } = useMemo(() => {
    const today = todayISO()
    return {
      thisWeek: statsForRange(sessions, isoDaysAgo(6), today),
      lastWeek: statsForRange(sessions, isoDaysAgo(13), isoDaysAgo(7)),
    }
  }, [sessions])

  const volDelta = thisWeek.volume - lastWeek.volume

  const rows: Array<{ label: string; value: string; delta?: string; ok?: boolean }> = [
    {
      label: t('history.volume'),
      value: String(thisWeek.volume),
      delta: volDelta !== 0 ? `${volDelta > 0 ? '+' : ''}${volDelta}` : undefined,
      ok: volDelta >= 0,
    },
    { label: t('history.status.completed'), value: String(thisWeek.completed) },
    { label: t('history.status.skipped'), value: String(thisWeek.skipped) },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {rows.map((r) => (
        <div key={r.label} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/40">
          <div className="text-2xl font-extrabold text-navy dark:text-slate-100">{r.value}</div>
          <div className="text-[11px] font-semibold text-slate-500">{r.label}</div>
          {r.delta && (
            <div className="text-[11px] font-bold" style={{ color: r.ok ? '#16a34a' : '#ea580c' }}>
              {r.delta} {t('history.vsLastWeek')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
