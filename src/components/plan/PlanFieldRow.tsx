'use client'

import { cn } from '@/lib/utils'

interface PlanFieldRowProps {
  icon: string
  label: string
  /** Current numeric value, or string for text/time fields. */
  value: string | number
  type?: 'number' | 'text'
  min?: number
  max?: number
  hint?: string
  placeholder?: string
  onChange: (value: string) => void
}

/** A single labelled inline input used in the plan editor. */
export function PlanFieldRow({
  icon,
  label,
  value,
  type = 'number',
  min,
  max,
  hint,
  placeholder,
  onChange,
}: PlanFieldRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-700/60">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</div>
        {hint && <div className="text-[11px] text-slate-400">{hint}</div>}
      </div>
      <input
        type={type}
        inputMode={type === 'number' ? 'numeric' : 'text'}
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 rounded-lg border-2 border-slate-200 bg-white px-3 text-right text-sm font-bold text-navy',
          'focus:border-navy focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100',
          type === 'number' ? 'w-20' : 'w-28',
        )}
      />
    </div>
  )
}
