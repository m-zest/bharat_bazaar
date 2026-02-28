import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, ArrowLeft, MoreVertical } from 'lucide-react'
import { api } from '../utils/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  richCard?: {
    type: 'pricing' | 'weather' | 'stock'
    title: string
    price?: string
    confidence?: number
    insight?: string
  }
}

const QUICK_CHIPS = [
  { emoji: '📊', label: 'Rice ka daam?' },
  { emoji: '🌧️', label: 'Mausam update' },
  { emoji: '📦', label: 'Stock check' },
  { emoji: '🎪', label: 'Festival prep' },
]

function parsePriceFromResponse(text: string): { price?: string; confidence?: number; insight?: string } | null {
  const priceMatch = text.match(/₹(\d+)/);
  const confMatch = text.match(/(\d+)%/);
  if (priceMatch) {
    return {
      price: `₹${priceMatch[1]}`,
      confidence: confMatch ? parseInt(confMatch[1]) : undefined,
      insight: text.split('.')[0],
    }
  }
  return null
}

export default function PhoneMockup() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Namaste! Main aapka Munim-ji hoon 🧮\nAap mujhse pricing, stock, ya market ke baare mein kuch bhi poochho!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage(text?: string) {
    const msgText = text || input.trim()
    if (!msgText || isTyping) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msgText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const result = await api.chat({ message: msgText, city: 'Lucknow', conversationHistory: [] })
      const responseText = result.response || result.reply || 'Main aapki madad karne ke liye tayyar hoon!'
      const priceData = parsePriceFromResponse(responseText)

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        richCard: priceData ? {
          type: 'pricing',
          title: msgText.toLowerCase().includes('rice') ? 'Basmati Rice 5kg' : 'Product',
          price: priceData.price,
          confidence: priceData.confidence,
          insight: priceData.insight,
        } : undefined,
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: 'Abhi thoda busy hoon, thodi der mein try karein! 😅',
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (d: Date) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      {/* "Try it live!" badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute -top-2 right-0 z-10 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/30"
      >
        👆 Try it live!
      </motion.div>

      {/* Phone frame */}
      <div className="w-[260px] h-[520px] bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl shadow-black/30 relative">
        {/* Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-b-2xl z-20" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-700 rounded-full z-20" />

        {/* Screen */}
        <div className="w-full h-full bg-[#ECE5DD] rounded-[2rem] overflow-hidden flex flex-col relative">
          {/* WhatsApp-style header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-3 py-2 pt-7 flex items-center gap-2 flex-shrink-0">
            <ArrowLeft className="w-4 h-4 opacity-70" />
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm">
              🧮
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold leading-tight">Munim-ji</p>
              <p className="text-[9px] text-white/70">AI Business Advisor</p>
            </div>
            <MoreVertical className="w-4 h-4 opacity-70" />
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1.5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M20 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-8 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z' fill='%23000' fill-opacity='.02'/%3E%3C/svg%3E")` }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`max-w-[85%] rounded-xl px-2.5 py-1.5 shadow-sm relative ${
                    msg.role === 'user'
                      ? 'bg-[#DCF8C6] rounded-tr-sm'
                      : 'bg-white rounded-tl-sm'
                  }`}
                >
                  <p className="text-[11px] text-slate-800 leading-relaxed whitespace-pre-line">{msg.content}</p>

                  {/* Rich card */}
                  {msg.richCard && (
                    <div className="mt-1.5 bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{msg.richCard.title}</p>
                      {msg.richCard.price && (
                        <p className="text-base font-extrabold text-green-600 mt-0.5">{msg.richCard.price}</p>
                      )}
                      {msg.richCard.confidence && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${msg.richCard.confidence}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full bg-gradient-to-r from-orange-400 to-green-500 rounded-full"
                            />
                          </div>
                          <span className="text-[9px] font-bold text-slate-500">{msg.richCard.confidence}%</span>
                        </div>
                      )}
                      <button className="mt-1.5 w-full text-[9px] font-semibold bg-orange-500 text-white py-1 rounded-md">
                        Apply Price
                      </button>
                    </div>
                  )}

                  <div className={`flex items-center gap-1 mt-0.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    <span className="text-[8px] text-slate-400">{formatTime(msg.timestamp)}</span>
                    {msg.role === 'user' && (
                      <span className="text-[8px] text-blue-400">✓✓</span>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 italic mr-1">typing</span>
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips */}
          {messages.length <= 2 && (
            <div className="px-2 pb-1 flex gap-1 overflow-x-auto flex-shrink-0">
              {QUICK_CHIPS.map(chip => (
                <button
                  key={chip.label}
                  onClick={() => sendMessage(chip.label)}
                  className="flex-shrink-0 text-[9px] px-2 py-1 bg-white rounded-full border border-green-200 text-green-700 font-medium hover:bg-green-50 transition-colors shadow-sm"
                >
                  {chip.emoji} {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="bg-[#F0F0F0] px-1.5 py-1.5 flex items-center gap-1.5 flex-shrink-0">
            <div className="flex-1 bg-white rounded-full flex items-center px-2.5 py-1.5">
              <span className="text-xs mr-1.5">😊</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 text-[11px] bg-transparent outline-none text-slate-800 placeholder-slate-400"
                disabled={isTyping}
              />
            </div>
            {input.trim() ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => sendMessage()}
                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0"
              >
                <Mic className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-600 rounded-full" />
      </div>
    </motion.div>
  )
}
