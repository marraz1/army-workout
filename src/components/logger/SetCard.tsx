'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MuscleDisplay } from '@/components/muscle/MuscleDisplay'
import type { Exercise } from '@/types'

interface SetCardProps {
  exercise: Exercise
  setNumber: number
  totalSets: number
  plannedReps: number
  restSec: number
  onDone: (actual: number) => void
  onSkip: () => void
}

/** Single-set logging card: +/− actual reps, delta vs plan, Done / Skip. */
export function SetCard({
  exercise,
  setNumber,
  totalSets,
  plannedReps,
  restSec,
  onDone,
  onSkip,
}: SetCardProps) {
  const { t } = useTranslation()
  const [actual, setActual] = useState(plannedReps)
  const delta = actual - plannedReps
  const unit = exercise.isHold ? 's' : ''

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-extrabold text-navy dark:text-slate-100">
          <span>{exercise.icon}</span> {exercise.name}
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {t('logger.set', { n: setNumber, total: totalSets })}
        </span>
      </div>

      <div className="mb-3">
        <MuscleDisplay exerciseId={exercise.id} compact />
      </div>

      <div className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        📋 {exercise.isHold ? t('logger.planHold', { n: plannedReps }) : t('logger.planReps', { n: plannedReps })}
        &nbsp;·&nbsp; ⏱ {t('logger.restAfter', { n: restSec })}
      </div>

      <div className="mb-5">
        <div className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {exercise.isHold ? t('logger.actualHold') : t('logger.actualReps')}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActual((v) => Math.max(0, v - 1))}
            className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-100 text-xl font-bold text-slate-600 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="decrease"
          >
            −
          </button>
          <div className="flex h-10 w-20 items-center justify-center rounded-lg border-2 border-navy text-2xl font-extrabold text-navy dark:text-slate-100">
            {actual}{unit}
          </div>
          <button
            onClick={() => setActual((v) => v + 1)}
            className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-100 text-xl font-bold text-slate-600 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="increase"
          >
            +
          </button>
          {delta !== 0 && (
            <span
              className="text-xs font-bold"
              style={{ color: delta > 0 ? '#16a34a' : '#ea580c' }}
            >
              {delta > 0 ? '+' : ''}
              {delta} {t('logger.vsPlan')}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onDone(actual)}
          className="flex-1 rounded-xl border-2 border-green-400 bg-green-50 py-2.5 text-sm font-bold text-green-700 active:scale-95 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
        >
          ✓ {t('logger.done')}
        </button>
        <button
          onClick={onSkip}
          className="flex-1 rounded-xl border-2 border-red-300 bg-red-50 py-2.5 text-sm font-bold text-red-600 active:scale-95 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
        >
          ✗ {t('logger.skip')}
        </button>
      </div>
    </div>
  )
}
