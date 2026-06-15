'use client'
import { useRouter } from 'next/navigation'
import { QuizPlayer } from './QuizPlayer'

interface Props {
  examId: string
  courseId: string
  title: string
  questions: any[]
  timeLimit: number
  passMark: number
  courseSlug: string
}

export function FinalExamClient({ examId, courseId, title, questions, timeLimit, passMark, courseSlug }: Props) {
  const router = useRouter()

  async function handleComplete(score: number, passed: boolean) {
    if (passed) {
      await fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, score }),
      })
      setTimeout(() => router.push('/certificates'), 3000)
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
