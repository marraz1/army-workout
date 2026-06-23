'use client'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Heatmap, heatColor, type HeatStatus } from '@/components/charts/Heatmap'
import type { WorkoutLog, WorkoutSession } from '@/types'

interface CalendarHeatmapProps {
  sessions: WorkoutSession[]
  logs: Record<string, WorkoutLog>
  onSelectDate?: (dateISO: string) => void
}

const LEGEND: Array<{ status: HeatStatus; key: string }> = [
  { status: 'completed', key: 'completed' },
  { status: 'partial', key: 'partial' },
  { status: 'skipped', key: 'skipped' },
  { status: 'cheat', key: 'cheat' },
  { status: 'recovery', key: 'recovery' },
  { status: 'rest', key: 'rest' },
]

/** Calendar heatmap fed by logs overlaid with richer session statuses. */
export function CalendarHeatmap({ sessions, logs, onSelectDate }: CalendarHeatmapProps) {
  const { t } = useTranslation()

  const statusByDate = useMemo(() => {
    const map: Record<string, HeatStatus> = {}
    for (const [date, log] of Object.entries(logs)) {
      map[date] = log.status === 'cheat' ? 'cheat' : log.status === 'skipped' ? 'skipped' : 'completed'
    }
    // Sessions are richer (can be 'partial') and take priority.
    for (const s of sessions) {
      map[s.date] = s.status as HeatStatus
    }
    return map
  }, [sessions, logs])

  return (
    <div>
      <Heatmap statusByDate={statusByDate} onSelectDate={onSelectDate} />
      <div className="mt-4 flex flex-wrap gap-2">
        {LEGEND.map((l) => (
          <div key={l.key} className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ background: heatColor[l.status] }} />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {t(`history.legend.${l.key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
