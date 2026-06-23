import type {
  PersonalBest,
  RunLog,
  SessionSet,
  SessionStatus,
  UserProfile,
  WorkoutLog,
  WorkoutPlan,
  WorkoutSession,
} from '@/types'

/**
 * Client-side data access. These call the per-user API routes
 * (src/app/api/*), which are protected by the NextAuth session.
 */

export async function getProfile(): Promise<UserProfile | null> {
  const res = await fetch('/api/profile', { cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as { profile: UserProfile | null }
  return data.profile
}

export async function putProfile(profile: UserProfile): Promise<void> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!res.ok) throw new Error('Failed to save profile')
}

export async function getLogs(): Promise<Record<string, WorkoutLog>> {
  const res = await fetch('/api/logs', { cache: 'no-store' })
  if (!res.ok) return {}
  const data = (await res.json()) as { logs: Record<string, WorkoutLog> }
  return data.logs
}

export async function postLog(log: WorkoutLog): Promise<void> {
  const res = await fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log),
  })
  if (!res.ok) throw new Error('Failed to save log')
}

// ─── v1.1: plans, sessions, personal bests ─────────────────────────────────

export async function getPlans(): Promise<WorkoutPlan[]> {
  const res = await fetch('/api/plans', { cache: 'no-store' })
  if (!res.ok) return []
  const data = (await res.json()) as { plans: WorkoutPlan[] }
  return data.plans
}

export async function putPlan(plan: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
  const res = await fetch('/api/plans', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  })
  if (!res.ok) throw new Error('Failed to save plan')
  const data = (await res.json()) as { plan: WorkoutPlan }
  return data.plan
}

export async function deletePlan(
  exerciseId: string,
  opts: { scope?: string; onceDate?: string } = {},
): Promise<void> {
  const params = new URLSearchParams({ exerciseId })
  if (opts.scope) params.set('scope', opts.scope)
  if (opts.onceDate) params.set('onceDate', opts.onceDate)
  const res = await fetch(`/api/plans?${params.toString()}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to reset plan')
}

export interface SessionPayload {
  date: string
  dayType: string
  status: SessionStatus
  energyRating?: number
  notes?: string
  totalDurationMin?: number
  sets: SessionSet[]
  runLog?: (RunLog & { exerciseId?: string }) | null
}

export async function getSessions(
  query: { from?: string; to?: string; status?: string } = {},
): Promise<WorkoutSession[]> {
  const params = new URLSearchParams()
  if (query.from) params.set('from', query.from)
  if (query.to) params.set('to', query.to)
  if (query.status) params.set('status', query.status)
  const qs = params.toString()
  const res = await fetch(`/api/sessions${qs ? `?${qs}` : ''}`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = (await res.json()) as { sessions: WorkoutSession[] }
  return data.sessions
}

export async function postSession(
  payload: SessionPayload,
): Promise<{ session: WorkoutSession; newPBs: PersonalBest[] }> {
  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to save session')
  return (await res.json()) as { session: WorkoutSession; newPBs: PersonalBest[] }
}

export async function getSession(id: string): Promise<WorkoutSession | null> {
  const res = await fetch(`/api/sessions/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as { session: WorkoutSession }
  return data.session
}

export async function deleteSession(id: string): Promise<void> {
  const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete session')
}

export async function getPersonalBests(): Promise<PersonalBest[]> {
  const res = await fetch('/api/personal-bests', { cache: 'no-store' })
  if (!res.ok) return []
  const data = (await res.json()) as { personalBests: PersonalBest[] }
  return data.personalBests
}
