'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatMMSS } from '@/lib/utils'

interface RestTimerProps {
  seconds: number
  onComplete: () => void
}

/** Auto-counting rest timer with skip and +15s override. */
export function RestTimer({ seconds, onComplete }: RestTimerProps) {
  const { t } = useTranslation()
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) {
      onComplete()
      return
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining, onComplete])

  const pct = seconds > 0 ? (remaining / seconds) * 100 : 0

  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-slate-800">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {t('logger.rest')}
      </div>
      <div className="mb-4 text-5xl font-extrabold tabular-nums text-navy dark:text-slate-100">
        {formatMMSS(remaining)}
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full rounded-full bg-navy transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setRemaining((r) => r + 15)}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200"
        >
          {t('logger.addRest')}
        </button>
        <button
          onClick={onComplete}
          className="rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white"
        >
          {t('logger.skipRest')} ⏭
        </button>
      </div>
    </div>
  )
}
