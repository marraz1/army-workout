'use client'

import { useState } from 'react'
import { todayISO } from '@/lib/utils'

export type HeatStatus =
  | 'completed'
  | 'partial'
  | 'skipped'
  | 'cheat'
  | 'recovery'
  | 'rest'

export const heatColor: Record<HeatStatus, string> = {
  completed: '#22c55e',
  partial: '#eab308',
  skipped: '#ef4444',
  cheat: '#8b5cf6',
  recovery: '#06b6d4',
  rest: '#cbd5e1',
}

interface HeatmapProps {
  /** ISO date (YYYY-MM-DD) → status. */
  statusByDate: Record<string, HeatStatus>
  onSelectDate?: (dateISO: string) => void
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

/** Monthly calendar grid, each day cell coloured by status. Mon-first. */
export function Heatmap({ statusByDate, onSelectDate }: HeatmapProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // JS getDay 0=Sun..6=Sat → Mon-first leading blanks.
  const leading = (first.getDay() + 6) % 7
  const today = todayISO()

  const step = (delta: number) => {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => step(-1)}
          className="rounded-lg px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-sm font-bold text-navy dark:text-slate-100">{monthLabel(year, month)}</div>
        <button
          onClick={() => step(1)}
          className="rounded-lg px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-slate-400">
            {d}
          </div>
        ))}
        {Array.from({ length: leading }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const status = statusByDate[iso]
          const isToday = iso === today
          return (
            <button
              key={iso}
              onClick={() => onSelectDate?.(iso)}
              className="flex aspect-square items-center justify-center rounded-md text-[11px] font-semibold transition-transform active:scale-95"
              style={{
                background: status ? heatColor[status] : 'transparent',
                color: status && status !== 'rest' ? '#fff' : '#94a3b8',
                border: isToday ? '2px solid #1e3a5f' : '1px solid #e2e8f0',
              }}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
