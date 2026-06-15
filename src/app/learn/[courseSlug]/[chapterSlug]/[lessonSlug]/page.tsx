export const dynamic = 'force-dynamic'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { LessonSidebar } from '@/components/lesson/LessonSidebar'
import { LessonContent } from '@/components/lesson/LessonContent'

async function getData(courseSlug: string, chapterSlug: string, lessonSlug: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        chapters: {
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        },
        finalExam: true,
      },
    })
    if (!course) return null

    const chapter = course.chapters.find(c => c.slug === chapterSlug)
    if (!chapter) return null

    const lesson = await prisma.lesson.findFirst({
      where: { chapterId: chapter.id, slug: lessonSlug },
      include: { exercise: true, quiz: { include: { questions: { orderBy: { order: 'asc' } } } } },
    })
    if (!lesson) return null

    return { course, chapter, lesson }
  } catch { return null }
}

export default async function LessonPage({ params }: { params: { courseSlug: string; chapterSlug: string; lessonSlug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id

  const data = await getData(params.courseSlug, params.chapterSlug, params.lessonSlug)
  if (!data) notFound()

  const { course, chapter, lesson } = data

  // Check purchase
  try {
    const uc = await prisma.userCourse.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    })
    if (!uc && course.price > 0) redirect(`/courses/${course.slug}`)
  } catch {}

  // Get progress
  let completedLessons: string[] = []
  let passedExams: string[] = []
  try {
    const progress = await prisma.userProgress.findMany({ where: { userId, completed: true } })
    completedLessons = progress.filter(p => p.lessonId).map(p => p.lessonId!)
    passedExams = progress.filter(p => p.chapterId).map(p => p.chapterId!)
  } catch {}

  return (
    <div className="flex min-h-screen pt-16">
      <LessonSidebar
        courseSlug={course.slug}
        courseTitle={course.title}
        chapters={course.chapters}
        completedLessons={completedLessons}
        passedExams={passedExams}
        hasFinalExam={!!course.finalExam}
      />
      <div className="ml-72 flex-1 p-8 max-w-4xl">
        <LessonContent
          lesson={lesson}
          courseSlug={course.slug}
          chapterSlug={chapter.slug}
          chapter={chapter}
          completedLessons={completedLessons}
        />
      </div>
    </div>
  )
}
