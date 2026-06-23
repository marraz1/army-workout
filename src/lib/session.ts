import type { RunLog, SessionSet, SessionStatus } from '@/types'

export interface SessionSummary {
  totalActualReps: number
  totalPlannedReps: number
  repsDelta: number
  setsDone: number
  setsTotal: number
  runActualSec?: number
  runGoalSec?: number
  /** Goal − actual (positive = under goal / faster). */
  runDeltaSec?: number
}

/** Derive a session status from the logged sets (run-only days count as completed). */
export function deriveStatus(sets: SessionSet[], runLogged: boolean): SessionStatus {
  if (sets.length === 0) return runLogged ? 'completed' : 'skipped'
  const done = sets.filter((s) => s.completed).length
  if (done === 0) return runLogged ? 'partial' : 'skipped'
  if (done < sets.length) return 'partial'
  return 'completed'
}

/** Aggregate logged sets + run into the numbers shown on the summary screen. */
export function computeSessionSummary(sets: SessionSet[], runLog?: RunLog | null): SessionSummary {
  let totalActualReps = 0
  let totalPlannedReps = 0
  let setsDone = 0
  for (const s of sets) {
    totalActualReps += s.actualReps
    totalPlannedReps += s.plannedReps
    if (s.completed) setsDone++
  }

  const summary: SessionSummary = {
    totalActualReps,
    totalPlannedReps,
    repsDelta: totalActualReps - totalPlannedReps,
    setsDone,
    setsTotal: sets.length,
  }

  if (runLog?.actualTimeSec) {
    summary.runActualSec = runLog.actualTimeSec
    summary.runGoalSec = runLog.goalTimeSec
    if (runLog.goalTimeSec) summary.runDeltaSec = runLog.goalTimeSec - runLog.actualTimeSec
  }

  return summary
}
