'use client'
import { useCallback, useEffect, useRef } from 'react'

export function useSpeech() {
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel() }
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ka-GE'
    u.rate = 0.95
    u.pitch = 1
    // Prefer Georgian voice if available, fall back to any available
    const voices = window.speechSynthesis.getVoices()
    const kaVoice = voices.find(v => v.lang.startsWith('ka')) ||
      voices.find(v => v.lang.startsWith('ru')) || // Slavic phonetics closer than English
      voices[0]
    if (kaVoice) u.voice = kaVoice
    utterRef.current = u
    window.speechSynthesis.speak(u)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  const isSpeaking = () => window.speechSynthesis?.speaking ?? false

  return { speak, stop, isSpeaking }
}
