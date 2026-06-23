'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LineChart, type LinePoint } from '@/components/charts/LineChart'
import { findExercise, exerciseName } from '@/lib/exercises'
import { formatMMSS } from '@/lib/utils'
import type { WorkoutSession } from '@/types'

interface ExerciseChartsProps {
  sessions: WorkoutSession[]
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

/** Per-exercise line chart of reps (or run time) over logged sessions. */
export function ExerciseCharts({ sessions }: ExerciseChartsProps) {
  const { t } = useTranslation()

  // Oldest → newest for left-to-right time axis.
  const ordered = useMemo(
    () => [...sessions].sort((a, b) => a.date.localeCompare(b.date)),
    [sessions],
  )

  const available = useMemo(() => {
    const ids = new Set<string>()
    for (const s of ordered) {
      for (const set of s.sets) ids.add(set.exerciseId)
      if (s.runLog?.actualTimeSec) ids.add('run-3km')
    }
    return [...ids]
  }, [ordered])

  const [selected, setSelected] = useState<string | null>(available[0] ?? null)
  const active = selected && available.includes(selected) ? selected : available[0] ?? null

  const ex = active ? findExercise(active) : undefined
  const isRun = ex?.isRun ?? false

  const points = useMemo<LinePoint[]>(() => {
    if (!active) return []
    const out: LinePoint[] = []
    for (const s of ordered) {
      if (isRun) {
        if (s.runLog?.actualTimeSec) out.push({ label: shortDate(s.date), value: s.runLog.actualTimeSec })
      } else {
        const best = s.sets
          .filter((set) => set.exerciseId === active && set.completed)
          .reduce((max, set) => Math.max(max, set.actualReps), 0)
        if (best > 0) out.push({ label: shortDate(s.date), value: best })
      }
    }
    return out
  }, [active, ordered, isRun])

  if (available.length === 0) {
    return <div className="py-6 text-center text-sm text-slate-400">{t('history.noSessions')}</div>
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {available.map((id) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={
              'rounded-full px-3 py-1.5 text-xs font-bold transition-colors ' +
              (id === active
                ? 'bg-navy text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200')
            }
          >
            {exerciseName(id)}
          </button>
        ))}
      </div>
      <LineChart
        points={points}
        color={isRun ? '#f97316' : '#2563eb'}
        goal={isRun ? ex?.runGoalSec : ex?.goalValue}
        formatValue={isRun ? (v) => formatMMSS(v) : (v) => String(v)}
      />
    </div>
  )
}
