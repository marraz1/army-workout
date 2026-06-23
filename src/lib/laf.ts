import type { PersonalBest, UserProfile } from '@/types'
import { lafStandards } from '@/data/lafStandards'
import { formatMMSS, parseMMSS } from '@/lib/utils'

export type ReadinessBand = 'fail' | 'pass' | 'good' | 'excellent'

export interface ReadinessItem {
  exerciseId: string
  label: string
  /** Target display string, e.g. "41" or "15:30". */
  target: string
  /** Current best display string, or "—" when no data yet. */
  current: string
  /** 0–100+ percentage toward the standard. */
  pct: number
  band: ReadinessBand
  hasData: boolean
}

export interface Readiness {
  items: ReadinessItem[]
  /** Average pct across items that have data, 0 when none. */
  overall: number
  band: ReadinessBand
}

export function bandFor(pct: number): ReadinessBand {
  if (pct >= 100) return 'excellent'
  if (pct >= 80) return 'good'
  if (pct >= 60) return 'pass'
  return 'fail'
}

/** Parse a "41+" / "52+ (2min)" style target into its leading number. */
function parseRepTarget(s: string): number {
  const m = s.match(/\d+/)
  return m ? parseInt(m[0], 10) : 0
}

/** Find the lafStandards row matching the profile's gender + age band. */
function standardFor(profile: UserProfile) {
  const genderWord = profile.gender === 'F' ? 'Women' : 'Men'
  const band = profile.age <= 30 ? '21–30' : profile.age <= 40 ? '31–40' : '41–50'
  const key = `${genderWord} ${band}`
  return lafStandards.find((r) => r.group === key) ?? lafStandards[0]
}

/**
 * Compute LAF readiness from personal bests vs the user's standard. Reps: best
 * / target. Run: target / actual (faster = higher). Capped display, uncapped
 * band so 100%+ reads as Excellent.
 */
export function computeReadiness(
  profile: UserProfile | null,
  personalBests: PersonalBest[],
): Readiness {
  const empty: Readiness = { items: [], overall: 0, band: 'fail' }
  if (!profile) return empty

  const std = standardFor(profile)
  const pbFor = (exerciseId: string, metric: PersonalBest['metric']) =>
    personalBests.find((p) => p.exerciseId === exerciseId && p.metric === metric)

  const items: ReadinessItem[] = []

  // Push-ups (reps, higher better).
  {
    const target = parseRepTarget(std.pushups)
    const pb = pbFor('push-ups', 'maxReps')
    const current = pb?.value ?? 0
    const pct = target > 0 && current > 0 ? Math.round((current / target) * 100) : 0
    items.push({
      exerciseId: 'push-ups',
      label: 'Push-ups',
      target: String(target),
      current: pb ? String(current) : '—',
      pct,
      band: bandFor(pct),
      hasData: !!pb,
    })
  }

  // Sit-ups (reps, higher better).
  {
    const target = parseRepTarget(std.situps)
    const pb = pbFor('sit-ups', 'maxReps')
    const current = pb?.value ?? 0
    const pct = target > 0 && current > 0 ? Math.round((current / target) * 100) : 0
    items.push({
      exerciseId: 'sit-ups',
      label: 'Sit-ups',
      target: String(target),
      current: pb ? String(current) : '—',
      pct,
      band: bandFor(pct),
      hasData: !!pb,
    })
  }

  // 3 km run (time, faster better).
  {
    const targetSec = parseMMSS(std.run.replace(/[^0-9:]/g, '')) ?? 0
    const pb = pbFor('run-3km', 'fastestRunSec')
    const actual = pb?.value ?? 0
    const pct = targetSec > 0 && actual > 0 ? Math.round((targetSec / actual) * 100) : 0
    items.push({
      exerciseId: 'run-3km',
      label: '3 km Run',
      target: formatMMSS(targetSec),
      current: pb ? formatMMSS(actual) : '—',
      pct,
      band: bandFor(pct),
      hasData: !!pb,
    })
  }

  const withData = items.filter((i) => i.hasData)
  const overall = withData.length
    ? Math.round(withData.reduce((sum, i) => sum + i.pct, 0) / withData.length)
    : 0

  return { items, overall, band: bandFor(overall) }
}
