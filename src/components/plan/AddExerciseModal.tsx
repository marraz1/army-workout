'use client'

import { useTranslation } from 'react-i18next'
import { MuscleDisplay } from '@/components/muscle/MuscleDisplay'
import type { Exercise } from '@/types'

interface AddExerciseModalProps {
  open: boolean
  /** Exercises from other groups not already in the current plan. */
  options: Exercise[]
  onSelect: (exercise: Exercise) => void
  onCancel: () => void
}

/** Modal: pick an exercise from the library to add to the plan. */
export function AddExerciseModal({ open, options, onSelect, onCancel }: AddExerciseModalProps) {
  const { t } = useTranslation()
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onCancel}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-base font-bold text-navy dark:text-slate-100">
          {t('plan.pickExercise')}
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {options.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-400">{t('plan.noneToAdd')}</div>
          )}
          {options.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelect(ex)}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-left dark:bg-slate-700/50"
            >
              <div className="shrink-0">
                <MuscleDisplay exerciseId={ex.id} compact />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-100">{ex.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{ex.sets} · {ex.target}</div>
              </div>
              <span className="text-lg text-green-600">＋</span>
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-4 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  )
}
