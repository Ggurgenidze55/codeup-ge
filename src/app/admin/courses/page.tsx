export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff } from 'lucide-react'

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/')

  let courses: any[] = []
  try {
    courses = await prisma.course.findMany({
      include: { chapters: { include: { lessons: true } }, _count: { select: { userCourses: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch {}

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white">კურსების მართვა</h1>
          <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> ახალი კურსი
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-[#8888AA] mb-4">კურსები ჯერ არ არის</p>
            <Link href="/admin/courses/new" className="btn-primary">+ შექმენი პირველი კურსი</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map(course => {
              const totalLessons = course.chapters.reduce((a: number, c: any) => a + c.lessons.length, 0)
              return (
                <div key={course.id} className="card p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{course.icon || '📚'}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{course.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${course.published ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                          {course.published ? 'გამოქვეყნებული' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-xs text-[#8888AA]">
                        {course.chapters.length} თავი • {totalLessons} გაკვეთილი • {course._count.userCourses} სტუდენტი • ${course.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/courses/${course.slug}`} className="text-[#8888AA] hover:text-white p-2 rounded-lg hover:bg-[#1A1A28]">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/courses/${course.id}/edit`} className="text-[#8888AA] hover:text-white p-2 rounded-lg hover:bg-[#1A1A28]">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
