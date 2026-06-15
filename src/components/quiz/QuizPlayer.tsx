'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Trophy, ArrowRight, AlertCircle } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string | null
}

interface Props {
  quizId: string
  examId?: string
  title: string
  questions: Question[]
  timeLimit: number // minutes
  passMark?: number // percent (for exams)
  onComplete: (score: number, passed: boolean) => void
}

export function QuizPlayer({ quizId, examId, title, questions, timeLimit, passMark = 0, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (finished) return
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); finishQuiz([...answers]); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [finished, answers])

  function handleSelect(idx: number) {
    if (showFeedback) return
    setSelected(idx)
  }

  function handleConfirm() {
    if (selected === null) return
    setShowFeedback(true)
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    if (current === questions.length - 1) {
      setTimeout(() => finishQuiz(newAnswers), 1200)
    }
  }

  function handleNext() {
    setShowFeedback(false)
    setSelected(null)
    setCurrent(c => c + 1)
  }

  async function finishQuiz(finalAnswers: number[]) {
    const correct = finalAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length
    const pct = (correct / questions.length) * 100
    const passed = pct >= passMark
    setScore(pct)
    setFinished(true)
    setSubmitting(true)
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, examId, answers: finalAnswers, score: pct, passed }),
      })
    } catch {}
    setSubmitting(false)
    onComplete(pct, passed)
  }

  const q = questions[current]
  const isCorrect = selected === q?.correctAnswer

  if (finished) {
    const passed = score >= passMark
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <div className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6',
          passed ? 'bg-green-500/10' : 'bg-red-500/10'
        )}>
          {passed ? <Trophy className="w-10 h-10 text-green-400" /> : <AlertCircle className="w-10 h-10 text-red-400" />}
        </div>
        <h2 className="text-2xl font-black text-white mb-2">{passed ? 'გილოცავ! 🎉' : 'სცადე თავიდან'}</h2>
        <p className="text-[#8888AA] mb-6">
          {passed ? 'წარმატებით ჩააბარე!' : `საჭიროა ${passMark}%, შენ მოიპოვე ${score.toFixed(0)}%`}
        </p>
        <div className="text-6xl font-black mb-2" style={{ color: passed ? '#22c55e' : '#ef4444' }}>
          {score.toFixed(0)}%
        </div>
        <p className="text-[#8888AA] text-sm mb-8">
          {answers.filter((a, i) => a === questions[i]?.correctAnswer).length} / {questions.length} სწორი პასუხი
        </p>
        {/* Score breakdown */}
        <div className="w-full bg-[#2A2A3C] rounded-full h-3 mb-8">
          <div
            className="h-3 rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, background: passed ? '#22c55e' : '#ef4444' }}
          />
        </div>
        <div className="space-y-2 text-left max-h-64 overflow-y-auto">
          {questions.map((q, i) => (
            <div key={q.id} className={cn(
              'flex items-start gap-3 p-3 rounded-lg text-sm',
              answers[i] === q.correctAnswer ? 'bg-green-500/10' : 'bg-red-500/10'
            )}>
              {answers[i] === q.correctAnswer
                ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
              <span className="text-[#C0C0DD] line-clamp-2">{q.text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-white">{title}</h2>
          <p className="text-[#8888AA] text-sm">{current + 1} / {questions.length}</p>
        </div>
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm font-bold',
          timeLeft < 60 ? 'bg-red-500/10 text-red-400' : 'bg-[#1A1A28] text-[#8888AA]'
        )}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-[#2A2A3C] rounded-full h-1.5 mb-8">
        <div
          className="h-1.5 rounded-full bg-[#6C63FF] transition-all"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card p-6 mb-6">
        <p className="text-white text-lg font-medium leading-relaxed font-georgian">{q.text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          let variant = 'default'
          if (showFeedback) {
            if (i === q.correctAnswer) variant = 'correct'
            else if (i === selected) variant = 'wrong'
          } else if (i === selected) {
            variant = 'selected'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all duration-200 font-georgian',
                variant === 'default' && 'bg-[#12121A] border-[#2A2A3C] text-[#C0C0DD] hover:border-[#6C63FF]/50 hover:bg-[#1A1A28]',
                variant === 'selected' && 'bg-[#6C63FF]/10 border-[#6C63FF] text-white',
                variant === 'correct' && 'bg-green-500/10 border-green-500 text-green-400',
                variant === 'wrong' && 'bg-red-500/10 border-red-500 text-red-400',
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                  variant === 'default' && 'bg-[#2A2A3C] text-[#8888AA]',
                  variant === 'selected' && 'bg-[#6C63FF] text-white',
                  variant === 'correct' && 'bg-green-500 text-white',
                  variant === 'wrong' && 'bg-red-500 text-white',
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {showFeedback && i === q.correctAnswer && <CheckCircle className="w-5 h-5 ml-auto text-green-400" />}
                {showFeedback && i === selected && i !== q.correctAnswer && <XCircle className="w-5 h-5 ml-auto text-red-400" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Explanation feedback */}
      {showFeedback && q.explanation && (
        <div className={cn(
          'p-4 rounded-xl mb-6 text-sm font-georgian',
          isCorrect ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-red-500/10 border border-red-500/20 text-red-300'
        )}>
          <strong>{isCorrect ? '✓ სწორია! ' : '✗ არასწორია. '}</strong>
          {q.explanation}
        </div>
      )}

      {/* Action button */}
      {!showFeedback ? (
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          className="w-full btn-primary py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          დადასტურება
        </button>
      ) : current < questions.length - 1 ? (
        <button onClick={handleNext} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
          შემდეგი კითხვა <ArrowRight className="w-5 h-5" />
        </button>
      ) : (
        <button disabled className="w-full btn-primary py-3 opacity-50">
          დასრულება...
        </button>
      )}
    </div>
  )
}
