import { useState, useEffect, useRef, ReactNode } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  ArrowRight, Camera, Receipt, MessageCircle,
  Database, Cpu, Shield, Eye, Server, Layers, Check,
  Globe, Store, TrendingUp, Mic, Brain, BarChart3,
  IndianRupee, Languages, Package, MapPin,
  FileText, Star, Calendar, ChevronRight, ChevronDown,
  Sun, Moon, Smartphone, Zap, Users, Truck,
  CheckCircle2,
} from 'lucide-react'
import { NavbarLogo } from '../components/TarazuLogo'
import { useTheme } from '../utils/ThemeContext'
import { useLanguage, LANGUAGES } from '../utils/LanguageContext'

/* ═══════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════ */

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Stagger({ children, className = '', stagger = 0.1 }: { children: ReactNode; className?: string; stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerChild({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CountUp({ end, suffix = '', prefix = '', className = '' }: { end: number; suffix?: string; prefix?: string; className?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const inc = end / 120
    const timer = setInterval(() => {
      start += inc
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, end])

  return <span ref={ref} className={className}>{prefix}{count.toLocaleString()}{suffix}</span>
}

function WordReveal({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

function Tilt3D({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8])
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 })

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) / r.width)
    y.set((e.clientY - r.top - r.height / 2) / r.height)
  }
  function onLeave() { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}>
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   BACKGROUND ELEMENTS
   ═══════════════════════════════════════ */

function NoiseOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" style={{
      opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat', backgroundSize: '128px',
    }} />
  )
}

function WarmOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[10%] right-[10%] w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[10%] -left-[5%] w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
    </div>
  )
}

function DotGrid({ dark }: { dark?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      opacity: 0.4,
      backgroundImage: dark
        ? 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)'
        : 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }} />
  )
}

/* ═══════════════════════════════════════
   WHATSAPP CHAT DATA
   ═══════════════════════════════════════ */
const CHAT_FLOW = [
  { type: 'user' as const, text: 'hi munim ji', time: '10:30 AM' },
  { type: 'bot' as const, text: 'Namaste! Main hoon Munim-ji, aapka AI business advisor. Kya madad karoon?\n\nType karo:\n  stock - inventory check\n  price - pricing advice\n  order - place order\n  bill - scan a bill\n  report - daily summary', time: '10:30 AM' },
  { type: 'user' as const, text: 'price dal', time: '10:31 AM' },
  { type: 'bot' as const, text: 'Toor Dal Pricing AI:\n\nMarket: Rs.142/kg\nYour price: Rs.155/kg\nSuggested: Rs.149/kg\n\n+18% more demand expected\nWeather impact: +5% (rain forecast)\n\nReply "set 149" to update price.', time: '10:31 AM' },
]

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function PremiumLanding() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up')
  const [langOpen, setLangOpen] = useState(false)
  const [visibleMessages, setVisibleMessages] = useState(0)
  const lastScrollY = useRef(0)
  const langRef = useRef<HTMLDivElement>(null)

  const currentLang = LANGUAGES.find(l => l.code === lang)!

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      setScrollDir(y > lastScrollY.current ? 'down' : 'up')
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Animate WhatsApp chat
  useEffect(() => {
    if (visibleMessages >= CHAT_FLOW.length) return
    const delay = CHAT_FLOW[visibleMessages]?.type === 'bot' ? 1200 : 600
    const timer = setTimeout(() => setVisibleMessages(v => v + 1), delay)
    return () => clearTimeout(timer)
  }, [visibleMessages])

  const goDemo = () => navigate('/login')

  const serif = "'Playfair Display', 'Instrument Serif', Georgia, serif"
  const mono = "'JetBrains Mono', monospace"
  const dk = theme === 'dark'

  // Theme-reactive palette
  const c = {
    bg: dk ? 'bg-[#0c0c0d]' : 'bg-[#FAFAF9]',
    bg2: dk ? 'bg-[#111113]' : 'bg-[#f5f5f4]',
    text: dk ? 'text-gray-100' : 'text-[#1C1917]',
    textMuted: dk ? 'text-gray-400' : 'text-[#78716C]',
    textFaint: dk ? 'text-gray-500' : 'text-[#a8a29e]',
    card: dk ? 'bg-[#1a1a1d]' : 'bg-white',
    cardBorder: dk ? 'border-[#2a2a2d]' : 'border-black/[0.04]',
    navBg: dk ? 'bg-[#0c0c0d]/80 backdrop-blur-xl shadow-sm border-b border-[#222]' : 'bg-white/70 backdrop-blur-xl shadow-sm border-b border-black/[0.04]',
    navLink: dk ? 'text-gray-400 hover:text-gray-100' : 'text-[#78716C] hover:text-[#1C1917]',
    btnSecBorder: dk ? 'border-[#333] hover:border-orange-500/50' : 'border-black/10 hover:border-[#F97316]/40',
    btnSecText: dk ? 'text-gray-300' : 'text-[#44403C]',
    btnSecBg: dk ? 'bg-white/5' : 'bg-white/60',
    inputBg: dk ? 'bg-white/5 border-[#333] text-gray-300' : 'bg-white/60 border-black/10 text-[#44403C]',
    dropBg: dk ? 'bg-[#1a1a1d] border-[#333]' : 'bg-white border-black/[0.06]',
    dropItem: dk ? 'text-gray-400 hover:bg-white/5' : 'text-[#78716C] hover:bg-[#f5f5f4]',
    dropActive: dk ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-[#F97316]',
  }

  return (
    <div className={`min-h-screen ${c.bg} ${c.text} overflow-hidden`} style={{ fontFamily: "'DM Sans', 'Satoshi', sans-serif" }}>
      <NoiseOverlay />

      {/* ═══ NAVBAR ═══ */}
      <motion.header
        animate={{ y: scrollDir === 'down' && scrolled ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? c.navBg : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="block"><NavbarLogo mode={dk ? 'dark' : 'light'} /></Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: t('nav.features'), href: '#features' },
              { label: t('nav.howItWorks'), href: '#how-it-works' },
              { label: t('nav.architecture'), href: '#architecture' },
              { label: 'Pricing', href: '#pricing' },
            ].map(link => (
              <a key={link.href} href={link.href}
                className={`text-sm ${c.navLink} transition-colors font-medium`}>{link.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={toggleTheme}
              className={`w-9 h-9 rounded-full flex items-center justify-center hover:text-[#F97316] ${c.btnSecText} ${c.btnSecBorder} ${c.btnSecBg} transition-all`}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors border ${c.inputBg} hover:border-[#F97316]/40`}>
                <Globe className="w-3.5 h-3.5 text-[#F97316]" />
                <span className="hidden sm:inline">{currentLang.native}</span>
                <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-1.5 z-50 overflow-hidden ${c.dropBg}`}
                  >
                    {LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          lang === l.code ? `${c.dropActive} font-semibold` : c.dropItem
                        }`}>
                        <span className="font-medium flex-1 text-left">{l.native}</span>
                        <span className={`text-xs ${c.textFaint}`}>{l.label}</span>
                        {lang === l.code && <Check className="w-3.5 h-3.5 text-[#F97316]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')}
              className={`hidden sm:flex items-center gap-2 ${c.btnSecText} px-4 py-2.5 rounded-full text-sm font-semibold border ${c.btnSecBorder} transition-colors`}>
              Register
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={goDemo}
              className="flex items-center gap-2 bg-[#F97316] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#EA580C] transition-colors shadow-lg shadow-orange-500/20">
              Try Live Demo <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <WarmOrbs />
        <DotGrid dark={dk} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="pt-8 lg:pt-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 bg-gradient-to-r from-orange-50 to-amber-50 text-[#F97316] border border-orange-200/60">
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}><Star className="w-3.5 h-3.5" /></motion.span>
                AI for Bharat Hackathon 2026
              </motion.div>

              <motion.h1 className="leading-[1.05] tracking-tight mb-6">
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
                  className={`block text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-bold ${c.text}`} style={{ fontFamily: serif }}>
                  {t('hero.title1')}
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
                  className="block text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-bold bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent"
                  style={{ fontFamily: serif }}>
                  {t('hero.title2')}
                </motion.span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className={`text-lg ${c.textMuted} max-w-lg leading-relaxed mb-8`}>
                {t('hero.desc')}
              </motion.p>

              {/* Platform Badges — Mobile + Web + WhatsApp */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="flex flex-wrap items-center gap-2 mb-8">
                {[
                  { icon: Smartphone, label: 'Mobile App', color: 'bg-violet-50 text-violet-600 border-violet-200/60' },
                  { icon: Globe, label: 'Web App', color: 'bg-blue-50 text-blue-600 border-blue-200/60' },
                  { icon: MessageCircle, label: 'WhatsApp', color: 'bg-green-50 text-green-600 border-green-200/60' },
                ].map(p => (
                  <span key={p.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${p.color}`}>
                    <p.icon className="w-3.5 h-3.5" /> {p.label}
                  </span>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                className="flex flex-wrap items-center gap-3 mb-10">
                <motion.button whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(249,115,22,0.35)' }} whileTap={{ scale: 0.97 }}
                  onClick={goDemo}
                  className="flex items-center gap-2.5 bg-[#F97316] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#EA580C] transition-all shadow-xl shadow-orange-500/20">
                  {t('hero.exploreDemo')} <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={goDemo}
                  className={`flex items-center gap-2 ${c.text} px-6 py-3.5 rounded-full text-sm font-semibold border ${c.btnSecBorder} transition-all`}>
                  {t('hero.askAI')} <MessageCircle className="w-4 h-4 text-[#F97316]" />
                </motion.button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                className={`flex items-center gap-6 text-sm ${c.textMuted}`} style={{ fontFamily: mono }}>
                {[{ n: 23, l: t('hero.stat1Label') }, { n: 13, l: 'APIs' }, { n: 6, l: t('hero.stat3Label') }, { n: 10, l: t('hero.stat2Label') }].map(s => (
                  <div key={s.l} className="flex items-center gap-1.5">
                    <CountUp end={s.n} className={`font-bold ${c.text}`} />
                    <span className="text-xs">{s.l}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right &#8212; 3D Phone */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="flex justify-center items-center relative">
              <Tilt3D className="relative">
                <div className="w-[280px] h-[560px] bg-[#1C1917] rounded-[3rem] p-3 shadow-2xl shadow-black/20 relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1C1917] rounded-b-2xl z-20" />
                  <div className="w-full h-full bg-[#FAFAF9] rounded-[2.4rem] overflow-hidden">
                    <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] px-4 pt-10 pb-4">
                      <p className="text-white/70 text-[10px]">Good morning</p>
                      <p className="text-white font-bold text-sm">Rajesh General Store</p>
                    </div>
                    <div className="px-3 -mt-3 space-y-2">
                      <div className="bg-white rounded-xl p-3 shadow-sm border border-black/[0.04]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] text-[#78716C] font-medium">Today&apos;s Revenue</span>
                          <span className="text-[8px] text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded-full">+18%</span>
                        </div>
                        <p className="text-lg font-bold text-[#1C1917]" style={{ fontFamily: mono }}>&#8377;12,850</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-xl p-2.5 shadow-sm border border-black/[0.04]">
                          <span className="text-[9px] text-[#78716C]">Items Sold</span>
                          <p className="text-sm font-bold" style={{ fontFamily: mono }}>47</p>
                        </div>
                        <div className="bg-white rounded-xl p-2.5 shadow-sm border border-black/[0.04]">
                          <span className="text-[9px] text-[#78716C]">Weekly</span>
                          <p className="text-sm font-bold" style={{ fontFamily: mono }}>&#8377;78,420</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-100">
                        <p className="text-[9px] text-amber-800 font-medium leading-relaxed">&#x1F327;&#xFE0F; Rain forecast &#8212; stock 20% more Dal &amp; Rice</p>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 shadow-sm border border-black/[0.04]">
                        <p className="text-[9px] text-[#78716C] font-medium mb-1.5">Top Sellers</p>
                        {['Basmati Rice 5kg', 'Toor Dal 1kg', 'Surf Excel'].map((item, i) => (
                          <div key={item} className="flex justify-between items-center py-0.5">
                            <span className="text-[9px] text-[#1C1917]">{i + 1}. {item}</span>
                            <span className="text-[8px] text-[#78716C]" style={{ fontFamily: mono }}>{['12', '8', '6'][i]} sold</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#44403C] rounded-full" />
                </div>

                {/* Floating cards */}
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-16 top-20 bg-white rounded-xl p-3 shadow-lg shadow-black/8 border border-black/[0.04] w-48">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center"><Camera className="w-3.5 h-3.5 text-[#F97316]" /></div>
                    <div><p className="text-[10px] font-semibold text-[#1C1917]">Bill scanned</p><p className="text-[8px] text-[#78716C]">5 items extracted</p></div>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -left-20 top-48 bg-white rounded-xl p-3 shadow-lg shadow-black/8 border border-black/[0.04] w-52">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center"><IndianRupee className="w-3.5 h-3.5 text-green-600" /></div>
                    <div><p className="text-[10px] font-semibold text-[#1C1917]">Suggested: &#8377;365</p><p className="text-[8px] text-[#78716C]">30.4% margin &#183; 92% confidence</p></div>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [-3, 7, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -right-10 bottom-32 bg-white rounded-xl p-3 shadow-lg shadow-black/8 border border-black/[0.04] w-48">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center text-sm">&#x1F9EE;</div>
                    <div><p className="text-[10px] font-semibold text-[#1C1917]">Munim-ji</p><p className="text-[8px] text-[#78716C]">Diwali stock ready!</p></div>
                  </div>
                </motion.div>
              </Tilt3D>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW — Mac Screen ═══ */}
      <section className={`py-24 px-6 lg:px-8 ${c.bg2} relative overflow-hidden`}>
        <DotGrid dark={dk} />
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('dashboard.label')}</p>
            <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${c.text}`} style={{ fontFamily: serif }}>
              {t('dashboard.title')} <span className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent">{t('dashboard.titleHighlight')}</span>
            </h2>
            <p className={`${c.textMuted} text-lg max-w-2xl mx-auto mt-4`}>
              {t('dashboard.desc')}
            </p>
          </Reveal>

          {/* Mac Window Frame */}
          <Reveal delay={0.2}>
            <Tilt3D className="max-w-5xl mx-auto">
              <div className={`${dk ? 'bg-[#1e1e20]' : 'bg-[#e8e8ed]'} rounded-2xl overflow-hidden shadow-2xl ${dk ? 'shadow-black/50' : 'shadow-black/20'} ring-1 ${dk ? 'ring-white/10' : 'ring-black/5'}`}>
                {/* Mac Title Bar */}
                <div className={`flex items-center gap-2 px-4 py-3 ${dk ? 'bg-[#2c2c2e]' : 'bg-[#e8e8ed]'} border-b ${dk ? 'border-white/5' : 'border-black/5'}`}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-colors" />
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <div className={`flex items-center gap-2 ${dk ? 'bg-white/5' : 'bg-white/60'} rounded-lg px-3 py-1 max-w-sm w-full`}>
                      <Shield className={`w-3 h-3 ${dk ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-[10px] ${dk ? 'text-white/50' : 'text-black/40'} font-medium`}>app.bharatbazaar.ai/dashboard</span>
                    </div>
                  </div>
                  <div className="w-[52px]" />
                </div>

                {/* Dashboard Content — Sidebar + Main */}
                <div className="flex">
                  {/* Sidebar */}
                  <div className={`w-48 ${dk ? 'bg-[#161618] border-r border-white/5' : 'bg-[#f7f7f8] border-r border-black/5'} p-3 hidden md:block`}>
                    <div className="flex items-center gap-2 mb-6 px-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">BB</span>
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold ${dk ? 'text-white' : 'text-[#1C1917]'}`}>BharatBazaar</p>
                        <p className={`text-[8px] ${dk ? 'text-white/40' : 'text-[#78716C]'}`}>Rajesh Store</p>
                      </div>
                    </div>
                    {[
                      { label: 'Dashboard', active: true },
                      { label: 'Inventory', active: false },
                      { label: 'AI Pricing', active: false },
                      { label: 'Invoices', active: false },
                      { label: 'Analytics', active: false },
                      { label: 'Sourcing', active: false },
                    ].map(item => (
                      <div key={item.label} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium mb-0.5 ${
                        item.active
                          ? 'bg-[#F97316]/10 text-[#F97316]'
                          : dk ? 'text-white/40 hover:bg-white/5' : 'text-[#78716C] hover:bg-black/[0.03]'
                      }`}>{item.label}</div>
                    ))}
                  </div>

                  {/* Main Dashboard Area */}
                  <div className={`flex-1 ${dk ? 'bg-[#0f0f11]' : 'bg-[#FAFAF9]'} p-5`}>
                    {/* Header Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className={`text-sm font-bold ${dk ? 'text-white' : 'text-[#1C1917]'}`}>Good morning, Rajesh</p>
                        <p className={`text-[10px] ${dk ? 'text-white/40' : 'text-[#78716C]'}`}>Lucknow, Uttar Pradesh &middot; Friday, 7 March 2026</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-medium ${dk ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                          All systems online
                        </div>
                      </div>
                    </div>

                    {/* KPI Row */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "Today's Revenue", value: '\u20B912,850', change: '+18.2%', up: true, icon: IndianRupee },
                        { label: 'Items Sold', value: '47', change: '+12 vs yesterday', up: true, icon: Package },
                        { label: 'Avg. Margin', value: '28.4%', change: '+3.2% this week', up: true, icon: TrendingUp },
                        { label: 'Active SKUs', value: '156', change: '5 low stock', up: false, icon: BarChart3 },
                      ].map(kpi => (
                        <div key={kpi.label} className={`${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-black/[0.04]'} rounded-xl p-3 border shadow-sm`}>
                          <div className="flex items-center justify-between mb-2">
                            <p className={`text-[9px] ${dk ? 'text-white/40' : 'text-[#78716C]'} font-medium`}>{kpi.label}</p>
                            <kpi.icon className={`w-3 h-3 ${dk ? 'text-white/20' : 'text-black/10'}`} />
                          </div>
                          <p className={`text-lg font-bold ${dk ? 'text-white' : 'text-[#1C1917]'}`} style={{ fontFamily: mono }}>{kpi.value}</p>
                          <p className={`text-[8px] font-medium mt-0.5 ${kpi.up ? 'text-green-500' : 'text-amber-500'}`}>{kpi.change}</p>
                        </div>
                      ))}
                    </div>

                    {/* Charts + Products Row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {/* Revenue Chart */}
                      <div className={`col-span-2 ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-black/[0.04]'} rounded-xl p-4 border shadow-sm`}>
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <p className={`text-[10px] font-semibold ${dk ? 'text-white' : 'text-[#1C1917]'}`}>Weekly Revenue</p>
                            <p className={`text-[8px] ${dk ? 'text-white/30' : 'text-[#a8a29e]'}`}>vs last week</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" /><span className={`text-[7px] ${dk ? 'text-white/40' : 'text-[#78716C]'}`}>This week</span></div>
                            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#F97316]/30" /><span className={`text-[7px] ${dk ? 'text-white/40' : 'text-[#78716C]'}`}>Last week</span></div>
                          </div>
                        </div>
                        <div className="flex items-end gap-1 h-24">
                          {[
                            { curr: 45, prev: 35 }, { curr: 62, prev: 50 }, { curr: 38, prev: 42 },
                            { curr: 75, prev: 60 }, { curr: 55, prev: 48 }, { curr: 82, prev: 65 }, { curr: 68, prev: 58 },
                          ].map((d, i) => (
                            <div key={i} className="flex-1 flex items-end gap-[2px]">
                              <motion.div initial={{ height: 0 }} whileInView={{ height: `${d.prev}%` }}
                                viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                                className="flex-1 rounded-t bg-[#F97316]/20" />
                              <motion.div initial={{ height: 0 }} whileInView={{ height: `${d.curr}%` }}
                                viewport={{ once: true }} transition={{ delay: i * 0.06 + 0.1, duration: 0.5 }}
                                className={`flex-1 rounded-t ${i === 5 ? 'bg-[#F97316]' : 'bg-[#F97316]/70'}`} />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1.5">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <span key={d} className={`text-[7px] ${dk ? 'text-white/20' : 'text-[#a8a29e]'} flex-1 text-center`}>{d}</span>
                          ))}
                        </div>
                      </div>

                      {/* Top Products */}
                      <div className={`${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-black/[0.04]'} rounded-xl p-4 border shadow-sm`}>
                        <p className={`text-[10px] font-semibold ${dk ? 'text-white' : 'text-[#1C1917]'} mb-3`}>Top Sellers Today</p>
                        {[
                          { name: 'Basmati Rice 5kg', sold: 42, pct: 85, revenue: '\u20B914,700' },
                          { name: 'Toor Dal 1kg', sold: 35, pct: 70, revenue: '\u20B95,250' },
                          { name: 'Surf Excel 1kg', sold: 28, pct: 55, revenue: '\u20B95,600' },
                          { name: 'Amul Butter 500g', sold: 22, pct: 44, revenue: '\u20B94,400' },
                          { name: 'Maggi 12-pack', sold: 18, pct: 36, revenue: '\u20B92,700' },
                        ].map(p => (
                          <div key={p.name} className="mb-2.5">
                            <div className="flex justify-between text-[8px] mb-0.5">
                              <span className={`${dk ? 'text-white/70' : 'text-[#44403C]'} font-medium`}>{p.name}</span>
                              <span className={`${dk ? 'text-white/40' : 'text-[#78716C]'}`} style={{ fontFamily: mono }}>{p.revenue}</span>
                            </div>
                            <div className={`h-1 ${dk ? 'bg-white/5' : 'bg-[#f5f5f4]'} rounded-full overflow-hidden`}>
                              <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.pct}%` }}
                                viewport={{ once: true }} transition={{ duration: 0.6 }}
                                className="h-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] rounded-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row — AI Alerts + Pricing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`${dk ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100'} rounded-xl p-3 border`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className={`w-3.5 h-3.5 ${dk ? 'text-amber-400' : 'text-amber-700'}`} />
                          <p className={`text-[10px] font-semibold ${dk ? 'text-amber-400' : 'text-amber-800'}`}>AI Insights</p>
                          <span className={`ml-auto text-[7px] px-1.5 py-0.5 rounded-full font-medium ${dk ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>3 new</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className={`flex items-start gap-2 ${dk ? 'text-amber-300/70' : 'text-amber-700'} text-[9px]`}>
                            <span className="mt-0.5">&#x1F327;&#xFE0F;</span><span>Rain forecast for tomorrow &mdash; stock +20% Dal &amp; Rice</span>
                          </div>
                          <div className={`flex items-start gap-2 ${dk ? 'text-amber-300/70' : 'text-amber-700'} text-[9px]`}>
                            <span className="mt-0.5">&#x1F4C8;</span><span>Surf Excel demand trending up &mdash; consider price increase</span>
                          </div>
                          <div className={`flex items-start gap-2 ${dk ? 'text-amber-300/70' : 'text-amber-700'} text-[9px]`}>
                            <span className="mt-0.5">&#x26A0;&#xFE0F;</span><span>Maggi 12-pack: 3 days until stockout &mdash; reorder now</span>
                          </div>
                        </div>
                      </div>
                      <div className={`${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-black/[0.04]'} rounded-xl p-3 border shadow-sm`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-[10px] font-semibold ${dk ? 'text-white' : 'text-[#1C1917]'}`}>AI Pricing &mdash; Basmati Rice 5kg</p>
                          <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-medium ${dk ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'}`}>92% confidence</span>
                        </div>
                        <div className="flex gap-2">
                          {[
                            { label: 'Economy', price: '\u20B9335', margin: '19.6%', color: dk ? 'border-blue-500/20 bg-blue-500/5' : 'border-blue-200 bg-blue-50' },
                            { label: 'Balanced', price: '\u20B9365', margin: '30.4%', color: dk ? 'border-green-500/20 bg-green-500/5 ring-1 ring-green-500/30' : 'border-green-200 bg-green-50 ring-1 ring-green-300' },
                            { label: 'Premium', price: '\u20B9399', margin: '42.5%', color: dk ? 'border-violet-500/20 bg-violet-500/5' : 'border-violet-200 bg-violet-50' },
                          ].map(s => (
                            <div key={s.label} className={`flex-1 rounded-lg p-2 border ${s.color}`}>
                              <p className={`text-[7px] ${dk ? 'text-white/40' : 'text-[#78716C]'} uppercase font-semibold`}>{s.label}</p>
                              <p className={`text-sm font-bold ${dk ? 'text-white' : 'text-[#1C1917]'} mt-0.5`} style={{ fontFamily: mono }}>{s.price}</p>
                              <p className={`text-[8px] ${dk ? 'text-white/30' : 'text-[#78716C]'}`}>{s.margin} margin</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3D>
          </Reveal>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal><p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('problem.label')}</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className={`text-3xl md:text-4xl lg:text-[3.2rem] leading-tight mb-16 max-w-3xl ${c.text}`} style={{ fontFamily: serif }}>
              <WordReveal text={t('problem.title')} />
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-5" stagger={0.12}>
            {[
              { icon: IndianRupee, title: 'Pricing by Gut Feeling', desc: 'Store owners set prices based on instinct, losing potential revenue every single day to competitors who know the market.', metric: '~\u20B950K lost/yr', color: 'bg-orange-50', iconColor: 'text-[#F97316]' },
              { icon: FileText, title: 'Paper Notebooks', desc: 'Inventory tracked in handwritten bahi-khata. No visibility into what sells, what rots, or what to reorder.', metric: '0% visibility', color: 'bg-teal-50', iconColor: 'text-[#0F766E]' },
              { icon: Languages, title: 'English-Only Tools', desc: '70% of store owners prefer regional languages. Enterprise tools cost \u20B950K+/month and speak only English.', metric: '70% excluded', color: 'bg-violet-50', iconColor: 'text-[#7C3AED]' },
              { icon: MessageCircle, title: 'No Digital Presence', desc: '500 million Indians on WhatsApp. Yet most stores have zero digital ordering, zero online price discovery.', metric: '500M on WhatsApp', color: 'bg-green-50', iconColor: 'text-green-600' },
            ].map(card => (
              <StaggerChild key={card.title}>
                <motion.div whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.08)' }}
                  className={`${card.color} rounded-2xl p-7 border border-black/[0.04] relative overflow-hidden cursor-default transition-all`}>
                  <div className="absolute top-5 right-5">
                    <span className="text-[10px] font-bold text-[#78716C] bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-black/[0.04]"
                      style={{ fontFamily: mono }}>{card.metric}</span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1C1917] mb-2">{card.title}</h3>
                  <p className="text-sm text-[#78716C] leading-relaxed">{card.desc}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </Stagger>

          <Reveal delay={0.3}>
            <div className="mt-12 bg-[#1C1917] rounded-2xl px-8 py-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {[{ n: 12, s: 'M+', l: 'Kirana Stores' }, { p: '$', n: 1.3, s: 'T', l: 'Market Size' }, { n: 90, s: '%', l: 'Undigitized' }].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: mono }}>
                    {s.p || ''}<CountUp end={s.n} suffix={s.s} />
                  </p>
                  <p className="text-xs text-white/50 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ MARKETPLACE ECOSYSTEM ═══ */}
      <section className="py-24 px-6 lg:px-8 bg-[#1C1917] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.4,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('marketplace.label')}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ fontFamily: serif }}>
              {t('marketplace.title1')}<br />
              <span className="bg-gradient-to-r from-[#F97316] to-[#0D9488] bg-clip-text text-transparent">{t('marketplace.title2')}</span>
            </h2>
            <p className="text-white/50 mt-4 text-lg max-w-2xl mx-auto">
              {t('marketplace.desc')}
            </p>
          </Reveal>

          {/* Three Role Cards */}
          <Stagger className="grid md:grid-cols-3 gap-5 mb-12" stagger={0.12}>
            {[
              {
                role: 'Retailer', tagline: 'Buy Smart. Sell Smarter.',
                desc: 'AI-powered pricing, inventory management, WhatsApp ordering, and customer khata.',
                features: ['Smart Pricing AI', 'Inventory Alerts', 'WhatsApp Orders', 'GST Invoicing'],
                color: 'from-orange-500 to-amber-500', borderColor: 'border-orange-500/20', bgColor: 'bg-orange-500/5',
                iconBg: 'bg-orange-500', count: '15M+', countLabel: 'Kirana Stores',
              },
              {
                role: 'Supplier', tagline: 'Reach Every Store. Directly.',
                desc: 'List your products, get verified, reach thousands of retailers. No middlemen. Direct B2B wholesale.',
                features: ['Product Listings', 'Verified Badge', 'Direct Orders', 'Analytics Dashboard'],
                color: 'from-teal-500 to-emerald-500', borderColor: 'border-teal-500/20', bgColor: 'bg-teal-500/5',
                iconBg: 'bg-teal-500', count: '40+', countLabel: 'Verified Suppliers',
              },
              {
                role: 'Customer', tagline: 'Discover. Compare. Save.',
                desc: 'Browse products from local stores, compare prices across your city, and discover the best deals.',
                features: ['Price Comparison', 'Store Discovery', 'Deal Alerts', 'Multi-language'],
                color: 'from-purple-500 to-violet-500', borderColor: 'border-purple-500/20', bgColor: 'bg-purple-500/5',
                iconBg: 'bg-purple-500', count: '10', countLabel: 'Cities Covered',
              },
            ].map(item => (
              <StaggerChild key={item.role}>
                <motion.div whileHover={{ y: -6, scale: 1.01 }}
                  className={`${item.bgColor} rounded-2xl p-6 border ${item.borderColor} h-full relative overflow-hidden`}>
                  <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <span className="text-white text-lg font-bold">{item.role.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.role}</h3>
                  <p className={`text-sm font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-3`}>{item.tagline}</p>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{item.desc}</p>
                  <div className="space-y-1.5 mb-5">
                    {item.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-white/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <p className="text-2xl font-bold text-white">{item.count}</p>
                      <p className="text-[10px] text-white/40">{item.countLabel}</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={goDemo}
                      className={`flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${item.color} text-white rounded-full text-xs font-semibold shadow-lg`}>
                      Join as {item.role} <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </Stagger>

          {/* Connection Flow */}
          <Reveal>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2"><Store className="w-8 h-8 text-orange-400" /></div>
                  <p className="text-sm font-bold text-white/90">Supplier</p>
                  <p className="text-[10px] text-white/40">Lists Products</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 md:w-20 h-px bg-gradient-to-r from-orange-500 to-teal-500" />
                  <Zap className="w-5 h-5 text-[#F97316]" />
                  <div className="w-12 md:w-20 h-px bg-gradient-to-r from-teal-500 to-purple-500" />
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#F97316]/20 to-[#0D9488]/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-orange-500/30">
                    <Brain className="w-10 h-10 text-[#F97316]" />
                  </div>
                  <p className="text-sm font-bold text-white/90">BharatBazaar AI</p>
                  <p className="text-[10px] text-white/40">Matches &amp; Optimizes</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 md:w-20 h-px bg-gradient-to-r from-purple-500 to-teal-500" />
                  <Zap className="w-5 h-5 text-[#0D9488]" />
                  <div className="w-12 md:w-20 h-px bg-gradient-to-r from-teal-500 to-orange-500" />
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2"><Package className="w-8 h-8 text-teal-400" /></div>
                  <p className="text-sm font-bold text-white/90">Retailer</p>
                  <p className="text-[10px] text-white/40">Orders &amp; Sells</p>
                </div>
              </div>
              <p className="text-center text-xs text-white/30 mt-6">
                AI-powered matching connects the right suppliers with the right retailers. Smart pricing ensures everyone profits.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ YOUR DAILY ACTIONS = YOUR DATA ═══ */}
      <section id="how-it-works" className={`py-24 px-6 lg:px-8 ${c.bg2} relative overflow-hidden`}>
        <WarmOrbs />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('daily.label')}</p>
            <h2 className={`text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight ${c.text}`} style={{ fontFamily: serif }}>
              {t('daily.title')}
            </h2>
            <p className={`${c.textMuted} text-lg max-w-2xl mx-auto mt-4`}>
              {t('daily.desc')}
            </p>
          </Reveal>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12" stagger={0.12}>
            {[
              {
                icon: Store, color: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-100',
                title: 'Setup Your Store', subtitle: 'Catalog personalized',
                desc: 'Tell us what you sell during onboarding \u2192 inventory seeded with real products, prices, and sell rates',
                data: 'Product catalog, category, pricing baseline',
              },
              {
                icon: Camera, color: 'bg-orange-50', iconColor: 'text-[#F97316]', borderColor: 'border-orange-100',
                title: 'Scan Purchase Bills', subtitle: 'Stock auto-updated',
                desc: 'Photograph any wholesaler bill \u2192 AI extracts products, quantities, prices \u2192 inventory grows automatically',
                data: 'Cost prices, supplier info, stock levels',
              },
              {
                icon: Receipt, color: 'bg-teal-50', iconColor: 'text-[#0F766E]', borderColor: 'border-teal-100',
                title: 'Generate Sales Invoices', subtitle: 'Sales tracked live',
                desc: 'Every bill = a sale recorded \u2192 today\u0027s revenue, items sold, top sellers \u2014 all updated in real-time',
                data: 'Revenue, demand patterns, top sellers',
              },
              {
                icon: MessageCircle, color: 'bg-green-50', iconColor: 'text-green-600', borderColor: 'border-green-100',
                title: 'Chat on WhatsApp', subtitle: 'Orders processed',
                desc: '"Order 50 Surf Excel" or "Price for Tata Salt" \u2192 AI processes every message into structured data',
                data: 'Orders, price checks, stock queries',
              },
            ].map(item => (
              <StaggerChild key={item.title}>
                <motion.div whileHover={{ y: -4 }}
                  className={`${item.color} rounded-2xl p-6 border ${item.borderColor} h-full transition-all`}>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <h4 className="text-lg font-bold text-[#1C1917] mb-1">{item.title}</h4>
                  <p className="text-xs font-semibold text-[#F97316] mb-3">{item.subtitle}</p>
                  <p className="text-sm text-[#78716C] leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex items-center gap-2 text-xs text-[#78716C] bg-white/80 px-3 py-2 rounded-lg border border-black/[0.04]">
                    <Database className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                    <span className="font-medium">Data captured:</span> {item.data}
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </Stagger>

          {/* Data Flow Diagram */}
          <Reveal>
            <div className="bg-white rounded-2xl p-8 border border-black/[0.04] shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                {[
                  { label: 'Store Setup', sub: 'Onboarding seeds your catalog', icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Stock In', sub: 'Scan bills, wholesale orders', icon: Camera, color: 'text-[#F97316]', bg: 'bg-orange-50' },
                  { label: 'Sales Out', sub: 'Invoices track what sells', icon: Receipt, color: 'text-[#0F766E]', bg: 'bg-teal-50' },
                  { label: 'AI Intelligence', sub: 'Revenue, trends, forecasts', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3 md:gap-4">
                    <div className="text-center">
                      <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                        <step.icon className={`w-7 h-7 ${step.color}`} />
                      </div>
                      <p className="text-xs font-bold text-[#1C1917]">{step.label}</p>
                      <p className="text-[9px] text-[#78716C] max-w-[120px]">{step.sub}</p>
                    </div>
                    {i < 3 && <ArrowRight className="w-5 h-5 text-[#d6d3d1] hidden md:block" />}
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-[#78716C] mt-6">
                <span className="text-[#F97316] font-semibold">No manual data entry.</span> Every interaction with BharatBazaar becomes business intelligence &#8212; stored in DynamoDB, analyzed by Bedrock AI.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ BENTO FEATURES ═══ */}
      <section id="features" className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <DotGrid dark={dk} />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('landing.features.label')}</p>
            <h2 className={`text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight ${c.text}`} style={{ fontFamily: serif }}>
              {t('landing.features.title1')}<br />
              <span className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent">{t('landing.features.title2')}</span>
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.08}>
            {/* AI Pricing — 2 cols */}
            <StaggerChild className="col-span-2">
              <motion.div whileHover={{ scale: 1.01 }}
                className={`${dk ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/15' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100/80'} rounded-2xl p-6 border overflow-hidden cursor-default h-full`}>
                <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-[2px] mb-2">AI Pricing Engine</p>
                <p className={`text-sm ${c.textMuted} mb-5 max-w-sm`}>3 strategies per product. City-aware. Festival-adjusted. Competitor-informed.</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Competitive', price: '\u20B9335', pct: '19.6%', color: dk ? 'border-blue-500/20 bg-blue-500/5' : 'border-blue-200 bg-blue-50', rec: false },
                    { label: 'Balanced', price: '\u20B9365', pct: '30.4%', color: dk ? 'border-green-500/20 bg-green-500/5' : 'border-green-200 bg-green-50', rec: true },
                    { label: 'Premium', price: '\u20B9399', pct: '42.5%', color: dk ? 'border-violet-500/20 bg-violet-500/5' : 'border-violet-200 bg-violet-50', rec: false },
                  ].map(s => (
                    <motion.div key={s.label} whileHover={{ y: -4 }}
                      className={`${s.color} rounded-xl p-3 border flex-1 ${s.rec ? dk ? 'ring-2 ring-green-500/30' : 'ring-2 ring-green-300' : ''}`}>
                      <p className={`text-[9px] font-semibold ${c.textMuted} uppercase`}>{s.label}</p>
                      <p className={`text-lg font-bold ${c.text} mt-1`} style={{ fontFamily: mono }}>{s.price}</p>
                      <p className={`text-[10px] ${c.textMuted}`}>Margin: {s.pct}</p>
                      {s.rec && <p className="text-[8px] text-green-600 font-semibold mt-1">RECOMMENDED</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </StaggerChild>

            {/* Munim-ji Chat */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.01 }}
                className={`h-full ${dk ? 'bg-green-500/5 border-green-500/15' : 'bg-green-50 border-green-100/80'} rounded-2xl p-5 border overflow-hidden cursor-default`}>
                <p className={`text-[10px] font-bold ${dk ? 'text-green-400' : 'text-green-700'} uppercase tracking-[2px] mb-3`}>Munim-ji AI</p>
                <div className="space-y-2">
                  <div className="flex justify-end"><div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-2.5 py-1.5 max-w-[90%]"><p className="text-[9px] text-[#1C1917]">price dal</p></div></div>
                  <div className="flex justify-start">
                    <div className={`${dk ? 'bg-[#1a1a1d]' : 'bg-white'} rounded-xl rounded-tl-sm px-2.5 py-1.5 max-w-[90%] shadow-sm`}>
                      <p className={`text-[9px] ${c.text}`}>Toor Dal 1kg:</p>
                      <p className={`text-[9px] ${c.textMuted}`}>Suggested: &#8377;149</p>
                      <p className="text-[9px] text-green-600 font-semibold">+18% demand</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerChild>

            {/* Bill Scanner */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className={`h-full ${c.card} rounded-2xl p-5 border ${c.cardBorder} shadow-sm overflow-hidden cursor-default`}>
                <Camera className="w-6 h-6 text-[#F97316] mb-2" />
                <p className={`text-sm font-bold ${c.text}`}>Bill Scanner</p>
                <p className={`text-[10px] ${c.textMuted} mt-1`}>Photo &rarr; AI extracts items &rarr; Inventory auto-filled</p>
                <div className={`mt-2 ${dk ? 'bg-orange-500/10' : 'bg-orange-50'} rounded-lg px-2 py-1`}><p className="text-[8px] text-[#F97316] font-semibold" style={{ fontFamily: mono }}>98% accuracy</p></div>
              </motion.div>
            </StaggerChild>

            {/* Voice */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className={`h-full ${dk ? 'bg-violet-500/5 border-violet-500/15' : 'bg-violet-50 border-violet-100/80'} rounded-2xl p-5 border overflow-hidden cursor-default`}>
                <Mic className="w-6 h-6 text-[#7C3AED] mb-2" />
                <p className={`text-sm font-bold ${c.text}`}>Voice Input</p>
                <p className={`text-[10px] ${c.textMuted} mt-1`}>Speak Hindi, Tamil, Bengali...</p>
                <motion.div animate={{ scaleX: [1, 1.2, 0.8, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="mt-2 h-4 bg-gradient-to-r from-violet-300 via-violet-400 to-violet-300 rounded-full opacity-40" />
              </motion.div>
            </StaggerChild>

            {/* WhatsApp wide */}
            <StaggerChild className="col-span-2">
              <motion.div whileHover={{ scale: 1.01 }}
                className={`h-full ${dk ? 'bg-green-500/5 border-green-500/15' : 'bg-green-50 border-green-100/80'} rounded-2xl p-5 border overflow-hidden cursor-default flex items-center gap-6`}>
                <div className="flex-1">
                  <p className={`text-[10px] font-bold ${dk ? 'text-green-400' : 'text-green-700'} uppercase tracking-[2px] mb-1`}>WhatsApp Integration</p>
                  <p className={`text-sm font-bold ${c.text}`}>WhatsApp-First. Always Connected.</p>
                  <p className={`text-xs ${c.textMuted} mt-1`}>500M+ Indians on WhatsApp. Send &quot;hi&quot; to start.</p>
                </div>
                <div className={`flex-shrink-0 ${dk ? 'bg-[#1a1a1d] border-green-500/15' : 'bg-white border-green-100'} rounded-xl p-3 shadow-sm border w-44`}>
                  <div className="flex gap-1 mb-1"><div className="bg-[#DCF8C6] rounded-lg px-2 py-1 text-[8px] text-[#1C1917]">Order 50 Surf Excel</div></div>
                  <div className="flex gap-1"><div className={`${dk ? 'bg-[#222] border-[#333]' : 'bg-white border-gray-100'} border rounded-lg px-2 py-1 text-[8px] ${c.text}`}>Done! &#8377;9,450 total</div></div>
                </div>
              </motion.div>
            </StaggerChild>

            {/* 6 Languages */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className={`h-full ${dk ? 'bg-amber-500/5 border-amber-500/15' : 'bg-amber-50 border-amber-100/80'} rounded-2xl p-5 border overflow-hidden cursor-default`}>
                <Globe className={`w-5 h-5 ${dk ? 'text-amber-400' : 'text-amber-600'} mb-2`} />
                <p className={`text-sm font-bold ${c.text}`}>6 Languages</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {['\u0939\u093F\u0902\u0926\u0940', '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD', '\u09AC\u09BE\u0982\u09B2\u09BE', '\u0A97\u0AC1\u0A9C', '\u092E\u0930\u093E\u0920\u0940', 'EN'].map(l => (
                    <span key={l} className={`text-[9px] ${dk ? 'bg-white/5 border-amber-500/15 text-white/70' : 'bg-white border-amber-100 text-[#1C1917]'} px-2 py-0.5 rounded-full border font-medium`}>{l}</span>
                  ))}
                </div>
              </motion.div>
            </StaggerChild>

            {/* 10 Cities */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className={`h-full ${dk ? 'bg-teal-500/5 border-teal-500/15' : 'bg-teal-50 border-teal-100/80'} rounded-2xl p-5 border overflow-hidden cursor-default`}>
                <MapPin className="w-5 h-5 text-[#0F766E] mb-2" />
                <p className={`text-sm font-bold ${c.text}`}>10 Cities</p>
                <p className={`text-[9px] ${c.textMuted} mt-1 leading-relaxed`}>Mumbai &middot; Delhi &middot; Bangalore &middot; Chennai &middot; Kolkata &middot; Lucknow &middot; Pune &middot; Jaipur &middot; Ahmedabad &middot; Indore</p>
              </motion.div>
            </StaggerChild>

            {/* Festival Calendar */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className={`h-full ${dk ? 'bg-rose-500/5 border-rose-500/15' : 'bg-rose-50 border-rose-100/80'} rounded-2xl p-5 border overflow-hidden cursor-default`}>
                <Calendar className={`w-5 h-5 ${dk ? 'text-rose-400' : 'text-rose-600'} mb-2`} />
                <p className={`text-sm font-bold ${c.text}`}>Festival Alerts</p>
                <p className={`text-[9px] ${c.textMuted} mt-1`}>Diwali &middot; Holi &middot; Eid &middot; Pongal &middot; Navratri</p>
                <p className={`text-[8px] ${dk ? 'text-rose-400' : 'text-rose-600'} font-semibold mt-1`}>Demand surge predictions</p>
              </motion.div>
            </StaggerChild>

            {/* Content Studio */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className={`h-full ${dk ? 'bg-blue-500/5 border-blue-500/15' : 'bg-blue-50 border-blue-100/80'} rounded-2xl p-5 border overflow-hidden cursor-default`}>
                <Languages className={`w-5 h-5 ${dk ? 'text-blue-400' : 'text-blue-600'} mb-2`} />
                <p className={`text-sm font-bold ${c.text}`}>Content Studio</p>
                <p className={`text-[9px] ${c.textMuted} mt-1`}>Generate listings for Instagram, Amazon, Flipkart, JioMart in 6 languages</p>
              </motion.div>
            </StaggerChild>
          </Stagger>
        </div>
      </section>

      {/* ═══ WHATSAPP DEMO ═══ */}
      <section className={`py-24 px-6 lg:px-8 ${dk ? 'bg-gradient-to-b from-[#0a1a0a] to-[#0c0c0d]' : 'bg-gradient-to-b from-[#f0fdf4] to-[#FAFAF9]'} relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-green-200">
              <MessageCircle className="w-4 h-4" /> {t('whatsapp.badge')}
            </div>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${c.text}`} style={{ fontFamily: serif }}>
              {t('whatsapp.title1')}<br /><span className="text-green-600">{t('whatsapp.title2')}</span>
            </h2>
            <p className={`${c.textMuted} mt-5 text-lg max-w-2xl mx-auto leading-relaxed`}>
              {t('whatsapp.desc')}
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left &#8212; Why WhatsApp */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal>
                <div className={`${c.card} rounded-2xl p-6 border ${dk ? 'border-green-500/15' : 'border-green-100'} shadow-sm`}>
                  <h3 className={`text-lg font-bold ${c.text} mb-1`}>Why WhatsApp-First?</h3>
                  <p className={`text-xs ${c.textMuted} mb-5`}>India&apos;s reality demands it</p>
                  <div className="space-y-4">
                    {[
                      { icon: Smartphone, title: 'Already on every phone', desc: 'No downloads, no signups. Store owners already know WhatsApp.' },
                      { icon: Mic, title: 'Voice messages supported', desc: "Can't type? Just send a voice note in Hindi. AI understands." },
                      { icon: Store, title: 'Works from the shop counter', desc: 'Quick replies between customers. No time wasted on complex UIs.' },
                      { icon: Zap, title: 'Works on 2G/3G networks', desc: 'Text-based AI works even in areas with poor internet connectivity.' },
                    ].map(item => (
                      <div key={item.title} className="flex gap-3">
                        <div className={`w-9 h-9 rounded-lg ${dk ? 'bg-green-500/10 border-green-500/15' : 'bg-green-50 border-green-100'} flex items-center justify-center flex-shrink-0 border`}>
                          <item.icon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${c.text}`}>{item.title}</p>
                          <p className={`text-xs ${c.textMuted} mt-0.5 leading-relaxed`}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: '500M+', label: 'WhatsApp users in India' },
                    { value: '15M+', label: 'Kirana stores nationwide' },
                    { value: '0', label: 'App downloads needed' },
                    { value: '2G', label: 'Works on slow networks' },
                  ].map(stat => (
                    <div key={stat.label} className={`${c.card} rounded-xl p-4 border ${dk ? 'border-green-500/15' : 'border-green-100'} text-center shadow-sm`}>
                      <p className="text-xl font-bold text-green-600">{stat.value}</p>
                      <p className={`text-[10px] ${c.textMuted} mt-1`}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Center &#8212; WhatsApp Phone Mockup */}
            <Reveal delay={0.15} className="lg:col-span-1 flex justify-center">
              <div className="w-[280px] bg-[#1C1917] rounded-[2.5rem] p-2.5 shadow-2xl shadow-black/20 relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-green-500/20 blur-xl rounded-full" />
                <div className="w-full bg-[#ECE5DD] rounded-[2rem] overflow-hidden">
                  <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-3 py-2 pt-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">BB</div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold">Munim-ji AI</p>
                      <p className="text-[9px] text-white/70">online</p>
                    </div>
                  </div>
                  <div className="px-2 py-3 space-y-2 min-h-[360px] max-h-[360px] overflow-hidden relative">
                    <AnimatePresence>
                      {CHAT_FLOW.slice(0, visibleMessages).map((msg, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`${msg.type === 'user' ? 'bg-[#DCF8C6] rounded-xl rounded-tr-sm' : 'bg-white rounded-xl rounded-tl-sm'} px-2.5 py-1.5 max-w-[85%] shadow-sm`}>
                            <p className="text-[10px] text-slate-800 leading-relaxed whitespace-pre-line">{msg.text}</p>
                            <p className="text-[7px] text-slate-400 text-right mt-0.5">{msg.time} {msg.type === 'user' && ' \u2713\u2713'}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {visibleMessages < CHAT_FLOW.length && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
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
                  <div className="bg-[#F0F0F0] px-2 py-1.5 flex items-center gap-1.5">
                    <div className="flex-1 bg-white rounded-full px-2.5 py-1.5"><p className="text-[10px] text-slate-400">Type a message...</p></div>
                    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center"><Mic className="w-3 h-3 text-white" /></div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right &#8212; All Features + CTA */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal delay={0.1}>
                <div className={`${c.card} rounded-2xl p-6 border ${dk ? 'border-green-500/15' : 'border-green-100'} shadow-sm`}>
                  <h3 className={`text-lg font-bold ${c.text} mb-1`}>Every Feature on WhatsApp</h3>
                  <p className={`text-xs ${c.textMuted} mb-5`}>Just type a command or send a voice note</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { icon: Package, label: 'Inventory Check', cmd: '"stock"', desc: 'Real-time stock levels' },
                      { icon: IndianRupee, label: 'Smart Pricing', cmd: '"price [item]"', desc: 'AI-powered price suggestions' },
                      { icon: Truck, label: 'Place Orders', cmd: '"order [items]"', desc: 'Restock from wholesalers' },
                      { icon: Camera, label: 'Scan Bills', cmd: 'Send photo', desc: 'OCR bill scanning via camera' },
                      { icon: BarChart3, label: 'Daily Reports', cmd: '"report"', desc: 'Sales & profit summary' },
                      { icon: Receipt, label: 'GST Invoice', cmd: '"bill [customer]"', desc: 'Generate & share invoices' },
                      { icon: Users, label: 'Customer Khata', cmd: '"khata [name]"', desc: 'Track credit & payments' },
                      { icon: Globe, label: 'Multi-language', cmd: '"hindi / tamil"', desc: 'Switch language anytime' },
                    ].map(feat => (
                      <div key={feat.label} className={`${c.bg2} rounded-xl p-3 border ${c.cardBorder} ${dk ? 'hover:border-green-500/30' : 'hover:border-green-200'} transition-colors`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <feat.icon className="w-3.5 h-3.5 text-green-600" />
                          <p className={`text-xs font-bold ${c.text}`}>{feat.label}</p>
                        </div>
                        <p className="text-[10px] text-green-600 font-medium mb-0.5" style={{ fontFamily: mono }}>{feat.cmd}</p>
                        <p className={`text-[10px] ${c.textMuted}`}>{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-base font-bold text-white mb-4">Get Started in 30 Seconds</h4>
                    <div className="space-y-3">
                      {[
                        { step: '1', text: 'Save our number on WhatsApp' },
                        { step: '2', text: 'Send "hi" to Munim-ji AI' },
                        { step: '3', text: 'Start managing your store!' },
                      ].map(s => (
                        <div key={s.step} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">{s.step}</div>
                          <p className="text-sm text-white/90">{s.text}</p>
                        </div>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goDemo}
                      className="mt-6 inline-flex items-center gap-2.5 bg-white text-green-700 px-6 py-3 rounded-full text-sm font-bold shadow-xl shadow-black/20 hover:bg-green-50 transition-colors">
                      <MessageCircle className="w-4 h-4" /> Open WhatsApp Now <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* All Three Platforms */}
          <Reveal delay={0.1}>
            <div className={`mt-16 ${c.card} rounded-2xl p-8 border ${c.cardBorder} shadow-sm`}>
              <div className="text-center mb-6">
                <p className={`text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-3`}>Available Everywhere</p>
                <h3 className={`text-2xl md:text-3xl font-bold ${c.text} max-w-3xl mx-auto leading-tight`}>
                  Start on <span className="text-green-600">WhatsApp</span>. Scale to <span className="text-blue-600">Web</span> and <span className="text-violet-600">Mobile</span>.
                </h3>
                <p className={`${c.textMuted} mt-4 text-base max-w-2xl mx-auto leading-relaxed`}>
                  WhatsApp is the entry point. When you&apos;re ready for deeper analytics, switch to the full web dashboard or mobile app. All your data syncs across every platform.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                {[
                  { icon: MessageCircle, label: 'WhatsApp', desc: 'Quick actions', color: 'text-green-600' },
                  { icon: Globe, label: 'Web App', desc: 'Full dashboard', color: 'text-blue-600' },
                  { icon: Smartphone, label: 'Mobile', desc: 'On the go', color: 'text-violet-600' },
                ].map(p => (
                  <div key={p.label} className="text-center">
                    <div className={`w-12 h-12 rounded-xl ${dk ? 'bg-white/5' : 'bg-[#f5f5f4]'} flex items-center justify-center mx-auto mb-2`}>
                      <p.icon className={`w-6 h-6 ${p.color}`} />
                    </div>
                    <p className={`text-sm font-bold ${c.text}`}>{p.label}</p>
                    <p className={`text-[10px] ${c.textMuted}`}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ AVAILABLE ON 3 PLATFORMS ═══ */}
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <DotGrid dark={dk} />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <Reveal>
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('platform.label')}</p>
            <h2 className={`text-3xl md:text-4xl font-bold leading-tight mb-4 ${c.text}`} style={{ fontFamily: serif }}>
              {t('platform.title1')} <span className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent">{t('platform.title2')}</span>
            </h2>
            <p className={`${c.textMuted} text-lg max-w-2xl mx-auto mb-16`}>
              {t('platform.desc')}
            </p>
          </Reveal>

          <Stagger className="grid md:grid-cols-3 gap-6" stagger={0.12}>
            {[
              {
                icon: Globe, title: 'Web App', subtitle: 'Full Dashboard Experience',
                desc: 'React 18 + TypeScript. Recharts, AI pricing, invoice generator, inventory management, competitor analysis &#8212; all in the browser.',
                features: ['23 interactive pages', 'Real-time analytics', 'GST invoice generation', 'Dark/light theme'],
                color: 'bg-blue-50', borderColor: 'border-blue-100', iconColor: 'text-blue-600', accentColor: 'from-blue-500 to-indigo-500',
              },
              {
                icon: Smartphone, title: 'Mobile App', subtitle: 'Native-Feel PWA',
                desc: 'Responsive design optimized for phones. Bill scanner uses camera, voice input via microphone. Works offline.',
                features: ['Camera bill scanning', 'Voice commands', 'Push notifications', 'Offline support'],
                color: 'bg-violet-50', borderColor: 'border-violet-100', iconColor: 'text-violet-600', accentColor: 'from-violet-500 to-purple-500',
              },
              {
                icon: MessageCircle, title: 'WhatsApp Bot', subtitle: 'Munim-ji AI',
                desc: 'Twilio-powered chatbot. Every feature accessible via text or voice &#8212; inventory, pricing, orders, bills, reports.',
                features: ['Zero downloads', 'Voice note support', '6 languages', 'Works on 2G'],
                color: 'bg-green-50', borderColor: 'border-green-100', iconColor: 'text-green-600', accentColor: 'from-green-500 to-emerald-500',
              },
            ].map(platform => (
              <StaggerChild key={platform.title}>
                <Tilt3D>
                  <motion.div whileHover={{ y: -6 }}
                    className={`${platform.color} rounded-2xl p-6 border ${platform.borderColor} h-full text-left transition-all`}>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <platform.icon className={`w-6 h-6 ${platform.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-[#1C1917] mb-0.5">{platform.title}</h3>
                    <p className={`text-xs font-semibold bg-gradient-to-r ${platform.accentColor} bg-clip-text text-transparent mb-3`}>{platform.subtitle}</p>
                    <p className="text-sm text-[#78716C] leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: platform.desc }} />
                    <div className="space-y-1.5">
                      {platform.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-[#44403C]">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {f}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </Tilt3D>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══ DEMO CTA ═══ */}
      <section className={`py-24 px-6 lg:px-8 ${c.bg2} relative overflow-hidden`}>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">TRY IT NOW</p>
            <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight mb-16" style={{ fontFamily: serif }}>
              Speak Hindi. Scan Bills.<br /><span className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent">Get Intelligence.</span>
            </h2>
          </Reveal>

          <Stagger className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-16">
            {[
              { icon: Camera, label: 'Scan', desc: 'Photo any bill', color: 'bg-orange-50', iconColor: 'text-[#F97316]' },
              { icon: Brain, label: 'AI Analyzes', desc: '4-tier model chain', color: 'bg-violet-50', iconColor: 'text-[#7C3AED]' },
              { icon: BarChart3, label: 'Intelligence', desc: 'Pricing + forecasts', color: 'bg-teal-50', iconColor: 'text-[#0F766E]' },
            ].map((step, i) => (
              <StaggerChild key={step.label} className="flex items-center gap-4">
                {i > 0 && <div className="hidden md:block w-16 border-t-2 border-dashed border-[#d6d3d1]" />}
                <div className="text-center">
                  <motion.div whileHover={{ scale: 1.05 }}
                    className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-black/[0.04]`}>
                    <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                  </motion.div>
                  <p className="text-sm font-bold text-[#1C1917]">{step.label}</p>
                  <p className="text-[10px] text-[#78716C]">{step.desc}</p>
                </div>
              </StaggerChild>
            ))}
          </Stagger>

          <Reveal>
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(249,115,22,0.35)' }} whileTap={{ scale: 0.97 }}
              onClick={goDemo}
              className="inline-flex items-center gap-2.5 bg-[#F97316] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#EA580C] transition-all shadow-xl shadow-orange-500/20">
              Launch Live Demo <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Reveal>
        </div>
      </section>

      {/* ═══ ARCHITECTURE ═══ */}
      <section id="architecture" className={`py-24 px-6 lg:px-8 relative overflow-hidden ${dk ? 'bg-[#0c0c0d]' : 'bg-[#1C1917]'}`}>
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('landing.arch.label')}</p>
            <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight text-white mb-4" style={{ fontFamily: serif }}>
              {t('landing.arch.title')}
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">{t('landing.arch.desc')}</p>
          </Reveal>

          {/* Architecture Stack — Visual Layers */}
          <Reveal delay={0.1}>
            <div className="max-w-4xl mx-auto mb-16">
              {[
                { label: 'FRONTEND', tech: 'React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Recharts', icon: Globe, color: 'from-blue-500 to-blue-600', dotColor: 'bg-blue-500' },
                { label: 'COMPUTE', tech: 'AWS App Runner (Docker) + ECR + Auto-scaling + Health Checks', icon: Server, color: 'from-orange-500 to-orange-600', dotColor: 'bg-orange-500' },
                { label: 'API LAYER', tech: 'Express.js + 13 REST Endpoints + CORS + Rate Limiting + JWT Auth', icon: Layers, color: 'from-teal-500 to-teal-600', dotColor: 'bg-teal-500' },
                { label: 'AI ENGINE', tech: 'Amazon Bedrock (Claude 3 Haiku + Nova Lite) + Gemini 1.5 Flash + 4-Tier Fallback', icon: Brain, color: 'from-violet-500 to-violet-600', dotColor: 'bg-violet-500' },
                { label: 'DATABASE', tech: 'Amazon DynamoDB Single-Table Design (PK/SK) + PAY_PER_REQUEST + GSI', icon: Database, color: 'from-amber-500 to-amber-600', dotColor: 'bg-amber-500' },
              ].map((layer, i) => (
                <StaggerChild key={layer.label}>
                  <motion.div whileHover={{ scale: 1.01, x: 4 }}
                    className="relative mb-1 group">
                    {/* Connector line */}
                    {i < 4 && <div className="absolute left-[28px] -bottom-1 w-px h-2 bg-white/10" />}
                    <div className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/10 transition-all">
                      {/* Color accent */}
                      <div className={`w-14 flex-shrink-0 bg-gradient-to-b ${layer.color} flex items-center justify-center`}>
                        <layer.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 flex items-center gap-4 px-5 py-4">
                        <span className="text-[10px] font-bold tracking-[2px] text-white/90 w-20 flex-shrink-0" style={{ fontFamily: mono }}>{layer.label}</span>
                        <div className="w-px h-5 bg-white/10 hidden md:block" />
                        <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{layer.tech}</span>
                      </div>
                    </div>
                  </motion.div>
                </StaggerChild>
              ))}
            </div>
          </Reveal>

          {/* 4-Tier Fallback — Horizontal Pipeline */}
          <Reveal>
            <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/[0.06] mb-12 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm font-bold text-white">4-Tier AI Fallback Chain</p>
                <span className="text-[10px] text-white/30 ml-2">Zero downtime guarantee</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
                {[
                  { name: 'Claude 3 Haiku', region: 'ap-south-1', color: 'bg-violet-500', tier: 'Primary' },
                  { name: 'Nova Lite', region: 'us-east-1', color: 'bg-amber-500', tier: 'Secondary' },
                  { name: 'Gemini 1.5 Flash', region: 'external', color: 'bg-blue-500', tier: 'Tertiary' },
                  { name: 'Smart Demo', region: 'local', color: 'bg-green-500', tier: 'Fallback' },
                ].map((model, i) => (
                  <div key={model.name} className="flex items-center">
                    <motion.div whileHover={{ scale: 1.05, y: -2 }}
                      className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06] text-center min-w-[130px] hover:border-white/15 transition-all">
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <div className={`w-2 h-2 ${model.color} rounded-full`} />
                        <span className="text-[8px] text-white/30 uppercase tracking-wider font-bold">{model.tier}</span>
                      </div>
                      <p className="text-xs font-semibold text-white">{model.name}</p>
                      <p className="text-[9px] text-white/30 mt-0.5" style={{ fontFamily: mono }}>{model.region}</p>
                    </motion.div>
                    {i < 3 && (
                      <div className="hidden md:flex items-center px-2">
                        <div className="w-6 border-t border-dashed border-white/10" />
                        <ChevronRight className="w-3 h-3 text-white/15" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-[10px] text-white/25 mt-6" style={{ fontFamily: mono }}>
                if (model.fails) &rarr; auto_retry(next) &rarr; user sees zero errors
              </p>
            </div>
          </Reveal>

          {/* AWS Services Grid */}
          <Stagger className="grid grid-cols-3 md:grid-cols-6 gap-2" stagger={0.05}>
            {[
              { name: 'Bedrock', icon: Cpu, cat: 'AI/ML' },
              { name: 'DynamoDB', icon: Database, cat: 'Database' },
              { name: 'App Runner', icon: Server, cat: 'Compute' },
              { name: 'ECR', icon: Layers, cat: 'Container' },
              { name: 'IAM', icon: Shield, cat: 'Security' },
              { name: 'CloudWatch', icon: Eye, cat: 'Monitoring' },
            ].map(s => (
              <StaggerChild key={s.name}>
                <motion.div whileHover={{ y: -2, borderColor: 'rgba(249,115,22,0.2)' }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center transition-all hover:bg-white/[0.05]">
                  <s.icon className="w-4 h-4 text-[#F97316] mx-auto mb-1.5" />
                  <p className="text-[10px] font-semibold text-white/80">{s.name}</p>
                  <p className="text-[8px] text-white/30">{s.cat}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══ IMPACT & MODEL ═══ */}
      <section id="pricing" className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <WarmOrbs />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('landing.impact.label')}</p>
            <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${c.text}`} style={{ fontFamily: serif }}>
              {t('landing.impact.title1')} {t('landing.impact.title2')}
            </h2>
          </Reveal>

          {/* Impact Stats */}
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16" stagger={0.1}>
            {[
              { n: 12, s: 'M+', l: 'Kirana Stores', d: 'Our addressable market', icon: Store },
              { p: '$', n: 1.3, s: 'T', l: 'Market Size', d: '4th largest in the world', icon: TrendingUp },
              { n: 90, s: '%', l: 'Undigitized', d: 'Zero tech adoption', icon: BarChart3 },
              { n: 26, s: '%', l: 'Margin Boost', d: 'Average with AI pricing', icon: IndianRupee },
            ].map(stat => (
              <StaggerChild key={stat.l}>
                <div className={`${c.bg2} rounded-xl p-5 border ${c.cardBorder}`}>
                  <stat.icon className={`w-5 h-5 ${dk ? 'text-white/20' : 'text-black/10'} mb-2`} />
                  <p className={`text-3xl font-bold ${c.text} mb-1`} style={{ fontFamily: mono }}>
                    {stat.p || ''}<CountUp end={stat.n} suffix={stat.s} />
                  </p>
                  <p className={`text-sm font-semibold ${c.text}`}>{stat.l}</p>
                  <p className={`text-[10px] ${c.textMuted}`}>{stat.d}</p>
                </div>
              </StaggerChild>
            ))}
          </Stagger>

          {/* Free-First Model */}
          <Reveal>
            <div className={`${dk ? 'bg-gradient-to-br from-[#111113] to-[#0c0c0d] border-[#2a2a2d]' : 'bg-gradient-to-br from-white to-[#f5f5f4] border-black/[0.04]'} rounded-2xl p-8 md:p-12 border shadow-sm`}>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${dk ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Free for Every Store
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-bold ${c.text} leading-tight mb-4`} style={{ fontFamily: serif }}>
                    Start free. <span className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent">Grow when ready.</span>
                  </h3>
                  <p className={`${c.textMuted} text-base leading-relaxed mb-6`}>
                    Every kirana store deserves AI intelligence &mdash; regardless of size or budget. Start with the full platform at zero cost. As your business grows, unlock advanced features with a subscription that pays for itself.
                  </p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goDemo}
                    className="inline-flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#EA580C] transition-colors shadow-lg shadow-orange-500/20">
                    Start Free Today <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="space-y-3">
                  {[
                    { tier: 'Free Forever', desc: 'Full platform access for every store owner', features: ['AI pricing suggestions', 'Inventory management', 'Invoice generation', 'WhatsApp integration', '6 languages'], active: true },
                    { tier: 'Pro Subscription', desc: 'Advanced features as your business scales', features: ['Priority AI models', 'Advanced analytics & reports', 'Bulk sourcing marketplace', 'API access & integrations', 'Dedicated support'], active: false },
                  ].map(plan => (
                    <motion.div key={plan.tier} whileHover={{ scale: 1.01 }}
                      className={`rounded-xl p-5 border transition-all ${
                        plan.active
                          ? dk ? 'bg-[#F97316]/10 border-[#F97316]/30 ring-1 ring-[#F97316]/20' : 'bg-orange-50 border-orange-200 ring-1 ring-orange-200'
                          : `${c.card} ${c.cardBorder}`
                      }`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-bold ${plan.active ? 'text-[#F97316]' : c.text}`}>{plan.tier}</p>
                        {plan.active && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${dk ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-orange-100 text-[#F97316]'}`}>CURRENT</span>}
                      </div>
                      <p className={`text-xs ${c.textMuted} mb-3`}>{plan.desc}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-center gap-1.5">
                            <Check className={`w-3 h-3 flex-shrink-0 ${plan.active ? 'text-[#F97316]' : 'text-green-500'}`} />
                            <span className={`text-[10px] ${c.textMuted}`}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-[#F97316] to-[#0F766E] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: serif }}>
              {t('landing.cta.line1')}
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 leading-tight mb-10" style={{ fontFamily: serif }}>
              {t('landing.cta.line2')}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.3)' }} whileTap={{ scale: 0.97 }}
              onClick={goDemo}
              className="inline-flex items-center gap-2.5 bg-white text-[#1C1917] px-8 py-4 rounded-full text-base font-bold hover:bg-white/95 transition-all shadow-2xl">
              {t('landing.cta.tryLive')} <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Reveal>
          <Reveal delay={0.3}><p className="text-white/50 text-sm mt-8">Team ParityAI &#183; AI for Bharat Hackathon 2026</p></Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#1C1917] text-white/50 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <NavbarLogo mode="dark" className="opacity-80 mb-4" />
              <p className="text-xs text-white/40 leading-relaxed max-w-[200px]">
                AI-powered market intelligence for 12M+ Indian kirana stores. Built for the AI for Bharat Hackathon 2026.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Product</p>
              <div className="space-y-2">
                <a href="#features" className="block text-xs text-white/40 hover:text-white/80 transition-colors">Features</a>
                <a href="#how-it-works" className="block text-xs text-white/40 hover:text-white/80 transition-colors">How It Works</a>
                <a href="#architecture" className="block text-xs text-white/40 hover:text-white/80 transition-colors">Architecture</a>
                <a href="#pricing" className="block text-xs text-white/40 hover:text-white/80 transition-colors">Pricing</a>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Platforms</p>
              <div className="space-y-2">
                <span onClick={goDemo} className="block text-xs text-white/40 hover:text-white/80 transition-colors cursor-pointer">Web Dashboard</span>
                <span onClick={goDemo} className="block text-xs text-white/40 hover:text-white/80 transition-colors cursor-pointer">Mobile App</span>
                <span onClick={goDemo} className="block text-xs text-white/40 hover:text-white/80 transition-colors cursor-pointer">WhatsApp Bot</span>
                <span onClick={goDemo} className="block text-xs text-white/40 hover:text-white/80 transition-colors cursor-pointer">Live Demo</span>
              </div>
            </div>

            {/* Team */}
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Team ParityAI</p>
              <div className="space-y-2">
                <a href="https://github.com/m-zest/bharat_bazaar" target="_blank" rel="noopener noreferrer" className="block text-xs text-white/40 hover:text-white/80 transition-colors">GitHub Repository</a>
                <a href="https://github.com/m-zest" target="_blank" rel="noopener noreferrer" className="block text-xs text-white/40 hover:text-white/80 transition-colors">Mohammad Zeeshan</a>
                <a href="mailto:hdglit@inf.elte.hu" className="block text-xs text-white/40 hover:text-white/80 transition-colors">Contact Us</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-white/30">
              &copy; 2026 BharatBazaar AI &mdash; Team ParityAI. Built with AWS for the AI for Bharat Hackathon.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/m-zest/bharat_bazaar" target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors">GitHub</a>
              <span className="text-white/10">|</span>
              <a href="mailto:hdglit@inf.elte.hu"
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors">hdglit@inf.elte.hu</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
