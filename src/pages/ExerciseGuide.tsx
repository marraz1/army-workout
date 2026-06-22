import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { useApp } from '@/context/AppContext'
import { ageGroups, ageGroupForAge } from '@/data/ageGroups'
import { cn, pickLang } from '@/lib/utils'

export default function ExerciseGuide() {
  const { t } = useTranslation()
  const { profile, language } = useApp()

  const defaultIndex = profile
    ? ageGroups.indexOf(ageGroupForAge(profile.age))
    : 0
  const [active, setActive] = useState(defaultIndex < 0 ? 0 : defaultIndex)
  const group = ageGroups[active]

  return (
    <div>
      <SectionHeader icon="🖼️" title={t('guide.title')} />

      {/* Age-group tabs */}
      <div className="mb-5 flex gap-2">
        {ageGroups.map((g, i) => (
          <button
            key={g.range}
            onClick={() => setActive(i)}
            className={cn(
              'flex-1 rounded-full border-2 px-2 py-2 text-sm font-bold transition-colors',
            )}
            style={{
              borderColor: g.color,
              background: active === i ? g.color : 'transparent',
              color: active === i ? '#fff' : g.color,
            }}
          >
            {g.range}
          </button>
        ))}
      </div>

      {/* Group summary */}
      <div
        className="mb-5 rounded-2xl border-2 p-4"
        style={{ background: group.bg, borderColor: group.border }}
      >
        <div className="text-base font-bold" style={{ color: group.color }}>
          {pickLang(language, group.label, group.labelLT)}
        </div>
        <div className="mt-1 text-sm text-slate-600">
          {pickLang(language, group.goal, group.goalLT)}
        </div>
        <div className="mt-2 text-xs font-semibold text-slate-500">
          📅 {group.frequency} &nbsp;·&nbsp; ⏱ {group.rest}
        </div>
      </div>

      {/* Exercise cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {group.exercises.map((ex) => (
          <div
            key={ex.name}
            className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800"
            style={{ borderLeft: `4px solid ${group.color}` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xl">{ex.icon}</div>
                <div className="mt-1 font-bold text-slate-800 dark:text-slate-100">
                  {ex.name}
                </div>
              </div>
              <div
                className="rounded-lg px-2.5 py-1 text-sm font-bold"
                style={{ background: group.bg, color: group.color }}
              >
                {ex.sets}
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              🎯 {ex.target}
            </div>
            {/* Illustration placeholder — replaced by Lottie/SVG in Phase 3 */}
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-[11px] text-green-700 dark:bg-green-900/20 dark:text-green-300">
              🖼️ {t('guide.illustration')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
