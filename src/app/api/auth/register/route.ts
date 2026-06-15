import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'ყველა ველი სავალდებულოა' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'ეს ელ-ფოსტა უკვე გამოყენებულია' }, { status: 400 })
    }
    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    })
    return NextResponse.json({ message: 'მომხმარებელი შეიქმნა', userId: user.id })
  } catch {
    return NextResponse.json({ error: 'შეცდომა. სცადეთ თავიდან.' }, { status: 500 })
  }
}
