import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { serializeSession, type SessionRow } from '@/lib/session-serialize'

/** Drill-down: one session with all sets + run log. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const row = await prisma.workoutSession.findFirst({
    where: { id, userId: session.user.id },
    include: { sets: { orderBy: { setNumber: 'asc' } }, runLog: true },
  })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ session: serializeSession(row as SessionRow) })
}

/** Delete a session (cascades to sets + run log). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.workoutSession.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.workoutSession.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
