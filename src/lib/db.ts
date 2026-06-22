import { supabase } from '@/lib/supabase'
import type { Gender, FitnessLevel, Lang, UserProfile, WorkoutLog, DayStatus, SkipReason } from '@/types'

/**
 * Supabase data access for per-user profile and workout logs.
 * All calls assume an authenticated session; RLS enforces ownership.
 */

interface ProfileRow {
  id: string
  name: string
  age: number
  gender: string
  fitness_level: string
  language: string
  wake_time: string
  created_at: string
}

interface LogRow {
  user_id: string
  log_date: string
  status: string
  reason: string | null
  logged_at: string
}

function rowToProfile(row: ProfileRow): UserProfile {
  return {
    name: row.name,
    age: row.age,
    gender: row.gender as Gender,
    fitnessLevel: row.fitness_level as FitnessLevel,
    language: row.language as Lang,
    wakeTime: row.wake_time,
    createdAt: row.created_at,
  }
}

function rowToLog(row: LogRow): WorkoutLog {
  return {
    date: row.log_date,
    status: row.status as DayStatus,
    reason: (row.reason as SkipReason) ?? undefined,
    loggedAt: row.logged_at,
  }
}

/** Fetch the signed-in user's profile, or null if they haven't onboarded. */
export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data ? rowToProfile(data as ProfileRow) : null
}

/** Create or update the signed-in user's profile. */
export async function upsertProfile(userId: string, profile: UserProfile): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    fitness_level: profile.fitnessLevel,
    language: profile.language,
    wake_time: profile.wakeTime,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

/** Fetch all workout logs for the user, keyed by ISO date. */
export async function fetchLogs(userId: string): Promise<Record<string, WorkoutLog>> {
  if (!supabase) return {}
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  const map: Record<string, WorkoutLog> = {}
  for (const row of (data ?? []) as LogRow[]) {
    map[row.log_date] = rowToLog(row)
  }
  return map
}

/** Insert or update one day's log (unique per user per date). */
export async function upsertLog(userId: string, log: WorkoutLog): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('workout_logs').upsert(
    {
      user_id: userId,
      log_date: log.date,
      status: log.status,
      reason: log.reason ?? null,
      logged_at: log.loggedAt,
    },
    { onConflict: 'user_id,log_date' },
  )
  if (error) throw error
}
