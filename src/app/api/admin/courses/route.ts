import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { title, slug, description, level, price, icon, color } = await req.json()
  try {
    const course = await prisma.course.create({
      data: { title, slug, description, level, price, icon, color, published: false },
    })
    return NextResponse.json(course)
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'ეს slug უკვე გამოყენებულია' }, { status: 400 })
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
