'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common/Button'
import { exerciseIcon, exerciseName } from '@/lib/exercises'
import { formatMMSS } from '@/lib/utils'
import type { PersonalBest, SessionSet, WorkoutSession } from '@/types'

interface SessionDetailProps {
  session: WorkoutSession
  personalBests: PersonalBest[]
  onBack: () => void
  onDelete: (id: string) => void
}

const ENERGY_EMOJI = ['', '😴', '😓', '😐', '🙂', '💪']

/** Drill-down view of one session: per-set actual vs plan, run, energy, notes. */
export function SessionDetail({ session, personalBests, onBack, onDelete }: SessionDetailProps) {
  const { t } = useTranslation()

  // Group sets by exercise, preserving first-seen order.
  const groups: Array<{ exerciseId: string; sets: SessionSet[] }> = []
  for (const set of session.sets) {
    let g = groups.find((x) => x.exerciseId === set.exerciseId)
    if (!g) {
      g = { exerciseId: set.exerciseId, sets: [] }
      groups.push(g)
    }
    g.sets.push(set)
  }

  const pbExercises = new Set(
    personalBests.filter((pb) => pb.sessionId === session.id).map((pb) => pb.exerciseId),
  )

  const runDelta =
    session.runLog?.actualTimeSec != null && session.runLog.goalTimeSec != null
      ? session.runLog.goalTimeSec - session.runLog.actualTimeSec
      : null

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-sm font-semibold text-slate-500 hover:text-navy dark:text-slate-400"
      >
        ← {t('common.back')}
      </button>

      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-lg font-extrabold text-navy dark:text-slate-100">🕐 {session.date}</div>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {t(`history.status.${session.status}`)}
          </span>
        </div>
        <div className="text-xs text-slate-500">{session.dayType}</div>

        {/* Exercises */}
        <div className="mt-4 space-y-3">
          {groups.map((g) => (
            <div key={g.exerciseId} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
              <div className="mb-2 flex items-center gap-2">
                <span>{exerciseIcon(g.exerciseId)}</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-100">
                  {exerciseName(g.exerciseId)}
                </span>
                {pbExercises.has(g.exerciseId) && <span className="text-sm">⭐</span>}
              </div>
              <div className="space-y-1">
                {g.sets.map((set) => {
                  const delta = set.actualReps - set.plannedReps
                  return (
                    <div key={set.setNumber} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {t('logger.set', { n: set.setNumber, total: g.sets.length })}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {set.actualReps} / {set.plannedReps}
                        {!set.completed && <span className="ml-1 text-red-500">✗</span>}
                        {set.completed && delta !== 0 && (
                          <span
                            className="ml-2 font-bold"
                            style={{ color: delta > 0 ? '#16a34a' : '#ea580c' }}
                          >
                            {delta > 0 ? '+' : ''}
                            {delta}
                          </span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Run */}
        {session.runLog?.actualTimeSec != null && (
          <div className="mt-3 rounded-xl bg-orange-50 p-3 dark:bg-orange-900/10">
            <div className="text-sm font-bold text-orange-700 dark:text-orange-300">
              🏃 {t('history.runResult')}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              {formatMMSS(session.runLog.actualTimeSec)}
              {session.runLog.goalTimeSec != null && ` / ${formatMMSS(session.runLog.goalTimeSec)} ${t('logger.goal')}`}
              {runDelta != null && (
                <span className="ml-2 font-bold" style={{ color: runDelta >= 0 ? '#16a34a' : '#ea580c' }}>
                  {runDelta >= 0 ? '−' : '+'}
                  {formatMMSS(Math.abs(runDelta))}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Energy + notes */}
        {session.energyRating != null && (
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            ⚡ {t('history.energy')}: {ENERGY_EMOJI[session.energyRating] ?? ''}
          </div>
        )}
        {session.notes && (
          <div className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-700/40 dark:text-slate-300">
            📝 {session.notes}
          </div>
        )}
      </div>

      <Button
        variant="danger"
        className="w-full"
        onClick={() => {
          if (confirm(t('history.deleteConfirm'))) onDelete(session.id)
        }}
      >
        🗑️ {t('history.delete')}
      </Button>
    </div>
  )
}
