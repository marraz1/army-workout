'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CalisthenicsLog } from '@/types/calisthenics'
import { calisthenicsExercises, findCalisthenicsExercise, MUSCLE_FILTER_MAP } from '@/data/calisthenicsExercises'
import { MuscleDisplay } from '@/components/muscle/MuscleDisplay'
import { getMuscleHighlightsFromNames } from '@/data/muscleMap'
import { useCalisthenics } from '@/context/CalisthenicsContext'

interface CalisthenicsSessionListProps {
  logs: CalisthenicsLog[]
  muscleFilter?: string
}

/** True if a library log's exercise targets the selected muscle group. */
function logMatchesMuscle(log: CalisthenicsLog, group: string): boolean {
  if (log.source !== 'library') return false
  const ex = calisthenicsExercises.find((e) => String(e.id) === log.exerciseId)
  if (!ex) return false
  const aliases = MUSCLE_FILTER_MAP[group] ?? [group]
  return ex.muscles.some((m) => aliases.includes(m) || m === group)
}

export function CalisthenicsSessionList({ logs, muscleFilter }: CalisthenicsSessionListProps) {
  const { t } = useTranslation()
  const { customExercises } = useCalisthenics()
  const [openDate, setOpenDate] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const visible = muscleFilter
      ? logs.filter((l) => logMatchesMuscle(l, muscleFilter))
      : logs
    const map = new Map<string, CalisthenicsLog[]>()
    for (const log of visible) {
      if (!map.has(log.sessionDate)) map.set(log.sessionDate, [])
      map.get(log.sessionDate)!.push(log)
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [logs, muscleFilter])

  if (grouped.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
        {t('history.noSessions')}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {grouped.map(([date, dateLogs]) => {
        const byEx = new Map<string, CalisthenicsLog[]>()
        for (const log of dateLogs) {
          if (!byEx.has(log.exerciseId)) byEx.set(log.exerciseId, [])
          byEx.get(log.exerciseId)!.push(log)
        }
        const completed = dateLogs.filter((l) => l.completed).length
        const status: 'completed' | 'partial' | 'skipped' =
          completed === 0 ? 'skipped' : completed === dateLogs.length ? 'completed' : 'partial'
        const statusColor =
          status === 'completed' ? '#22c55e' : status === 'partial' ? '#eab308' : '#ef4444'
        const isOpen = openDate === date

        return (
          <div key={date} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
              onClick={() => setOpenDate(isOpen ? null : date)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{date}</div>
                <div className="text-xs text-slate-500">{t('calisthenics.sessionSummary', { exercises: byEx.size, sets: completed })}</div>
              </div>
              <span
                className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ background: statusColor }}
              >
                {t(`history.status.${status}`)}
              </span>
              <span className="text-slate-400">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3 space-y-3">
                {Array.from(byEx.entries()).map(([exId, exLogs]) => {
                  const firstLog = exLogs[0]
                  let name = exId
                  let isCustom = false
                  let muscles: string[] = []

                  if (firstLog.source === 'library') {
                    const libEx = findCalisthenicsExercise(Number(exId))
                    name = libEx?.name ?? exId
                    muscles = libEx?.muscles ?? []
                  } else {
                    const custEx = customExercises.find((e) => e.id === exId)
                    name = custEx?.name ?? exId
                    muscles = custEx?.muscles ?? []
                    isCustom = true
                  }

                  const muscleHighlights = getMuscleHighlightsFromNames(muscles)

                  return (
                    <div key={exId}>
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{name}</span>
                        {isCustom && (
                          <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            🛠️ {t('calisthenics.customBadge')}
                          </span>
                        )}
                        {muscleHighlights.length > 0 && (
                          <MuscleDisplay highlights={muscleHighlights} compact />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {exLogs.sort((a, b) => a.setNumber - b.setNumber).map((l) => (
                          <div
                            key={l.id}
                            className={`rounded-lg px-2 py-1 text-xs ${
                              l.completed
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                            }`}
                          >
                            {t('calisthenics.set', { n: l.setNumber })}: {l.actualReps}{l.completed ? ' ✓' : ' ✗'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
