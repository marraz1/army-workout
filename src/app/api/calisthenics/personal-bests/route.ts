import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const grouped = await prisma.calisthenicsLog.groupBy({
    by: ['exerciseId', 'source'],
    where: {
      userId: session.user.id,
      completed: true,
    },
    _max: { actualReps: true },
  })

  const personalBests = grouped.map((g) => ({
    exerciseId: g.exerciseId,
    source: g.source,
    bestReps: g._max.actualReps ?? 0,
  }))

  return NextResponse.json({ personalBests })
}
