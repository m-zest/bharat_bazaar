import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, IndianRupee, CloudSun, Package, Sparkles } from 'lucide-react'
import { api } from '../utils/api'
import DemoModeBadge from '../components/DemoModeBadge'
import { useToast } from '../components/Toast'
import VoiceInput from '../components/VoiceInput'
import VoiceOutput from '../components/VoiceOutput'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  voiceInitiated?: boolean
}

const QUICK_CHIPS = [
  { text: 'Rice ka daam?', emoji: '📊' },
  { text: 'Mausam update', emoji: '🌧️' },
  { text: 'Stock check karo', emoji: '📦' },
  { text: 'Festival prep tips', emoji: '🎪' },
  { text: 'Profit kaise badhaye?', emoji: '💰' },
  { text: 'Competitor analysis', emoji: '🔍' },
]

/* ---- Rich card detector helpers ---- */
function hasPricingData(text: string) {
  return /₹\d+|Rs\.?\s*\d+|price|pricing|margin|cost|daam|kimat/i.test(text)
}
function hasWeatherData(text: string) {
  return /weather|mausam|temperature|rain|barish|humidity|garmi|thand/i.test(text)
}
function hasInventoryData(text: string) {
  return /stock|inventory|reorder|quantity|unit|godown|maal/i.test(text)
}

/* ---- Rich Card Components ---- */
function PricingCard({ text }: { text: string }) {
  const priceMatches = text.match(/₹[\d,]+|Rs\.?\s*[\d,]+/g) || []
  const prices = priceMatches.slice(0, 3)
  return (
    <div className="mt-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
          <IndianRupee className="w-3.5 h-3.5 text-orange-600" />
        </div>
        <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Pricing Insight</span>
      </div>
      {prices.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {prices.map((p, i) => (
            <span key={i} className="text-sm font-bold text-orange-800 bg-white px-2.5 py-1 rounded-lg border border-orange-200">
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function WeatherCard() {
  return (
    <div className="mt-2 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-3 border border-blue-200">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
          <CloudSun className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Weather Impact</span>
      </div>
    </div>
  )
}

function InventoryCard() {
  return (
    <div className="mt-2 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-3 border border-teal-200">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
          <Package className="w-3.5 h-3.5 text-teal-600" />
        </div>
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Inventory Insight</span>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Namaste! Main Munim-ji hoon — aapka AI hisaab-kitaab advisor. 🧮\n\nPuchiye kuch bhi — pricing, stock, mausam, ya competitor analysis. Hindi, English ya Hinglish mein baat karein!\n\n🎤 Mic tap karke Hindi mein bol sakte hain!',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [city] = useState('Lucknow')
  const [demoMode, setDemoMode] = useState(false)
  const [voiceLang, setVoiceLang] = useState('hi-IN')
  const [lastWasVoice, setLastWasVoice] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string, fromVoice = false) {
    const msgText = text || input.trim()
    if (!msgText || loading) return

    setLastWasVoice(fromVoice)

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msgText,
      timestamp: new Date(),
      voiceInitiated: fromVoice,
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    if (fromVoice) {
      toast('info', '🎤 Voice mode — Munim-ji is listening')
    }

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }))

      const result = await api.chat({
        message: msgText,
        city,
        conversationHistory: history,
      })

      if (result.demoMode) {
        setDemoMode(true)
        toast('info', 'AI demo mode — smart responses from cached data')
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (err: any) {
      toast('error', err.message || 'Connection failed')
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Maaf kijiye! Thodi technical problem aa gayi. Thodi der mein dobara try karein. 🙏`,
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

  function handleVoiceResult(text: string) {
    setInput(text)
    // Auto-send after a short delay for voice input
    setTimeout(() => sendMessage(text, true), 300)
  }

  function handleVoiceInterim(text: string) {
    setInput(text)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header — WhatsApp-style green with Munim-ji */}
      <div className="px-4 lg:px-6 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg">
            🧮
          </div>
          <div className="flex-1">
            <h1 className="font-display text-base font-bold flex items-center gap-1.5">
              Munim-ji
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            </h1>
            <p className="text-[10px] text-white/70">AI Business Advisor — speaks 8 Indian languages</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white/50" />
            <span className="text-[10px] text-white/50">Bedrock AI</span>
          </div>
        </div>
      </div>

      {/* Chat Background Pattern */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-4 space-y-3 bg-[#f0f2f5]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d1d5db\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                msg.role === 'user'
                  ? 'bg-saffron-100 text-saffron-600'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <span>🧮</span>}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] lg:max-w-[65%] ${
                msg.role === 'user'
                  ? 'bg-emerald-500 text-white rounded-2xl rounded-tr-sm shadow-sm'
                  : 'bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100'
              } px-3.5 py-2.5`}>
                {msg.role === 'assistant' && msg.id !== 'welcome' && (
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[10px] font-semibold text-emerald-600">Munim-ji 🧮</p>
                    <VoiceOutput
                      text={msg.content}
                      language={voiceLang}
                      autoPlay={lastWasVoice && msg.id === messages[messages.length - 1]?.id}
                      compact
                    />
                  </div>
                )}
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'assistant' ? 'text-gray-700' : ''
                }`}>
                  {msg.content}
                </p>

                {/* Rich Cards for AI responses */}
                {msg.role === 'assistant' && msg.id !== 'welcome' && (
                  <>
                    {hasPricingData(msg.content) && <PricingCard text={msg.content} />}
                    {hasWeatherData(msg.content) && <WeatherCard />}
                    {hasInventoryData(msg.content) && <InventoryCard />}
                  </>
                )}

                {msg.role === 'user' && msg.voiceInitiated && (
                  <p className="text-[9px] text-white/50 mt-0.5">🎤 voice</p>
                )}

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
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
              🧮
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400">Munim-ji soch raha hai...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips — always visible */}
      <div className="px-3 py-2 bg-white border-t border-gray-100 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {QUICK_CHIPS.map((chip) => (
            <motion.button
              key={chip.text}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendMessage(chip.text)}
              disabled={loading}
              className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-all text-gray-600 hover:text-emerald-700 whitespace-nowrap disabled:opacity-40"
            >
              {chip.emoji} {chip.text}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input Area — WhatsApp-style with Voice */}
      <div className="px-3 py-2.5 bg-[#f0f2f5]">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <VoiceInput
            onResult={handleVoiceResult}
            onInterim={handleVoiceInterim}
            language={voiceLang}
            onLanguageChange={setVoiceLang}
            disabled={loading}
          />
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Munim-ji..."
              className="w-full px-4 py-2.5 rounded-full border-0 bg-white text-sm shadow-sm focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              disabled={loading}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:bg-emerald-600"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      <DemoModeBadge visible={demoMode} />
    </div>
  )
}
