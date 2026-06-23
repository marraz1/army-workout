'use client'

import { useTranslation } from 'react-i18next'
import { exerciseIcon, exerciseName } from '@/lib/exercises'
import { formatMMSS } from '@/lib/utils'
import type { PersonalBest, PersonalBestMetric } from '@/types'

interface PersonalBestsProps {
  personalBests: PersonalBest[]
}

const metricKey: Record<PersonalBestMetric, string> = {
  maxReps: 'history.metric.maxReps',
  fastestRunSec: 'history.metric.fastestRun',
  longestHoldSec: 'history.metric.longestHold',
}

function formatValue(pb: PersonalBest): string {
  if (pb.metric === 'fastestRunSec') return formatMMSS(pb.value)
  if (pb.metric === 'longestHoldSec') return `${pb.value}s`
  return String(pb.value)
}

/** All-time personal bests list with metric label, value and date. */
export function PersonalBests({ personalBests }: PersonalBestsProps) {
  const { t } = useTranslation()

  if (personalBests.length === 0) {
    return <div className="py-6 text-center text-sm text-slate-400">{t('history.noBests')}</div>
  }

  return (
    <div className="space-y-2">
      {personalBests.map((pb) => (
        <div
          key={pb.id}
          className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-700/40"
        >
          <span className="text-xl">⭐</span>
          <span className="text-lg">{exerciseIcon(pb.exerciseId)}</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-100">
              {exerciseName(pb.exerciseId)}
            </div>
            <div className="text-[11px] text-slate-500">{t(metricKey[pb.metric])} · {pb.date}</div>
          </div>
          <div className="text-lg font-extrabold text-navy dark:text-flag-yellow">
            {formatValue(pb)}
          </div>
        </div>
      ))}
    </div>
  )
}
