'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CalisthenicsLog } from '@/types/calisthenics'
import { calisthenicsExercises, MUSCLE_FILTER_MAP } from '@/data/calisthenicsExercises'

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Core', 'Legs', 'Full Body']

const PERIOD_DAYS = [7, 30, Infinity]

function getColor(count: number): string {
  if (count === 0)  return '#e2e8f0'
  if (count <= 2)   return '#22c55e'
  if (count <= 4)   return '#eab308'
  if (count <= 7)   return '#f97316'
  return '#ef4444'
}

function muscleForExercise(exerciseId: string, source: string): string[] {
  if (source === 'library') {
    const ex = calisthenicsExercises.find((e) => String(e.id) === exerciseId)
    return ex?.muscles ?? []
  }
  return []
}

interface MuscleHeatmapProps {
  logs: CalisthenicsLog[]
  onMuscleClick?: (muscle: string) => void
}

export function MuscleHeatmap({ logs, onMuscleClick }: MuscleHeatmapProps) {
  const { t } = useTranslation()
  const [periodIdx, setPeriodIdx] = useState(1)
  const days = PERIOD_DAYS[periodIdx]

  const PERIOD_LABELS = [
    t('calisthenics.period7'),
    t('calisthenics.period30'),
    t('calisthenics.periodAll'),
  ]

  const counts = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - (isFinite(days) ? days : 36500))
    const cutoffStr = cutoff.toISOString().slice(0, 10)

    const filtered = logs.filter(
      (l) => l.completed && (isFinite(days) ? l.sessionDate >= cutoffStr : true),
    )

    const map: Record<string, number> = {}
    for (const group of MUSCLE_GROUPS) map[group] = 0

    for (const log of filtered) {
      const muscles = muscleForExercise(log.exerciseId, log.source)
      for (const m of muscles) {
        for (const [group, aliases] of Object.entries(MUSCLE_FILTER_MAP)) {
          if (aliases.includes(m) || m === group) {
            map[group] = (map[group] ?? 0) + 1
          }
        }
      }
    }
    return map
  }, [logs, days])

  return (
    <div className="space-y-4">
      {/* Period toggle */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 w-fit">
        {PERIOD_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setPeriodIdx(i)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              periodIdx === i
                ? 'bg-purple-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-3 gap-3">
        {MUSCLE_GROUPS.map((group) => {
          const count = counts[group] ?? 0
          return (
            <button
              key={group}
              onClick={() => onMuscleClick?.(group)}
              className="rounded-xl p-3 text-center transition-transform hover:scale-105"
              style={{ backgroundColor: getColor(count) }}
            >
              <div className="text-xs font-bold text-white drop-shadow">{group}</div>
              <div className="text-lg font-bold text-white drop-shadow">{count}</div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
        {[
          { color: '#e2e8f0', label: '0' },
          { color: '#22c55e', label: '1–2' },
          { color: '#eab308', label: '3–4' },
          { color: '#f97316', label: '5–7' },
          { color: '#ef4444', label: '8+' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span>{label} {t('calisthenics.sessionsLegend')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
