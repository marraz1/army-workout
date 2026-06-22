export type Lang = 'EN' | 'LT'
export type Gender = 'M' | 'F'
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type Theme = 'light' | 'dark'

export interface Exercise {
  name: string
  sets: string
  target: string
  icon: string
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
