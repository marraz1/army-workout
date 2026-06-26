import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const since = searchParams.get('since')

  const logs = await prisma.dailyRoutineLog.findMany({
    where: {
      userId: session.user.id,
      ...(since ? { date: { gte: since } } : {}),
    },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json({ logs })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { date, itemKey, label, completed } = (await req.json()) as {
    date: string
    itemKey: string
    label: string
    completed: boolean
  }

  const userId = session.user.id

  if (completed) {
    await prisma.dailyRoutineLog.upsert({
      where: { userId_date_itemKey: { userId, date, itemKey } },
      create: { userId, date, itemKey, label, completed: true },
      update: { completed: true, label },
    })
  } else {
    await prisma.dailyRoutineLog.deleteMany({ where: { userId, date, itemKey } })
  }

  return NextResponse.json({ ok: true })
}
