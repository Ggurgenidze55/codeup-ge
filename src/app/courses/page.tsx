export const dynamic = 'force-dynamic'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { BookOpen, Clock, Star } from 'lucide-react'

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'დამწყები', INTERMEDIATE: 'საშუალო', ADVANCED: 'მოწინავე',
}
const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'text-green-400 bg-green-400/10',
  INTERMEDIATE: 'text-yellow-400 bg-yellow-400/10',
  ADVANCED: 'text-red-400 bg-red-400/10',
}

const PLACEHOLDER_COURSES = [
  { slug: 'html-css', title: 'HTML & CSS', icon: '🌐', color: '#E44D26', level: 'BEGINNER', price: 49, description: 'ვებ-განვითარების საფუძვლები — HTML სტრუქტურა, CSS სტილები, Flexbox, Grid და რეაგირებადი დიზაინი', chapters: 6, lessons: 24, duration: '12 საათი' },
  { slug: 'javascript', title: 'JavaScript', icon: '⚡', color: '#F7DF1E', level: 'BEGINNER', price: 69, description: 'სრული JavaScript-ის კურსი — ცვლადები, ფუნქციები, DOM, Async/Await, ES6+', chapters: 8, lessons: 32, duration: '20 საათი' },
  { slug: 'python', title: 'Python', icon: '🐍', color: '#3776AB', level: 'BEGINNER', price: 69, description: 'პითონი დამწყებებისთვის — სინტაქსი, ფუნქციები, OOP, ფაილები, ბიბლიოთეკები', chapters: 7, lessons: 28, duration: '18 საათი' },
  { slug: 'react', title: 'React', icon: '⚛️', color: '#61DAFB', level: 'INTERMEDIATE', price: 89, description: 'React-ის სრული კურსი — Components, Hooks, State Management, Router, Next.js', chapters: 8, lessons: 32, duration: '25 საათი' },
  { slug: 'nodejs', title: 'Node.js', icon: '🟢', color: '#339933', level: 'INTERMEDIATE', price: 79, description: 'სერვერ-საიდ JavaScript — Express, REST API, Database, Authentication', chapters: 7, lessons: 28, duration: '22 საათი' },
  { slug: 'typescript', title: 'TypeScript', icon: '🔷', color: '#3178C6', level: 'INTERMEDIATE', price: 79, description: 'ტიპიზებული JavaScript — Types, Interfaces, Generics, React + TypeScript', chapters: 6, lessons: 24, duration: '16 საათი' },
  { slug: 'git', title: 'Git & GitHub', icon: '📦', color: '#F05032', level: 'BEGINNER', price: 39, description: 'ვერსიების კონტროლი — Git basics, branching, merging, GitHub, CI/CD', chapters: 5, lessons: 20, duration: '8 საათი' },
  { slug: 'sql', title: 'SQL & Databases', icon: '🗄️', color: '#4479A1', level: 'INTERMEDIATE', price: 69, description: 'მონაცემთა ბაზები — SQL queries, Joins, Indexes, PostgreSQL, Prisma', chapters: 7, lessons: 28, duration: '18 საათი' },
]

async function getCourses() {
  try {
    return await prisma.course.findMany({
      where: { published: true },
      include: { chapters: { include: { lessons: true } } },
      orderBy: { createdAt: 'asc' },
    })
  } catch { return null }
}

export default async function CoursesPage() {
  const dbCourses = await getCourses()
  const courses = dbCourses?.length ? dbCourses : null

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">ყველა კურსი</h1>
          <p className="text-[#8888AA] text-xl">8 კომპლექსური კურსი ქართულ ენაზე</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses
            ? courses.map((c: any) => {
                const totalLessons = c.chapters.reduce((acc: number, ch: any) => acc + ch.lessons.length, 0)
                return (
                  <CourseCard key={c.id} slug={c.slug} title={c.title} icon={c.icon || '📚'} color={c.color || '#6C63FF'}
                    level={c.level} price={c.price} description={c.description}
                    chapters={c.chapters.length} lessons={totalLessons} duration="" />
                )
              })
            : PLACEHOLDER_COURSES.map(c => <CourseCard key={c.slug} {...c} />)
          }
        </div>
      </div>
    </div>
  )
}

function CourseCard({ slug, title, icon, color, level, price, description, chapters, lessons, duration }: any) {
  return (
    <Link href={`/courses/${slug}`} className="card p-6 hover:border-[#6C63FF]/40 hover:-translate-y-1 transition-all duration-300 group block">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5" style={{ background: color + '20', border: `1px solid ${color}30` }}>
        {icon}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[level]}`}>
          {LEVEL_LABELS[level]}
        </span>
      </div>
      <h3 className="font-bold text-white text-xl mb-2 group-hover:text-[#6C63FF] transition-colors">{title}</h3>
      <p className="text-[#8888AA] text-sm mb-5 line-clamp-3 leading-relaxed">{description}</p>
      <div className="flex items-center gap-4 text-xs text-[#8888AA] mb-5">
        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {chapters} თავი</span>
        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {lessons} გაკვეთილი</span>
        {duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {duration}</span>}
      </div>
      <div className="pt-4 border-t border-[#2A2A3C] flex items-center justify-between">
        <span className="text-white font-black text-2xl">{price === 0 ? 'უფასო' : `$${price}`}</span>
        <span className="text-sm font-medium text-[#6C63FF] group-hover:underline">დეტალები →</span>
      </div>
    </Link>
  )
}
