import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, RotateCcw, User, Bot, Mic, MicOff, Lightbulb } from 'lucide-react'
import { api } from '../utils/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  { text: 'Diwali ke liye kya stock karun?', labelHi: 'दिवाली की तैयारी' },
  { text: 'Mere competitor se sasta kaise bechun?', labelHi: 'प्रतिस्पर्धा' },
  { text: 'Which products should I start selling online?', labelHi: 'ऑनलाइन बिक्री' },
  { text: 'Basmati Rice ka best wholesale price kya hai?', labelHi: 'थोक दाम' },
  { text: 'Aaj mausam kaisa rahega aur business pe kya asar padega?', labelHi: 'मौसम' },
  { text: 'How to increase my monthly profit by 20%?', labelHi: 'मुनाफ़ा बढ़ाएं' },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Namaste! Main BharatBazaar AI Business Advisor hoon. Aap mujhse apne business ke baare mein kuch bhi pooch sakte hain — pricing, stocking, suppliers, ya market trends. Hindi, English ya Hinglish mein baat karein! 🙏\n\nKuch suggestions:\n- "Diwali ke liye kya stock karun?"\n- "Mere competitor se sasta kaise bechun?"\n- "Best wholesale price for Basmati Rice?"',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [city] = useState('Lucknow')
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported] = useState(() =>
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const msgText = text || input.trim()
    if (!msgText || loading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msgText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }))

      const result = await api.chat({
        message: msgText,
        city,
        conversationHistory: history,
      })

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (err: any) {
      const isRateLimit = err.message?.includes('daily limit') || err.message?.includes('busy') || err.message?.includes('limit reached');
      const errorContent = isRateLimit
        ? `Maaf kijiye! ${err.message} Thodi der baad dobara try karein.`
        : `Sorry, kuch problem aa gayi. ${err.message || 'Connection failed'}. Please try again in a moment.`;
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function toggleVoice() {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.interimResults = true
    recognition.continuous = false
    recognitionRef.current = recognition

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
      setInput(transcript)
    }

    recognition.onend = () => {
      setIsListening(false)
      // Auto-send if we got a transcript
      if (input.trim()) {
        setTimeout(() => sendMessage(), 200)
      }
    }

    recognition.onerror = () => setIsListening(false)

    recognition.start()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-400 to-royal-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900">AI Business Advisor</h1>
            <p className="text-sm text-gray-500">Ask anything in Hindi, English or Hinglish</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Powered by Amazon Bedrock</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-saffron-100 text-saffron-600'
                  : 'bg-gradient-to-br from-saffron-400 to-royal-500 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[75%] ${
                msg.role === 'user'
                  ? 'bg-saffron-500 text-white rounded-2xl rounded-tr-md'
                  : 'bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm'
              } px-4 py-3`}>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'assistant' ? 'text-gray-700' : ''
                }`}>
                  {msg.content}
                </p>
                <p className={`text-[10px] mt-1 ${
                  msg.role === 'user' ? 'text-white/60' : 'text-gray-400'
                }`}>
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron-400 to-royal-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3 h-3 text-saffron-500 animate-spin" />
                <span className="text-sm text-gray-400">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-8 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-saffron-500" />
            <span className="text-xs font-medium text-gray-500">Try asking:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => sendMessage(prompt.text)}
                className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-saffron-300 hover:bg-saffron-50 transition-all text-gray-600 hover:text-saffron-700"
              >
                <span className="font-hindi text-[10px] text-gray-400 mr-1">{prompt.labelHi}</span>
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-8 py-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Bol rahe hain... (Listening)' : 'Type your question... (Hindi / English / Hinglish)'}
            className="flex-1 input-field"
            disabled={loading}
          />
          {voiceSupported && (
            <button
              onClick={toggleVoice}
              disabled={loading}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/25'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={isListening ? 'Stop listening' : 'Speak in Hindi'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-xl bg-saffron-500 text-white flex items-center justify-center hover:bg-saffron-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-saffron-500/25"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Powered by Amazon Bedrock (Claude AI) — {voiceSupported ? 'Tap mic to speak in Hindi' : 'Your business data stays private'}
        </p>
      </div>
    </div>
  )
}
