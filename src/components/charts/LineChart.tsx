'use client'

import { useMemo } from 'react'

export interface LinePoint {
  /** X label (e.g. a short date). */
  label: string
  value: number
}

interface LineChartProps {
  points: LinePoint[]
  color?: string
  /** Optional dashed horizontal goal line. */
  goal?: number
  /** Format a value for the tooltip / axis (e.g. MM:SS). */
  formatValue?: (v: number) => string
  /** When true, lower values are better (run time) — flips the fill direction hint only. */
  height?: number
}

const W = 320
const PAD = { top: 12, right: 10, bottom: 22, left: 32 }

/** Dependency-free SVG line chart: polyline + points, optional goal line. */
export function LineChart({
  points,
  color = '#2563eb',
  goal,
  formatValue = (v) => String(v),
  height = 160,
}: LineChartProps) {
  const H = height
  const geom = useMemo(() => {
    const values = points.map((p) => p.value)
    if (goal != null) values.push(goal)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    const x = (i: number) =>
      PAD.left + (points.length <= 1 ? innerW / 2 : (i / (points.length - 1)) * innerW)
    const y = (v: number) => PAD.top + innerH - ((v - min) / span) * innerH

    return {
      min,
      max,
      coords: points.map((p, i) => ({ cx: x(i), cy: y(p.value), ...p })),
      goalY: goal != null ? y(goal) : null,
    }
  }, [points, goal, H])

  if (points.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400 dark:bg-slate-700/40">
        No data yet
      </div>
    )
  }

  const polyline = geom.coords.map((c) => `${c.cx},${c.cy}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {/* y-axis min/max ticks */}
      <text x={4} y={PAD.top + 4} className="fill-slate-400" fontSize="9">
        {formatValue(geom.max)}
      </text>
      <text x={4} y={H - PAD.bottom} className="fill-slate-400" fontSize="9">
        {formatValue(geom.min)}
      </text>

      {/* goal line */}
      {geom.goalY != null && (
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={geom.goalY}
          y2={geom.goalY}
          stroke="#16a34a"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      )}

      {/* line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />

      {/* points + x labels */}
      {geom.coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r={3.5} fill={color} />
          {(i === 0 || i === geom.coords.length - 1 || geom.coords.length <= 5) && (
            <text x={c.cx} y={H - 6} textAnchor="middle" className="fill-slate-400" fontSize="8">
              {c.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
