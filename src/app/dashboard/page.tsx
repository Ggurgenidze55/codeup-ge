export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { BookOpen, Award, Flame, Clock, ArrowRight, CheckCircle } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  const userId = (session.user as any).id

  let userCourses: any[] = []
  let certificates: any[] = []
  let user: any = null

  try {
    user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, streak: true, createdAt: true } })
    userCourses = await prisma.userCourse.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            chapters: { include: { lessons: true } },
          },
        },
      },
    })
    certificates = await prisma.certificate.findMany({
      where: { userId },
      include: { course: true },
    })
  } catch {}

  const totalLessons = userCourses.reduce((acc, uc) =>
    acc + uc.course.chapters.reduce((a: number, c: any) => a + c.lessons.length, 0), 0)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">
            გამარჯობა, {user?.name?.split(' ')[0] || 'სტუდენტო'}! 👋
          </h1>
          <p className="text-[#8888AA] text-lg">შენი სწავლის პროგრესი</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen, label: 'კურსები', value: userCourses.length, color: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10' },
            { icon: Flame, label: 'სტრიკი', value: `${user?.streak || 0} დღე`, color: 'text-orange-400', bg: 'bg-orange-400/10' },
            { icon: Award, label: 'სერტიფიკატი', value: certificates.length, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            { icon: CheckCircle, label: 'გაკვეთილები', value: totalLessons, color: 'text-green-400', bg: 'bg-green-400/10' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[#8888AA] text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <h2 className="text-2xl font-black text-white mb-6">ჩემი კურსები</h2>
        {userCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {userCourses.map(uc => {
              const totalL = uc.course.chapters.reduce((a: number, c: any) => a + c.lessons.length, 0)
              const firstChapter = uc.course.chapters[0]
              const firstLesson = firstChapter?.lessons[0]
              return (
                <div key={uc.id} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{uc.course.icon || '📚'}</div>
                    <div>
                      <h3 className="font-bold text-white">{uc.course.title}</h3>
                      <p className="text-xs text-[#8888AA]">{uc.course.chapters.length} თავი • {totalL} გაკვეთილი</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-[#8888AA] mb-1">
                      <span>პროგრესი</span>
                      <span>{Math.round(uc.progress)}%</span>
                    </div>
                    <div className="w-full bg-[#2A2A3C] rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#6C63FF] transition-all" style={{ width: `${uc.progress}%` }} />
                    </div>
                  </div>
                  {firstChapter && firstLesson && (
                    <Link
                      href={`/learn/${uc.course.slug}/${firstChapter.slug}/${firstLesson.slug}`}
                      className="flex items-center gap-2 text-[#6C63FF] text-sm font-medium hover:underline"
                    >
                      გაგრძელება <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card p-12 text-center mb-12">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">კურსები ჯერ არ შეგიძენია</h3>
            <p className="text-[#8888AA] mb-6">დაიწყე სწავლა ქართულ ენაზე</p>
            <Link href="/courses" className="btn-primary">კურსების ნახვა</Link>
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <>
            <h2 className="text-2xl font-black text-white mb-6">სერტიფიკატები</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="card p-6 border-[#6C63FF]/20 bg-gradient-to-br from-[#6C63FF]/5 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center">
                      <Award className="w-8 h-8 text-[#6C63FF]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{cert.course.title}</h3>
                      <p className="text-[#8888AA] text-sm">ქულა: {cert.score.toFixed(0)}%</p>
                      <p className="text-[#8888AA] text-xs">{new Date(cert.issuedAt).toLocaleDateString('ka-GE')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
