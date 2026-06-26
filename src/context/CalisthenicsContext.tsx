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
import type {
  CalisthenicsLog,
  CalisthenicsPersonalBest,
  CalisthenicsPlan,
  CalisthenicsSessionPayload,
  CustomExercise,
} from '@/types/calisthenics'
import {
  deleteCustomExercise as apiDeleteCustomExercise,
  deleteCalisthenicsPlan as apiDeletePlan,
  getCalisthenicsLogs,
  getCalisthenicsPersonalBests,
  getCalisthenicsPlans,
  getCustomExercises,
  postCalisthenicsLogs,
  postCalisthenicsPlan,
  postCustomExercise,
  putCalisthenicsPlan,
  putCustomExercise,
} from '@/lib/calisthenicsDb'

interface CalisthenicsValue {
  loading: boolean
  customExercises: CustomExercise[]
  plans: CalisthenicsPlan[]
  logs: CalisthenicsLog[]
  personalBests: CalisthenicsPersonalBest[]
  saveCustomExercise: (data: Omit<CustomExercise, 'id' | 'userId' | 'createdAt'>) => Promise<CustomExercise>
  updateCustomExercise: (id: string, data: Partial<CustomExercise>) => Promise<void>
  removeCustomExercise: (id: string, force?: boolean) => Promise<{ warning?: string; deleted?: boolean }>
  savePlan: (data: Omit<CalisthenicsPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'libraryExercise' | 'customExercise'>) => Promise<void>
  updatePlan: (id: string, data: Partial<CalisthenicsPlan>) => Promise<void>
  removePlan: (id: string) => Promise<void>
  saveLogs: (payload: CalisthenicsSessionPayload) => Promise<void>
  refresh: () => void
}

const CalisthenicsContext = createContext<CalisthenicsValue | null>(null)

export function CalisthenicsProvider({ children }: { children: ReactNode }) {
  const { status } = useSession()

  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([])
  const [plans, setPlans] = useState<CalisthenicsPlan[]>([])
  const [logs, setLogs] = useState<CalisthenicsLog[]>([])
  const [personalBests, setPersonalBests] = useState<CalisthenicsPersonalBest[]>([])
  const [loading, setLoading] = useState(true)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    if (status === 'loading') return
    if (status !== 'authenticated') {
      setCustomExercises([])
      setPlans([])
      setLogs([])
      setPersonalBests([])
      setLoading(false)
      return
    }
    setLoading(true)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    const from = ninetyDaysAgo.toISOString().slice(0, 10)

    void Promise.all([
      getCustomExercises(),
      getCalisthenicsPlans(),
      getCalisthenicsLogs({ from }),
      getCalisthenicsPersonalBests(),
    ])
      .then(([ce, pl, lo, pb]) => {
        if (cancelled) return
        setCustomExercises(ce)
        setPlans(pl)
        setLogs(lo)
        setPersonalBests(pb)
      })
      .catch((err) => console.error('Failed to load calisthenics data', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [status, nonce])

  const saveCustomExercise = useCallback(
    async (data: Omit<CustomExercise, 'id' | 'userId' | 'createdAt'>) => {
      const created = await postCustomExercise(data)
      setCustomExercises((prev) => [...prev, created])
      return created
    },
    [],
  )

  const updateCustomExercise = useCallback(async (id: string, data: Partial<CustomExercise>) => {
    const updated = await putCustomExercise(id, data)
    setCustomExercises((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }, [])

  const removeCustomExercise = useCallback(
    async (id: string, force = false) => {
      const result = await apiDeleteCustomExercise(id, force)
      if (result.deleted) {
        setCustomExercises((prev) => prev.filter((e) => e.id !== id))
        setPlans((prev) => prev.filter((p) => p.customExerciseId !== id))
      }
      return result
    },
    [],
  )

  const savePlan = useCallback(
    async (
      data: Omit<CalisthenicsPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'libraryExercise' | 'customExercise'>,
    ) => {
      const created = await postCalisthenicsPlan(data)
      setPlans((prev) => [...prev, created])
    },
    [],
  )

  const updatePlan = useCallback(async (id: string, data: Partial<CalisthenicsPlan>) => {
    const updated = await putCalisthenicsPlan(id, data)
    setPlans((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  const removePlan = useCallback(async (id: string) => {
    await apiDeletePlan(id)
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const saveLogs = useCallback(async (payload: CalisthenicsSessionPayload) => {
    await postCalisthenicsLogs(payload)
    refresh()
  }, [refresh])

  const value = useMemo<CalisthenicsValue>(
    () => ({
      loading,
      customExercises,
      plans,
      logs,
      personalBests,
      saveCustomExercise,
      updateCustomExercise,
      removeCustomExercise,
      savePlan,
      updatePlan,
      removePlan,
      saveLogs,
      refresh,
    }),
    [
      loading, customExercises, plans, logs, personalBests,
      saveCustomExercise, updateCustomExercise, removeCustomExercise,
      savePlan, updatePlan, removePlan, saveLogs, refresh,
    ],
  )

  return <CalisthenicsContext.Provider value={value}>{children}</CalisthenicsContext.Provider>
}

export function useCalisthenics(): CalisthenicsValue {
  const ctx = useContext(CalisthenicsContext)
  if (!ctx) throw new Error('useCalisthenics must be used inside CalisthenicsProvider')
  return ctx
}
