'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { SetCard } from '@/components/logger/SetCard'
import { RestTimer } from '@/components/logger/RestTimer'
import { EnergyPicker } from '@/components/logger/EnergyPicker'
import { SessionSummary } from '@/components/logger/SessionSummary'
import { useApp } from '@/context/AppContext'
import { useWorkoutData } from '@/context/WorkoutDataContext'
import { ageGroupForAge, ageGroups } from '@/data/ageGroups'
import { scheduleForDate } from '@/data/weekSchedule'
import { resolveEffectivePlan } from '@/lib/plan'
import { computeReadiness } from '@/lib/laf'
import { computeSessionSummary, deriveStatus } from '@/lib/session'
import { cn, parseMMSS, todayISO } from '@/lib/utils'
import type { EffectivePlanItem, PersonalBest, SessionSet } from '@/types'
import type { SessionPayload } from '@/lib/db'

interface QueueItem {
  item: EffectivePlanItem
  setNumber: number
}

type Phase = 'select' | 'logging' | 'resting' | 'run' | 'summary' | 'saved'

export default function WorkoutLogger() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useSearchParams()
  const { profile } = useApp()
  const { plans, personalBests, saveSession } = useWorkoutData()

  const date = params.get('date') ?? todayISO()
  const dayType = scheduleForDate(new Date(date)).type
  const dayAbbr = params.get('day') ?? scheduleForDate(new Date(date)).day

  const group = profile ? ageGroupForAge(profile.age) : ageGroups[0]
  const effective = useMemo(
    () => resolveEffectivePlan(group, plans, date),
    [group, plans, date],
  )

  // Loggable items = sets-based exercises + the run. (Stretch/mobility excluded.)
  const loggable = useMemo(
    () => effective.filter((i) => i.exercise.isRepBased || i.exercise.isRun),
    [effective],
  )

  // Default selection = exercises this weekday schedules; fall back to all.
  const defaultIds = useMemo(() => {
    const planned = loggable.filter((i) => i.exercise.days?.includes(dayAbbr))
    return (planned.length > 0 ? planned : loggable).map((i) => i.exercise.id)
  }, [loggable, dayAbbr])

  // null = follow the default; otherwise the user's edited selection.
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null)
  const selected = useMemo(
    () => new Set(selectedIds ?? defaultIds),
    [selectedIds, defaultIds],
  )

  const selectedItems = useMemo(
    () => loggable.filter((i) => selected.has(i.exercise.id)),
    [loggable, selected],
  )

  const queue = useMemo<QueueItem[]>(() => {
    const q: QueueItem[] = []
    for (const item of selectedItems) {
      if (!item.exercise.isRepBased) continue
      for (let n = 1; n <= item.setsCount; n++) q.push({ item, setNumber: n })
    }
    return q
  }, [selectedItems])

  const runItem = selectedItems.find((i) => i.exercise.isRun)

  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('select')
  const [results, setResults] = useState<SessionSet[]>([])
  const [runStr, setRunStr] = useState('')
  const [energy, setEnergy] = useState<number | undefined>()
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [newPBs, setNewPBs] = useState<PersonalBest[]>([])

  const current = queue[idx]

  const toggle = (id: string) => {
    setSelectedIds(() => {
      const next = new Set(selected)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return [...next]
    })
  }

  const startSession = () => {
    setIdx(0)
    setResults([])
    if (queue.length > 0) setPhase('logging')
    else if (runItem) setPhase('run')
    else setPhase('summary')
  }

  const recordAndAdvance = (set: SessionSet) => {
    setResults((prev) => [...prev, set])
    if (idx < queue.length - 1) {
      setPhase('resting')
    } else if (runItem) {
      setPhase('run')
    } else {
      setPhase('summary')
    }
  }

  const onDone = (actual: number) => {
    if (!current) return
    recordAndAdvance({
      exerciseId: current.item.exercise.id,
      setNumber: current.setNumber,
      plannedReps: current.item.repsTarget,
      actualReps: actual,
      completed: true,
    })
  }

  const onSkip = () => {
    if (!current) return
    recordAndAdvance({
      exerciseId: current.item.exercise.id,
      setNumber: current.setNumber,
      plannedReps: current.item.repsTarget,
      actualReps: 0,
      completed: false,
    })
  }

  const onRestComplete = () => {
    setIdx((i) => i + 1)
    setPhase('logging')
  }

  const runActualSec = runItem ? parseMMSS(runStr) : null

  const runLog = useMemo(
    () =>
      runItem && runActualSec != null
        ? {
            distanceKm: 3,
            goalTimeSec: runItem.runGoalSec,
            actualTimeSec: runActualSec,
            exerciseId: runItem.exercise.id,
          }
        : null,
    [runItem, runActualSec],
  )

  const summary = useMemo(
    () => computeSessionSummary(results, runLog),
    [results, runLog],
  )

  // LAF readiness before vs estimated after (merge this session's bests).
  const { lafPct, lafDelta } = useMemo(() => {
    const before = computeReadiness(profile, personalBests)
    const merged = new Map(personalBests.map((p) => [`${p.exerciseId}:${p.metric}`, p]))
    for (const s of results) {
      if (!s.completed || s.actualReps <= 0) continue
      const ex = effective.find((i) => i.exercise.id === s.exerciseId)?.exercise
      if (ex && !ex.isRepBased) continue
      const metric = ex?.isHold ? 'longestHoldSec' : 'maxReps'
      const mkey = `${s.exerciseId}:${metric}`
      const existing = merged.get(mkey)
      if (!existing || s.actualReps > existing.value) {
        merged.set(mkey, { id: mkey, exerciseId: s.exerciseId, metric, value: s.actualReps, date })
      }
    }
    if (runLog?.actualTimeSec) {
      const mkey = `${runLog.exerciseId}:fastestRunSec`
      const existing = merged.get(mkey)
      if (!existing || runLog.actualTimeSec < existing.value) {
        merged.set(mkey, {
          id: mkey,
          exerciseId: runLog.exerciseId,
          metric: 'fastestRunSec',
          value: runLog.actualTimeSec,
          date,
        })
      }
    }
    const after = computeReadiness(profile, [...merged.values()])
    return { lafPct: after.overall, lafDelta: after.overall - before.overall }
  }, [profile, personalBests, results, runLog, effective, date])

  const onSave = async () => {
    setSaving(true)
    try {
      const status = deriveStatus(results, runLog != null)
      const payload: SessionPayload = {
        date,
        dayType,
        status,
        energyRating: energy,
        notes: note.trim() || undefined,
        sets: results,
        runLog,
      }
      const res = await saveSession(payload)
      setNewPBs(res.newPBs)
      setPhase('saved')
    } catch (err) {
      console.error('Failed to save session', err)
      setSaving(false)
    }
  }

  if (loggable.length === 0 && phase !== 'saved') {
    return (
      <div className="space-y-4">
        <SectionHeader icon="📝" title={t('logger.title')} />
        <Card>
          <div className="py-6 text-center text-sm text-slate-500">{t('logger.nothingToday')}</div>
          <Button className="mt-2 w-full" onClick={() => router.push('/')}>
            {t('common.back')}
          </Button>
        </Card>
      </div>
    )
  }

  const progress = queue.length
    ? Math.round(((idx + (phase === 'summary' || phase === 'run' ? 1 : 0)) / queue.length) * 100)
    : 100

  return (
    <div className="space-y-4">
      <SectionHeader icon="📝" title={t('logger.title')} subtitle={dayType} />

      {/* ── Step 0: choose what to log ─────────────────────────────────── */}
      {phase === 'select' && (
        <>
          <Card title={t('logger.selectTitle')}>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('logger.selectHint')}</p>
            <div className="space-y-2">
              {loggable.map((item) => {
                const ex = item.exercise
                const on = selected.has(ex.id)
                const scheduled = ex.days?.includes(dayAbbr)
                return (
                  <button
                    key={ex.id}
                    onClick={() => toggle(ex.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors',
                      on
                        ? 'border-navy bg-navy/5 dark:border-flag-yellow dark:bg-slate-700/40'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold text-white',
                        on ? 'border-navy bg-navy dark:border-flag-yellow dark:bg-flag-yellow dark:text-navy' : 'border-slate-300',
                      )}
                    >
                      {on ? '✓' : ''}
                    </span>
                    <span className="text-xl">{ex.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-100">{ex.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {ex.isRun ? ex.target : `${item.setsCount}×${item.repsTarget}`}
                      </div>
                    </div>
                    {scheduled && (
                      <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        {t('logger.scheduledTag')}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>
          <Button className="w-full" onClick={startSession} disabled={selectedItems.length === 0}>
            ▶ {t('schedule.startSession')}
          </Button>
        </>
      )}

      {(phase === 'logging' || phase === 'resting') && (
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full rounded-full bg-navy transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {phase === 'logging' && current && (
        <SetCard
          exercise={current.item.exercise}
          setNumber={current.setNumber}
          totalSets={current.item.setsCount}
          plannedReps={current.item.repsTarget}
          restSec={current.item.restSec}
          onDone={onDone}
          onSkip={onSkip}
        />
      )}

      {phase === 'resting' && (
        <RestTimer seconds={current?.item.restSec ?? 60} onComplete={onRestComplete} />
      )}

      {phase === 'run' && runItem && (
        <Card>
          <div className="mb-2 flex items-center gap-2 text-lg font-bold text-navy dark:text-slate-100">
            🏃 {runItem.exercise.name}
          </div>
          {runItem.runGoalSec && (
            <div className="mb-3 text-xs text-slate-500">
              🎯 {t('logger.goal')}: {runItem.exercise.target}
            </div>
          )}
          <label className="mb-1 block text-sm font-semibold text-slate-600 dark:text-slate-300">
            {t('logger.runTime')}
          </label>
          <input
            value={runStr}
            onChange={(e) => setRunStr(e.target.value)}
            placeholder="15:30"
            inputMode="numeric"
            className="h-11 w-32 rounded-lg border-2 border-slate-200 bg-white px-3 text-center text-lg font-bold text-navy focus:border-navy focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <div className="mt-4 flex gap-3">
            <Button className="flex-1" onClick={() => setPhase('summary')} disabled={!!runStr && parseMMSS(runStr) == null}>
              {t('common.next')} →
            </Button>
            <Button variant="secondary" onClick={() => { setRunStr(''); setPhase('summary') }}>
              {t('logger.skip')}
            </Button>
          </div>
        </Card>
      )}

      {phase === 'summary' && (
        <>
          <Card title={t('logger.summary')}>
            <SessionSummary summary={summary} lafPct={lafPct} lafDelta={lafDelta} />
          </Card>
          <Card>
            <EnergyPicker value={energy} onChange={setEnergy} />
            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                📝 {t('logger.note')}
              </label>
              <textarea
                value={note}
                maxLength={300}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('logger.notePlaceholder')}
                rows={3}
                className="w-full rounded-lg border-2 border-slate-200 bg-white p-3 text-sm text-slate-700 focus:border-navy focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <div className="text-right text-[11px] text-slate-400">{note.length}/300</div>
            </div>
          </Card>
          <Button className="w-full" onClick={onSave} disabled={saving}>
            💾 {t('logger.save')}
          </Button>
        </>
      )}

      {phase === 'saved' && (
        <Card>
          <div className="py-4 text-center">
            <div className="text-4xl">🎉</div>
            <div className="mt-2 text-lg font-bold text-navy dark:text-slate-100">{t('logger.saved')}</div>
            {newPBs.length > 0 && (
              <div className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                ⭐ {t('logger.newPBs', { count: newPBs.length })}
              </div>
            )}
          </div>
          <div className="mt-2 flex gap-3">
            <Button className="flex-1" onClick={() => router.push('/history')}>
              📈 {t('history.title')}
            </Button>
            <Button variant="secondary" onClick={() => router.push('/')}>
              🏠
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
