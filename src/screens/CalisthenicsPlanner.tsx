'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { DayPicker } from '@/components/calisthenics/DayPicker'
import { TimePicker } from '@/components/calisthenics/TimePicker'
import { HoldToggle } from '@/components/calisthenics/HoldToggle'
import { RestPicker } from '@/components/calisthenics/RestPicker'
import { LevelBadge } from '@/components/calisthenics/LevelBadge'
import { findCalisthenicsExercise } from '@/data/calisthenicsExercises'
import { useCalisthenics } from '@/context/CalisthenicsContext'
import type { CalisthenicsSource } from '@/types/calisthenics'

export default function CalisthenicsPlanner() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useSearchParams()
  const { customExercises, plans, savePlan, updatePlan, loading } = useCalisthenics()

  // Edit mode: ?planId=xxx loads an existing scheduled plan entry.
  const planId = params.get('planId') ?? undefined
  const editingPlan = planId ? plans.find((p) => p.id === planId) : undefined

  const STEP_TITLES = [
    t('calisthenics.reviewExercise'),
    t('calisthenics.dayOfWeek'),
    t('calisthenics.timeOfDay'),
    t('calisthenics.sets'),
    t('calisthenics.repsOrSecs'),
    t('calisthenics.restSeconds'),
    `${t('common.done')} & ${t('common.save')}`,
  ]

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const exerciseIdRaw = editingPlan
    ? (editingPlan.source === 'library' ? String(editingPlan.libraryExerciseId) : (editingPlan.customExerciseId ?? '0'))
    : (params.get('exerciseId') ?? '0')
  const exerciseId = Number(exerciseIdRaw)
  const source = editingPlan
    ? editingPlan.source
    : ((params.get('source') ?? 'library') as CalisthenicsSource)

  const libEx = source === 'library' ? findCalisthenicsExercise(exerciseId) : undefined
  const custEx = source === 'custom' ? customExercises.find((e) => e.id === exerciseIdRaw) : undefined
  const ex = libEx ?? custEx

  const [step, setStep] = useState(1)
  const [days, setDays] = useState<number[]>([])
  const [time, setTime] = useState('07:00')
  const [sets, setSets] = useState(libEx?.defaultSets ?? custEx?.defaultSets ?? 3)
  const [repsOrSecs, setRepsOrSecs] = useState(libEx?.defaultReps ?? custEx?.defaultRepsOrSecs ?? 10)
  const [isTimed, setIsTimed] = useState(libEx?.isTimed ?? custEx?.isTimed ?? false)
  const [rest, setRest] = useState(libEx?.defaultRestSec ?? custEx?.restSec ?? 60)
  const [goal, setGoal] = useState('')
  const [saving, setSaving] = useState(false)
  // Track whether we've synced form state from an existing plan (edit mode cold-load fix)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (editingPlan && !synced) {
      setDays([editingPlan.dayOfWeek])
      setTime(editingPlan.timeOfDay)
      setSets(editingPlan.sets)
      setRepsOrSecs(editingPlan.repsOrSecs)
      setRest(editingPlan.restSec)
      setGoal(editingPlan.goalTarget ?? '')
      setSynced(true)
    } else if (!planId && !synced) {
      // New plan: set defaults from exercise once available
      if (libEx || custEx) {
        setSets(libEx?.defaultSets ?? custEx?.defaultSets ?? 3)
        setRepsOrSecs(libEx?.defaultReps ?? custEx?.defaultRepsOrSecs ?? 10)
        setIsTimed(libEx?.isTimed ?? custEx?.isTimed ?? false)
        setRest(libEx?.defaultRestSec ?? custEx?.restSec ?? 60)
        setSynced(true)
      }
    }
  }, [editingPlan, libEx, custEx, planId, synced])

  const canNext = () => {
    if (step === 2) return days.length > 0
    return true
  }

  async function handleSave() {
    if (days.length === 0) return
    setSaving(true)
    try {
      if (editingPlan) {
        // Edit mode: update the single existing plan entry.
        await updatePlan(editingPlan.id, {
          dayOfWeek: days[0],
          timeOfDay: time,
          sets,
          repsOrSecs,
          restSec: rest,
          goalTarget: goal || undefined,
        })
      } else {
        // Create one plan entry per selected day
        await Promise.all(days.map((d) =>
          savePlan({
            source,
            libraryExerciseId: source === 'library' ? exerciseId : undefined,
            customExerciseId: source === 'custom' ? exerciseIdRaw : undefined,
            dayOfWeek: d,
            timeOfDay: time,
            sets,
            repsOrSecs,
            restSec: rest,
            goalTarget: goal || undefined,
            isActive: true,
          })
        ))
      }
      router.push(editingPlan ? '/schedule' : '/calisthenics')
    } finally {
      setSaving(false)
    }
  }

  // In edit mode, wait for plans to load before deciding the exercise is missing.
  if (!ex && planId && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  if (!ex) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        {t('calisthenics.exerciseNotFound')}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      {/* Progress bar */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700">
        <div
          className="h-1 bg-purple-600 transition-all"
          style={{ width: `${(step / 7) * 100}%` }}
        />
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Step title */}
        <div>
          <div className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
            {t('calisthenics.stepOf', { step })}
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
            {STEP_TITLES[step - 1]}
          </h2>
        </div>

        {/* Step 1: Exercise preview */}
        {step === 1 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤸</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{ex.name}</span>
                  <LevelBadge level={ex.level} />
                </div>
                {ex.description && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{ex.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Day picker */}
        {step === 2 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('calisthenics.selectDays')}</p>
            <DayPicker selected={days} onChange={setDays} />
            {days.length === 0 && (
              <p className="text-xs text-red-500">{t('calisthenics.selectDaysError')}</p>
            )}
          </div>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('calisthenics.selectTime')}</p>
            <TimePicker value={time} onChange={setTime} />
          </div>
        )}

        {/* Step 4: Sets */}
        {step === 4 && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSets((s) => Math.max(1, s - 1))}
              className="h-10 w-10 rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700"
            >−</button>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 min-w-[3ch] text-center">
              {sets}
            </div>
            <button
              onClick={() => setSets((s) => Math.min(10, s + 1))}
              className="h-10 w-10 rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700"
            >+</button>
            <span className="text-slate-500">{t('calisthenics.setsLabel')}</span>
          </div>
        )}

        {/* Step 5: Reps / Hold */}
        {step === 5 && (
          <div className="space-y-4">
            <HoldToggle isTimed={isTimed} onChange={setIsTimed} />
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRepsOrSecs((r) => Math.max(1, r - 1))}
                className="h-10 w-10 rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700"
              >−</button>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 min-w-[3ch] text-center">
                {repsOrSecs}
              </div>
              <button
                onClick={() => setRepsOrSecs((r) => r + 1)}
                className="h-10 w-10 rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700"
              >+</button>
              <span className="text-slate-500">{isTimed ? t('calisthenics.secondsLabel') : t('calisthenics.repsLabel')}</span>
            </div>
          </div>
        )}

        {/* Step 6: Rest */}
        {step === 6 && (
          <RestPicker value={rest} onChange={setRest} />
        )}

        {/* Step 7: Review */}
        {step === 7 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 space-y-3">
              <Row label={t('calisthenics.reviewExercise')} value={ex.name} />
              <Row label={t('calisthenics.reviewDays')} value={days.map((d) => DAY_LABELS[d]).join(', ')} />
              <Row label={t('calisthenics.reviewTime')} value={time} />
              <Row label={t('calisthenics.reviewSets')} value={`${sets} ${t('calisthenics.setsLabel')}`} />
              <Row label={isTimed ? t('calisthenics.holdToggle') : t('calisthenics.repsLabel')} value={`${repsOrSecs}${isTimed ? 's' : ''}`} />
              <Row label={t('calisthenics.reviewRest')} value={`${rest}s`} />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                {t('calisthenics.goalTarget')}
              </label>
              <input
                type="text"
                placeholder={t('calisthenics.goalPlaceholder')}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300"
            >
              {t('common.back')}
            </button>
          )}
          {step < 7 ? (
            <button
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {t('common.next')}
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving || days.length === 0}
              className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? t('calisthenics.saving') : `💾 ${t('calisthenics.saveToSchedule')}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-800 dark:text-slate-100">{value}</span>
    </div>
  )
}
