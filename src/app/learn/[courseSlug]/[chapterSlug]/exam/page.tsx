export const dynamic = 'force-dynamic'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { LessonSidebar } from '@/components/lesson/LessonSidebar'
import { ExamClient } from '@/components/quiz/ExamClient'

export default async function ChapterExamPage({ params }: { params: { courseSlug: string; chapterSlug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  const userId = (session.user as any).id

  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.courseSlug },
      include: {
        chapters: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
        finalExam: true,
      },
    })
    if (!course) notFound()

    const chapter = course.chapters.find(c => c.slug === params.chapterSlug)
    if (!chapter) notFound()

    const exam = await prisma.exam.findUnique({
      where: { chapterId: chapter.id },
      include: { questions: { orderBy: { order: 'asc' } } },
    })

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
          <h1 className="text-3xl font-black text-white mb-8">
            {chapter.title} — <span className="text-[#6C63FF]">თავის გამოცდა</span>
          </h1>
          {exam ? (
            <ExamClient
              examId={exam.id}
              title={exam.title}
              questions={exam.questions}
              timeLimit={exam.timeLimit}
              passMark={exam.passMark}
              chapterId={chapter.id}
              courseSlug={params.courseSlug}
              nextChapterSlug={course.chapters[course.chapters.indexOf(chapter) + 1]?.slug}
            />
          ) : (
            <div className="card p-8 text-center">
              <p className="text-[#8888AA]">გამოცდა ჯერ მომზადებულია.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch { notFound() }
}
