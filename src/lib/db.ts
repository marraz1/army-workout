import type { UserProfile, WorkoutLog } from '@/types'

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
