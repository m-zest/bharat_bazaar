import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

interface VoiceOutputProps {
  text: string
  language?: string
  autoPlay?: boolean
  compact?: boolean
}

export default function VoiceOutput({
  text,
  language = 'hi-IN',
  autoPlay = false,
  compact = false,
}: VoiceOutputProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  const speak = useCallback(() => {
    if (!supported || !text) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices()
    const langPrefix = language.split('-')[0] // 'hi' from 'hi-IN'
    const matchedVoice = voices.find(v => v.lang.startsWith(langPrefix)) ||
                         voices.find(v => v.lang.startsWith('hi')) ||
                         voices.find(v => v.lang.includes('IN'))

    if (matchedVoice) utterance.voice = matchedVoice
    utterance.lang = language
    utterance.rate = 0.9
    utterance.pitch = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [supported, text, language])

  const toggle = useCallback(() => {
    if (isSpeaking) {
      stop()
    } else {
      speak()
    }
  }, [isSpeaking, stop, speak])

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && supported && text) {
      // Small delay to let the message render first
      const timer = setTimeout(speak, 500)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, supported, text, speak])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  if (!supported) return null

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className={`inline-flex items-center justify-center transition-all ${
        compact
          ? 'w-5 h-5 rounded'
          : 'w-6 h-6 rounded-md'
      } ${
        isSpeaking
          ? 'text-emerald-500'
          : 'text-gray-400 hover:text-gray-600'
      }`}
      title={isSpeaking ? 'Stop speaking' : 'Listen to response'}
    >
      {isSpeaking ? (
        <motion.div className="relative">
          <VolumeX className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {/* Sound wave animation */}
          <motion.div
            className="absolute -right-1 top-0 flex flex-col gap-0.5"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <div className="w-0.5 h-1 bg-emerald-400 rounded-full" />
            <div className="w-0.5 h-1.5 bg-emerald-400 rounded-full" />
            <div className="w-0.5 h-1 bg-emerald-400 rounded-full" />
          </motion.div>
        </motion.div>
      ) : (
        <Volume2 className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      )}
    </motion.button>
  )
}
