import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { WorkoutLog, DayStatus, SkipReason } from '@/types'

/** Return all of the signed-in user's logs, keyed by ISO date. */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await prisma.workoutLog.findMany({ where: { userId: session.user.id } })
  const logs: Record<string, WorkoutLog> = {}
  for (const row of rows) {
    logs[row.date] = {
      date: row.date,
      status: row.status as DayStatus,
      reason: (row.reason as SkipReason | null) ?? undefined,
      loggedAt: row.loggedAt.toISOString(),
    }
  }
  return NextResponse.json({ logs })
}

/** Insert or update one day's log (unique per user per date). */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as WorkoutLog
  if (!body.date || !body.status) {
    return NextResponse.json({ error: 'date and status are required.' }, { status: 400 })
  }

  const userId = session.user.id
  await prisma.workoutLog.upsert({
    where: { userId_date: { userId, date: body.date } },
    create: {
      userId,
      date: body.date,
      status: body.status,
      reason: body.reason ?? null,
    },
    update: { status: body.status, reason: body.reason ?? null },
  })

  return NextResponse.json({ ok: true })
}
