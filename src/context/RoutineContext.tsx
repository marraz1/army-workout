'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { dailyRoutine as defaultItems } from '@/data/dailyRoutine'
import type { RoutineItem, RoutineLog } from '@/types'
import { todayISO } from '@/lib/utils'

interface RoutineContextValue {
  items: RoutineItem[]
  todayChecked: Set<string>
  logs: RoutineLog[]
  toggleItem: (itemKey: string, label: string) => Promise<void>
  saveItems: (items: RoutineItem[]) => Promise<void>
}

const RoutineContext = createContext<RoutineContextValue | null>(null)

export function RoutineProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [items, setItems] = useState<RoutineItem[]>(defaultItems)
  const [todayChecked, setTodayChecked] = useState<Set<string>>(new Set())
  const [logs, setLogs] = useState<RoutineLog[]>([])

  useEffect(() => {
    if (!session?.user) return

    fetch('/api/routine')
      .then((r) => r.json())
      .then(({ items: saved }) => {
        if (saved && saved.length > 0) setItems(saved)
      })
      .catch(() => {})

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const since = thirtyDaysAgo.toISOString().split('T')[0]

    fetch(`/api/routine/log?since=${since}`)
      .then((r) => r.json())
      .then(({ logs: fetched }) => {
        if (!fetched) return
        const today = todayISO()
        setLogs(fetched)
        const checked = new Set<string>(
          fetched
            .filter((l: RoutineLog) => l.date === today && l.completed)
            .map((l: RoutineLog) => l.itemKey),
        )
        setTodayChecked(checked)
      })
      .catch(() => {})
  }, [session?.user])

  const toggleItem = useCallback(
    async (itemKey: string, label: string) => {
      const today = todayISO()
      const wasChecked = todayChecked.has(itemKey)
      const nowChecked = !wasChecked

      setTodayChecked((prev) => {
        const next = new Set(prev)
        if (nowChecked) next.add(itemKey)
        else next.delete(itemKey)
        return next
      })

      if (nowChecked) {
        const newLog: RoutineLog = {
          id: itemKey + today,
          date: today,
          itemKey,
          label,
          completed: true,
        }
        setLogs((prev) => [
          ...prev.filter((l) => !(l.date === today && l.itemKey === itemKey)),
          newLog,
        ])
      } else {
        setLogs((prev) => prev.filter((l) => !(l.date === today && l.itemKey === itemKey)))
      }

      try {
        await fetch('/api/routine/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, itemKey, label, completed: nowChecked }),
        })
      } catch {
        // Revert on error
        setTodayChecked((prev) => {
          const next = new Set(prev)
          if (wasChecked) next.add(itemKey)
          else next.delete(itemKey)
          return next
        })
        if (nowChecked) {
          setLogs((prev) => prev.filter((l) => !(l.date === today && l.itemKey === itemKey)))
        }
      }
    },
    [todayChecked],
  )

  const saveItems = useCallback(async (newItems: RoutineItem[]) => {
    setItems(newItems)
    await fetch('/api/routine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: newItems }),
    })
  }, [])

  return (
    <RoutineContext.Provider value={{ items, todayChecked, logs, toggleItem, saveItems }}>
      {children}
    </RoutineContext.Provider>
  )
}

export function useRoutine() {
  const ctx = useContext(RoutineContext)
  if (!ctx) throw new Error('useRoutine must be inside RoutineProvider')
  return ctx
}
