'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { heatColor } from '@/components/charts/Heatmap'
import type { SessionStatus, WorkoutSession } from '@/types'

interface SessionHistoryListProps {
  sessions: WorkoutSession[]
  onSelect: (session: WorkoutSession) => void
}

const FILTERS: Array<SessionStatus | 'all'> = ['all', 'completed', 'partial', 'skipped', 'cheat']

function statusColor(status: SessionStatus): string {
  return heatColor[status as keyof typeof heatColor] ?? '#94a3b8'
}

/** Filterable, scrollable list of saved sessions. */
export function SessionHistoryList({ sessions, onSelect }: SessionHistoryListProps) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<SessionStatus | 'all'>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? sessions : sessions.filter((s) => s.status === filter)),
    [sessions, filter],
  )

  if (sessions.length === 0) {
    return <div className="py-6 text-center text-sm text-slate-400">{t('history.noSessions')}</div>
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              'rounded-full px-3 py-1 text-xs font-bold transition-colors ' +
              (f === filter
                ? 'bg-navy text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200')
            }
          >
            {f === 'all' ? t('history.filterAll') : t(`history.status.${f}`)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((s) => {
          const totalReps = s.sets.reduce((sum, set) => sum + set.actualReps, 0)
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-left dark:bg-slate-700/40"
            >
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
                style={{ background: statusColor(s.status) }}
              >
                {t(`history.status.${s.status}`)}
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-100">{s.date}</div>
                <div className="text-[11px] text-slate-500">
                  {s.dayType} · {t('history.totalReps', { n: totalReps })}
                </div>
              </div>
              <span className="text-slate-300">›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
