export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Users, BookOpen, Award, DollarSign, Plus } from 'lucide-react'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/')

  let stats = { users: 0, courses: 0, certificates: 0 }
  try {
    const [users, courses, certificates] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.certificate.count(),
    ])
    stats = { users, courses, certificates }
  } catch {}

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white">ადმინ-პანელი</h1>
            <p className="text-[#8888AA]">Codeup.ge მართვის ცენტრი</p>
          </div>
          <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> ახალი კურსი
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: 'სტუდენტები', value: stats.users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { icon: BookOpen, label: 'კურსები', value: stats.courses, color: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10' },
            { icon: Award, label: 'სერტიფიკატები', value: stats.certificates, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            { icon: DollarSign, label: 'შემოსავალი', value: '$0', color: 'text-green-400', bg: 'bg-green-400/10' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-[#8888AA] text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/courses" className="card p-6 hover:border-[#6C63FF]/40 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-[#6C63FF]" />
              <h2 className="font-bold text-white text-lg group-hover:text-[#6C63FF] transition-colors">კურსების მართვა</h2>
            </div>
            <p className="text-[#8888AA] text-sm">კურსების, თავებისა და გაკვეთილების შექმნა/რედაქტირება</p>
          </Link>
          <Link href="/admin/users" className="card p-6 hover:border-[#6C63FF]/40 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-[#6C63FF]" />
              <h2 className="font-bold text-white text-lg group-hover:text-[#6C63FF] transition-colors">მომხმარებლების მართვა</h2>
            </div>
            <p className="text-[#8888AA] text-sm">სტუდენტების სია, პროგრესი და სერტიფიკატები</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
