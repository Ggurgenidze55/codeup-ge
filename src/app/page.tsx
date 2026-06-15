export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ArrowRight, Code2, BookOpen, Award, Users, Star, CheckCircle, Zap, Globe, Lock } from 'lucide-react'
import prisma from '@/lib/prisma'

async function getCourses() {
  try {
    return await prisma.course.findMany({
      where: { published: true },
      include: { chapters: { include: { lessons: true } } },
      orderBy: { createdAt: 'asc' },
    })
  } catch { return [] }
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'დამწყები',
  INTERMEDIATE: 'საშუალო',
  ADVANCED: 'მოწინავე',
}

const STATS = [
  { label: 'სტუდენტი', value: '2,500+' },
  { label: 'კურსი', value: '8' },
  { label: 'გაკვეთილი', value: '200+' },
  { label: 'სერტიფიკატი', value: '500+' },
]

const FEATURES = [
  { icon: Code2, title: 'ინტერაქტიული გაკვეთილები', desc: 'კოდი იწერება ანიმაციურად — ნახე, გაიგე, ისავარჯიშე' },
  { icon: BookOpen, title: 'სტრუქტურირებული კურსები', desc: 'თავებად, გაკვეთილებად და გამოცდებად დაყოფილი შინაარსი' },
  { icon: Award, title: 'სერტიფიკატები', desc: 'კურსის დასრულების შემდეგ მიიღე ოფიციალური სერტიფიკატი' },
  { icon: Globe, title: 'ქართულ ენაზე', desc: '100% ქართული ახსნა-განმარტება და კონტენტი' },
  { icon: Zap, title: 'სავარჯიშოები', desc: 'თითოეული გაკვეთილის შემდეგ პრაქტიკული დავალება' },
  { icon: Lock, title: 'პროგრეს-ტრეკინგი', desc: 'ნახე შენი წინსვლა ყველა კურსში ერთ ადგილზე' },
]

export default async function HomePage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6C63FF]/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6C63FF]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#6C63FF]/10 border border-[#6C63FF]/20 rounded-full px-4 py-2 text-sm text-[#6C63FF] mb-6">
            <Star className="w-4 h-4" fill="currentColor" />
            საქართველოს #1 პროგრამირების პლატფორმა
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            ისწავლე კოდი
            <br />
            <span className="text-[#6C63FF]">ქართულ ენაზე</span>
          </h1>
          <p className="text-xl text-[#8888AA] mb-10 max-w-2xl mx-auto leading-relaxed">
            ინტერაქტიული გაკვეთილები, სავარჯიშოები და სერტიფიკატები — ყველაფერი ერთ ადგილზე, ქართულ ენაზე
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="btn-primary flex items-center justify-center gap-2 text-lg py-4 px-8">
              კურსების ნახვა <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/register" className="btn-secondary flex items-center justify-center gap-2 text-lg py-4 px-8">
              უფასო რეგისტრაცია
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-[#2A2A3C]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black text-white">{s.value}</div>
              <div className="text-[#8888AA] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">კურსები</h2>
            <p className="text-[#8888AA] text-lg">აირჩიე შენი გზა პროგრამირებაში</p>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {PLACEHOLDER_COURSES.map(c => <PlaceholderCourseCard key={c.slug} course={c} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/courses" className="btn-secondary inline-flex items-center gap-2">
              ყველა კურსის ნახვა <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[#0D0D17]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">რატომ Codeup.ge?</h2>
            <p className="text-[#8888AA] text-lg">სწავლის ყველაზე ეფექტური გზა</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 hover:border-[#6C63FF]/40 transition-all duration-300">
                <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-[#6C63FF]" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-[#8888AA] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            დაიწყე სწავლა <span className="text-[#6C63FF]">დღესვე</span>
          </h2>
          <p className="text-[#8888AA] text-xl mb-10">
            შეუერთდი ათასობით სტუდენტს, ვინც უკვე სწავლობს Codeup.ge-ზე
          </p>
          <Link href="/register" className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2">
            უფასოდ დაწყება <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A3C] py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 bg-[#6C63FF] rounded-lg flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white">Codeup<span className="text-[#6C63FF]">.ge</span></span>
          </div>
          <p className="text-[#8888AA] text-sm">© 2024 Codeup.ge — ყველა უფლება დაცულია</p>
          <div className="flex gap-4 text-sm text-[#8888AA]">
            <Link href="/privacy" className="hover:text-white">კონფიდენციალურობა</Link>
            <Link href="/terms" className="hover:text-white">პირობები</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const PLACEHOLDER_COURSES = [
  { slug: 'html-css', title: 'HTML & CSS', icon: '🌐', color: '#E44D26', level: 'BEGINNER', price: 49, desc: 'ვებ-განვითარების საფუძვლები', chapters: 6, lessons: 24 },
  { slug: 'javascript', title: 'JavaScript', icon: '⚡', color: '#F7DF1E', level: 'BEGINNER', price: 69, desc: 'სრული JavaScript-ის კურსი', chapters: 8, lessons: 32 },
  { slug: 'python', title: 'Python', icon: '🐍', color: '#3776AB', level: 'BEGINNER', price: 69, desc: 'პროგრამირების ძირითადი ენა', chapters: 7, lessons: 28 },
  { slug: 'react', title: 'React', icon: '⚛️', color: '#61DAFB', level: 'INTERMEDIATE', price: 89, desc: 'მოდერნული UI განვითარება', chapters: 8, lessons: 32 },
  { slug: 'nodejs', title: 'Node.js', icon: '🟢', color: '#339933', level: 'INTERMEDIATE', price: 79, desc: 'სერვერ-საიდ JavaScript', chapters: 7, lessons: 28 },
  { slug: 'typescript', title: 'TypeScript', icon: '🔷', color: '#3178C6', level: 'INTERMEDIATE', price: 79, desc: 'ტიპიზებული JavaScript', chapters: 6, lessons: 24 },
  { slug: 'git', title: 'Git & GitHub', icon: '📦', color: '#F05032', level: 'BEGINNER', price: 39, desc: 'ვერსიების კონტროლი', chapters: 5, lessons: 20 },
  { slug: 'sql', title: 'SQL & Databases', icon: '🗄️', color: '#4479A1', level: 'INTERMEDIATE', price: 69, desc: 'მონაცემთა ბაზები', chapters: 7, lessons: 28 },
]

function PlaceholderCourseCard({ course }: { course: typeof PLACEHOLDER_COURSES[0] }) {
  return (
    <Link href={`/courses/${course.slug}`} className="card p-6 hover:border-[#6C63FF]/40 hover:bg-[#12121A] transition-all duration-300 group block">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: course.color + '20' }}>
        {course.icon}
      </div>
      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#6C63FF] transition-colors">{course.title}</h3>
      <p className="text-[#8888AA] text-sm mb-4">{course.desc}</p>
      <div className="flex items-center justify-between text-xs text-[#8888AA]">
        <span>{course.chapters} თავი • {course.lessons} გაკვეთილი</span>
        <span className="bg-[#6C63FF]/10 text-[#6C63FF] px-2 py-1 rounded">{LEVEL_LABELS[course.level]}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-[#2A2A3C] flex items-center justify-between">
        <span className="text-white font-bold text-lg">${course.price}</span>
        <span className="text-[#6C63FF] text-sm font-medium group-hover:underline">დაწყება →</span>
      </div>
    </Link>
  )
}

function CourseCard({ course }: { course: any }) {
  const totalLessons = course.chapters.reduce((acc: number, c: any) => acc + c.lessons.length, 0)
  return (
    <Link href={`/courses/${course.slug}`} className="card p-6 hover:border-[#6C63FF]/40 transition-all duration-300 group block">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: (course.color || '#6C63FF') + '20' }}>
        {course.icon || '📚'}
      </div>
      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#6C63FF] transition-colors">{course.title}</h3>
      <p className="text-[#8888AA] text-sm mb-4 line-clamp-2">{course.description}</p>
      <div className="flex items-center justify-between text-xs text-[#8888AA]">
        <span>{course.chapters.length} თავი • {totalLessons} გაკვეთილი</span>
        <span className="bg-[#6C63FF]/10 text-[#6C63FF] px-2 py-1 rounded">{LEVEL_LABELS[course.level]}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-[#2A2A3C] flex items-center justify-between">
        <span className="text-white font-bold text-lg">{course.price === 0 ? 'უფასო' : `$${course.price}`}</span>
        <span className="text-[#6C63FF] text-sm font-medium group-hover:underline">დაწყება →</span>
      </div>
    </Link>
  )
}
