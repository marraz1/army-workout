import type { Exercise } from '@/types'
import { ageGroups } from '@/data/ageGroups'

/**
 * Flat lookup of every exercise across all age groups, keyed by slug. The same
 * slug can appear in multiple groups (e.g. "sit-ups"); the first match wins,
 * which is fine — shared slugs describe the same movement.
 */
const bySlug = new Map<string, Exercise>()
for (const group of ageGroups) {
  for (const ex of group.exercises) {
    if (!bySlug.has(ex.id)) bySlug.set(ex.id, ex)
  }
}

/** Find an exercise definition by its slug, across all groups. */
export function findExercise(slug: string): Exercise | undefined {
  return bySlug.get(slug)
}

/** Human-readable name for a slug, falling back to the slug itself. */
export function exerciseName(slug: string): string {
  return bySlug.get(slug)?.name ?? slug
}

/** Emoji icon for a slug, falling back to a dumbbell. */
export function exerciseIcon(slug: string): string {
  return bySlug.get(slug)?.icon ?? '🏋️'
}
