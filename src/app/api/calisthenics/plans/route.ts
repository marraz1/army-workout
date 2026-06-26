import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plans = await prisma.calisthenicsPlan.findMany({
    where: { userId: session.user.id, isActive: true },
    include: {
      libraryExercise: true,
      customExercise: true,
    },
    orderBy: [{ dayOfWeek: 'asc' }, { timeOfDay: 'asc' }],
  })

  return NextResponse.json({ plans })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { source, libraryExerciseId, customExerciseId, dayOfWeek, timeOfDay, sets, repsOrSecs, restSec, goalTarget } = body

  if (!source || !['library', 'custom'].includes(source)) {
    return NextResponse.json({ error: 'source must be library or custom.' }, { status: 400 })
  }
  if (source === 'library' && !libraryExerciseId) {
    return NextResponse.json({ error: 'libraryExerciseId is required for library source.' }, { status: 400 })
  }
  if (source === 'custom' && !customExerciseId) {
    return NextResponse.json({ error: 'customExerciseId is required for custom source.' }, { status: 400 })
  }
  if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
    return NextResponse.json({ error: 'dayOfWeek must be 0–6.' }, { status: 400 })
  }

  const plan = await prisma.calisthenicsPlan.create({
    data: {
      userId: session.user.id,
      source,
      libraryExerciseId: source === 'library' ? libraryExerciseId : null,
      customExerciseId: source === 'custom' ? customExerciseId : null,
      dayOfWeek,
      timeOfDay: timeOfDay ?? '07:00',
      sets: sets ?? 3,
      repsOrSecs: repsOrSecs ?? 10,
      restSec: restSec ?? 60,
      goalTarget: goalTarget ?? null,
      isActive: true,
    },
    include: { libraryExercise: true, customExercise: true },
  })

  return NextResponse.json({ plan }, { status: 201 })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 })

  const existing = await prisma.calisthenicsPlan.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  const body = await req.json()

  const plan = await prisma.calisthenicsPlan.update({
    where: { id },
    data: {
      ...(body.dayOfWeek !== undefined ? { dayOfWeek: body.dayOfWeek } : {}),
      ...(body.timeOfDay !== undefined ? { timeOfDay: body.timeOfDay } : {}),
      ...(body.sets !== undefined ? { sets: body.sets } : {}),
      ...(body.repsOrSecs !== undefined ? { repsOrSecs: body.repsOrSecs } : {}),
      ...(body.restSec !== undefined ? { restSec: body.restSec } : {}),
      ...(body.goalTarget !== undefined ? { goalTarget: body.goalTarget } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
    },
    include: { libraryExercise: true, customExercise: true },
  })

  return NextResponse.json({ plan })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 })

  const existing = await prisma.calisthenicsPlan.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  // Soft-deactivate
  await prisma.calisthenicsPlan.update({ where: { id }, data: { isActive: false } })

  return NextResponse.json({ deactivated: true })
}
