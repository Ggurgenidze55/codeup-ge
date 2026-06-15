export const dynamic = 'force-dynamic'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { LessonSidebar } from '@/components/lesson/LessonSidebar'
import { ExerciseEditor } from '@/components/lesson/ExerciseEditor'

export default async function PracticePage({ params }: { params: { courseSlug: string; chapterSlug: string } }) {
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

    const exercises = await prisma.exercise.findMany({
      where: { lesson: { chapterId: chapter.id } },
      include: { lesson: true },
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
            {chapter.title} — <span className="text-[#6C63FF]">სავარჯიშოები</span>
          </h1>
          {exercises.length > 0 ? (
            <div className="space-y-12">
              {exercises.map((ex, i) => (
                <div key={ex.id}>
                  <h2 className="text-lg font-bold text-white mb-4">სავარჯიშო {i + 1}: {ex.lesson.title}</h2>
                  <ExerciseEditor
                    exerciseId={ex.id}
                    task={ex.task}
                    starterCode={ex.starterCode}
                    solution={ex.solution}
                    hints={ex.hints}
                    expectedOutput={ex.expectedOutput}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-[#8888AA]">სავარჯიშოები მომზადებაშია.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch { notFound() }
}
