'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { useApp } from '@/context/AppContext'
import { useWorkoutData } from '@/context/WorkoutDataContext'
import { useCalisthenics } from '@/context/CalisthenicsContext'
import { weekSchedule, trainingPhases, scheduleForDate } from '@/data/weekSchedule'
import { cn, pickLang, todayISO } from '@/lib/utils'
import type { SessionStatus } from '@/types'

/** ISO date of each weekday (Mon-first index) in the current week. */
function dateForWeekdayIndex(index: number): string {
  const now = new Date()
  const monFirst = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - monFirst)
  const d = new Date(monday)
  d.setDate(monday.getDate() + index)
  return todayISO(d)
}

const REST_TYPES = new Set(['Rest', 'Active Recovery'])

export default function Schedule() {
  const { t } = useTranslation()
  const router = useRouter()
  const { language, logs } = useApp()
  const { sessions } = useWorkoutData()
  const { plans: calPlans, logs: calLogs } = useCalisthenics()
  const todayDay = scheduleForDate().day
  const [expanded, setExpanded] = useState<string | null>(todayDay)

  const statusByDate = useMemo(() => {
    const map: Record<string, SessionStatus> = {}
    for (const [date, log] of Object.entries(logs)) {
      map[date] = (log.status === 'cheat' ? 'cheat' : log.status === 'skipped' ? 'skipped' : 'completed') as SessionStatus
    }
    for (const s of sessions) map[s.date] = s.status
    return map
  }, [logs, sessions])

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader icon="📅" title={t('schedule.title')} />
        <div className="space-y-2.5">
          {weekSchedule.map((day, i) => {
            const date = dateForWeekdayIndex(i)
            const status = statusByDate[date]
            const isRest = REST_TYPES.has(day.type)
            const isOpen = expanded === day.day
            const dayWeekday = (i + 1) % 7
            const dayCalPlans = calPlans.filter(
              (p) => p.dayOfWeek === dayWeekday && p.isActive,
            )
            const dayCalLogged = dayCalPlans.length > 0 && calLogs.some((l) => l.sessionDate === date)
            return (
              <div
                key={day.day}
                className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800"
                style={{ borderLeft: `5px solid ${day.color}` }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : day.day)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
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
                    <div className="text-xs text-slate-500 dark:text-slate-400">{day.focus}</div>
                  </div>
                  {status && (
                    <span
                      className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{
                        background:
                          status === 'completed'
                            ? '#22c55e'
                            : status === 'partial'
                              ? '#eab308'
                              : status === 'cheat'
                                ? '#8b5cf6'
                                : '#ef4444',
                      }}
                    >
                      {t(`history.status.${status}`)}
                    </span>
                  )}
                  {dayCalLogged && (
                    <span className="rounded-md bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      🤸 ✓
                    </span>
                  )}
                  <span className={cn('text-slate-300 transition-transform', isOpen && 'rotate-90')}>›</span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex gap-2 px-4 py-3">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => router.push(`/plan/edit?day=${day.day}`)}
                      >
                        ✏️ {t('schedule.editPlan')}
                      </Button>
                      {!isRest && (
                        <Button
                          className="flex-1"
                          onClick={() => router.push(`/log?day=${day.day}&date=${date}`)}
                        >
                          ▶ {t('schedule.startSession')}
                        </Button>
                      )}
                    </div>
                    {dayCalPlans.length > 0 && (
                      <div className="border-t border-slate-100 px-4 pb-3 dark:border-slate-700/60">
                        <p className="mb-2 pt-2 text-[11px] font-bold uppercase text-purple-600">
                          🤸 {t('calisthenics.title')}
                        </p>
                        <div className="mb-3 space-y-1">
                          {dayCalPlans.map((plan) => {
                            const name =
                              plan.libraryExercise?.name ??
                              plan.customExercise?.name ??
                              'Exercise'
                            return (
                              <div
                                key={plan.id}
                                className="border-l-4 border-purple-500 py-0.5 pl-2 text-xs text-slate-700 dark:text-slate-200"
                              >
                                {name} · {plan.sets}×{plan.repsOrSecs}
                              </div>
                            )
                          })}
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => router.push('/calisthenics/log')}
                        >
                          ▶ {t('calisthenics.startSession')}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
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
