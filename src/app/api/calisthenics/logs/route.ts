import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { CalisthenicsSessionPayload } from '@/types/calisthenics'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const logs = await prisma.calisthenicsLog.findMany({
    where: {
      userId: session.user.id,
      ...(from || to
        ? { sessionDate: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
        : {}),
    },
    orderBy: [{ sessionDate: 'desc' }, { setNumber: 'asc' }],
  })

  return NextResponse.json({ logs })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as CalisthenicsSessionPayload

  if (!body.sessionDate || !body.source || !body.exerciseId || !Array.isArray(body.sets)) {
    return NextResponse.json({ error: 'sessionDate, source, exerciseId, and sets are required.' }, { status: 400 })
  }

  const userId = session.user.id

  await prisma.calisthenicsLog.createMany({
    data: body.sets.map((s) => ({
      userId,
      planId: body.planId ?? null,
      source: body.source,
      exerciseId: body.exerciseId,
      sessionDate: body.sessionDate,
      setNumber: s.setNumber,
      plannedReps: s.plannedReps,
      actualReps: s.actualReps,
      completed: s.completed,
      notes: s.notes ?? null,
    })),
  })

  return NextResponse.json({ created: body.sets.length }, { status: 201 })
}
