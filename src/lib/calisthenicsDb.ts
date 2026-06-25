import type {
  CalisthenicsPlan,
  CalisthenicsLog,
  CalisthenicsPersonalBest,
  CalisthenicsSessionPayload,
  CustomExercise,
} from '@/types/calisthenics'

// ─── Custom exercises ──────────────────────────────────────────────────────

export async function getCustomExercises(): Promise<CustomExercise[]> {
  const res = await fetch('/api/calisthenics/custom-exercises', { cache: 'no-store' })
  if (!res.ok) return []
  const data = (await res.json()) as { exercises: CustomExercise[] }
  return data.exercises
}

export async function postCustomExercise(
  data: Omit<CustomExercise, 'id' | 'userId' | 'createdAt'>,
): Promise<CustomExercise> {
  const res = await fetch('/api/calisthenics/custom-exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = (await res.json()) as { exercise?: CustomExercise; error?: string }
  if (!res.ok) throw new Error(json.error ?? 'Failed to create exercise')
  return json.exercise!
}

export async function putCustomExercise(
  id: string,
  data: Partial<Omit<CustomExercise, 'id' | 'userId' | 'createdAt'>>,
): Promise<CustomExercise> {
  const res = await fetch(`/api/calisthenics/custom-exercises?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = (await res.json()) as { exercise?: CustomExercise; error?: string }
  if (!res.ok) throw new Error(json.error ?? 'Failed to update exercise')
  return json.exercise!
}

export async function deleteCustomExercise(
  id: string,
  force = false,
): Promise<{ warning?: string; deleted?: boolean }> {
  const res = await fetch(`/api/calisthenics/custom-exercises?id=${id}&force=${force}`, {
    method: 'DELETE',
  })
  return res.json() as Promise<{ warning?: string; deleted?: boolean }>
}

// ─── Plans ─────────────────────────────────────────────────────────────────

export async function getCalisthenicsPlans(): Promise<CalisthenicsPlan[]> {
  const res = await fetch('/api/calisthenics/plans', { cache: 'no-store' })
  if (!res.ok) return []
  const data = (await res.json()) as { plans: CalisthenicsPlan[] }
  return data.plans
}

export async function postCalisthenicsPlan(
  data: Omit<CalisthenicsPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'libraryExercise' | 'customExercise'>,
): Promise<CalisthenicsPlan> {
  const res = await fetch('/api/calisthenics/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = (await res.json()) as { plan?: CalisthenicsPlan; error?: string }
  if (!res.ok) throw new Error(json.error ?? 'Failed to create plan')
  return json.plan!
}

export async function putCalisthenicsPlan(
  id: string,
  data: Partial<CalisthenicsPlan>,
): Promise<CalisthenicsPlan> {
  const res = await fetch(`/api/calisthenics/plans?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = (await res.json()) as { plan?: CalisthenicsPlan; error?: string }
  if (!res.ok) throw new Error(json.error ?? 'Failed to update plan')
  return json.plan!
}

export async function deleteCalisthenicsPlan(id: string): Promise<void> {
  await fetch(`/api/calisthenics/plans?id=${id}`, { method: 'DELETE' })
}

// ─── Logs ──────────────────────────────────────────────────────────────────

export async function getCalisthenicsLogs(query?: { from?: string; to?: string }): Promise<CalisthenicsLog[]> {
  const params = new URLSearchParams()
  if (query?.from) params.set('from', query.from)
  if (query?.to) params.set('to', query.to)
  const qs = params.toString()
  const res = await fetch(`/api/calisthenics/logs${qs ? `?${qs}` : ''}`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = (await res.json()) as { logs: CalisthenicsLog[] }
  return data.logs
}

export async function postCalisthenicsLogs(payload: CalisthenicsSessionPayload): Promise<void> {
  const res = await fetch('/api/calisthenics/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to save calisthenics session')
}

// ─── Personal bests ────────────────────────────────────────────────────────

export async function getCalisthenicsPersonalBests(): Promise<CalisthenicsPersonalBest[]> {
  const res = await fetch('/api/calisthenics/personal-bests', { cache: 'no-store' })
  if (!res.ok) return []
  const data = (await res.json()) as { personalBests: CalisthenicsPersonalBest[] }
  return data.personalBests
}
