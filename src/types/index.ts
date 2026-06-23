export type Lang = 'EN' | 'LT'
export type Gender = 'M' | 'F'
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type Theme = 'light' | 'dark'

export interface Exercise {
  /** Stable slug used as a DB key across plans/sessions/PBs (e.g. "push-ups"). Never rename. */
  id: string
  name: string
  /** Display string, e.g. "4×30". Kept for reference; structured fields drive logic. */
  sets: string
  /** Display string, e.g. "≥41 (LAF min)". */
  target: string
  icon: string
  /** Number of sets to perform. */
  setsCount: number
  /** Reps per set. For hold exercises (plank/wall sit) this is SECONDS, not reps. */
  repsTarget: number
  /** Rest between sets, seconds (derived from the group's `rest` string). */
  restSec: number
  /** Optional numeric goal (e.g. push-up LAF minimum) for readiness math. */
  goalValue?: number
  /** Optional run goal in seconds (e.g. ≤15:30 → 930). */
  runGoalSec?: number
  /** False for frequency/daily/stretch items that aren't logged set-by-set. */
  isRepBased: boolean
  /** True when this exercise is a timed hold (repsTarget is seconds). */
  isHold?: boolean
  /** True for run exercises (logged as MM:SS, not reps). */
  isRun?: boolean
  /** Weekday abbreviations this exercise is scheduled on, e.g. ['Mon','Fri']. */
  days?: string[]
}

export interface AgeGroup {
  range: string
  /** Inclusive bounds used to map a numeric age to this group. */
  min: number
  max: number
  label: string
  labelLT: string
  color: string
  bg: string
  border: string
  goal: string
  goalLT: string
  exercises: Exercise[]
  rest: string
  frequency: string
}

export interface ScheduleDay {
  day: string
  type: string
  icon: string
  focus: string
  color: string
}

export interface RoutineItem {
  time: string
  icon: string
  label: string
  detail: string
  color: string
}

export interface LafStandard {
  group: string
  pushups: string
  situps: string
  run: string
  note: string
}

/** User onboarding profile, persisted to localStorage (and Supabase later). */
export interface UserProfile {
  name: string
  age: number
  gender: Gender
  fitnessLevel: FitnessLevel
  language: Lang
  wakeTime: string
  createdAt: string
}

export type DayStatus = 'completed' | 'skipped' | 'cheat'
export type SkipReason = 'Sick' | 'Tired' | 'Travel' | 'Other'

/** A single day's workout log entry, keyed by ISO date (YYYY-MM-DD). */
export interface WorkoutLog {
  date: string
  status: DayStatus
  reason?: SkipReason
  loggedAt: string
}

// ─── v1.1: Plan customisation, logger & history ────────────────────────────

/** Rich session status (superset of DayStatus, adds 'partial'). */
export type SessionStatus = 'completed' | 'partial' | 'skipped' | 'cheat'

/** How far a plan override reaches. */
export type PlanScope = 'all' | 'once'

/** A user's override of an exercise's plan (sets/reps/goal/rest). */
export interface WorkoutPlan {
  id: string
  exerciseId: string
  setsCount: number
  repsTarget: number
  goalTarget?: string
  restSec: number
  runGoalSec?: number
  /** True when the exercise was removed from the plan. */
  removed: boolean
  isCustom: boolean
  scope: PlanScope
  /** ISO date the override applies to, when scope === 'once'. */
  onceDate?: string
}

/** One logged set within a session. */
export interface SessionSet {
  id?: string
  exerciseId: string
  setNumber: number
  plannedReps: number
  actualReps: number
  completed: boolean
}

/** A logged run within a session. */
export interface RunLog {
  id?: string
  distanceKm?: number
  goalTimeSec?: number
  actualTimeSec?: number
}

/** A saved training session with all set/run data. */
export interface WorkoutSession {
  id: string
  date: string
  dayType: string
  status: SessionStatus
  energyRating?: number
  notes?: string
  totalDurationMin?: number
  createdAt: string
  sets: SessionSet[]
  runLog?: RunLog | null
}

export type PersonalBestMetric = 'maxReps' | 'fastestRunSec' | 'longestHoldSec'

/** All-time best for an exercise/metric pair. */
export interface PersonalBest {
  id: string
  exerciseId: string
  metric: PersonalBestMetric
  value: number
  sessionId?: string
  date: string
}

/** A resolved plan row = age-group default overlaid with user overrides. */
export interface EffectivePlanItem {
  exercise: Exercise
  setsCount: number
  repsTarget: number
  goalTarget: string
  restSec: number
  runGoalSec?: number
  isCustom: boolean
}
