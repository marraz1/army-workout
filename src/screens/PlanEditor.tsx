'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { PlanFieldRow } from '@/components/plan/PlanFieldRow'
import { ScopeModal } from '@/components/plan/ScopeModal'
import { AddExerciseModal } from '@/components/plan/AddExerciseModal'
import { CustomBadge } from '@/components/plan/CustomBadge'
import { MuscleSelector, deserializeMuscles, serializeMuscles, type MuscleState } from '@/components/muscle/MuscleSelector'
import { useApp } from '@/context/AppContext'
import { useWorkoutData } from '@/context/WorkoutDataContext'
import { ageGroups, ageGroupForAge } from '@/data/ageGroups'
import { resolveEffectivePlan } from '@/lib/plan'
import { formatMMSS, parseMMSS, todayISO } from '@/lib/utils'
import type { EffectivePlanItem, Exercise, PlanScope } from '@/types'

interface DraftFields {
  sets: string
  reps: string
  goal: string
  rest: string
  run: string
}

function draftFromItem(item: EffectivePlanItem): DraftFields {
  return {
    sets: String(item.setsCount),
    reps: String(item.repsTarget),
    goal: item.goalTarget,
    rest: String(item.restSec),
    run: item.runGoalSec ? formatMMSS(item.runGoalSec) : '',
  }
}

export default function PlanEditor() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useSearchParams()
  const { profile } = useApp()
  const { plans, savePlan, resetPlan } = useWorkoutData()

  const focusExercise = params.get('exercise')
  const groupParam = params.get('group')

  const group = useMemo(() => {
    if (groupParam != null) {
      const idx = parseInt(groupParam, 10)
      if (!Number.isNaN(idx) && ageGroups[idx]) return ageGroups[idx]
    }
    return profile ? ageGroupForAge(profile.age) : ageGroups[0]
  }, [groupParam, profile])

  const today = todayISO()
  const effective = useMemo(
    () => resolveEffectivePlan(group, plans, today),
    [group, plans, today],
  )

  const visible = focusExercise
    ? effective.filter((i) => i.exercise.id === focusExercise)
    : effective

  const [drafts, setDrafts] = useState<Record<string, DraftFields>>({})
  const [muscleStates, setMuscleStates] = useState<Record<string, MuscleState>>({})
  const [scopeFor, setScopeFor] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getMuscleState = (id: string): MuscleState => {
    if (muscleStates[id]) return muscleStates[id]
    const existing = plans.find((p) => p.exerciseId === id)?.muscleData
    return deserializeMuscles(existing)
  }

  const setMuscleState = (id: string, state: MuscleState) => {
    setMuscleStates((prev) => ({ ...prev, [id]: state }))
  }

  const getDraft = (item: EffectivePlanItem): DraftFields =>
    drafts[item.exercise.id] ?? draftFromItem(item)

  const setField = (id: string, field: keyof DraftFields, value: string, item: EffectivePlanItem) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? draftFromItem(item)), [field]: value },
    }))
  }

  const validate = (d: DraftFields, ex: Exercise): string | null => {
    if (ex.isRun) {
      const sec = parseMMSS(d.run)
      if (sec == null) return t('plan.errRun')
      if (sec < 480) return t('plan.errRunMin')
      return null
    }
    const sets = parseInt(d.sets, 10)
    const reps = parseInt(d.reps, 10)
    if (Number.isNaN(sets) || sets < 1 || sets > 8) return t('plan.errSets')
    if (Number.isNaN(reps) || reps < 1 || reps > 200) return t('plan.errReps')
    const rest = parseInt(d.rest, 10)
    if (Number.isNaN(rest) || rest < 15 || rest > 300) return t('plan.errRest')
    return null
  }

  const onSaveClick = (item: EffectivePlanItem) => {
    const d = getDraft(item)
    const err = validate(d, item.exercise)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setScopeFor(item.exercise.id)
  }

  const commit = async (scope: PlanScope) => {
    const id = scopeFor
    setScopeFor(null)
    if (!id) return
    const item = effective.find((i) => i.exercise.id === id)
    if (!item) return
    const d = getDraft(item)

    const ms = getMuscleState(id)
    const muscleData =
      ms.primary.length || ms.secondary.length ? serializeMuscles(ms) : undefined

    await savePlan({
      exerciseId: id,
      setsCount: item.exercise.isRun ? 1 : parseInt(d.sets, 10),
      repsTarget: item.exercise.isRun ? 0 : parseInt(d.reps, 10),
      goalTarget: d.goal || undefined,
      restSec: parseInt(d.rest, 10) || item.exercise.restSec,
      runGoalSec: item.exercise.isRun ? parseMMSS(d.run) ?? undefined : undefined,
      removed: false,
      isCustom: true,
      scope,
      onceDate: scope === 'once' ? today : undefined,
      muscleData,
    })
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const onReset = async (id: string) => {
    if (!confirm(t('plan.resetConfirm'))) return
    await resetPlan(id)
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const onRemove = async (item: EffectivePlanItem) => {
    if (!confirm(t('plan.removeConfirm', { name: item.exercise.name }))) return
    await savePlan({
      exerciseId: item.exercise.id,
      setsCount: item.setsCount,
      repsTarget: item.repsTarget,
      goalTarget: item.goalTarget,
      restSec: item.restSec,
      runGoalSec: item.runGoalSec,
      removed: true,
      isCustom: true,
      scope: 'all',
    })
  }

  // Exercises from any group not already in this plan, for the Add modal.
  const addOptions = useMemo<Exercise[]>(() => {
    const present = new Set(effective.map((i) => i.exercise.id))
    const seen = new Set<string>()
    const out: Exercise[] = []
    for (const g of ageGroups) {
      for (const ex of g.exercises) {
        if (present.has(ex.id) || seen.has(ex.id)) continue
        seen.add(ex.id)
        out.push(ex)
      }
    }
    return out
  }, [effective])

  const onAdd = async (ex: Exercise) => {
    setAddOpen(false)
    await savePlan({
      exerciseId: ex.id,
      setsCount: ex.setsCount,
      repsTarget: ex.repsTarget,
      goalTarget: ex.target,
      restSec: ex.restSec,
      runGoalSec: ex.runGoalSec,
      removed: false,
      isCustom: true,
      scope: 'all',
    })
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.back()}
        className="text-sm font-semibold text-slate-500 hover:text-navy dark:text-slate-400"
      >
        ← {t('common.back')}
      </button>
      <SectionHeader icon="✏️" title={t('plan.editTitle')} subtitle={group.range} />

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {visible.map((item) => {
        const ex = item.exercise
        const d = getDraft(item)
        const def = group.exercises.find((e) => e.id === ex.id)
        return (
          <Card key={ex.id} accent={group.color}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{ex.icon}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{ex.name}</span>
              </div>
              {item.isCustom && <CustomBadge />}
            </div>

            {ex.isRun ? (
              <PlanFieldRow
                icon="🏃"
                label={t('plan.runGoal')}
                type="text"
                value={d.run}
                placeholder="15:30"
                onChange={(v) => setField(ex.id, 'run', v, item)}
              />
            ) : (
              <>
                <PlanFieldRow
                  icon="🔢"
                  label={t('plan.sets')}
                  value={d.sets}
                  min={1}
                  max={8}
                  onChange={(v) => setField(ex.id, 'sets', v, item)}
                />
                <PlanFieldRow
                  icon="🔁"
                  label={ex.isHold ? t('plan.holdSeconds') : t('plan.reps')}
                  hint={ex.isHold ? t('plan.holdHint') : undefined}
                  value={d.reps}
                  min={1}
                  max={200}
                  onChange={(v) => setField(ex.id, 'reps', v, item)}
                />
                <PlanFieldRow
                  icon="⏱"
                  label={t('plan.rest')}
                  value={d.rest}
                  min={15}
                  max={300}
                  onChange={(v) => setField(ex.id, 'rest', v, item)}
                />
              </>
            )}
            <PlanFieldRow
              icon="🎯"
              label={t('plan.goal')}
              type="text"
              value={d.goal}
              onChange={(v) => setField(ex.id, 'goal', v, item)}
            />

            {def && (
              <div className="mt-2 text-[11px] text-slate-400">
                {t('plan.defaultWas', { sets: def.sets, goal: def.target })}
              </div>
            )}

            {item.isCustom && (
              <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
                <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  💪 Muscle Groups
                </div>
                <MuscleSelector
                  value={getMuscleState(ex.id)}
                  onChange={(state) => setMuscleState(ex.id, state)}
                />
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <Button className="flex-1" onClick={() => onSaveClick(item)}>
                💾 {t('common.save')}
              </Button>
              {item.isCustom && (
                <Button variant="secondary" onClick={() => onReset(ex.id)}>
                  ↩️ {t('plan.reset')}
                </Button>
              )}
              <Button variant="danger" onClick={() => onRemove(item)}>
                🗑️
              </Button>
            </div>
          </Card>
        )
      })}

      {!focusExercise && (
        <Button variant="secondary" className="w-full" onClick={() => setAddOpen(true)}>
          ➕ {t('plan.addExercise')}
        </Button>
      )}

      <ScopeModal open={scopeFor != null} onSelect={commit} onCancel={() => setScopeFor(null)} />
      <AddExerciseModal
        open={addOpen}
        options={addOptions}
        onSelect={onAdd}
        onCancel={() => setAddOpen(false)}
      />
    </div>
  )
}
