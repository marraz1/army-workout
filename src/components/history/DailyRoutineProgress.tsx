'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/common/Card'
import { useRoutine } from '@/context/RoutineContext'
import type { RoutineLog } from '@/types'

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function DailyRoutineProgress() {
  const { t } = useTranslation()
  const { logs, items } = useRoutine()
  const [expanded, setExpanded] = useState<string | null>(null)

  // Group logs by date, keep only completed ones
  const byDate = logs.reduce<Record<string, RoutineLog[]>>((acc, log) => {
    if (!log.completed) return acc
    if (!acc[log.date]) acc[log.date] = []
    acc[log.date].push(log)
    return acc
  }, {})

  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a))
  const total = items.length

  if (dates.length === 0) {
    return (
      <Card title={t('routine.progressTitle')}>
        <p className="text-center text-sm text-slate-400">{t('routine.noHistory')}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-[15px] font-bold text-navy dark:text-slate-100">
        {t('routine.progressTitle')}
      </div>

      {dates.map((date) => {
        const completed = byDate[date].length
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0
        const isOpen = expanded === date

        return (
          <div
            key={date}
            className="rounded-2xl bg-white shadow-sm dark:bg-slate-800"
          >
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
              onClick={() => setExpanded(isOpen ? null : date)}
            >
              {/* Date */}
              <div className="w-28 flex-shrink-0">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {formatDate(date)}
                </div>
                <div className="text-xs text-slate-400">
                  {completed}/{total} {t('routine.itemsDone')}
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct === 100
                          ? '#22c55e'
                          : pct >= 70
                          ? '#f59e0b'
                          : '#ef4444',
                    }}
                  />
                </div>
              </div>

              {/* Pct badge */}
              <div
                className="w-11 flex-shrink-0 text-right text-xs font-bold"
                style={{
                  color: pct === 100 ? '#22c55e' : pct >= 70 ? '#f59e0b' : '#ef4444',
                }}
              >
                {pct}%
              </div>

              <span className="text-xs text-slate-400">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 px-4 pb-3 pt-2 dark:border-slate-700">
                <div className="space-y-1.5">
                  {items.map((item) => {
                    const done = byDate[date].some((l) => l.itemKey === item.id)
                    return (
                      <div key={item.id} className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <span
                          className={`text-sm ${
                            done
                              ? 'text-slate-700 dark:text-slate-200'
                              : 'text-slate-300 line-through dark:text-slate-600'
                          }`}
                        >
                          {item.label}
                        </span>
                        {done && <span className="ml-auto text-green-500">✓</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
