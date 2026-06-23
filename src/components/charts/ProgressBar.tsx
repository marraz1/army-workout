import { cn } from '@/lib/utils'
import { bandFor, type ReadinessBand } from '@/lib/laf'

const bandColor: Record<ReadinessBand, string> = {
  fail: '#ef4444',
  pass: '#eab308',
  good: '#22c55e',
  excellent: '#1e3a5f',
}

interface ProgressBarProps {
  /** 0–100+ percentage. */
  pct: number
  label?: string
  sublabel?: string
  className?: string
}

/** A LAF-band coloured percentage bar (capped visually at 100%). */
export function ProgressBar({ pct, label, sublabel, className }: ProgressBarProps) {
  const color = bandColor[bandFor(pct)]
  const width = Math.min(100, Math.max(0, pct))

  return (
    <div className={cn('w-full', className)}>
      {(label || sublabel) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          {label && (
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
          )}
          {sublabel && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{sublabel}</span>
          )}
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      <div className="mt-1 text-right text-sm font-extrabold" style={{ color }}>
        {Math.round(pct)}%
      </div>
    </div>
  )
}
