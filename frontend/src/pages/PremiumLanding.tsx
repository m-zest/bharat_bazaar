import { useState, useEffect, useRef, ReactNode } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  ArrowRight, Camera, Receipt, MessageCircle,
  Database, Cpu, Shield, Eye, Server, Layers, Check,
  Globe, Store, TrendingUp, Mic, Brain, BarChart3,
  IndianRupee, Languages, Package, MapPin,
  FileText, Star, Calendar, ChevronRight,
} from 'lucide-react'
import { NavbarLogo } from '../components/TarazuLogo'

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

function DotGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      opacity: 0.4,
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }} />
  )
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function PremiumLanding() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up')
  const lastScrollY = useRef(0)

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

  const goDemo = () => navigate('/login')

  const serif = "'Playfair Display', 'Instrument Serif', Georgia, serif"
  const mono = "'JetBrains Mono', monospace"

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] overflow-hidden" style={{ fontFamily: "'DM Sans', 'Satoshi', sans-serif" }}>
      <NoiseOverlay />

      {/* ═══ NAVBAR ═══ */}
      <motion.header
        animate={{ y: scrollDir === 'down' && scrolled ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/70 backdrop-blur-xl shadow-sm border-b border-black/[0.04]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="block"><NavbarLogo mode="light" /></Link>
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Architecture', 'Pricing'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
                className="text-sm text-[#78716C] hover:text-[#1C1917] transition-colors font-medium">{link}</a>
            ))}
          </nav>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={goDemo}
            className="flex items-center gap-2 bg-[#F97316] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#EA580C] transition-colors shadow-lg shadow-orange-500/20">
            Try Live Demo <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.header>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <WarmOrbs />
        <DotGrid />
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
                  className="block text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-bold text-[#1C1917]" style={{ fontFamily: serif }}>
                  Market Intelligence for
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
                  className="block text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-bold bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent"
                  style={{ fontFamily: serif }}>
                  Every Kirana Store
                </motion.span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-lg text-[#78716C] max-w-lg leading-relaxed mb-8">
                Amazon has data science teams. We give that same intelligence to 15 million kirana stores — in their language, on WhatsApp, for &#8377;0.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                className="flex flex-wrap items-center gap-3 mb-10">
                <motion.button whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(249,115,22,0.35)' }} whileTap={{ scale: 0.97 }}
                  onClick={goDemo}
                  className="flex items-center gap-2.5 bg-[#F97316] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#EA580C] transition-all shadow-xl shadow-orange-500/20">
                  Try Live Demo <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.04, backgroundColor: '#f5f5f4' }} whileTap={{ scale: 0.97 }} onClick={goDemo}
                  className="flex items-center gap-2 text-[#1C1917] px-6 py-3.5 rounded-full text-sm font-semibold border border-black/10 hover:border-black/20 transition-all">
                  Watch 2-min Video <span className="text-[#F97316]">&#9654;</span>
                </motion.button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                className="flex items-center gap-6 text-sm text-[#78716C]" style={{ fontFamily: mono }}>
                {[{ n: 23, l: 'Features' }, { n: 13, l: 'APIs' }, { n: 6, l: 'Languages' }, { n: 10, l: 'Cities' }].map(s => (
                  <div key={s.l} className="flex items-center gap-1.5">
                    <CountUp end={s.n} className="font-bold text-[#1C1917]" />
                    <span className="text-xs">{s.l}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — 3D Phone */}
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
                          <span className="text-[9px] text-[#78716C] font-medium">Today's Revenue</span>
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
                        <p className="text-[9px] text-amber-800 font-medium leading-relaxed">
                          &#x1F327;&#xFE0F; Rain forecast — stock 20% more Dal &amp; Rice
                        </p>
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

      {/* ═══ PROBLEM ═══ */}
      <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal><p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">THE PROBLEM</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] leading-tight mb-16 max-w-3xl" style={{ fontFamily: serif }}>
              <WordReveal text="The people who feed India have zero data intelligence." />
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-5" stagger={0.12}>
            {[
              { icon: IndianRupee, title: 'Pricing by Gut Feeling', desc: 'Store owners set prices based on instinct, losing potential revenue every single day to competitors who know the market.', metric: '~&#8377;50K lost/yr', color: 'bg-orange-50', iconColor: 'text-[#F97316]' },
              { icon: FileText, title: 'Paper Notebooks', desc: 'Inventory tracked in handwritten bahi-khata. No visibility into what sells, what rots, or what to reorder.', metric: '0% visibility', color: 'bg-teal-50', iconColor: 'text-[#0F766E]' },
              { icon: Languages, title: 'English-Only Tools', desc: '70% of store owners prefer regional languages. Enterprise tools cost &#8377;50K+/month and speak only English.', metric: '70% excluded', color: 'bg-violet-50', iconColor: 'text-[#7C3AED]' },
              { icon: MessageCircle, title: 'No Digital Presence', desc: '500 million Indians on WhatsApp. Yet most stores have zero digital ordering, zero online price discovery.', metric: '500M on WhatsApp', color: 'bg-green-50', iconColor: 'text-green-600' },
            ].map(card => (
              <StaggerChild key={card.title}>
                <motion.div whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.08)' }}
                  className={`${card.color} rounded-2xl p-7 border border-black/[0.04] relative overflow-hidden cursor-default transition-all`}>
                  <div className="absolute top-5 right-5">
                    <span className="text-[10px] font-bold text-[#78716C] bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-black/[0.04]"
                      style={{ fontFamily: mono }} dangerouslySetInnerHTML={{ __html: card.metric }} />
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1C1917] mb-2">{card.title}</h3>
                  <p className="text-sm text-[#78716C] leading-relaxed" dangerouslySetInnerHTML={{ __html: card.desc }} />
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

      {/* ═══ HOW IT WORKS — DATA FLOW ═══ */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-[#f5f5f4] relative overflow-hidden">
        <WarmOrbs />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">HOW IT WORKS</p>
            <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight mb-4" style={{ fontFamily: serif }}>
              Daily actions become business intelligence
            </h2>
            <p className="text-[#78716C] text-lg max-w-2xl mb-16">No data entry. No spreadsheets. The store owner's daily routine automatically builds the intelligence layer.</p>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
            {/* Data In */}
            <Stagger className="space-y-4" stagger={0.1}>
              <StaggerChild><p className="text-[10px] font-bold text-[#F97316] uppercase tracking-[3px] mb-3">Data In</p></StaggerChild>
              {[
                { icon: Store, title: 'Onboarding', desc: 'Select what you sell — catalog seeded', color: 'bg-blue-50', iconColor: 'text-blue-600' },
                { icon: Camera, title: 'Bill Scanner', desc: 'Photo of bill — items extracted by AI', color: 'bg-orange-50', iconColor: 'text-[#F97316]' },
                { icon: Package, title: 'Wholesale Orders', desc: 'Source stock — inventory auto-tracked', color: 'bg-teal-50', iconColor: 'text-[#0F766E]' },
                { icon: MessageCircle, title: 'WhatsApp', desc: 'Chat orders — AI processes messages', color: 'bg-green-50', iconColor: 'text-green-600' },
              ].map(item => (
                <StaggerChild key={item.title}>
                  <motion.div whileHover={{ x: 4 }}
                    className={`${item.color} rounded-xl p-4 flex items-center gap-4 border border-black/[0.04] transition-all`}>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div><p className="text-sm font-semibold text-[#1C1917]">{item.title}</p><p className="text-xs text-[#78716C]">{item.desc}</p></div>
                  </motion.div>
                </StaggerChild>
              ))}
            </Stagger>

            {/* Center Hub */}
            <Reveal delay={0.3} className="hidden lg:flex flex-col items-center justify-center gap-6 py-8">
              <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#F97316]/30" />
              <motion.div animate={{ boxShadow: ['0 0 0 0 rgba(249,115,22,0.2)', '0 0 0 20px rgba(249,115,22,0)', '0 0 0 0 rgba(249,115,22,0.2)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-xl">
                <Database className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">DynamoDB</p>
              <div className="w-px h-4 bg-[#F97316]/30" />
              <motion.div animate={{ boxShadow: ['0 0 0 0 rgba(124,58,237,0.2)', '0 0 0 16px rgba(124,58,237,0)', '0 0 0 0 rgba(124,58,237,0.2)'] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </motion.div>
              <p className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">AI Engine</p>
              <div className="w-px h-8 bg-gradient-to-b from-[#7C3AED]/30 to-transparent" />
            </Reveal>

            {/* Data Out */}
            <Stagger className="space-y-4" stagger={0.1}>
              <StaggerChild><p className="text-[10px] font-bold text-[#0F766E] uppercase tracking-[3px] mb-3">Data Out</p></StaggerChild>
              {[
                { icon: BarChart3, title: 'Dashboard', desc: 'Revenue, top sellers, trends live', color: 'bg-violet-50', iconColor: 'text-[#7C3AED]' },
                { icon: Receipt, title: 'GST Invoices', desc: 'PDF with CGST/SGST, WhatsApp share', color: 'bg-rose-50', iconColor: 'text-rose-600' },
                { icon: IndianRupee, title: 'AI Pricing', desc: '3 strategies with competitor data', color: 'bg-amber-50', iconColor: 'text-amber-600' },
                { icon: TrendingUp, title: 'Smart Alerts', desc: 'Reorder, festival surge, weather impact', color: 'bg-cyan-50', iconColor: 'text-cyan-600' },
              ].map(item => (
                <StaggerChild key={item.title}>
                  <motion.div whileHover={{ x: -4 }}
                    className={`${item.color} rounded-xl p-4 flex items-center gap-4 border border-black/[0.04] transition-all`}>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div><p className="text-sm font-semibold text-[#1C1917]">{item.title}</p><p className="text-xs text-[#78716C]">{item.desc}</p></div>
                  </motion.div>
                </StaggerChild>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ═══ BENTO FEATURES ═══ */}
      <section id="features" className="py-24 px-6 lg:px-8 relative overflow-hidden">
        <DotGrid />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">23 FEATURES, ALL WORKING</p>
            <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight mb-16" style={{ fontFamily: serif }}>
              Not mockups. Not wireframes.<br />
              <span className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent">Every feature works.</span>
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] lg:auto-rows-[200px]" stagger={0.08}>
            {/* AI Pricing — 2 cols, 2 rows */}
            <StaggerChild className="col-span-2 row-span-2">
              <motion.div whileHover={{ scale: 1.01 }}
                className="h-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100/80 overflow-hidden cursor-default">
                <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-[2px] mb-2">AI Pricing Engine</p>
                <p className="text-sm text-[#78716C] mb-5 max-w-sm">3 strategies per product. City-aware. Festival-adjusted. Competitor-informed.</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Competitive', price: '&#8377;335', pct: '19.6%', color: 'border-blue-200 bg-blue-50', rec: false },
                    { label: 'Balanced', price: '&#8377;365', pct: '30.4%', color: 'border-green-200 bg-green-50', rec: true },
                    { label: 'Premium', price: '&#8377;399', pct: '42.5%', color: 'border-violet-200 bg-violet-50', rec: false },
                  ].map(s => (
                    <motion.div key={s.label} whileHover={{ y: -4 }}
                      className={`${s.color} rounded-xl p-3 border flex-1 ${s.rec ? 'ring-2 ring-green-300' : ''}`}>
                      <p className="text-[9px] font-semibold text-[#78716C] uppercase">{s.label}</p>
                      <p className="text-lg font-bold text-[#1C1917] mt-1" style={{ fontFamily: mono }} dangerouslySetInnerHTML={{ __html: s.price }} />
                      <p className="text-[10px] text-[#78716C]">Margin: {s.pct}</p>
                      {s.rec && <p className="text-[8px] text-green-600 font-semibold mt-1">RECOMMENDED</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </StaggerChild>

            {/* Munim-ji Chat — 1 col, 2 rows */}
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
                  <p className="text-xs text-[#78716C] mt-1">500M+ Indians on WhatsApp. Send "hi" to start.</p>
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

      {/* ═══ DEMO CTA ═══ */}
      <section className="py-24 px-6 lg:px-8 bg-[#f5f5f4] relative overflow-hidden">
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
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">BUILT ON AWS</p>
            <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold leading-tight mb-4" style={{ fontFamily: serif }}>
              Production-grade architecture
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mb-16">Not a hackathon prototype. This is deployable infrastructure with enterprise-grade resilience.</p>
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
              <p className="text-sm font-bold text-[#F97316] mb-6">4-Tier AI Fallback Chain — We Never Fail</p>
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
                <p className="text-xs font-semibold text-[#F97316] uppercase tracking-[3px] mb-4">IMPACT</p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-10" style={{ fontFamily: serif }}>
                  Built for scale.<br />Designed for Bharat.
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
                  { name: 'Free', price: '&#8377;0', desc: 'For every kirana store', features: ['Unlimited invoices', 'AI pricing (basic)', 'Inventory tracking', 'WhatsApp integration'], highlight: false },
                  { name: 'Starter', price: '&#8377;299', desc: '/month', features: ['Everything in Free', 'Advanced analytics', 'Priority AI models', 'Bulk sourcing'], highlight: false },
                  { name: 'Pro', price: '&#8377;799', desc: '/month', features: ['Everything in Starter', 'Custom pricing AI', 'API access', 'Dedicated support'], highlight: true },
                  { name: 'Enterprise', price: 'Custom', desc: 'Contact us', features: ['Everything in Pro', 'White-label', 'SLA guarantee', 'Custom integrations'], highlight: false },
                ].map(plan => (
                  <StaggerChild key={plan.name}>
                    <Tilt3D>
                      <motion.div whileHover={{ y: -4 }}
                        className={`rounded-xl p-5 border transition-all h-full ${
                          plan.highlight ? 'bg-[#F97316] text-white border-[#F97316] shadow-xl shadow-orange-500/20' : 'bg-white border-black/[0.04] shadow-sm'
                        }`}>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.highlight ? 'text-white/80' : 'text-[#78716C]'}`}>{plan.name}</p>
                        <p className="text-2xl font-bold mb-0.5" style={{ fontFamily: mono }} dangerouslySetInnerHTML={{ __html: plan.price }} />
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
              Amazon has data science teams.
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 leading-tight mb-10" style={{ fontFamily: serif }}>
              Kirana stores have BharatBazaar AI.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.3)' }} whileTap={{ scale: 0.97 }}
              onClick={goDemo}
              className="inline-flex items-center gap-2.5 bg-white text-[#1C1917] px-8 py-4 rounded-full text-base font-bold hover:bg-white/95 transition-all shadow-2xl">
              Try it Live <ArrowRight className="w-5 h-5" />
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
