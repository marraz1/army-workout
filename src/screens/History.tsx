'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { CalendarHeatmap } from '@/components/history/CalendarHeatmap'
import { ExerciseCharts } from '@/components/history/ExerciseCharts'
import { LafReadiness } from '@/components/history/LafReadiness'
import { PersonalBests } from '@/components/history/PersonalBests'
import { SessionHistoryList } from '@/components/history/SessionHistoryList'
import { WeeklySummary } from '@/components/history/WeeklySummary'
import { SessionDetail } from '@/components/history/SessionDetail'
import { useApp } from '@/context/AppContext'
import { useWorkoutData } from '@/context/WorkoutDataContext'
import { CalisthenicsHistory } from '@/components/history/CalisthenicsHistory'
import { lafStandards } from '@/data/lafStandards'
import { computeStreak } from '@/lib/utils'
import type { WorkoutSession } from '@/types'

type View = 'heatmap' | 'charts' | 'readiness' | 'bests' | 'sessions' | 'weekly'

const VIEWS: Array<{ key: View; icon: string }> = [
  { key: 'heatmap', icon: '📆' },
  { key: 'charts', icon: '📊' },
  { key: 'readiness', icon: '🏆' },
  { key: 'bests', icon: '⭐' },
  { key: 'sessions', icon: '📋' },
  { key: 'weekly', icon: '📅' },
]

export default function History() {
  const { t } = useTranslation()
  const { profile, logs } = useApp()
  const { sessions, personalBests, removeSession } = useWorkoutData()

  const [mode, setMode] = useState<'laf' | 'calisthenics'>('laf')
  const [view, setView] = useState<View>('heatmap')
  const [selected, setSelected] = useState<WorkoutSession | null>(null)

  const completed = Object.values(logs).filter((l) => l.status === 'completed').length
  const streak = computeStreak(logs)

  const onDeleteSession = async (id: string) => {
    await removeSession(id)
    setSelected(null)
  }

  if (selected) {
    return (
      <SessionDetail
        session={selected}
        personalBests={personalBests}
        onBack={() => setSelected(null)}
        onDelete={onDeleteSession}
      />
    )
  }

  return (
    <div className="space-y-5">
      <SectionHeader icon="📈" title={t('history.title')} />

      {/* Mode toggle */}
      <div className="flex gap-1.5">
        <button
          onClick={() => setMode('laf')}
          className={`flex-1 rounded-full py-2 text-xs font-bold transition-colors ${
            mode === 'laf'
              ? 'bg-navy text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
          }`}
        >
          🏋️ {t('calisthenics.lafTab')}
        </button>
        <button
          onClick={() => setMode('calisthenics')}
          className={`flex-1 rounded-full py-2 text-xs font-bold transition-colors ${
            mode === 'calisthenics'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
          }`}
        >
          🤸 {t('calisthenics.historyTab')}
        </button>
      </div>

      {mode === 'calisthenics' ? (
        <CalisthenicsHistory />
      ) : (
        <>

      {/* Quick stats (absorbed from Progress) */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-3xl font-extrabold text-navy dark:text-flag-yellow">{completed}</div>
          <div className="text-xs font-semibold text-slate-500">✅ {t('history.statsDone')}</div>
        </Card>
        <Card>
          <div className="text-3xl font-extrabold text-amber-500">{streak}</div>
          <div className="text-xs font-semibold text-slate-500">🔥 {t('history.statsStreak')}</div>
        </Card>
      </div>

      {/* Segmented control */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={
              'flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ' +
              (v.key === view
                ? 'bg-navy text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200')
            }
          >
            {v.icon} {t(`history.tabs.${v.key}`)}
          </button>
        ))}
      </div>

      {view === 'heatmap' && (
        <Card title={t('history.tabs.heatmap')}>
          <CalendarHeatmap
            sessions={sessions}
            logs={logs}
            onSelectDate={(date) => {
              const s = sessions.find((x) => x.date === date)
              if (s) setSelected(s)
            }}
          />
        </Card>
      )}

      {view === 'charts' && (
        <Card title={t('history.tabs.charts')}>
          <ExerciseCharts sessions={sessions} />
        </Card>
      )}

      {view === 'readiness' && (
        <>
          <Card title={t('history.tabs.readiness')}>
            <LafReadiness profile={profile} personalBests={personalBests} />
          </Card>
          <Card title={t('history.standards')}>
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
                    <tr key={row.group} className={i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-700/30' : ''}>
                      <td className="p-2 font-semibold text-navy dark:text-slate-200">{row.group}</td>
                      <td className="p-2 font-bold text-green-600">{row.pushups}</td>
                      <td className="p-2 font-bold text-blue-600">{row.situps}</td>
                      <td className="p-2 font-bold text-red-600">{row.run}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {view === 'bests' && (
        <Card title={t('history.tabs.bests')}>
          <PersonalBests personalBests={personalBests} />
        </Card>
      )}

      {view === 'sessions' && (
        <Card title={t('history.tabs.sessions')}>
          <SessionHistoryList sessions={sessions} onSelect={setSelected} />
        </Card>
      )}

      {view === 'weekly' && (
        <Card title={t('history.tabs.weekly')}>
          <WeeklySummary sessions={sessions} />
        </Card>
      )}
        </>
      )}
    </div>
  )
}
