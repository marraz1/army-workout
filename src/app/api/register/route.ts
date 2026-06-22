import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const email = body.email?.toLowerCase().trim()
  const password = body.password

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'That email is already registered.' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { email, password: hashed } })

  return NextResponse.json({ ok: true }, { status: 201 })
}
