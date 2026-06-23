import type { AgeGroup, EffectivePlanItem, Exercise, WorkoutPlan } from '@/types'
import { findExercise } from '@/lib/exercises'

/** The age-group default exercise definition for a slug, if any. */
export function defaultForExercise(group: AgeGroup, exerciseId: string): Exercise | undefined {
  return group.exercises.find((e) => e.id === exerciseId)
}

/** Build an EffectivePlanItem from an exercise definition (no overrides). */
function baseItem(ex: Exercise): EffectivePlanItem {
  return {
    exercise: ex,
    setsCount: ex.setsCount,
    repsTarget: ex.repsTarget,
    goalTarget: ex.target,
    restSec: ex.restSec,
    runGoalSec: ex.runGoalSec,
    isCustom: false,
  }
}

/** Apply one override row onto an item (mutates a copy). */
function applyOverride(item: EffectivePlanItem, plan: WorkoutPlan): EffectivePlanItem {
  return {
    ...item,
    setsCount: plan.setsCount,
    repsTarget: plan.repsTarget,
    goalTarget: plan.goalTarget ?? item.goalTarget,
    restSec: plan.restSec,
    runGoalSec: plan.runGoalSec ?? item.runGoalSec,
    isCustom: plan.isCustom,
  }
}

/**
 * Resolve the effective plan for a date: age-group defaults overlaid with the
 * user's 'all'-scope overrides, then 'once'-scope overrides matching `dateISO`.
 * Removed exercises are dropped; custom-added exercises are appended.
 */
export function resolveEffectivePlan(
  group: AgeGroup,
  plans: WorkoutPlan[],
  dateISO: string,
): EffectivePlanItem[] {
  const items = new Map<string, EffectivePlanItem>()
  for (const ex of group.exercises) items.set(ex.id, baseItem(ex))

  // 'all' first, then 'once' matching this date so once wins.
  const ordered = [
    ...plans.filter((p) => p.scope === 'all'),
    ...plans.filter((p) => p.scope === 'once' && p.onceDate === dateISO),
  ]

  const removed = new Set<string>()
  for (const plan of ordered) {
    if (plan.removed) {
      removed.add(plan.exerciseId)
      continue
    }
    removed.delete(plan.exerciseId)

    const existing = items.get(plan.exerciseId)
    if (existing) {
      items.set(plan.exerciseId, applyOverride(existing, plan))
    } else {
      // Custom-added exercise: pull a definition from the library or synthesize.
      const def = findExercise(plan.exerciseId)
      const ex: Exercise =
        def ?? {
          id: plan.exerciseId,
          name: plan.exerciseId,
          sets: `${plan.setsCount}×${plan.repsTarget}`,
          target: plan.goalTarget ?? '',
          icon: '🏋️',
          setsCount: plan.setsCount,
          repsTarget: plan.repsTarget,
          restSec: plan.restSec,
          runGoalSec: plan.runGoalSec,
          isRepBased: true,
        }
      items.set(plan.exerciseId, applyOverride(baseItem(ex), plan))
    }
  }

  for (const id of removed) items.delete(id)

  // Preserve group order, then any custom-added exercises after.
  const result: EffectivePlanItem[] = []
  for (const ex of group.exercises) {
    const item = items.get(ex.id)
    if (item) {
      result.push(item)
      items.delete(ex.id)
    }
  }
  for (const item of items.values()) result.push(item)
  return result
}
