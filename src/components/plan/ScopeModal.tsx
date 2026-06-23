'use client'

import { useTranslation } from 'react-i18next'
import type { PlanScope } from '@/types'

interface ScopeModalProps {
  open: boolean
  onSelect: (scope: PlanScope) => void
  onCancel: () => void
}

/** Modal: apply plan edits to this workout only, or all future workouts. */
export function ScopeModal({ open, onSelect, onCancel }: ScopeModalProps) {
  const { t } = useTranslation()
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-base font-bold text-navy dark:text-slate-100">
          {t('plan.scopeTitle')}
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => onSelect('once')}
            className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 text-left dark:border-orange-900/40 dark:bg-orange-900/10"
          >
            <div className="text-2xl">1️⃣</div>
            <div className="mt-1 font-bold text-orange-600">{t('plan.scopeOnce')}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{t('plan.scopeOnceDesc')}</div>
          </button>
          <button
            onClick={() => onSelect('all')}
            className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-left dark:border-blue-900/40 dark:bg-blue-900/10"
          >
            <div className="text-2xl">♾️</div>
            <div className="mt-1 font-bold text-blue-600">{t('plan.scopeAll')}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{t('plan.scopeAllDesc')}</div>
          </button>
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
