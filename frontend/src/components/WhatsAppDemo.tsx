import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, ArrowRight, Smartphone, Store, Mic, Camera,
  IndianRupee, Package, BarChart3, Receipt, Truck, Users,
  CheckCircle2, Zap, Globe,
} from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem } from './AnimatedComponents'
import { GradientOrbs, FloatingParticles } from './BackgroundEffects'

/* WhatsApp chat messages for the animated conversation */
const CHAT_FLOW = [
  { type: 'user' as const, text: 'hi munim ji', time: '10:30 AM' },
  { type: 'bot' as const, text: 'Namaste! Main hoon Munim-ji, aapka AI business advisor. Kya madad karoon?\n\nType karo:\n  stock - inventory check\n  price - pricing advice\n  order - place order\n  bill - scan a bill\n  report - daily summary', time: '10:30 AM' },
  { type: 'user' as const, text: 'stock', time: '10:31 AM' },
  { type: 'bot' as const, text: 'Your Inventory:\n\n  Toor Dal: 25kg\n  Basmati Rice: 10kg\n  Sugar: 50kg\n  Surf Excel: 8 pkt\n  Parle-G: 5 pkt\n\nLow stock alert on Surf & Parle-G. Reply "order surf 20, parle 30" to restock.', time: '10:31 AM' },
  { type: 'user' as const, text: 'price dal', time: '10:32 AM' },
  { type: 'bot' as const, text: 'Toor Dal Pricing AI:\n\nMarket: Rs.142/kg\nYour price: Rs.155/kg\nSuggested: Rs.149/kg\n\n+18% more demand expected\nCompetitor avg: Rs.151/kg\nWeather impact: +5% (rain forecast)\n\nReply "set 149" to update price.', time: '10:32 AM' },
]

/* Features accessible via WhatsApp */
const WA_FEATURES = [
  { icon: Package, label: 'Inventory Check', cmd: '"stock"', desc: 'Real-time stock levels' },
  { icon: IndianRupee, label: 'Smart Pricing', cmd: '"price [item]"', desc: 'AI-powered price suggestions' },
  { icon: Truck, label: 'Place Orders', cmd: '"order [items]"', desc: 'Restock from wholesalers' },
  { icon: Camera, label: 'Scan Bills', cmd: 'Send photo', desc: 'OCR bill scanning via camera' },
  { icon: BarChart3, label: 'Daily Reports', cmd: '"report"', desc: 'Sales & profit summary' },
  { icon: Receipt, label: 'GST Invoice', cmd: '"bill [customer]"', desc: 'Generate & share invoices' },
  { icon: Users, label: 'Customer Khata', cmd: '"khata [name]"', desc: 'Track credit & payments' },
  { icon: Globe, label: 'Multi-language', cmd: '"hindi / tamil"', desc: 'Switch language anytime' },
]

/* Why WhatsApp-first for India stats */
const INDIA_STATS = [
  { value: '500M+', label: 'WhatsApp users in India' },
  { value: '15M+', label: 'Kirana stores nationwide' },
  { value: '0', label: 'App downloads needed' },
  { value: '2G', label: 'Works on slow networks' },
]

export default function WhatsAppDemo() {
  const whatsappLink = 'https://wa.me/14155238886?text=join%20BharatBazaar'
  const [visibleMessages, setVisibleMessages] = useState(0)

  useEffect(() => {
    if (visibleMessages >= CHAT_FLOW.length) return
    const delay = CHAT_FLOW[visibleMessages]?.type === 'bot' ? 1200 : 600
    const timer = setTimeout(() => setVisibleMessages(v => v + 1), delay)
    return () => clearTimeout(timer)
  }, [visibleMessages])

  return (
    <section className="py-24 px-6 lg:px-8 bg-[#0a1a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-green-500/8 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-green-600/6 to-transparent blur-[100px]" />
        <FloatingParticles count={20} color="#22C55E" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-green-500/20">
            <MessageCircle className="w-4 h-4" />
            WhatsApp-First Platform
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-100 tracking-tight">
            No App. No Website.<br />
            Just <span className="text-green-400">WhatsApp.</span>
          </h2>

          <p className="text-gray-400 mt-5 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Indian store owners live on WhatsApp. So we brought the entire platform to them.
            Every feature — pricing, inventory, orders, bills — accessible through simple messages.
            No training needed. No new app to learn.
          </p>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Left — Why WhatsApp for India (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal>
              <div className="bg-[#1a1a1d]/80 backdrop-blur-sm rounded-2xl p-6 border border-green-500/10">
                <h3 className="text-lg font-extrabold text-gray-100 mb-1">Why WhatsApp-First?</h3>
                <p className="text-xs text-gray-500 mb-5">India&apos;s reality demands it</p>

                <div className="space-y-4">
                  {[
                    { icon: Smartphone, title: 'Already on every phone', desc: 'No downloads, no signups. Store owners already know WhatsApp.' },
                    { icon: Mic, title: 'Voice messages supported', desc: 'Can\'t type? Just send a voice note in Hindi. AI understands.' },
                    { icon: Store, title: 'Works from the shop counter', desc: 'Quick replies between customers. No time wasted on complex UIs.' },
                    { icon: Zap, title: 'Works on 2G/3G networks', desc: 'Text-based AI works even in areas with poor internet connectivity.' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-200">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* India Stats */}
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-3">
                {INDIA_STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-[#1a1a1d]/80 backdrop-blur-sm rounded-xl p-4 border border-green-500/10 text-center"
                  >
                    <p className="text-xl font-extrabold text-green-400">{stat.value}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Center — Phone Mockup with animated chat (1.5 cols) */}
          <ScrollReveal delay={0.15} className="lg:col-span-1 flex justify-center">
            <div className="w-[280px] bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl shadow-green-900/20 relative">
              {/* Status bar glow */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-green-500/20 blur-xl rounded-full" />
              {/* Screen */}
              <div className="w-full bg-[#ECE5DD] rounded-[2rem] overflow-hidden">
                {/* WhatsApp header */}
                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-3 py-2 pt-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">BB</div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">Munim-ji AI</p>
                    <p className="text-[9px] text-white/70">online</p>
                  </div>
                  <div className="flex gap-3 text-white/60">
                    <span className="text-xs">...</span>
                  </div>
                </div>

                {/* Animated conversation */}
                <div className="px-2 py-3 space-y-2 min-h-[360px] max-h-[360px] overflow-hidden relative">
                  <AnimatePresence>
                    {CHAT_FLOW.slice(0, visibleMessages).map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`${
                          msg.type === 'user'
                            ? 'bg-[#DCF8C6] rounded-xl rounded-tr-sm'
                            : 'bg-white rounded-xl rounded-tl-sm'
                        } px-2.5 py-1.5 max-w-[85%] shadow-sm`}>
                          <p className="text-[10px] text-slate-800 leading-relaxed whitespace-pre-line">{msg.text}</p>
                          <p className="text-[7px] text-slate-400 text-right mt-0.5">
                            {msg.time} {msg.type === 'user' && ' \u2713\u2713'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {visibleMessages < CHAT_FLOW.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-xl px-3 py-2 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input bar */}
                <div className="bg-[#F0F0F0] px-2 py-1.5 flex items-center gap-1.5">
                  <div className="flex-1 bg-white rounded-full px-2.5 py-1.5">
                    <p className="text-[10px] text-slate-400">Type a message...</p>
                  </div>
                  <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — All features accessible via WhatsApp (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal delay={0.1}>
              <div className="bg-[#1a1a1d]/80 backdrop-blur-sm rounded-2xl p-6 border border-green-500/10">
                <h3 className="text-lg font-extrabold text-gray-100 mb-1">Every Feature on WhatsApp</h3>
                <p className="text-xs text-gray-500 mb-5">Just type a command or send a voice note</p>

                <div className="grid grid-cols-2 gap-2.5">
                  {WA_FEATURES.map((feat, i) => (
                    <motion.div
                      key={feat.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/[0.03] rounded-xl p-3 border border-white/5 hover:border-green-500/20 transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <feat.icon className="w-3.5 h-3.5 text-green-400" />
                        <p className="text-xs font-bold text-gray-200">{feat.label}</p>
                      </div>
                      <p className="text-[10px] text-green-400/70 font-mono mb-0.5">{feat.cmd}</p>
                      <p className="text-[10px] text-gray-500">{feat.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* How it works flow */}
            <ScrollReveal delay={0.25}>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] rounded-full bg-white/10" />
                <div className="absolute bottom-[-20px] left-[-20px] w-[80px] h-[80px] rounded-full bg-white/5" />
                <div className="relative z-10">
                  <h4 className="text-base font-extrabold text-white mb-4">Get Started in 30 Seconds</h4>
                  <div className="space-y-3">
                    {[
                      { step: '1', text: 'Save our number on WhatsApp' },
                      { step: '2', text: 'Send "hi" to Munim-ji AI' },
                      { step: '3', text: 'Start managing your store!' },
                    ].map((s) => (
                      <div key={s.step} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                          {s.step}
                        </div>
                        <p className="text-sm text-white/90">{s.text}</p>
                      </div>
                    ))}
                  </div>

                  <motion.a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 inline-flex items-center gap-2.5 bg-white text-green-700 px-6 py-3 rounded-full text-sm font-bold shadow-xl shadow-black/20 hover:bg-green-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Open WhatsApp Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom — The Vision */}
        <ScrollReveal delay={0.1}>
          <div className="mt-16 bg-[#1a1a1d]/60 backdrop-blur-sm rounded-2xl p-8 border border-green-500/10 text-center">
            <p className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">The Vision</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-100 max-w-3xl mx-auto leading-tight">
              15 million kirana stores won&apos;t download an app.<br />
              But they&apos;ll reply to a <span className="text-green-400">WhatsApp message</span>.
            </h3>
            <p className="text-gray-400 mt-4 text-base max-w-2xl mx-auto leading-relaxed">
              BharatBazaar AI meets store owners where they already are. Voice notes in Hindi,
              photo-based bill scanning, inventory alerts, order placement — all through the
              app they use 50+ times a day. No barriers. No friction. Just commerce.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
              {[
                { icon: CheckCircle2, text: 'No app download' },
                { icon: CheckCircle2, text: 'Works on any phone' },
                { icon: CheckCircle2, text: 'Voice + text + photos' },
                { icon: CheckCircle2, text: 'Hindi, Tamil, Bengali...' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-gray-300">
                  <item.icon className="w-4 h-4 text-green-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
