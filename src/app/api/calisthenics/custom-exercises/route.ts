import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MAX_CUSTOM = 50

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const exercises = await prisma.customExercise.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ exercises })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const count = await prisma.customExercise.count({ where: { userId } })
  if (count >= MAX_CUSTOM) {
    return NextResponse.json({ error: `Maximum ${MAX_CUSTOM} custom exercises allowed.` }, { status: 400 })
  }

  const body = await req.json()
  const { name, muscles, level, defaultSets, defaultRepsOrSecs, isTimed, restSec, description, notes, illustrationTemplate } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'name is required.' }, { status: 400 })
  }
  if (name.length > 50) {
    return NextResponse.json({ error: 'name must be 50 characters or fewer.' }, { status: 400 })
  }
  if (!Array.isArray(muscles) || muscles.length < 1 || muscles.length > 4) {
    return NextResponse.json({ error: 'muscles must be 1–4 items.' }, { status: 400 })
  }

  const exercise = await prisma.customExercise.create({
    data: {
      userId,
      name: name.trim(),
      muscles,
      level: level ?? 'Beginner',
      defaultSets: defaultSets ?? 3,
      defaultRepsOrSecs: defaultRepsOrSecs ?? 10,
      isTimed: isTimed ?? false,
      restSec: restSec ?? 60,
      description: description?.slice(0, 200) ?? null,
      notes: notes?.slice(0, 200) ?? null,
      illustrationTemplate: illustrationTemplate ?? null,
    },
  })

  return NextResponse.json({ exercise }, { status: 201 })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 })

  const existing = await prisma.customExercise.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  const body = await req.json()
  const { name, muscles, level, defaultSets, defaultRepsOrSecs, isTimed, restSec, description, notes, illustrationTemplate } = body

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0 || name.length > 50)) {
    return NextResponse.json({ error: 'name must be 1–50 characters.' }, { status: 400 })
  }
  if (muscles !== undefined && (!Array.isArray(muscles) || muscles.length < 1 || muscles.length > 4)) {
    return NextResponse.json({ error: 'muscles must be 1–4 items.' }, { status: 400 })
  }

  const exercise = await prisma.customExercise.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(muscles !== undefined ? { muscles } : {}),
      ...(level !== undefined ? { level } : {}),
      ...(defaultSets !== undefined ? { defaultSets } : {}),
      ...(defaultRepsOrSecs !== undefined ? { defaultRepsOrSecs } : {}),
      ...(isTimed !== undefined ? { isTimed } : {}),
      ...(restSec !== undefined ? { restSec } : {}),
      ...(description !== undefined ? { description: description?.slice(0, 200) ?? null } : {}),
      ...(notes !== undefined ? { notes: notes?.slice(0, 200) ?? null } : {}),
      ...(illustrationTemplate !== undefined ? { illustrationTemplate } : {}),
    },
  })

  return NextResponse.json({ exercise })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const force = searchParams.get('force') === 'true'

  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 })

  const existing = await prisma.customExercise.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  if (!force) {
    const activePlan = await prisma.calisthenicsPlan.findFirst({
      where: { customExerciseId: id, isActive: true },
    })
    if (activePlan) {
      return NextResponse.json({ warning: 'inActivePlan' })
    }
  }

  // Remove logs first, then plans, then the exercise
  await prisma.calisthenicsLog.deleteMany({ where: { exerciseId: id, source: 'custom' } })
  await prisma.calisthenicsPlan.deleteMany({ where: { customExerciseId: id } })
  await prisma.customExercise.delete({ where: { id } })

  return NextResponse.json({ deleted: true })
}
