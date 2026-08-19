import type { Exercise, Lang } from "@/types";
import { pickLangOpt } from "@/lib/utils";
import { ageGroups } from "@/data/ageGroups";

/**
 * Flat lookup of every exercise across all age groups, keyed by slug. The same
 * slug can appear in multiple groups (e.g. "sit-ups"); the first match wins,
 * which is fine — shared slugs describe the same movement.
 */
const bySlug = new Map<string, Exercise>();
for (const group of ageGroups) {
  for (const ex of group.exercises) {
    if (!bySlug.has(ex.id)) bySlug.set(ex.id, ex);
  }
}

/** Find an exercise definition by its slug, across all groups. */
export function findExercise(slug: string): Exercise | undefined {
  return bySlug.get(slug);
}

/**
 * Human-readable name for a slug, falling back to the slug itself. Pass `lang`
 * to get the Lithuanian name where the library defines one.
 */
export function exerciseName(slug: string, lang: Lang = "EN"): string {
  const ex = bySlug.get(slug);
  if (!ex) return slug;
  return pickLangOpt(lang, ex.name, ex.nameLT);
}

/** Emoji icon for a slug, falling back to a dumbbell. */
export function exerciseIcon(slug: string): string {
  return bySlug.get(slug)?.icon ?? "🏋️";
}
