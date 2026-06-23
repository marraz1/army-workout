'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { ProgressBar } from '@/components/charts/ProgressBar'
import { useApp } from '@/context/AppContext'
import { useWorkoutData } from '@/context/WorkoutDataContext'
import { ageGroupForAge } from '@/data/ageGroups'
import { scheduleForDate } from '@/data/weekSchedule'
import { dailyRoutine } from '@/data/dailyRoutine'
import { computeReadiness } from '@/lib/laf'
import { computeStreak, pickLang, todayISO } from '@/lib/utils'

const REST_TYPES = new Set(['Rest', 'Active Recovery'])

export default function Home() {
  const { t } = useTranslation()
  const router = useRouter()
  const { profile, language, logs, addLog } = useApp()
  const { sessions, personalBests } = useWorkoutData()

  if (!profile) return null

  const group = ageGroupForAge(profile.age)
  const today = scheduleForDate()
  const todayKey = todayISO()
  const todayLog = logs[todayKey]
  const todaySession = sessions.find((s) => s.date === todayKey)
  const streak = computeStreak(logs)
  const isRest = REST_TYPES.has(today.type)
  const readiness = computeReadiness(profile, personalBests)

  const markComplete = () =>
    addLog({ date: todayKey, status: 'completed', loggedAt: new Date().toISOString() })

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy dark:text-white">
            {t('home.greeting', { name: profile.name })}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {pickLang(language, group.label, group.labelLT)} · {group.range}
          </p>
        </div>
        {streak > 0 && (
          <div className="rounded-full bg-flag-yellow/20 px-3 py-1.5 text-sm font-bold text-amber-600 dark:text-flag-yellow">
            🔥 {t('home.streak', { count: streak })}
          </div>
        )}
      </div>

      {/* Today's workout */}
      <Card title={t('home.todaysWorkout')} accent={today.color}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{today.icon}</span>
          <div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {today.type}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{today.focus}</div>
          </div>
        </div>

        {todaySession ? (
          <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <div className="font-bold">{t(`history.status.${todaySession.status}`)} ✓</div>
            <div className="text-xs opacity-80">
              {t('history.totalReps', {
                n: todaySession.sets.reduce((sum, set) => sum + set.actualReps, 0),
              })}
            </div>
          </div>
        ) : (
          <>
            {!isRest && (
              <Button className="mt-4 w-full" onClick={() => router.push(`/log?date=${todayKey}`)}>
                ▶ {t('schedule.startSession')}
              </Button>
            )}
            {todayLog ? (
              <div className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {todayLog.status === 'completed' ? t('home.completed') : t('skip.logged')}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Button variant="secondary" onClick={markComplete} className="px-2">
                  ✓ {t('home.markComplete')}
                </Button>
                <Button variant="secondary" className="px-2" onClick={() => router.push('/skip')}>
                  ⏭ {t('home.skipDay')}
                </Button>
                <Button
                  variant="secondary"
                  className="px-2"
                  onClick={() => router.push('/skip?cheat=1')}
                >
                  🎭 {t('home.cheatDay')}
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* LAF readiness widget → History */}
      <button className="w-full text-left" onClick={() => router.push('/history')}>
        <Card title={`🏆 ${t('progress.readiness')}`}>
          <ProgressBar pct={readiness.overall} sublabel={t('home.viewProgress')} />
        </Card>
      </button>

      {/* Plan preview */}
      <Card title={t('home.yourPlan')}>
        <div className="grid grid-cols-2 gap-2">
          {group.exercises.slice(0, 4).map((ex) => (
            <div
              key={ex.name}
              className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-700/50"
            >
              <div className="text-lg">{ex.icon}</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {ex.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{ex.sets}</div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          className="mt-3 w-full"
          onClick={() => router.push('/guide')}
        >
          {t('guide.title')} →
        </Button>
      </Card>

      {/* Daily routine timeline */}
      <Card title={t('home.dailyRoutine')}>
        <div className="relative">
          <div className="absolute bottom-2 left-[18px] top-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-3">
            {dailyRoutine.map((item) => (
              <div key={item.time} className="relative flex gap-3">
                <div
                  className="z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base ring-2 ring-white dark:ring-slate-800"
                  style={{ background: item.color }}
                >
                  {item.icon}
                </div>
                <div className="pt-1">
                  <div className="text-xs font-bold text-slate-400">{item.time}</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
