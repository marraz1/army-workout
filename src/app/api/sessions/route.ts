import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { findExercise } from '@/lib/exercises'
import { serializeSession, type SessionRow } from '@/lib/session-serialize'
import type {
  DayStatus,
  PersonalBest,
  RunLog,
  SessionSet,
  SessionStatus,
  WorkoutSession,
} from '@/types'

interface SessionPayload {
  date: string
  dayType: string
  status: SessionStatus
  energyRating?: number
  notes?: string
  totalDurationMin?: number
  sets: SessionSet[]
  runLog?: (RunLog & { exerciseId?: string }) | null
}

/** Map a rich session status onto the day-log status that drives streak/heatmap. */
function toDayStatus(status: SessionStatus): DayStatus {
  // 'partial' counts as completed for streak purposes (the user trained).
  if (status === 'skipped') return 'skipped'
  if (status === 'cheat') return 'cheat'
  return 'completed'
}

/** Return sessions in an optional date range / status, newest first. */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const status = searchParams.get('status')

  const rows = await prisma.workoutSession.findMany({
    where: {
      userId: session.user.id,
      ...(from || to ? { date: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
      ...(status ? { status } : {}),
    },
    include: { sets: { orderBy: { setNumber: 'asc' } }, runLog: true },
    orderBy: { date: 'desc' },
  })

  const sessions: WorkoutSession[] = rows.map((r) => serializeSession(r as SessionRow))
  return NextResponse.json({ sessions })
}

/**
 * Central write: create the session (+ nested sets/runLog), upsert the day's
 * WorkoutLog so streak/heatmap keep working, then recompute personal bests.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as SessionPayload
  if (!body.date || !body.status) {
    return NextResponse.json({ error: 'date and status are required.' }, { status: 400 })
  }

  const userId = session.user.id
  const notes = body.notes?.slice(0, 300)

  const created = await prisma.workoutSession.create({
    data: {
      userId,
      date: body.date,
      dayType: body.dayType ?? '',
      status: body.status,
      energyRating: body.energyRating ?? null,
      notes: notes ?? null,
      totalDurationMin: body.totalDurationMin ?? null,
      sets: {
        create: (body.sets ?? []).map((s) => ({
          exerciseId: s.exerciseId,
          setNumber: s.setNumber,
          plannedReps: s.plannedReps,
          actualReps: s.actualReps,
          completed: s.completed,
        })),
      },
      runLog: body.runLog
        ? {
            create: {
              distanceKm: body.runLog.distanceKm ?? null,
              goalTimeSec: body.runLog.goalTimeSec ?? null,
              actualTimeSec: body.runLog.actualTimeSec ?? null,
            },
          }
        : undefined,
    },
    include: { sets: { orderBy: { setNumber: 'asc' } }, runLog: true },
  })

  // Keep the day-log in sync so streak + heatmap base colour stay correct.
  const dayStatus = toDayStatus(body.status)
  await prisma.workoutLog.upsert({
    where: { userId_date: { userId, date: body.date } },
    create: { userId, date: body.date, status: dayStatus },
    update: { status: dayStatus },
  })

  const newPBs = await recomputePersonalBests(userId, created.id, body)

  return NextResponse.json({ session: serializeSession(created as SessionRow), newPBs })
}

/** Higher value wins for reps/holds; lower (faster) wins for run time. */
function isBetter(metric: PersonalBest['metric'], next: number, prev: number): boolean {
  return metric === 'fastestRunSec' ? next < prev : next > prev
}

async function recomputePersonalBests(
  userId: string,
  sessionId: string,
  body: SessionPayload,
): Promise<PersonalBest[]> {
  // Best candidate value per (exerciseId, metric) from this session.
  const candidates = new Map<string, { exerciseId: string; metric: PersonalBest['metric']; value: number }>()

  for (const set of body.sets ?? []) {
    if (!set.completed || set.actualReps <= 0) continue
    const ex = findExercise(set.exerciseId)
    if (ex && !ex.isRepBased) continue
    const metric: PersonalBest['metric'] = ex?.isHold ? 'longestHoldSec' : 'maxReps'
    const key = `${set.exerciseId}:${metric}`
    const cur = candidates.get(key)
    if (!cur || set.actualReps > cur.value) {
      candidates.set(key, { exerciseId: set.exerciseId, metric, value: set.actualReps })
    }
  }

  if (body.runLog?.actualTimeSec && body.runLog.actualTimeSec > 0) {
    const exerciseId = body.runLog.exerciseId ?? 'run-3km'
    candidates.set(`${exerciseId}:fastestRunSec`, {
      exerciseId,
      metric: 'fastestRunSec',
      value: body.runLog.actualTimeSec,
    })
  }

  const newPBs: PersonalBest[] = []
  for (const c of candidates.values()) {
    const existing = await prisma.personalBest.findUnique({
      where: { userId_exerciseId_metric: { userId, exerciseId: c.exerciseId, metric: c.metric } },
    })
    if (existing && !isBetter(c.metric, c.value, existing.value)) continue

    const row = await prisma.personalBest.upsert({
      where: { userId_exerciseId_metric: { userId, exerciseId: c.exerciseId, metric: c.metric } },
      create: { userId, exerciseId: c.exerciseId, metric: c.metric, value: c.value, sessionId, date: body.date },
      update: { value: c.value, sessionId, date: body.date },
    })
    newPBs.push({
      id: row.id,
      exerciseId: row.exerciseId,
      metric: row.metric as PersonalBest['metric'],
      value: row.value,
      sessionId: row.sessionId ?? undefined,
      date: row.date,
    })
  }
  return newPBs
}
