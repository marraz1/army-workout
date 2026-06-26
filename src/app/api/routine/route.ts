import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { RoutineItem } from '@/types'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.routineItem.findMany({
    where: { userId: session.user.id },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json({ items })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items } = (await req.json()) as { items: RoutineItem[] }
  const userId = session.user.id

  await prisma.routineItem.deleteMany({ where: { userId } })

  if (items.length > 0) {
    await prisma.routineItem.createMany({
      data: items.map((item, i) => ({
        id: item.id,
        userId,
        time: item.time,
        icon: item.icon,
        label: item.label,
        detail: item.detail,
        color: item.color,
        sortOrder: i,
      })),
    })
  }

  return NextResponse.json({ ok: true })
}
