import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { useApp } from '@/context/AppContext'
import { weekSchedule, trainingPhases, scheduleForDate } from '@/data/weekSchedule'
import { pickLang } from '@/lib/utils'

export default function Schedule() {
  const { t } = useTranslation()
  const { language } = useApp()
  const todayDay = scheduleForDate().day

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader icon="📅" title={t('schedule.title')} />
        <div className="space-y-2.5">
          {weekSchedule.map((day) => (
            <div
              key={day.day}
              className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-800"
              style={{ borderLeft: `5px solid ${day.color}` }}
            >
              <div className="w-11 text-center">
                <div className="text-sm font-extrabold" style={{ color: day.color }}>
                  {day.day}
                </div>
                {day.day === todayDay && (
                  <div className="text-[9px] font-bold uppercase text-slate-400">
                    {t('common.today')}
                  </div>
                )}
              </div>
              <div className="text-2xl">{day.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {day.type}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {day.focus}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card title={t('schedule.phasesTitle')}>
        <div className="space-y-3">
          {trainingPhases.map((p) => (
            <div
              key={p.name}
              className="rounded-xl p-4"
              style={{ background: `${p.color}11`, border: `2px solid ${p.color}33` }}
            >
              <div
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ color: p.color }}
              >
                {pickLang(language, p.phase, p.phaseLT)}
              </div>
              <div className="mt-0.5 text-base font-extrabold text-slate-800 dark:text-slate-100">
                {pickLang(language, p.name, p.nameLT)}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {pickLang(language, p.desc, p.descLT)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
