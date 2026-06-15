'use client'
import { useCallback, useEffect, useRef } from 'react'

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    function loadVoice() {
      const voices = window.speechSynthesis.getVoices()
      // Prefer English voice — reads Georgian text without distorting into Cyrillic
      voiceRef.current =
        voices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')) ||
        voices.find(v => v.lang.startsWith('en-US')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0] ||
        null
    }
    loadVoice()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoice)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoice)
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    if (voiceRef.current) u.voice = voiceRef.current
    u.rate = 0.82   // slightly slower — Georgian text needs time
    u.pitch = 1
    window.speechSynthesis.speak(u)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop }
}
