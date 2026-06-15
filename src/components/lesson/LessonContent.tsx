'use client'
import { useState } from 'react'
import { CodePlayer } from './CodePlayer'
import { ExerciseEditor } from './ExerciseEditor'
import { QuizPlayer } from '../quiz/QuizPlayer'
import { CheckCircle, BookOpen, Code, ClipboardList, ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Tab = 'lesson' | 'exercise' | 'quiz'

interface Props {
  lesson: any
  courseSlug: string
  chapterSlug: string
  chapter: any
  completedLessons: string[]
}

export function LessonContent({ lesson, courseSlug, chapterSlug, chapter, completedLessons }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('lesson')
  const [lessonDone, setLessonDone] = useState(completedLessons.includes(lesson.id))
  const [exerciseDone, setExerciseDone] = useState(false)
  const [quizDone, setQuizDone] = useState(false)
  const [marking, setMarking] = useState(false)

  async function markLessonComplete() {
    setMarking(true)
    try {
      await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id }),
      })
      setLessonDone(true)
    } catch {}
    setMarking(false)
  }

  const codeScript = lesson.codeScript as any[] | null
  const allTabs: { id: Tab; label: string; icon: any; available: boolean }[] = [
    { id: 'lesson' as Tab, label: 'გაკვეთილი', icon: BookOpen, available: true },
    { id: 'exercise' as Tab, label: 'სავარჯიშო', icon: Code, available: !!lesson.exercise },
    { id: 'quiz' as Tab, label: 'მინი-ტესტი', icon: ClipboardList, available: !!lesson.quiz },
  ]
  const tabs = allTabs.filter(t => t.available)

  return (
    <div>
      {/* Title */}
      <div className="flex items-center gap-2 text-sm text-[#8888AA] mb-4">
        <span>{chapter.title}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">{lesson.title}</span>
      </div>
      <h1 className="text-3xl font-black text-white mb-6">{lesson.title}</h1>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex items-center gap-1 bg-[#12121A] border border-[#2A2A3C] rounded-xl p-1 mb-8 w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-[#6C63FF] text-white' : 'text-[#8888AA] hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.id === 'lesson' && lessonDone && <CheckCircle className="w-3 h-3 text-green-400" />}
              {t.id === 'exercise' && exerciseDone && <CheckCircle className="w-3 h-3 text-green-400" />}
              {t.id === 'quiz' && quizDone && <CheckCircle className="w-3 h-3 text-green-400" />}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {tab === 'lesson' && (
        <div className="space-y-8">
          {codeScript && codeScript.length > 0 ? (
            <CodePlayer
              steps={codeScript}
              language={chapter.courseId ? 'html' : 'javascript'}
              onComplete={markLessonComplete}
            />
          ) : (
            <div className="card p-8">
              <p className="text-[#C0C0DD] leading-relaxed text-lg font-georgian">
                {lesson.explanation || 'გაკვეთილის შინაარსი მოკლებულია.'}
              </p>
            </div>
          )}

          {!lessonDone && (
            <button onClick={markLessonComplete} disabled={marking} className="btn-secondary flex items-center gap-2">
              {marking ? 'ინიშნება...' : '✓ გავიარე ეს გაკვეთილი'}
            </button>
          )}

          {lessonDone && (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <CheckCircle className="w-5 h-5" /> გაკვეთილი დასრულებულია
              </div>
              {lesson.exercise && (
                <button onClick={() => setTab('exercise')} className="btn-primary flex items-center gap-2">
                  სავარჯიშოს შესრულება <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'exercise' && lesson.exercise && (
        <ExerciseEditor
          exerciseId={lesson.exercise.id}
          task={lesson.exercise.task}
          starterCode={lesson.exercise.starterCode}
          solution={lesson.exercise.solution}
          hints={lesson.exercise.hints}
          expectedOutput={lesson.exercise.expectedOutput}
          onComplete={() => {
            setExerciseDone(true)
            if (lesson.quiz) setTimeout(() => setTab('quiz'), 1500)
          }}
        />
      )}

      {tab === 'quiz' && lesson.quiz && (
        <QuizPlayer
          quizId={lesson.quiz.id}
          title={`${lesson.title} — მინი-ტესტი`}
          questions={lesson.quiz.questions}
          timeLimit={lesson.quiz.timeLimit}
          onComplete={(score, passed) => {
            setQuizDone(true)
          }}
        />
      )}
    </div>
  )
}
