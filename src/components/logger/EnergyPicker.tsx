'use client'

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface EnergyPickerProps {
  value?: number
  onChange: (value: number) => void
}

const EMOJI = ['😴', '😓', '😐', '🙂', '💪']

/** 1–5 emoji energy scale. */
export function EnergyPicker({ value, onChange }: EnergyPickerProps) {
  const { t } = useTranslation()
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        ⚡ {t('logger.energy')}
      </div>
      <div className="flex justify-between gap-2">
        {EMOJI.map((emoji, i) => {
          const level = i + 1
          return (
            <button
              key={level}
              onClick={() => onChange(level)}
              className={cn(
                'flex-1 rounded-xl border-2 py-2 text-2xl transition-colors',
                value === level
                  ? 'border-flag-yellow bg-amber-50 dark:bg-amber-900/20'
                  : 'border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/40',
              )}
              aria-label={`energy ${level}`}
            >
              {emoji}
            </button>
          )
        })}
      </div>
    </div>
  )
}
