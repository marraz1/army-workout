'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { SetCard } from '@/components/logger/SetCard'
import { RestTimer } from '@/components/logger/RestTimer'
import { EnergyPicker } from '@/components/logger/EnergyPicker'
import { useCalisthenics } from '@/context/CalisthenicsContext'
import { findCalisthenicsExercise } from '@/data/calisthenicsExercises'
import { todayISO } from '@/lib/utils'
import type { Exercise } from '@/types'
import type { CalisthenicsPlan, CalisthenicsSetInput, CalisthenicsSource } from '@/types/calisthenics'

interface QueueItem {
  plan: CalisthenicsPlan
  setNumber: number
}

type Phase = 'select' | 'logging' | 'resting' | 'summary' | 'saved'

function planToExercise(plan: CalisthenicsPlan): Exercise {
  const libEx = plan.source === 'library' && plan.libraryExerciseId
    ? findCalisthenicsExercise(plan.libraryExerciseId)
    : undefined
  const custEx = plan.customExercise

  const name = libEx?.name ?? custEx?.name ?? 'Exercise'
  const isTimed = libEx?.isTimed ?? custEx?.isTimed ?? false

  return {
    id: `cal-${plan.id}`,
    name,
    sets: `${plan.sets}×${plan.repsOrSecs}`,
    target: plan.goalTarget ?? '',
    icon: '🤸',
    setsCount: plan.sets,
    repsTarget: plan.repsOrSecs,
    restSec: plan.restSec,
    isRepBased: true,
    isHold: isTimed,
    isRun: false,
  }
}

interface SetResult {
  planId: string
  source: CalisthenicsSource
  exerciseId: string
  setNumber: number
  plannedReps: number
  actualReps: number
  completed: boolean
}

export default function CalisthenicsLogger() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useSearchParams()
  const { plans, saveLogs, loading } = useCalisthenics()

  const date = params.get('date') ?? todayISO()
  const weekday = new Date(date + 'T12:00:00').getDay()

  const todayPlans = useMemo(
    () => plans.filter((p) => p.dayOfWeek === weekday && p.isActive),
    [plans, weekday],
  )

  // Build queue: each set of each plan
  const queue: QueueItem[] = useMemo(() => {
    const items: QueueItem[] = []
    for (const plan of todayPlans) {
      for (let s = 1; s <= plan.sets; s++) {
        items.push({ plan, setNumber: s })
      }
    }
    return items
  }, [todayPlans])

  // null = follow the default (all of today's plans); otherwise the user's edit.
  // Deriving the default reactively avoids a stale empty-Set when plans load
  // after the logger first mounts (cold load of /calisthenics/log).
  const [selectedOverride, setSelectedOverride] = useState<Set<string> | null>(null)
  const selectedPlanIds = useMemo(
    () => selectedOverride ?? new Set(todayPlans.map((p) => p.id)),
    [selectedOverride, todayPlans],
  )
  const [phase, setPhase] = useState<Phase>('select')
  const [queueIdx, setQueueIdx] = useState(0)
  const [results, setResults] = useState<SetResult[]>([])
  const [energyRating, setEnergyRating] = useState<number>(3)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const filteredQueue = queue.filter((q) => selectedPlanIds.has(q.plan.id))
  const current = filteredQueue[queueIdx]

  function handleSetDone(actualReps: number) {
    if (!current) return
    const plan = current.plan
    const exId = plan.source === 'library'
      ? String(plan.libraryExerciseId)
      : (plan.customExerciseId ?? '')

    setResults((prev) => [
      ...prev,
      {
        planId: plan.id,
        source: plan.source,
        exerciseId: exId,
        setNumber: current.setNumber,
        plannedReps: plan.repsOrSecs,
        actualReps,
        completed: true,
      },
    ])
    advance()
  }

  function handleSetSkip() {
    if (!current) return
    const plan = current.plan
    const exId = plan.source === 'library'
      ? String(plan.libraryExerciseId)
      : (plan.customExerciseId ?? '')

    setResults((prev) => [
      ...prev,
      {
        planId: plan.id,
        source: plan.source,
        exerciseId: exId,
        setNumber: current.setNumber,
        plannedReps: plan.repsOrSecs,
        actualReps: 0,
        completed: false,
      },
    ])
    // Skip rest, go directly to next
    advanceDirect()
  }

  function advance() {
    // Show rest between sets (not after last set)
    const isLastSet = current?.setNumber === current?.plan.sets
    if (!isLastSet) {
      setPhase('resting')
    } else {
      advanceDirect()
    }
  }

  function advanceDirect() {
    const next = queueIdx + 1
    if (next >= filteredQueue.length) {
      setPhase('summary')
    } else {
      setQueueIdx(next)
      setPhase('logging')
    }
  }

  const handleSave = useCallback(async () => {
    if (results.length === 0) {
      setSaveError(t('calisthenics.noSetsRecorded'))
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      // Group results by (planId, exerciseId, source)
      const byExercise = new Map<string, SetResult[]>()
      for (const r of results) {
        const key = `${r.planId}__${r.exerciseId}`
        if (!byExercise.has(key)) byExercise.set(key, [])
        byExercise.get(key)!.push(r)
      }

      console.log('[CalisthenicsLogger] Saving session:', {
        date,
        exercises: byExercise.size,
        totalSets: results.length,
        results,
      })

      await Promise.all(
        Array.from(byExercise.entries()).map(([, sets]) => {
          const first = sets[0]
          const payload: Parameters<typeof saveLogs>[0] = {
            sessionDate: date,
            planId: first.planId,
            source: first.source,
            exerciseId: first.exerciseId,
            sets: sets.map<CalisthenicsSetInput>((s) => ({
              setNumber: s.setNumber,
              plannedReps: s.plannedReps,
              actualReps: s.actualReps,
              completed: s.completed,
            })),
          }
          console.log('[CalisthenicsLogger] POST payload:', payload)
          return saveLogs(payload)
        }),
      )
      console.log('[CalisthenicsLogger] Save complete ✅')
      setPhase('saved')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save session.'
      console.error('[CalisthenicsLogger] Save error:', msg)
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }, [results, date, saveLogs, t])

  // ─── PHASE: select ────────────────────────────────────────────────────────
  if (phase === 'select') {
    // Show spinner while plans are loading so we never flash "nothing planned"
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-4xl animate-spin">🤸</div>
        </div>
      )
    }

    if (todayPlans.length === 0) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="text-4xl">🤸</div>
          <p className="text-slate-600 dark:text-slate-300">{t('calisthenics.noPlannedToday')}</p>
          <button
            onClick={() => router.push('/calisthenics')}
            className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white"
          >
            {t('calisthenics.browseLibrary')}
          </button>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
        <div className="px-4 py-6 space-y-4">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">🤸 {t('calisthenics.title')}</h1>
          <p className="text-sm text-slate-500">{t('calisthenics.selectToLog')}</p>
          <div className="space-y-2">
            {todayPlans.map((plan) => {
              const ex = planToExercise(plan)
              const checked = selectedPlanIds.has(plan.id)
              return (
                <button
                  key={plan.id}
                  onClick={() =>
                    setSelectedOverride(() => {
                      const next = new Set(selectedPlanIds)
                      if (next.has(plan.id)) next.delete(plan.id)
                      else next.add(plan.id)
                      return next
                    })
                  }
                  className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                    checked
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  <span className={`text-xl ${checked ? '' : 'opacity-40'}`}>
                    {checked ? '✅' : '⬜'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 dark:text-slate-100">{ex.name}</div>
                    <div className="text-xs text-slate-500">{plan.sets}×{plan.repsOrSecs}{ex.isHold ? 's' : ''} · {plan.restSec}s rest</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    {t('logger.scheduledTag')}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            onClick={() => {
              if (filteredQueue.length === 0) return
              setQueueIdx(0)
              setResults([])
              setPhase('logging')
            }}
            disabled={selectedPlanIds.size === 0 || filteredQueue.length === 0}
            className="w-full rounded-2xl bg-purple-600 py-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            ▶ {t('calisthenics.startSession')}
          </button>
        </div>
      </div>
    )
  }

  // ─── PHASE: logging ───────────────────────────────────────────────────────
  // Fallback: if current is undefined (queue unexpectedly empty), return to select
  if (phase === 'logging' && !current) {
    console.warn('[CalisthenicsLogger] filteredQueue empty during logging, returning to select')
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-4xl">⚠️</div>
        <p className="text-slate-600 dark:text-slate-300">No exercises in queue. Please go back and try again.</p>
        <button
          onClick={() => { setPhase('select'); setQueueIdx(0); setResults([]) }}
          className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white"
        >
          ← Back
        </button>
      </div>
    )
  }

  if (phase === 'logging' && current) {
    const ex = planToExercise(current.plan)
    const totalSets = filteredQueue.filter((q) => q.plan.id === current.plan.id).length
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 px-4 py-6">
        <div className="mb-4">
          <div className="text-xs font-bold uppercase text-purple-600">
            Exercise {todayPlans.findIndex((p) => p.id === current.plan.id) + 1} of {filteredQueue.map((q) => q.plan.id).filter((v, i, a) => a.indexOf(v) === i).length}
          </div>
          <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-2 rounded-full bg-purple-600 transition-all"
              style={{ width: `${((queueIdx + 1) / filteredQueue.length) * 100}%` }}
            />
          </div>
        </div>
        <SetCard
          exercise={ex}
          setNumber={current.setNumber}
          totalSets={totalSets}
          plannedReps={current.plan.repsOrSecs}
          restSec={current.plan.restSec}
          onDone={handleSetDone}
          onSkip={handleSetSkip}
        />
      </div>
    )
  }

  // ─── PHASE: resting ───────────────────────────────────────────────────────
  if (phase === 'resting' && current) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6">
        <RestTimer
          seconds={current.plan.restSec}
          onComplete={() => { setQueueIdx((i) => i + 1); setPhase('logging') }}
        />
      </div>
    )
  }

  // ─── PHASE: summary ───────────────────────────────────────────────────────
  if (phase === 'summary') {
    const completed = results.filter((r) => r.completed).length
    const total = results.length
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 px-4 py-6 space-y-6">
        <div className="text-center">
          <div className="text-4xl">🤸</div>
          <h2 className="mt-2 text-xl font-bold text-slate-800 dark:text-slate-100">{t('calisthenics.sessionComplete')}</h2>
          <p className="text-sm text-slate-500 mt-1">{t('calisthenics.setsCompleted', { completed, total })}</p>
        </div>

        <EnergyPicker value={energyRating} onChange={setEnergyRating} />

        {saveError && (
          <div className="rounded-xl border-2 border-red-400 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-300">
            ⚠️ {saveError}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-2xl bg-purple-600 py-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? t('calisthenics.saving') : `💾 ${t('calisthenics.saveSession')}`}
        </button>
      </div>
    )
  }

  // ─── PHASE: saved ─────────────────────────────────────────────────────────
  if (phase === 'saved') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="text-6xl">✅</div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('calisthenics.sessionSaved')}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/history')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium dark:border-slate-600"
          >
            {t('history.tabs.sessions')}
          </button>
          <button
            onClick={() => router.push('/')}
            className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t('nav.home')}
          </button>
        </div>
      </div>
    )
  }

  return null
}
