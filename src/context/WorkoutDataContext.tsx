'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useSession } from 'next-auth/react'
import type { PersonalBest, WorkoutPlan, WorkoutSession } from '@/types'
import {
  deletePlan as apiDeletePlan,
  deleteSession as apiDeleteSession,
  getPersonalBests,
  getPlans,
  getSessions,
  postSession,
  putPlan,
  type SessionPayload,
} from '@/lib/db'

interface WorkoutDataValue {
  loading: boolean
  plans: WorkoutPlan[]
  sessions: WorkoutSession[]
  personalBests: PersonalBest[]
  savePlan: (plan: Partial<WorkoutPlan>) => Promise<void>
  resetPlan: (exerciseId: string, opts?: { scope?: string; onceDate?: string }) => Promise<void>
  saveSession: (payload: SessionPayload) => Promise<{ session: WorkoutSession; newPBs: PersonalBest[] }>
  removeSession: (id: string) => Promise<void>
  refresh: () => void
}

const WorkoutDataContext = createContext<WorkoutDataValue | null>(null)

export function WorkoutDataProvider({ children }: { children: ReactNode }) {
  const { status } = useSession()

  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([])
  const [loading, setLoading] = useState(true)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    if (status === 'loading') return
    if (status !== 'authenticated') {
      setPlans([])
      setSessions([])
      setPersonalBests([])
      setLoading(false)
      return
    }
    setLoading(true)
    void Promise.all([getPlans(), getSessions(), getPersonalBests()])
      .then(([p, s, pb]) => {
        if (cancelled) return
        setPlans(p)
        setSessions(s)
        setPersonalBests(pb)
      })
      .catch((err) => console.error('Failed to load workout data', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [status, nonce])

  const savePlan = useCallback(async (plan: Partial<WorkoutPlan>) => {
    const saved = await putPlan(plan)
    setPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [...prev, saved]
    })
  }, [])

  const resetPlan = useCallback(
    async (exerciseId: string, opts: { scope?: string; onceDate?: string } = {}) => {
      await apiDeletePlan(exerciseId, opts)
      setPlans((prev) =>
        prev.filter((p) => {
          if (p.exerciseId !== exerciseId) return true
          if (opts.scope && p.scope !== opts.scope) return true
          if (opts.onceDate && p.onceDate !== opts.onceDate) return true
          return false
        }),
      )
    },
    [],
  )

  const saveSession = useCallback(async (payload: SessionPayload) => {
    const result = await postSession(payload)
    setSessions((prev) => [result.session, ...prev])
    if (result.newPBs.length) {
      setPersonalBests((prev) => {
        const map = new Map(prev.map((p) => [`${p.exerciseId}:${p.metric}`, p]))
        for (const pb of result.newPBs) map.set(`${pb.exerciseId}:${pb.metric}`, pb)
        return [...map.values()]
      })
    }
    return result
  }, [])

  const removeSession = useCallback(async (id: string) => {
    await apiDeleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const value = useMemo<WorkoutDataValue>(
    () => ({
      loading,
      plans,
      sessions,
      personalBests,
      savePlan,
      resetPlan,
      saveSession,
      removeSession,
      refresh,
    }),
    [loading, plans, sessions, personalBests, savePlan, resetPlan, saveSession, removeSession, refresh],
  )

  return <WorkoutDataContext.Provider value={value}>{children}</WorkoutDataContext.Provider>
}

export function useWorkoutData(): WorkoutDataValue {
  const ctx = useContext(WorkoutDataContext)
  if (!ctx) throw new Error('useWorkoutData must be used within WorkoutDataProvider')
  return ctx
}
