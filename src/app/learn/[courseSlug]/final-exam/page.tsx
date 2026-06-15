export const dynamic = 'force-dynamic'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { LessonSidebar } from '@/components/lesson/LessonSidebar'
import { FinalExamClient } from '@/components/quiz/FinalExamClient'

export default async function FinalExamPage({ params }: { params: { courseSlug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  const userId = (session.user as any).id

  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.courseSlug },
      include: {
        chapters: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
        finalExam: { include: { questions: { orderBy: { order: 'asc' } } } },
      },
    })
    if (!course) notFound()

    const progress = await prisma.userProgress.findMany({ where: { userId, completed: true } })
    const completedLessons = progress.filter(p => p.lessonId).map(p => p.lessonId!)
    const passedExams = progress.filter(p => p.chapterId).map(p => p.chapterId!)

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
        <div className="ml-72 flex-1 p-8">
          <h1 className="text-3xl font-black text-white mb-2">
            საბოლოო <span className="text-[#6C63FF]">გამოცდა</span>
          </h1>
          <p className="text-[#8888AA] mb-8">80%+ ქულის შემთხვევაში მიიღებ სერტიფიკატს</p>
          {course.finalExam ? (
            <FinalExamClient
              examId={course.finalExam.id}
              courseId={course.id}
              title={course.finalExam.title}
              questions={course.finalExam.questions}
              timeLimit={course.finalExam.timeLimit}
              passMark={course.finalExam.passMark}
              courseSlug={course.slug}
            />
          ) : (
            <div className="card p-8 text-center">
              <p className="text-[#8888AA]">გამოცდა მომზადებაშია.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch { notFound() }
}
