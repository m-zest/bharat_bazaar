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
              <div className="bg-[#1C1917] rounded-xl overflow-hidden shadow-2xl shadow-black/30">
                {/* Mac Title Bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#2C2C2E]">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  <div className="flex-1 text-center">
                    <span className="text-[11px] text-white/40 font-medium">BharatBazaar AI &#8212; Dashboard</span>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-[#FAFAF9] p-6">
                  {/* Top Row — KPIs */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Today's Revenue", value: '\u20B912,850', change: '+18%', changeColor: 'text-green-600 bg-green-50' },
                      { label: 'Items Sold', value: '47', change: '+12', changeColor: 'text-blue-600 bg-blue-50' },
                      { label: 'Avg. Margin', value: '28.4%', change: '+3.2%', changeColor: 'text-green-600 bg-green-50' },
                      { label: 'Active Products', value: '156', change: '+5 new', changeColor: 'text-violet-600 bg-violet-50' },
                    ].map(kpi => (
                      <div key={kpi.label} className="bg-white rounded-lg p-3 border border-black/[0.04] shadow-sm">
                        <p className="text-[9px] text-[#78716C] font-medium">{kpi.label}</p>
                        <div className="flex items-end justify-between mt-1">
                          <p className="text-lg font-bold text-[#1C1917]" style={{ fontFamily: mono }}>{kpi.value}</p>
                          <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${kpi.changeColor}`}>{kpi.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {/* Revenue Chart */}
                    <div className="col-span-2 bg-white rounded-lg p-4 border border-black/[0.04] shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] font-semibold text-[#1C1917]">Weekly Revenue</p>
                        <span className="text-[8px] text-[#78716C] bg-[#f5f5f4] px-2 py-0.5 rounded-full">Last 7 days</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-24">
                        {[45, 62, 38, 75, 55, 82, 68].map((h, i) => (
                          <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                            className={`flex-1 rounded-t-md ${i === 5 ? 'bg-[#F97316]' : 'bg-orange-100'}`} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1.5">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                          <span key={d} className="text-[7px] text-[#a8a29e] flex-1 text-center">{d}</span>
                        ))}
                      </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-lg p-4 border border-black/[0.04] shadow-sm">
                      <p className="text-[10px] font-semibold text-[#1C1917] mb-3">Top Products</p>
                      {[
                        { name: 'Basmati Rice 5kg', sold: 42, pct: 85 },
                        { name: 'Toor Dal 1kg', sold: 35, pct: 70 },
                        { name: 'Surf Excel 1kg', sold: 28, pct: 55 },
                        { name: 'Amul Butter 500g', sold: 22, pct: 44 },
                        { name: 'Maggi 12-pack', sold: 18, pct: 36 },
                      ].map(p => (
                        <div key={p.name} className="mb-2">
                          <div className="flex justify-between text-[8px] mb-0.5">
                            <span className="text-[#44403C] font-medium">{p.name}</span>
                            <span className="text-[#78716C]" style={{ fontFamily: mono }}>{p.sold}</span>
                          </div>
                          <div className="h-1 bg-[#f5f5f4] rounded-full overflow-hidden">
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
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                      <p className="text-[10px] font-semibold text-amber-800 mb-2">&#x1F4A1; AI Insights</p>
                      <div className="space-y-1.5">
                        <p className="text-[9px] text-amber-700">&#x1F327;&#xFE0F; Rain expected tomorrow &#8212; stock +20% Dal &amp; Rice</p>
                        <p className="text-[9px] text-amber-700">&#x1F4C8; Surf Excel demand rising &#8212; consider price increase</p>
                        <p className="text-[9px] text-amber-700">&#x26A0;&#xFE0F; Maggi stock low &#8212; 3 days until stockout</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-black/[0.04] shadow-sm">
                      <p className="text-[10px] font-semibold text-[#1C1917] mb-2">AI Pricing &#8212; Basmati Rice</p>
                      <div className="flex gap-2">
                        {[
                          { label: 'Competitive', price: '\u20B9335', color: 'border-blue-200 bg-blue-50' },
                          { label: 'Balanced', price: '\u20B9365', color: 'border-green-200 bg-green-50 ring-1 ring-green-300' },
                          { label: 'Premium', price: '\u20B9399', color: 'border-violet-200 bg-violet-50' },
                        ].map(s => (
                          <div key={s.label} className={`flex-1 rounded-lg p-2 border ${s.color}`}>
                            <p className="text-[7px] text-[#78716C] uppercase font-semibold">{s.label}</p>
                            <p className="text-sm font-bold text-[#1C1917]" style={{ fontFamily: mono }}>{s.price}</p>
                          </div>
                        ))}
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
          <Reveal>
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('landing.features.label')}</p>
            <h2 className={`text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight mb-16 ${c.text}`} style={{ fontFamily: serif }}>
              {t('landing.features.title1')}<br />
              <span className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent">{t('landing.features.title2')}</span>
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] lg:auto-rows-[200px]" stagger={0.08}>
            {/* AI Pricing &#8212; 2 cols, 2 rows */}
            <StaggerChild className="col-span-2 row-span-2">
              <motion.div whileHover={{ scale: 1.01 }}
                className="h-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100/80 overflow-hidden cursor-default">
                <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-[2px] mb-2">AI Pricing Engine</p>
                <p className="text-sm text-[#78716C] mb-5 max-w-sm">3 strategies per product. City-aware. Festival-adjusted. Competitor-informed.</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Competitive', price: '\u20B9335', pct: '19.6%', color: 'border-blue-200 bg-blue-50', rec: false },
                    { label: 'Balanced', price: '\u20B9365', pct: '30.4%', color: 'border-green-200 bg-green-50', rec: true },
                    { label: 'Premium', price: '\u20B9399', pct: '42.5%', color: 'border-violet-200 bg-violet-50', rec: false },
                  ].map(s => (
                    <motion.div key={s.label} whileHover={{ y: -4 }}
                      className={`${s.color} rounded-xl p-3 border flex-1 ${s.rec ? 'ring-2 ring-green-300' : ''}`}>
                      <p className="text-[9px] font-semibold text-[#78716C] uppercase">{s.label}</p>
                      <p className="text-lg font-bold text-[#1C1917] mt-1" style={{ fontFamily: mono }}>{s.price}</p>
                      <p className="text-[10px] text-[#78716C]">Margin: {s.pct}</p>
                      {s.rec && <p className="text-[8px] text-green-600 font-semibold mt-1">RECOMMENDED</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </StaggerChild>

            {/* Munim-ji Chat &#8212; 1 col, 2 rows */}
            <StaggerChild className="row-span-2">
              <motion.div whileHover={{ scale: 1.01 }}
                className="h-full bg-green-50 rounded-2xl p-5 border border-green-100/80 overflow-hidden cursor-default">
                <p className="text-[10px] font-bold text-green-700 uppercase tracking-[2px] mb-3">Munim-ji AI</p>
                <div className="space-y-2">
                  <div className="flex justify-end"><div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%]"><p className="text-[10px] text-[#1C1917]">Rice ka daam kya hai?</p></div></div>
                  <div className="flex justify-start">
                    <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%] shadow-sm">
                      <p className="text-[10px] text-[#1C1917]">Rajesh ji, Basmati Rice 5kg:</p>
                      <p className="text-[10px] text-[#78716C] mt-0.5">&#8226; Amazon: &#8377;389</p>
                      <p className="text-[10px] text-[#78716C]">&#8226; BigBasket: &#8377;345</p>
                      <p className="text-[10px] text-green-600 font-semibold mt-1">Aapka &#8377;350 competitive hai!</p>
                    </div>
                  </div>
                  <div className="flex justify-end"><div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%]"><p className="text-[10px] text-[#1C1917]">Mausam kaisa rahega?</p></div></div>
                  <div className="flex justify-start">
                    <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%] shadow-sm">
                      <p className="text-[10px] text-[#1C1917]">&#x1F327;&#xFE0F; Lucknow mein barish</p>
                      <p className="text-[10px] text-[#78716C]">Dal demand +15%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerChild>

            {/* Bill Scanner */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className="h-full bg-white rounded-2xl p-5 border border-black/[0.04] shadow-sm overflow-hidden cursor-default">
                <Camera className="w-6 h-6 text-[#F97316] mb-2" />
                <p className="text-sm font-bold text-[#1C1917]">Bill Scanner</p>
                <p className="text-[10px] text-[#78716C] mt-1">Photo &#8594; AI extracts items &#8594; Inventory auto-filled</p>
                <div className="mt-2 bg-orange-50 rounded-lg px-2 py-1"><p className="text-[8px] text-[#F97316] font-semibold" style={{ fontFamily: mono }}>98% accuracy</p></div>
              </motion.div>
            </StaggerChild>

            {/* Voice */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className="h-full bg-violet-50 rounded-2xl p-5 border border-violet-100/80 overflow-hidden cursor-default">
                <Mic className="w-6 h-6 text-[#7C3AED] mb-2" />
                <p className="text-sm font-bold text-[#1C1917]">Voice Input</p>
                <p className="text-[10px] text-[#78716C] mt-1">Speak Hindi, Tamil, Bengali...</p>
                <motion.div animate={{ scaleX: [1, 1.2, 0.8, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="mt-2 h-4 bg-gradient-to-r from-violet-300 via-violet-400 to-violet-300 rounded-full opacity-40" />
              </motion.div>
            </StaggerChild>

            {/* WhatsApp wide */}
            <StaggerChild className="col-span-2">
              <motion.div whileHover={{ scale: 1.01 }}
                className="h-full bg-green-50 rounded-2xl p-5 border border-green-100/80 overflow-hidden cursor-default flex items-center gap-6">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-[2px] mb-1">WhatsApp Integration</p>
                  <p className="text-sm font-bold text-[#1C1917]">No App. Just WhatsApp.</p>
                  <p className="text-xs text-[#78716C] mt-1">500M+ Indians on WhatsApp. Send &quot;hi&quot; to start.</p>
                </div>
                <div className="flex-shrink-0 bg-white rounded-xl p-3 shadow-sm border border-green-100 w-44">
                  <div className="flex gap-1 mb-1"><div className="bg-[#DCF8C6] rounded-lg px-2 py-1 text-[8px]">Order 50 Surf Excel</div></div>
                  <div className="flex gap-1"><div className="bg-white border border-gray-100 rounded-lg px-2 py-1 text-[8px]">Done! &#8377;9,450 total</div></div>
                </div>
              </motion.div>
            </StaggerChild>

            {/* 6 Languages */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className="h-full bg-amber-50 rounded-2xl p-5 border border-amber-100/80 overflow-hidden cursor-default">
                <Globe className="w-5 h-5 text-amber-600 mb-2" />
                <p className="text-sm font-bold text-[#1C1917]">6 Languages</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {['\u0939\u093F\u0902\u0926\u0940', '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD', '\u09AC\u09BE\u0982\u09B2\u09BE', '\u0A97\u0AC1\u0A9C', '\u092E\u0930\u093E\u0920\u0940', 'EN'].map(l => (
                    <span key={l} className="text-[9px] bg-white px-2 py-0.5 rounded-full border border-amber-100 text-[#1C1917] font-medium">{l}</span>
                  ))}
                </div>
              </motion.div>
            </StaggerChild>

            {/* 10 Cities */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className="h-full bg-teal-50 rounded-2xl p-5 border border-teal-100/80 overflow-hidden cursor-default">
                <MapPin className="w-5 h-5 text-[#0F766E] mb-2" />
                <p className="text-sm font-bold text-[#1C1917]">10 Cities</p>
                <p className="text-[9px] text-[#78716C] mt-1 leading-relaxed">Mumbai &#183; Delhi &#183; Bangalore &#183; Chennai &#183; Kolkata &#183; Lucknow &#183; Pune &#183; Jaipur &#183; Ahmedabad &#183; Indore</p>
              </motion.div>
            </StaggerChild>

            {/* Festival Calendar */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className="h-full bg-rose-50 rounded-2xl p-5 border border-rose-100/80 overflow-hidden cursor-default">
                <Calendar className="w-5 h-5 text-rose-600 mb-2" />
                <p className="text-sm font-bold text-[#1C1917]">Festival Alerts</p>
                <p className="text-[9px] text-[#78716C] mt-1">Diwali &#183; Holi &#183; Eid &#183; Pongal &#183; Navratri</p>
                <p className="text-[8px] text-rose-600 font-semibold mt-1">Demand surge predictions</p>
              </motion.div>
            </StaggerChild>

            {/* Content Studio */}
            <StaggerChild>
              <motion.div whileHover={{ scale: 1.02 }} className="h-full bg-blue-50 rounded-2xl p-5 border border-blue-100/80 overflow-hidden cursor-default">
                <Languages className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-sm font-bold text-[#1C1917]">Content Studio</p>
                <p className="text-[9px] text-[#78716C] mt-1">Generate listings for Instagram, Amazon, Flipkart, JioMart in 6 languages</p>
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
                <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
                  <h3 className="text-lg font-bold text-[#1C1917] mb-1">Why WhatsApp-First?</h3>
                  <p className="text-xs text-[#78716C] mb-5">India&apos;s reality demands it</p>
                  <div className="space-y-4">
                    {[
                      { icon: Smartphone, title: 'Already on every phone', desc: 'No downloads, no signups. Store owners already know WhatsApp.' },
                      { icon: Mic, title: 'Voice messages supported', desc: "Can't type? Just send a voice note in Hindi. AI understands." },
                      { icon: Store, title: 'Works from the shop counter', desc: 'Quick replies between customers. No time wasted on complex UIs.' },
                      { icon: Zap, title: 'Works on 2G/3G networks', desc: 'Text-based AI works even in areas with poor internet connectivity.' },
                    ].map(item => (
                      <div key={item.title} className="flex gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                          <item.icon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1C1917]">{item.title}</p>
                          <p className="text-xs text-[#78716C] mt-0.5 leading-relaxed">{item.desc}</p>
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
                    <div key={stat.label} className="bg-white rounded-xl p-4 border border-green-100 text-center shadow-sm">
                      <p className="text-xl font-bold text-green-600">{stat.value}</p>
                      <p className="text-[10px] text-[#78716C] mt-1">{stat.label}</p>
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
                <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
                  <h3 className="text-lg font-bold text-[#1C1917] mb-1">Every Feature on WhatsApp</h3>
                  <p className="text-xs text-[#78716C] mb-5">Just type a command or send a voice note</p>
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
                      <div key={feat.label} className="bg-[#f5f5f4] rounded-xl p-3 border border-black/[0.04] hover:border-green-200 transition-colors">
                        <div className="flex items-center gap-2 mb-1.5">
                          <feat.icon className="w-3.5 h-3.5 text-green-600" />
                          <p className="text-xs font-bold text-[#1C1917]">{feat.label}</p>
                        </div>
                        <p className="text-[10px] text-green-600 font-medium mb-0.5" style={{ fontFamily: mono }}>{feat.cmd}</p>
                        <p className="text-[10px] text-[#78716C]">{feat.desc}</p>
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

          {/* The Vision */}
          <Reveal delay={0.1}>
            <div className="mt-16 bg-white rounded-2xl p-8 border border-green-100 shadow-sm text-center">
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">The Vision</p>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1C1917] max-w-3xl mx-auto leading-tight">
                15 million kirana stores won&apos;t download an app.<br />
                But they&apos;ll reply to a <span className="text-green-600">WhatsApp message</span>.
              </h3>
              <p className="text-[#78716C] mt-4 text-base max-w-2xl mx-auto leading-relaxed">
                BharatBazaar AI meets store owners where they already are. Voice notes in Hindi,
                photo-based bill scanning, inventory alerts, order placement &#8212; all through the
                app they use 50+ times a day.
              </p>
              <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                {[
                  { icon: CheckCircle2, text: 'No app download' },
                  { icon: CheckCircle2, text: 'Works on any phone' },
                  { icon: CheckCircle2, text: 'Voice + text + photos' },
                  { icon: CheckCircle2, text: 'Hindi, Tamil, Bengali...' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-[#44403C]">
                    <item.icon className="w-4 h-4 text-green-500" /> {item.text}
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
      <section id="architecture" className="py-24 px-6 lg:px-8 bg-[#1C1917] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.4,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('landing.arch.label')}</p>
            <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight mb-4" style={{ fontFamily: serif }}>
              {t('landing.arch.title')}
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mb-16">{t('landing.arch.desc')}</p>
          </Reveal>

          <Stagger className="space-y-3 mb-12" stagger={0.1}>
            {[
              { label: 'USER', tech: 'React 18 + TypeScript + Vite + Tailwind + Framer Motion + Recharts', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20' },
              { label: 'HOSTING', tech: 'AWS App Runner (Docker) + ECR + Auto-scaling + Health checks', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/20' },
              { label: 'API', tech: 'Express.js + REST endpoints + CORS + Rate limiting', color: 'from-teal-500/20 to-teal-500/5', border: 'border-teal-500/20' },
              { label: 'AI', tech: 'Amazon Bedrock (Claude 3 Haiku + Nova Lite) + Gemini 1.5 Flash fallback', color: 'from-violet-500/20 to-violet-500/5', border: 'border-violet-500/20' },
              { label: 'DATA', tech: 'Amazon DynamoDB single-table design (PK/SK) + PAY_PER_REQUEST', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20' },
            ].map(layer => (
              <StaggerChild key={layer.label}>
                <motion.div whileHover={{ x: 4 }}
                  className={`bg-gradient-to-r ${layer.color} rounded-xl p-4 border ${layer.border} flex items-center gap-4`}>
                  <span className="text-[10px] font-bold tracking-[2px] w-16 flex-shrink-0" style={{ fontFamily: mono }}>{layer.label}</span>
                  <div className="w-px h-6 bg-white/10" />
                  <span className="text-sm text-white/70">{layer.tech}</span>
                </motion.div>
              </StaggerChild>
            ))}
          </Stagger>

          {/* 4-Tier Fallback */}
          <Reveal>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-12">
              <p className="text-sm font-bold text-[#F97316] mb-6">4-Tier AI Fallback Chain &#8212; We Never Fail</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { name: 'Claude 3 Haiku', region: 'ap-south-1', color: 'bg-violet-500' },
                  { name: 'Nova Lite', region: 'us-east-1', color: 'bg-amber-500' },
                  { name: 'Gemini 1.5 Flash', region: 'external', color: 'bg-blue-500' },
                  { name: 'Smart Demo Mode', region: 'always works', color: 'bg-green-500' },
                ].map((model, i) => (
                  <div key={model.name} className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center min-w-[140px]">
                      <div className={`w-3 h-3 ${model.color} rounded-full mx-auto mb-2`} />
                      <p className="text-xs font-semibold text-white">{model.name}</p>
                      <p className="text-[9px] text-white/40">{model.region}</p>
                    </motion.div>
                    {i < 3 && <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-white/30 mt-4">If model fails &#8594; auto-tries next &#8594; user never sees an error</p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" stagger={0.05}>
            {[
              { name: 'Bedrock', icon: Cpu, cat: 'AI/ML' },
              { name: 'DynamoDB', icon: Database, cat: 'Database' },
              { name: 'App Runner', icon: Server, cat: 'Compute' },
              { name: 'ECR', icon: Layers, cat: 'DevOps' },
              { name: 'IAM', icon: Shield, cat: 'Security' },
              { name: 'CloudWatch', icon: Eye, cat: 'Monitoring' },
            ].map(s => (
              <StaggerChild key={s.name}>
                <motion.div whileHover={{ y: -2, borderColor: 'rgba(249,115,22,0.3)' }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center transition-colors">
                  <s.icon className="w-5 h-5 text-[#F97316] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white/90">{s.name}</p>
                  <p className="text-[9px] text-white/40">{s.cat}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══ IMPACT & PRICING ═══ */}
      <section id="pricing" className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <WarmOrbs />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">{t('landing.impact.label')}</p>
                <h2 className={`text-3xl md:text-4xl font-bold leading-tight mb-10 ${c.text}`} style={{ fontFamily: serif }}>
                  {t('landing.impact.title1')}<br />{t('landing.impact.title2')}
                </h2>
              </Reveal>
              <Stagger className="grid grid-cols-2 gap-4" stagger={0.1}>
                {[
                  { n: 12, s: 'M+', l: 'Kirana Stores', d: 'Our addressable market' },
                  { p: '$', n: 1.3, s: 'T', l: 'Market Size', d: '4th largest in the world' },
                  { n: 90, s: '%', l: 'Undigitized', d: 'Zero tech adoption' },
                  { n: 26, s: '%', l: 'Margin Boost', d: 'Average with AI pricing' },
                ].map(stat => (
                  <StaggerChild key={stat.l}>
                    <div className="bg-[#f5f5f4] rounded-xl p-5 border border-black/[0.04]">
                      <p className="text-3xl font-bold text-[#1C1917] mb-1" style={{ fontFamily: mono }}>
                        {stat.p || ''}<CountUp end={stat.n} suffix={stat.s} />
                      </p>
                      <p className="text-sm font-semibold text-[#1C1917]">{stat.l}</p>
                      <p className="text-[10px] text-[#78716C]">{stat.d}</p>
                    </div>
                  </StaggerChild>
                ))}
              </Stagger>
            </div>

            <div>
              <Reveal><p className="text-xs font-semibold text-[#0F766E] uppercase tracking-[3px] mb-4">PRICING</p></Reveal>
              <Stagger className="grid grid-cols-2 gap-4" stagger={0.1}>
                {[
                  { name: 'Free', price: '\u20B90', desc: 'For every kirana store', features: ['Unlimited invoices', 'AI pricing (basic)', 'Inventory tracking', 'WhatsApp integration'], highlight: false },
                  { name: 'Starter', price: '\u20B9299', desc: '/month', features: ['Everything in Free', 'Advanced analytics', 'Priority AI models', 'Bulk sourcing'], highlight: false },
                  { name: 'Pro', price: '\u20B9799', desc: '/month', features: ['Everything in Starter', 'Custom pricing AI', 'API access', 'Dedicated support'], highlight: true },
                  { name: 'Enterprise', price: 'Custom', desc: 'Contact us', features: ['Everything in Pro', 'White-label', 'SLA guarantee', 'Custom integrations'], highlight: false },
                ].map(plan => (
                  <StaggerChild key={plan.name}>
                    <Tilt3D>
                      <motion.div whileHover={{ y: -4 }}
                        className={`rounded-xl p-5 border transition-all h-full ${
                          plan.highlight ? 'bg-[#F97316] text-white border-[#F97316] shadow-xl shadow-orange-500/20' : 'bg-white border-black/[0.04] shadow-sm'
                        }`}>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.highlight ? 'text-white/80' : 'text-[#78716C]'}`}>{plan.name}</p>
                        <p className="text-2xl font-bold mb-0.5" style={{ fontFamily: mono }}>{plan.price}</p>
                        <p className={`text-[10px] mb-4 ${plan.highlight ? 'text-white/60' : 'text-[#78716C]'}`}>{plan.desc}</p>
                        <div className="space-y-1.5">
                          {plan.features.map(f => (
                            <div key={f} className="flex items-center gap-1.5">
                              <Check className={`w-3 h-3 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-green-500'}`} />
                              <span className={`text-[10px] ${plan.highlight ? 'text-white/80' : 'text-[#78716C]'}`}>{f}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </Tilt3D>
                  </StaggerChild>
                ))}
              </Stagger>
            </div>
          </div>
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
      <footer className="bg-[#1C1917] text-white/50 py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <NavbarLogo mode="dark" className="opacity-60" />
          <div className="flex items-center gap-6 text-xs">
            <span className="hover:text-white/80 cursor-pointer transition-colors">GitHub</span>
            <span className="hover:text-white/80 cursor-pointer transition-colors">Live Demo</span>
            <span className="hover:text-white/80 cursor-pointer transition-colors">Architecture</span>
            <span className="hover:text-white/80 cursor-pointer transition-colors">Contact</span>
          </div>
          <p className="text-xs">Built with &#10084;&#65039; using AWS</p>
        </div>
      </footer>
    </div>
  )
}
