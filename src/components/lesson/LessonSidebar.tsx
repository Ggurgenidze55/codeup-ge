'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckCircle, Lock, Play, FileText, ClipboardList, Trophy, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Lesson { id: string; title: string; slug: string; order: number }
interface Chapter { id: string; title: string; slug: string; order: number; lessons: Lesson[] }
interface Props {
  courseSlug: string
  courseTitle: string
  chapters: Chapter[]
  completedLessons: string[]
  passedExams: string[]
  hasFinalExam: boolean
}

export function LessonSidebar({ courseSlug, courseTitle, chapters, completedLessons, passedExams, hasFinalExam }: Props) {
  const path = usePathname()
  const [expanded, setExpanded] = useState<string[]>(chapters.map(c => c.id))

  function toggle(id: string) {
    setExpanded(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id])
  }

  return (
    <aside className="w-72 shrink-0 bg-[#0D0D17] border-r border-[#2A2A3C] h-screen overflow-y-auto fixed top-16 left-0 pt-4 pb-20">
      <div className="px-4 mb-4">
        <Link href={`/courses/${courseSlug}`} className="text-xs text-[#8888AA] hover:text-white transition-colors">
          ← {courseTitle}
        </Link>
      </div>

      {chapters.map(chapter => {
        const isExpanded = expanded.includes(chapter.id)
        const allDone = chapter.lessons.every(l => completedLessons.includes(l.id))
        const examPassed = passedExams.includes(chapter.id)

        return (
          <div key={chapter.id} className="mb-1">
            <button
              onClick={() => toggle(chapter.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1A1A28] transition-colors group"
            >
              <div className="flex items-center gap-2">
                {allDone && examPassed
                  ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  : <div className="w-4 h-4 rounded-full border border-[#2A2A3C] shrink-0" />}
                <span className="text-sm font-medium text-white line-clamp-1">{chapter.title}</span>
              </div>
              {isExpanded ? <ChevronDown className="w-4 h-4 text-[#8888AA] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[#8888AA] shrink-0" />}
            </button>

            {isExpanded && (
              <div className="pl-4 border-l border-[#2A2A3C] ml-6 mb-2">
                {chapter.lessons.map(lesson => {
                  const lessonPath = `/learn/${courseSlug}/${chapter.slug}/${lesson.slug}`
                  const isActive = path === lessonPath
                  const isDone = completedLessons.includes(lesson.id)

                  return (
                    <div key={lesson.id}>
                      <Link
                        href={lessonPath}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 my-0.5',
                          isActive ? 'bg-[#6C63FF]/10 text-[#6C63FF]' : 'text-[#8888AA] hover:text-white hover:bg-[#1A1A28]',
                        )}
                      >
                        {isDone
                          ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                          : <Play className="w-4 h-4 shrink-0" />}
                        <span className="line-clamp-1">{lesson.title}</span>
                      </Link>
                    </div>
                  )
                })}

                {/* Practice */}
                <Link
                  href={`/learn/${courseSlug}/${chapter.slug}/practice`}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 my-0.5',
                    path === `/learn/${courseSlug}/${chapter.slug}/practice`
                      ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                      : 'text-[#8888AA] hover:text-white hover:bg-[#1A1A28]',
                  )}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>სავარჯიშო</span>
                </Link>

                {/* Chapter exam */}
                <Link
                  href={`/learn/${courseSlug}/${chapter.slug}/exam`}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 my-0.5',
                    path === `/learn/${courseSlug}/${chapter.slug}/exam`
                      ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                      : examPassed ? 'text-green-400 hover:bg-[#1A1A28]' : 'text-[#8888AA] hover:text-white hover:bg-[#1A1A28]',
                  )}
                >
                  {examPassed
                    ? <CheckCircle className="w-4 h-4 shrink-0" />
                    : allDone ? <ClipboardList className="w-4 h-4 shrink-0" /> : <Lock className="w-4 h-4 shrink-0" />}
                  <span>თავის გამოცდა</span>
                  {examPassed && <span className="ml-auto text-xs text-green-400">✓</span>}
                </Link>
              </div>
            )}
          </div>
        )
      })}

      {/* Final exam */}
      {hasFinalExam && (
        <div className="px-4 mt-4 pt-4 border-t border-[#2A2A3C]">
          <Link
            href={`/learn/${courseSlug}/final-exam`}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
              path === `/learn/${courseSlug}/final-exam`
                ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                : 'text-[#8888AA] hover:text-white hover:bg-[#1A1A28]'
            )}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span className="font-medium">საბოლოო გამოცდა</span>
          </Link>
        </div>
      )}
    </aside>
  )
}
