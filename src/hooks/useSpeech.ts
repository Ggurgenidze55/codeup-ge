'use client'
import { useCallback, useEffect, useRef } from 'react'

function getVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  return (
    voices.find(v => v.lang.startsWith('ka')) ||
    voices.find(v => v.lang.startsWith('ru')) ||
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0]
  )
}

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    const load = () => { voiceRef.current = getVoice() }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    // Only set ka-GE if the browser actually has a Georgian voice
    const voice = voiceRef.current || getVoice()
    if (voice) {
      u.voice = voice
      u.lang = voice.lang
    }
    u.rate = 0.88
    u.pitch = 1
    window.speechSynthesis.speak(u)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop }
}
