import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const { quizId, examId, answers, score, passed } = await req.json()

  try {
    await prisma.quizAttempt.create({
      data: { userId, quizId: quizId || null, examId: examId || null, answers, score, passed },
    })
    if (examId && passed) {
      const exam = await prisma.exam.findUnique({ where: { id: examId } })
      if (exam?.chapterId) {
        await prisma.userProgress.upsert({
          where: { userId_chapterId: { userId, chapterId: exam.chapterId } },
          create: { userId, chapterId: exam.chapterId, completed: true, score, completedAt: new Date() },
          update: { completed: true, score, completedAt: new Date() },
        })
      }
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
