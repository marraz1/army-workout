import type { WorkoutSession } from '@/types'

/** Shape of a Prisma WorkoutSession row with sets + runLog included. */
export interface SessionRow {
  id: string
  date: string
  dayType: string
  status: string
  energyRating: number | null
  notes: string | null
  totalDurationMin: number | null
  createdAt: Date
  sets: Array<{
    id: string
    exerciseId: string
    setNumber: number
    plannedReps: number
    actualReps: number
    completed: boolean
  }>
  runLog: {
    id: string
    distanceKm: number | null
    goalTimeSec: number | null
    actualTimeSec: number | null
  } | null
}

/** Convert a Prisma session row into the client-facing WorkoutSession type. */
export function serializeSession(row: SessionRow): WorkoutSession {
  return {
    id: row.id,
    date: row.date,
    dayType: row.dayType,
    status: row.status as WorkoutSession['status'],
    energyRating: row.energyRating ?? undefined,
    notes: row.notes ?? undefined,
    totalDurationMin: row.totalDurationMin ?? undefined,
    createdAt: row.createdAt.toISOString(),
    sets: row.sets.map((s) => ({
      id: s.id,
      exerciseId: s.exerciseId,
      setNumber: s.setNumber,
      plannedReps: s.plannedReps,
      actualReps: s.actualReps,
      completed: s.completed,
    })),
    runLog: row.runLog
      ? {
          id: row.runLog.id,
          distanceKm: row.runLog.distanceKm ?? undefined,
          goalTimeSec: row.runLog.goalTimeSec ?? undefined,
          actualTimeSec: row.runLog.actualTimeSec ?? undefined,
        }
      : null,
  }
}
