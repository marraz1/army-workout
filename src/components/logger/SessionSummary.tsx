'use client'

import { useTranslation } from 'react-i18next'
import { formatMMSS } from '@/lib/utils'
import type { SessionSummary as Summary } from '@/lib/session'

interface SessionSummaryProps {
  summary: Summary
  /** LAF readiness % after this session, and delta vs before (optional). */
  lafPct?: number
  lafDelta?: number
}

interface Tile {
  icon: string
  label: string
  value: string
  delta?: string
  ok: boolean
}

/** Grid of summary stat tiles shown after the last set. */
export function SessionSummary({ summary, lafPct, lafDelta }: SessionSummaryProps) {
  const { t } = useTranslation()

  const tiles: Tile[] = [
    {
      icon: '🔢',
      label: t('logger.totalReps'),
      value: `${summary.totalActualReps} / ${summary.totalPlannedReps} ${t('logger.planned')}`,
      delta: summary.repsDelta !== 0 ? `${summary.repsDelta > 0 ? '+' : ''}${summary.repsDelta}` : undefined,
      ok: summary.repsDelta >= 0,
    },
    {
      icon: '✅',
      label: t('logger.setsDone'),
      value: `${summary.setsDone} / ${summary.setsTotal}`,
      delta:
        summary.setsDone < summary.setsTotal ? `−${summary.setsTotal - summary.setsDone}` : undefined,
      ok: summary.setsDone >= summary.setsTotal,
    },
  ]

  if (summary.runActualSec != null) {
    tiles.push({
      icon: '🏃',
      label: t('logger.runResult'),
      value: `${formatMMSS(summary.runActualSec)}${summary.runGoalSec ? ` / ${formatMMSS(summary.runGoalSec)} ${t('logger.goal')}` : ''}`,
      delta:
        summary.runDeltaSec != null
          ? `${summary.runDeltaSec >= 0 ? '−' : '+'}${formatMMSS(Math.abs(summary.runDeltaSec))}`
          : undefined,
      ok: (summary.runDeltaSec ?? 0) >= 0,
    })
  }

  if (lafPct != null) {
    tiles.push({
      icon: '🏆',
      label: t('logger.lafScore'),
      value: `${lafPct}%`,
      delta: lafDelta ? `${lafDelta > 0 ? '+' : ''}${lafDelta}%` : undefined,
      ok: (lafDelta ?? 0) >= 0,
    })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="rounded-xl border p-3"
          style={{
            background: tile.ok ? '#f0fdf4' : '#fff7ed',
            borderColor: tile.ok ? '#86efac' : '#fed7aa',
          }}
        >
          <div className="text-lg">{tile.icon}</div>
          <div className="text-[11px] font-semibold text-slate-500">{tile.label}</div>
          <div className="mt-0.5 text-sm font-extrabold text-slate-800">{tile.value}</div>
          {tile.delta && (
            <div className="text-xs font-bold" style={{ color: tile.ok ? '#16a34a' : '#ea580c' }}>
              {tile.delta} {t('logger.vsPlan')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
