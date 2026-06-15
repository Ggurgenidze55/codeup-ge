import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.redirect(new URL('/login', req.url))
  const userId = (session.user as any).id
  const formData = await req.formData()
  const courseId = formData.get('courseId') as string

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.redirect(new URL('/courses', req.url))

    if (course.price === 0) {
      await prisma.userCourse.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId },
        update: {},
      })
      const firstChapter = await prisma.chapter.findFirst({ where: { courseId }, orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } })
      const firstLesson = firstChapter?.lessons[0]
      if (firstChapter && firstLesson) {
        return NextResponse.redirect(new URL(`/learn/${course.slug}/${firstChapter.slug}/${firstLesson.slug}`, req.url))
      }
    }
    // TODO: Stripe integration
    return NextResponse.redirect(new URL(`/courses/${course.slug}?payment=pending`, req.url))
  } catch {
    return NextResponse.redirect(new URL('/courses', req.url))
  }
}
