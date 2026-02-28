import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { ScrollReveal } from './AnimatedComponents'

const COMMANDS = [
  { cmd: 'stock', desc: 'Check your inventory status', emoji: '📦' },
  { cmd: 'price dal', desc: 'Get pricing advice for dal', emoji: '💰' },
  { cmd: 'weather mumbai', desc: 'Weather + business impact', emoji: '🌧️' },
  { cmd: 'festival', desc: 'Upcoming festival prep tips', emoji: '🎪' },
]

export default function WhatsAppDemo() {
  const whatsappLink = 'https://wa.me/14155238886?text=join%20BharatBazaar'

  return (
    <section className="py-14 px-6 lg:px-8 bg-[#ECE5DD]/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Info */}
          <ScrollReveal>
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Integration
              </div>

              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
                Try Munim-ji on<br />
                <span className="text-green-600">WhatsApp</span> — Live Demo
              </h2>

              <p className="text-[#666] mt-4 text-lg leading-relaxed max-w-md">
                Text our AI advisor from your phone. Ask about prices, stock levels,
                weather impact — all in Hindi or English.
              </p>

              <div className="mt-8 space-y-3">
                {COMMANDS.map((cmd) => (
                  <div
                    key={cmd.cmd}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100"
                  >
                    <span className="text-lg">{cmd.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">"{cmd.cmd}"</p>
                      <p className="text-xs text-gray-500">{cmd.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 inline-flex items-center gap-2.5 bg-green-600 text-white px-7 py-3.5 rounded-full text-sm font-semibold shadow-xl shadow-green-600/25 hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Open WhatsApp
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <p className="text-xs text-gray-400 mt-3">
                Powered by Twilio WhatsApp Sandbox. Send "join BharatBazaar" to get started.
              </p>
            </div>
          </ScrollReveal>

          {/* Right — Phone mockup showing WhatsApp conversation */}
          <ScrollReveal delay={0.2}>
            <div className="flex justify-center">
              <div className="w-[260px] bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl shadow-black/30">
                {/* Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-b-2xl z-20" />
                {/* Screen */}
                <div className="w-full bg-[#ECE5DD] rounded-[2rem] overflow-hidden">
                  {/* WhatsApp header */}
                  <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-3 py-2 pt-6 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm">🧮</div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold">Munim-ji AI</p>
                      <p className="text-[9px] text-white/70">online</p>
                    </div>
                  </div>

                  {/* Sample conversation */}
                  <div className="px-2 py-3 space-y-2 min-h-[300px]">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-2.5 py-1.5 max-w-[80%] shadow-sm">
                        <p className="text-[11px] text-slate-800">stock check karo</p>
                        <p className="text-[8px] text-slate-400 text-right mt-0.5">10:30 AM ✓✓</p>
                      </div>
                    </div>

                    {/* AI response */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-xl rounded-tl-sm px-2.5 py-1.5 max-w-[85%] shadow-sm">
                        <p className="text-[11px] text-slate-800 leading-relaxed">
                          🧮 *Munim-ji AI*{'\n\n'}
                          📦 *Your Inventory:*{'\n'}
                          • Toor Dal: 25kg ✅{'\n'}
                          • Rice: 10kg ✅{'\n'}
                          • Surf: 8 pkt ⚠️{'\n'}
                          • Parle-G: 5 pkt ⚠️{'\n\n'}
                          _Reply 'order' to restock_
                        </p>
                        <p className="text-[8px] text-slate-400 mt-0.5">10:30 AM</p>
                      </div>
                    </div>

                    {/* Another user message */}
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-2.5 py-1.5 max-w-[80%] shadow-sm">
                        <p className="text-[11px] text-slate-800">price dal batao</p>
                        <p className="text-[8px] text-slate-400 text-right mt-0.5">10:31 AM ✓✓</p>
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="bg-[#F0F0F0] px-2 py-1.5 flex items-center gap-1.5">
                    <div className="flex-1 bg-white rounded-full px-2.5 py-1.5">
                      <p className="text-[10px] text-slate-400">Type a message...</p>
                    </div>
                    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px]">🎤</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
