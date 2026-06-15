'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export interface CodeStep {
  code: string
  explanation: string
  language?: string
}

interface Props {
  steps: CodeStep[]
  language?: string
  onComplete?: () => void
}

const SPEEDS = [0.5, 1, 1.5, 2]

export function CodePlayer({ steps, language = 'html', onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [explanation, setExplanation] = useState(steps[0]?.explanation || '')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentCode = steps[stepIndex]?.code || ''

  const clearTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  const tick = useCallback(() => {
    setCharIndex(prev => {
      const next = prev + 1
      if (next <= currentCode.length) {
        setDisplayedCode(currentCode.slice(0, next))
        return next
      }
      // step done
      clearTimer()
      if (stepIndex < steps.length - 1) {
        setTimeout(() => {
          setStepIndex(si => si + 1)
          setCharIndex(0)
          setDisplayedCode('')
          setExplanation(steps[stepIndex + 1]?.explanation || '')
          setIsPlaying(true)
        }, 600)
      } else {
        setIsPlaying(false)
        setCompleted(true)
        onComplete?.()
      }
      return prev
    })
  }, [currentCode, stepIndex, steps, clearTimer, onComplete])

  useEffect(() => {
    if (isPlaying) {
      clearTimer()
      const delay = Math.max(20, Math.round(50 / speed))
      intervalRef.current = setInterval(tick, delay)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [isPlaying, speed, tick, clearTimer])

  function restart() {
    clearTimer()
    setStepIndex(0)
    setCharIndex(0)
    setDisplayedCode('')
    setCompleted(false)
    setIsPlaying(false)
    setExplanation(steps[0]?.explanation || '')
  }

  function togglePlay() {
    if (completed) restart()
    else setIsPlaying(p => !p)
  }

  const progress = steps.length > 0 ? ((stepIndex / steps.length) + (charIndex / Math.max(1, currentCode.length)) / steps.length) * 100 : 0

  return (
    <div className="rounded-2xl overflow-hidden border border-[#2A2A3C] bg-[#0D0D17]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#12121A] border-b border-[#2A2A3C]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-[#8888AA] font-mono">
            {language === 'html' ? 'index.html' : language === 'javascript' ? 'script.js' : language === 'python' ? 'main.py' : language === 'css' ? 'style.css' : 'code.' + language}
          </span>
        </div>
        <div className="text-xs text-[#8888AA]">
          {stepIndex + 1} / {steps.length}
        </div>
      </div>

      {/* Code editor */}
      <div className="h-[300px] md:h-[380px]">
        <MonacoEditor
          height="100%"
          language={language === 'html' ? 'html' : language === 'javascript' ? 'javascript' : language === 'python' ? 'python' : language}
          value={displayedCode}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'none',
            cursorStyle: isPlaying ? 'line' : 'block',
            cursorBlinking: 'blink',
          }}
        />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#2A2A3C]">
        <div
          className="h-full bg-[#6C63FF] transition-all duration-150"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      {/* Explanation */}
      <div className="px-6 py-4 min-h-[70px] bg-[#0D0D17]">
        <p className="text-[#C0C0DD] text-sm leading-relaxed font-georgian">
          {explanation || steps[stepIndex]?.explanation || ''}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#12121A] border-t border-[#2A2A3C]">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-[#6C63FF] hover:bg-[#4D43F5] rounded-full flex items-center justify-center transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </button>
          <button
            onClick={restart}
            className="w-8 h-8 text-[#8888AA] hover:text-white transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {completed && (
            <span className="text-green-400 text-sm font-medium">✓ დასრულდა!</span>
          )}
          {/* Speed control */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(p => !p)}
              className="flex items-center gap-1 text-sm text-[#8888AA] hover:text-white bg-[#1A1A28] px-3 py-1.5 rounded-lg border border-[#2A2A3C] transition-colors"
            >
              {speed}x <ChevronDown className="w-3 h-3" />
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-10 right-0 bg-[#12121A] border border-[#2A2A3C] rounded-lg overflow-hidden shadow-xl">
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setShowSpeedMenu(false) }}
                    className={`block w-full px-4 py-2 text-sm text-left transition-colors ${speed === s ? 'text-[#6C63FF] bg-[#6C63FF]/10' : 'text-[#8888AA] hover:text-white hover:bg-[#1A1A28]'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
