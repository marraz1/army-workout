import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { PersonalBest } from '@/types'

/** Return all of the signed-in user's personal bests. */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await prisma.personalBest.findMany({ where: { userId: session.user.id } })
  const personalBests: PersonalBest[] = rows.map((r) => ({
    id: r.id,
    exerciseId: r.exerciseId,
    metric: r.metric as PersonalBest['metric'],
    value: r.value,
    sessionId: r.sessionId ?? undefined,
    date: r.date,
  }))
  return NextResponse.json({ personalBests })
}
