'use client'
import { useRouter } from 'next/navigation'
import { QuizPlayer } from './QuizPlayer'

interface Props {
  examId: string
  title: string
  questions: any[]
  timeLimit: number
  passMark: number
  chapterId: string
  courseSlug: string
  nextChapterSlug?: string
}

export function ExamClient({ examId, title, questions, timeLimit, passMark, chapterId, courseSlug, nextChapterSlug }: Props) {
  const router = useRouter()

  async function handleComplete(score: number, passed: boolean) {
    if (passed && nextChapterSlug) {
      setTimeout(() => {
        router.push(`/learn/${courseSlug}/${nextChapterSlug}/${questions[0]?.id || ''}`)
      }, 3000)
    }
  }

  return (
    <QuizPlayer
      quizId=""
      examId={examId}
      title={title}
      questions={questions}
      timeLimit={timeLimit}
      passMark={passMark}
      onComplete={handleComplete}
    />
  )
}
