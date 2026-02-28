import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, ChevronDown } from 'lucide-react'
import { useToast } from './Toast'

const LANGUAGES = [
  { code: 'hi-IN', name: 'हिंदी', label: 'Hindi', flag: '🇮🇳' },
  { code: 'en-IN', name: 'English', label: 'English', flag: '🇬🇧' },
  { code: 'ta-IN', name: 'தமிழ்', label: 'Tamil', flag: '🇮🇳' },
  { code: 'te-IN', name: 'తెలుగు', label: 'Telugu', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'বাংলা', label: 'Bengali', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'मराठी', label: 'Marathi', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'ગુજરાતી', label: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ', label: 'Kannada', flag: '🇮🇳' },
]

interface VoiceInputProps {
  onResult: (text: string) => void
  onInterim?: (text: string) => void
  language?: string
  onLanguageChange?: (lang: string) => void
  disabled?: boolean
  compact?: boolean
}

export default function VoiceInput({
  onResult,
  onInterim,
  language = 'hi-IN',
  onLanguageChange,
  disabled = false,
  compact = false,
}: VoiceInputProps) {
  const { toast } = useToast()
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [showLangPicker, setShowLangPicker] = useState(false)
  const recognitionRef = useRef<any>(null)
  const langPickerRef = useRef<HTMLDivElement>(null)

  const supported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  // Close lang picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setShowLangPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
    setInterimText('')
  }, [])

  const startListening = useCallback(() => {
    if (!supported) {
      toast('warning', 'Microphone not supported in this browser')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setIsListening(true)
      setInterimText('')
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }
      if (interim) {
        setInterimText(interim)
        onInterim?.(interim)
      }
      if (final) {
        setInterimText('')
        onResult(final)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      setInterimText('')
      if (event.error === 'not-allowed') {
        toast('error', 'Microphone access denied. Please allow microphone.')
      } else if (event.error !== 'aborted') {
        toast('warning', 'Voice recognition ended. Try again.')
      }
    }

    recognition.start()
  }, [supported, language, onResult, onInterim, toast])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, stopListening, startListening])

  if (!supported) return null

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="flex items-center gap-1.5 relative">
      {/* Language selector */}
      {!compact && (
        <div className="relative" ref={langPickerRef}>
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            {currentLang.flag} {currentLang.name}
            <ChevronDown className="w-3 h-3" />
          </button>

          <AnimatePresence>
            {showLangPicker && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                className="absolute bottom-full mb-1 left-0 bg-white rounded-xl shadow-lg border border-gray-200 p-1 z-50 min-w-[140px]"
              >
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange?.(lang.code)
                      setShowLangPicker(false)
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      language === lang.code
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    <span className="text-gray-400 text-[10px] ml-auto">{lang.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Mic button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        disabled={disabled}
        className={`relative flex items-center justify-center transition-all disabled:opacity-40 ${
          compact
            ? 'w-8 h-8 rounded-full'
            : 'w-10 h-10 rounded-full'
        } ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
            : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm border border-gray-200'
        }`}
        title={isListening ? 'Stop listening' : `Speak in ${currentLang.label}`}
      >
        {isListening ? (
          <MicOff className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        ) : (
          <Mic className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        )}

        {/* Pulse rings when listening */}
        {isListening && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            />
          </>
        )}
      </motion.button>

      {/* Interim transcription floating text */}
      <AnimatePresence>
        {isListening && interimText && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 min-w-[200px] z-50"
          >
            <span className="text-red-500 mr-1">●</span>
            {interimText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { LANGUAGES }
