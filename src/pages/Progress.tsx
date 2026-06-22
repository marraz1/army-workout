import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { useApp } from '@/context/AppContext'
import { lafStandards } from '@/data/lafStandards'
import { computeStreak } from '@/lib/utils'

export default function Progress() {
  const { t } = useTranslation()
  const { logs } = useApp()

  const completed = Object.values(logs).filter((l) => l.status === 'completed').length
  const streak = computeStreak(logs)

  return (
    <div className="space-y-5">
      <SectionHeader icon="📊" title={t('progress.title')} />

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-3xl font-extrabold text-navy dark:text-flag-yellow">
            {completed}
          </div>
          <div className="text-xs font-semibold text-slate-500">✅ Workouts done</div>
        </Card>
        <Card>
          <div className="text-3xl font-extrabold text-amber-500">{streak}</div>
          <div className="text-xs font-semibold text-slate-500">🔥 Current streak</div>
        </Card>
      </div>

      {/* LAF standards reference */}
      <Card title={t('progress.readiness')}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-navy text-left text-white">
                <th className="p-2 font-semibold">Group</th>
                <th className="p-2 font-semibold">Push</th>
                <th className="p-2 font-semibold">Sit</th>
                <th className="p-2 font-semibold">Run</th>
              </tr>
            </thead>
            <tbody>
              {lafStandards.map((row, i) => (
                <tr
                  key={row.group}
                  className={i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-700/30' : ''}
                >
                  <td className="p-2 font-semibold text-navy dark:text-slate-200">
                    {row.group}
                  </td>
                  <td className="p-2 font-bold text-green-600">{row.pushups}</td>
                  <td className="p-2 font-bold text-blue-600">{row.situps}</td>
                  <td className="p-2 font-bold text-red-600">{row.run}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        📈 {t('progress.comingSoon')}
      </div>
    </div>
  )
}
