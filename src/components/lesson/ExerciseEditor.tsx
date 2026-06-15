'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Lightbulb, Eye, RotateCcw, Volume2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSpeech } from '@/hooks/useSpeech'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  exerciseId: string
  task: string
  starterCode: string
  solution: string
  hints: string[]
  expectedOutput?: string | null
  language?: string
  onComplete?: () => void
}

export function ExerciseEditor({ exerciseId, task, starterCode, solution, hints, expectedOutput, language = 'html', onComplete }: Props) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [hintsShown, setHintsShown] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [checking, setChecking] = useState(false)
  const { speak } = useSpeech()

  useEffect(() => {
    const intro = `დავალება: ${task}`
    speak(intro)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function checkCode() {
    setChecking(true)
    await new Promise(r => setTimeout(r, 500))
    // Basic similarity check — normalize whitespace
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()
    const isCorrect = norm(code).includes(norm(solution.split('\n')[0].trim())) ||
      norm(code) === norm(solution) ||
      (expectedOutput ? norm(getPreviewText(code)).includes(norm(expectedOutput)) : false)

    setAttempts(a => a + 1)
    if (isCorrect) {
      setStatus('correct')
      setOutput('✅ ბრავო! კოდი სწორია!')
      onComplete?.()
      await fetch('/api/progress/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId }),
      })
    } else {
      setStatus('wrong')
      const newAttempts = attempts + 1
      if (newAttempts >= 3) {
        setOutput('❌ კიდევ სცადე. 3 მცდელობის შემდეგ ამოხსნა ხელმისაწვდომია.')
      } else {
        setOutput(`❌ არ არის სწორი. სცადე თავიდან! (${newAttempts}/3)`)
      }
    }
    setChecking(false)
  }

  function getPreviewText(html: string) {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  function showNextHint() {
    if (hintsShown < hints.length) {
      const nextHint = hints[hintsShown]
      setHintsShown(h => h + 1)
      if (nextHint) speak(`მინიშნება: ${nextHint}`)
    }
  }

  return (
    <div className="space-y-4">
      {/* Task */}
      <div className="card p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-[#6C63FF] rounded-full flex items-center justify-center text-xs">📝</span>
          დავალება
          <button
            onClick={() => speak(`დავალება: ${task}`)}
            title="დავალების მოსმენა"
            className="ml-auto w-7 h-7 rounded-lg bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-[#6C63FF] hover:bg-[#6C63FF]/20 flex items-center justify-center transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </h3>
        <p className="text-[#C0C0DD] text-sm leading-relaxed font-georgian">{task}</p>
        {expectedOutput && (
          <div className="mt-3 p-3 bg-[#0A0A0F] rounded-lg">
            <p className="text-xs text-[#8888AA] mb-1">მოსალოდნელი შედეგი:</p>
            <code className="text-green-400 text-sm">{expectedOutput}</code>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden border border-[#2A2A3C]">
        <div className="flex items-center justify-between px-4 py-2 bg-[#12121A] border-b border-[#2A2A3C]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-[#8888AA]">სავარჯიშო.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'css' ? 'css' : 'html'}</span>
          </div>
          <button onClick={() => { setCode(starterCode); setStatus('idle'); setOutput('') }} className="text-xs text-[#8888AA] hover:text-white flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> გაწმენდა
          </button>
        </div>
        <MonacoEditor
          height="280px"
          language={language}
          value={showSolution ? solution : code}
          onChange={v => { if (!showSolution) setCode(v || '') }}
          theme="vs-dark"
          options={{
            readOnly: showSolution,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Output */}
      {output && (
        <div className={`p-4 rounded-xl border text-sm font-georgian ${status === 'correct' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {output}
        </div>
      )}

      {/* Hints */}
      {hintsShown > 0 && (
        <div className="space-y-2">
          {hints.slice(0, hintsShown).map((hint, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-300 font-georgian">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span><strong>მინიშნება {i + 1}:</strong> {hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {status !== 'correct' && !showSolution && (
          <button onClick={checkCode} disabled={checking} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {checking ? 'მოწმდება...' : '✓ შეამოწმე'}
          </button>
        )}
        {hintsShown < hints.length && status !== 'correct' && (
          <button onClick={showNextHint} className="btn-secondary flex items-center gap-2 text-sm">
            <Lightbulb className="w-4 h-4" /> მინიშნება ({hintsShown}/{hints.length})
          </button>
        )}
        {attempts >= 3 && !showSolution && status !== 'correct' && (
          <button onClick={() => setShowSolution(true)} className="text-[#8888AA] hover:text-white text-sm flex items-center gap-1 transition-colors">
            <Eye className="w-4 h-4" /> ამოხსნის ნახვა
          </button>
        )}
        {showSolution && (
          <button onClick={() => setShowSolution(false)} className="text-[#6C63FF] hover:underline text-sm">
            ← დაბრუნება
          </button>
        )}
        {status === 'correct' && (
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <CheckCircle className="w-5 h-5" /> სავარჯიშო შესრულებულია!
          </div>
        )}
      </div>
    </div>
  )
}
