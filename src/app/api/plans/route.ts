import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { WorkoutPlan } from '@/types'

function toPlan(row: {
  id: string
  exerciseId: string
  setsCount: number
  repsTarget: number
  goalTarget: string | null
  restSec: number
  runGoalSec: number | null
  removed: boolean
  isCustom: boolean
  scope: string
  onceDate: string | null
  muscleData: string | null
}): WorkoutPlan {
  return {
    id: row.id,
    exerciseId: row.exerciseId,
    setsCount: row.setsCount,
    repsTarget: row.repsTarget,
    goalTarget: row.goalTarget ?? undefined,
    restSec: row.restSec,
    runGoalSec: row.runGoalSec ?? undefined,
    removed: row.removed,
    isCustom: row.isCustom,
    scope: row.scope as WorkoutPlan['scope'],
    onceDate: row.onceDate ?? undefined,
    muscleData: row.muscleData ?? undefined,
  }
}

/** Return all of the signed-in user's plan overrides. */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await prisma.workoutPlan.findMany({ where: { userId: session.user.id } })
  return NextResponse.json({ plans: rows.map(toPlan) })
}

/** Upsert one plan override (scope 'all' or 'once'). */
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as Partial<WorkoutPlan>
  if (!body.exerciseId) {
    return NextResponse.json({ error: 'exerciseId is required.' }, { status: 400 })
  }

  const userId = session.user.id
  const scope = body.scope ?? 'all'
  const onceDate = scope === 'once' ? body.onceDate ?? null : null
  const data = {
    setsCount: body.setsCount ?? 1,
    repsTarget: body.repsTarget ?? 0,
    goalTarget: body.goalTarget ?? null,
    restSec: body.restSec ?? 60,
    runGoalSec: body.runGoalSec ?? null,
    removed: body.removed ?? false,
    isCustom: body.isCustom ?? true,
    scope,
    onceDate,
    muscleData: body.muscleData ?? null,
  }

  // Postgres treats NULL as distinct in unique constraints, so for scope 'all'
  // (onceDate null) we find-then-update manually instead of relying on upsert.
  const existing = await prisma.workoutPlan.findFirst({
    where: { userId, exerciseId: body.exerciseId, scope, onceDate },
  })

  const row = existing
    ? await prisma.workoutPlan.update({ where: { id: existing.id }, data })
    : await prisma.workoutPlan.create({ data: { userId, exerciseId: body.exerciseId, ...data } })

  return NextResponse.json({ plan: toPlan(row) })
}

/** Reset an exercise to its age-group default by removing override rows. */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const exerciseId = searchParams.get('exerciseId')
  const scope = searchParams.get('scope')
  const onceDate = searchParams.get('onceDate')
  if (!exerciseId) {
    return NextResponse.json({ error: 'exerciseId is required.' }, { status: 400 })
  }

  await prisma.workoutPlan.deleteMany({
    where: {
      userId: session.user.id,
      exerciseId,
      ...(scope ? { scope } : {}),
      ...(onceDate ? { onceDate } : {}),
    },
  })

  return NextResponse.json({ ok: true })
}
