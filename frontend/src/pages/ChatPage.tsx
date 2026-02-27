import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, RotateCcw, User, Bot, Mic, MicOff, Lightbulb, Sparkles } from 'lucide-react'
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
      if (input.trim()) {
        setTimeout(() => sendMessage(), 200)
      }
    }

    recognition.onerror = () => setIsListening(false)

    recognition.start()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 lg:px-8 py-4 bg-gradient-to-r from-[#1E1B4B] via-[#312e81] to-[#1E1B4B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-lg shadow-saffron-500/30">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold">AI Business Advisor</h1>
            <p className="text-xs text-white/50">Ask anything in Hindi, English or Hinglish</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-white/40">Amazon Bedrock</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-saffron-100 text-saffron-600'
                  : 'bg-gradient-to-br from-[#1E1B4B] to-[#312e81] text-white shadow-sm'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] lg:max-w-[70%] ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-saffron-500 to-saffron-600 text-white rounded-2xl rounded-tr-md shadow-lg shadow-saffron-500/20'
                  : 'bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm'
              } px-4 py-3`}>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'assistant' ? 'text-gray-700' : ''
                }`}>
                  {msg.content}
                </p>
                <p className={`text-[10px] mt-1.5 ${
                  msg.role === 'user' ? 'text-white/50' : 'text-gray-400'
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
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E1B4B] to-[#312e81] flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md shadow-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-saffron-400 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 ml-1">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 lg:px-8 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-saffron-500" />
            <span className="text-xs font-medium text-gray-500">Try asking:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <motion.button
                key={prompt.text}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sendMessage(prompt.text)}
                className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-saffron-300 hover:bg-saffron-50 transition-all text-gray-600 hover:text-saffron-700 shadow-sm"
              >
                <span className="font-hindi text-[10px] text-gray-400 mr-1">{prompt.labelHi}</span>
                {prompt.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 lg:px-8 py-4 border-t border-gray-200/60 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Bol rahe hain... (Listening)' : 'Type your question... (Hindi / English / Hinglish)'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition-all bg-white text-sm"
              disabled={loading}
            />
            {isListening && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.span
                    key={i}
                    className="w-0.5 bg-red-500 rounded-full"
                    animate={{ height: [8, 16, 8] }}
                    transition={{ duration: 0.4, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            )}
          </div>
          {voiceSupported && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoice}
              disabled={loading}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={isListening ? 'Stop listening' : 'Speak in Hindi'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-saffron-500/25"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Powered by Amazon Bedrock (Claude AI) — {voiceSupported ? 'Tap mic to speak in Hindi' : 'Your business data stays private'}
        </p>
      </div>
    </div>
  )
}
