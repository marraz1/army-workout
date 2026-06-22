import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { UserProfile } from '@/types'

/** Return the signed-in user's profile, or null if they haven't onboarded. */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const row = await prisma.profile.findUnique({ where: { userId: session.user.id } })
  if (!row) return NextResponse.json({ profile: null })

  const profile: UserProfile = {
    name: row.name,
    age: row.age,
    gender: row.gender as UserProfile['gender'],
    fitnessLevel: row.fitnessLevel as UserProfile['fitnessLevel'],
    language: row.language as UserProfile['language'],
    wakeTime: row.wakeTime,
    createdAt: row.createdAt.toISOString(),
  }
  return NextResponse.json({ profile })
}

/** Create or update the signed-in user's profile. */
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as Partial<UserProfile>
  const data = {
    name: body.name ?? 'Recruit',
    age: body.age ?? 30,
    gender: body.gender ?? 'M',
    fitnessLevel: body.fitnessLevel ?? 'Intermediate',
    language: body.language ?? 'EN',
    wakeTime: body.wakeTime ?? '06:00',
  }

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: data,
  })

  return NextResponse.json({ ok: true })
}
