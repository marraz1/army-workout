'use client'

import { useTranslation } from 'react-i18next'
import { ProgressBar } from '@/components/charts/ProgressBar'
import { computeReadiness, type ReadinessBand } from '@/lib/laf'
import type { PersonalBest, UserProfile } from '@/types'

interface LafReadinessProps {
  profile: UserProfile | null
  personalBests: PersonalBest[]
}

const bandLabelKey: Record<ReadinessBand, string> = {
  fail: 'history.bands.fail',
  pass: 'history.bands.pass',
  good: 'history.bands.good',
  excellent: 'history.bands.excellent',
}

/** LAF readiness: per-standard % bars + overall band, with legend of bands. */
export function LafReadiness({ profile, personalBests }: LafReadinessProps) {
  const { t } = useTranslation()
  const readiness = computeReadiness(profile, personalBests)

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-700/40">
        <div className="text-4xl font-extrabold text-navy dark:text-flag-yellow">
          {readiness.overall}%
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {t('history.overall')} · {t(bandLabelKey[readiness.band])}
        </div>
      </div>

      {readiness.items.map((item) => (
        <ProgressBar
          key={item.exerciseId}
          pct={item.pct}
          label={item.label}
          sublabel={`${t('common.goal')}: ${item.target} · ${item.current}`}
        />
      ))}

      <div className="flex gap-2">
        {(
          [
            { range: '<60%', band: 'fail' as const },
            { range: '60–79%', band: 'pass' as const },
            { range: '80–99%', band: 'good' as const },
            { range: '100%+', band: 'excellent' as const },
          ]
        ).map((b) => (
          <div key={b.band} className="flex-1 rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-700/40">
            <div className="text-xs font-extrabold text-navy dark:text-slate-200">{b.range}</div>
            <div className="text-[10px] text-slate-500">{t(bandLabelKey[b.band])}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
