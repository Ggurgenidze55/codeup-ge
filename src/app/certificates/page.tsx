export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Award, Download, Calendar } from 'lucide-react'

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  const userId = (session.user as any).id

  let certificates: any[] = []
  let user: any = null
  try {
    user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
    certificates = await prisma.certificate.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { issuedAt: 'desc' },
    })
  } catch {}

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-2">სერტიფიკატები</h1>
        <p className="text-[#8888AA] mb-10">შენ მიერ მიღებული სერტიფიკატები</p>

        {certificates.length === 0 ? (
          <div className="card p-16 text-center">
            <Award className="w-16 h-16 text-[#6C63FF]/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">სერტიფიკატი ჯერ არ გაქვს</h2>
            <p className="text-[#8888AA]">გაიარე კურსი და ჩააბარე საბოლოო გამოცდა სერტიფიკატის მისაღებად</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map(cert => (
              <div key={cert.id} className="card p-8 border-[#6C63FF]/20 bg-gradient-to-br from-[#6C63FF]/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C63FF]/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center">
                    <Award className="w-9 h-9 text-[#6C63FF]" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#6C63FF]">{cert.score.toFixed(0)}%</div>
                    <div className="text-xs text-[#8888AA]">საბოლოო ქულა</div>
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-1">{cert.course.title}</h3>
                <p className="text-[#8888AA] text-sm mb-1">სერტიფიკატი გაცემულია:</p>
                <div className="flex items-center gap-2 text-[#8888AA] text-sm mb-6">
                  <Calendar className="w-4 h-4" />
                  {new Date(cert.issuedAt).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="border-t border-[#2A2A3C]/50 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8888AA]">გაიცა:</p>
                    <p className="font-medium text-white">{user?.name || session.user?.name}</p>
                  </div>
                  <button className="flex items-center gap-2 text-[#6C63FF] hover:underline text-sm font-medium">
                    <Download className="w-4 h-4" /> გადმოწერა
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
