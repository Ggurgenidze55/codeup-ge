export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { CheckCircle, Clock, BookOpen, Award, Lock, ChevronDown, ChevronRight, Star } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'დამწყები', INTERMEDIATE: 'საშუალო', ADVANCED: 'მოწინავე',
}

async function getCourse(slug: string) {
  try {
    return await prisma.course.findUnique({
      where: { slug },
      include: {
        chapters: {
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        },
      },
    })
  } catch { return null }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const course = await getCourse(params.slug)

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-6">🚧</div>
          <h1 className="text-4xl font-black text-white mb-4">კურსი მალე!</h1>
          <p className="text-[#8888AA] text-lg mb-8">ეს კურსი ჯერ მომზადების პროცესშია. გამოიწერე სიახლეები.</p>
          <Link href="/courses" className="btn-primary">← ყველა კურსი</Link>
        </div>
      </div>
    )
  }

  let hasPurchased = false
  if (session?.user) {
    try {
      const uc = await prisma.userCourse.findUnique({
        where: { userId_courseId: { userId: (session.user as any).id, courseId: course.id } },
      })
      hasPurchased = !!uc
    } catch {}
  }

  const totalLessons = course.chapters.reduce((acc, c) => acc + c.lessons.length, 0)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-[#6C63FF] bg-[#6C63FF]/10 px-3 py-1 rounded-full border border-[#6C63FF]/20">
                {LEVEL_LABELS[course.level]}
              </span>
              {course.language === 'ge' && (
                <span className="text-xs text-[#8888AA] bg-[#1A1A28] px-3 py-1 rounded-full border border-[#2A2A3C]">
                  🇬🇪 ქართულ ენაზე
                </span>
              )}
            </div>
            <h1 className="text-5xl font-black text-white mb-4 leading-tight">{course.title}</h1>
            <p className="text-[#8888AA] text-xl leading-relaxed mb-6">{course.description}</p>
            <div className="flex items-center gap-6 text-sm text-[#8888AA]">
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.chapters.length} თავი</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4" /> {totalLessons} გაკვეთილი</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4" /> სერტიფიკატი</span>
            </div>
          </div>

          {/* Purchase card */}
          <div className="card p-6 h-fit sticky top-24">
            <div className="text-4xl font-black text-white mb-2">
              {course.price === 0 ? 'უფასო' : `$${course.price}`}
            </div>
            {hasPurchased ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-4">
                  <CheckCircle className="w-5 h-5" /> კურსი შეძენილია
                </div>
                <Link href={`/learn/${course.slug}/${course.chapters[0]?.slug}/${course.chapters[0]?.lessons[0]?.slug}`}
                  className="btn-primary w-full text-center block">
                  სწავლის გაგრძელება →
                </Link>
              </div>
            ) : session?.user ? (
              <form action={`/api/payment/checkout`} method="POST">
                <input type="hidden" name="courseId" value={course.id} />
                <button type="submit" className="btn-primary w-full mb-3">
                  {course.price === 0 ? 'უფასოდ დაწყება' : 'შეძენა'}
                </button>
              </form>
            ) : (
              <Link href="/login" className="btn-primary w-full text-center block mb-3">
                შესვლა / რეგისტრაცია
              </Link>
            )}
            <ul className="space-y-2 mt-4">
              {['სიცოცხლის განმავლობაში წვდომა', 'სერტიფიკატი', 'სავარჯიშოები', 'პროგრეს-ტრეკინგი'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#8888AA]">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Syllabus */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6">სასწავლო გეგმა</h2>
          <div className="space-y-3">
            {course.chapters.map((chapter, ci) => (
              <div key={chapter.id} className="card overflow-hidden">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#6C63FF]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#6C63FF]">
                      {ci + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{chapter.title}</h3>
                      <p className="text-xs text-[#8888AA]">{chapter.lessons.length} გაკვეთილი</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#8888AA]" />
                </div>
                <div className="border-t border-[#2A2A3C]">
                  {chapter.lessons.map((lesson, li) => (
                    <div key={lesson.id} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-[#1A1A28] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border border-[#2A2A3C] flex items-center justify-center text-xs text-[#8888AA]">
                          {hasPurchased ? <ChevronRight className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        </div>
                        <span className="text-[#C0C0DD]">{lesson.title}</span>
                      </div>
                      <span className="text-[#8888AA] text-xs">{lesson.duration} წთ</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 px-5 py-3 text-sm border-t border-[#2A2A3C]/50">
                    <div className="w-6 h-6 rounded-full border border-[#6C63FF]/30 flex items-center justify-center text-xs text-[#6C63FF]">📝</div>
                    <span className="text-[#8888AA]">თავის გამოცდა</span>
                    <span className="text-xs text-[#6C63FF] ml-auto">70%+ საჭირო</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
