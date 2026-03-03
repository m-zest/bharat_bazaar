import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IndianRupee, Languages, MessageSquareText, ArrowRight, ArrowUpRight, Sparkles,
  Package, MessageCircle, Globe, BarChart3, Star, Zap, Check, ChevronDown,
  ShoppingCart, Truck, MapPin, Eye, Receipt,
  Shield, Database, Cpu, Lock,
  Server, Layers, CheckCircle2, ArrowDown, Sun, Moon,
} from 'lucide-react'
import { NavbarLogo, FullLogo, IconLogo, WordmarkLogo } from '../components/TarazuLogo'
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/AnimatedComponents'
import PhoneMockup from '../components/PhoneMockup'
import { useTheme } from '../utils/ThemeContext'
import WhatsAppDemo from '../components/WhatsAppDemo'
import { useLanguage, LANGUAGES } from '../utils/LanguageContext'
import DatabaseWithRestApi from '../components/ui/database-with-rest-api'
import { Hero195 } from '../components/ui/hero-195'

/* ──────────────── COMPONENT ──────────────── */

export default function Landing() {
  const navigate = useNavigate()
  const { lang, setLang, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('pricing')
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === lang)!

  const NAV_LINKS = [
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.howItWorks'), href: '#showcase' },
    { label: 'Platform', href: '#platform' },
    { label: 'Architecture', href: '#architecture' },
  ]

  const FEATURE_CARDS = [
    { icon: IndianRupee, title: t('features.smartPricing'), subtitle: t('features.smartPricingSub'), bg: 'bg-orange-500/10', route: '/pricing' },
    { icon: Languages, title: t('features.aiContent'), subtitle: t('features.aiContentSub'), bg: 'bg-teal-500/10', route: '/content' },
    { icon: MessageSquareText, title: t('features.sentiment'), subtitle: t('features.sentimentSub'), bg: 'bg-purple-500/10', route: '/sentiment' },
    { icon: Package, title: t('features.sourcing'), subtitle: t('features.sourcingSub'), bg: 'bg-amber-500/10', route: '/sourcing' },
  ]

  const SHOWCASE_TABS = [
    {
      id: 'pricing',
      label: t('features.smartPricing'),
      cards: [
        { title: 'Competitive Strategy', price: '\u20B9415', confidence: 92, change: '+18% demand', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '\uD83C\uDFAF' },
        { title: 'Premium Strategy', price: '\u20B9469', confidence: 87, change: '+12% revenue', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '\u2728' },
        { title: 'Value Strategy', price: '\u20B9389', confidence: 78, change: '+35% volume', color: 'text-teal-400', bg: 'bg-teal-500/10', icon: '\uD83D\uDEE1\uFE0F' },
      ],
    },
    {
      id: 'content',
      label: t('features.aiContent'),
      cards: [
        { title: 'English Description', price: 'Premium aged rice...', confidence: 95, change: 'SEO optimized', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '\uD83C\uDDEC\uD83C\uDDE7' },
        { title: 'Hindi Description', price: '\u092A\u094D\u0930\u0940\u092E\u093F\u092F\u092E \u092C\u093E\u0938\u092E\u0924\u0940 \u091A\u093E\u0935\u0932...', confidence: 90, change: 'Culturally adapted', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '\uD83C\uDDEE\uD83C\uDDF3' },
        { title: 'Tamil Description', price: '\u0BAA\u0BBF\u0BB0\u0BC0\u0BAE\u0BBF\u0BAF\u0BAE\u0BCD \u0BAA\u0BBE\u0BB8\u0BCD\u0BAE\u0BA4\u0BBF...', confidence: 88, change: 'Regional keywords', color: 'text-teal-400', bg: 'bg-teal-500/10', icon: '\uD83C\uDDEE\uD83C\uDDF3' },
      ],
    },
    {
      id: 'sourcing',
      label: t('features.sourcing'),
      cards: [
        { title: 'Gupta Wholesale', price: '\u20B9285/5kg', confidence: 96, change: 'Save \u20B935', color: 'text-green-400', bg: 'bg-green-500/10', icon: '\uD83C\uDFEA' },
        { title: 'Mehta Distributors', price: '\u20B9295/5kg', confidence: 92, change: '2-day delivery', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '\uD83D\uDE9B' },
        { title: 'Sharma Trading', price: '\u20B9310/5kg', confidence: 85, change: 'Verified \u2713', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '\u2705' },
      ],
    },
  ]

  const BENEFITS = [
    { icon: Globe, title: t('benefits.languages'), desc: t('benefits.languagesDesc'), color: 'bg-orange-500/10', iconColor: 'text-orange-400' },
    { icon: BarChart3, title: t('benefits.marketData'), desc: t('benefits.marketDataDesc'), color: 'bg-teal-500/10', iconColor: 'text-teal-400' },
    { icon: Zap, title: t('benefits.zeroSetup'), desc: t('benefits.zeroSetupDesc'), color: 'bg-purple-500/10', iconColor: 'text-purple-400' },
  ]

  const TESTIMONIALS = [
    {
      quote: '"Pehle main gut feeling se price karta tha. Ab BharatBazaar AI batata hai ki competitor ne kya price rakha hai, weather ka kya impact hoga. Mera profit 20% badh gaya hai."',
      name: 'Ramesh Sharma',
      role: 'Kirana Store Owner, Lucknow',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',
      featured: true,
    },
    {
      quote: '"The multilingual content generator is a game-changer. I list products in Hindi, Tamil, and English simultaneously. My conversion rate on Flipkart increased by 35%."',
      name: 'Priya Menon',
      role: 'D2C Founder, Mumbai',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
      badge: 'Verified User',
    },
  ]

  // ── Order Flow Steps ──
  const ORDER_FLOW = [
    { step: 1, title: 'AI Price Check', desc: 'Get AI-powered pricing with margins & festival trends', icon: IndianRupee, color: 'bg-orange-500' },
    { step: 2, title: 'Browse & Source', desc: 'Explore wholesale products from 10+ Indian cities', icon: Package, color: 'bg-teal-500' },
    { step: 3, title: 'Smart Cart', desc: 'Compare wholesale vs MRP, auto quantity suggestions', icon: ShoppingCart, color: 'bg-blue-500' },
    { step: 4, title: 'Secure Checkout', desc: 'Address, COD/UPI payment, GST invoice auto-generated', icon: Lock, color: 'bg-purple-500' },
    { step: 5, title: 'Live Tracking', desc: 'Real-time 6-step delivery tracking with agent details', icon: Truck, color: 'bg-green-500' },
    { step: 6, title: 'Khata & Reorder', desc: 'Customer ledger, order history, one-click repeat orders', icon: Receipt, color: 'bg-rose-500' },
  ]

  // ── AWS Architecture ──
  const AWS_SERVICES = [
    { name: 'Amazon Bedrock', desc: 'Claude 3 Haiku + Nova Lite — pricing, content, sentiment, chat, vision (7 handlers)', icon: Cpu, category: 'AI/ML' },
    { name: 'Amazon DynamoDB', desc: 'Single-table design (PK/SK) — inventory, orders, store settings via @aws-sdk/lib-dynamodb', icon: Database, category: 'Database' },
    { name: 'AWS App Runner', desc: 'Docker container hosting — auto-scaling, health checks, zero cold starts', icon: Server, category: 'Compute' },
    { name: 'Amazon ECR', desc: 'Private Docker image registry — multi-stage builds, CI/CD pipeline', icon: Layers, category: 'DevOps' },
    { name: 'AWS IAM', desc: 'Fine-grained access control — Bedrock invoke, DynamoDB CRUD, ECR push/pull', icon: Shield, category: 'Security' },
    { name: 'Amazon CloudWatch', desc: 'Container logs, API latency metrics, AI model error rate monitoring', icon: Eye, category: 'Observability' },
  ]

  const FOOTER_LINKS: Record<string, string[]> = {
    [t('footer.features')]: ['Smart Pricing', 'AI Content', 'Sentiment Analysis', 'Smart Sourcing', 'AI Advisor'],
    [t('footer.resources')]: ['Documentation', 'API Reference', 'Case Studies', 'Blog'],
    [t('footer.company')]: ['About ParityAI', 'Careers', 'Contact', 'Press Kit'],
  }

  const activeShowcase = SHOWCASE_TABS.find(t => t.id === activeTab)!

  return (
    <div className="min-h-screen bg-[#0c0c0d] overflow-hidden">

      {/* ═══ NAVBAR ═══ */}
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0c0c0d]/80 backdrop-blur-xl shadow-sm border-b border-[#222]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="block">
            <NavbarLogo mode={theme === 'dark' ? 'dark' : 'light'} />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-sm text-gray-400 hover:text-gray-100 transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-400 border border-[#333] bg-white/5 hover:border-orange-500/50 transition-all"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors border border-[#333] bg-white/5 text-gray-300 hover:border-orange-500/50"
              >
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
                    className="absolute right-0 mt-2 w-48 bg-[#1a1a1d] rounded-xl shadow-xl border border-[#333] py-1.5 z-50 overflow-hidden"
                  >
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          lang === l.code
                            ? 'bg-orange-500/10 text-orange-400 font-semibold'
                            : 'text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        <span className="font-medium flex-1 text-left">{l.native}</span>
                        <span className="text-xs text-gray-500">{l.label}</span>
                        {lang === l.code && <Check className="w-3.5 h-3.5 text-[#F97316]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {t('nav.tryDemo')}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0c0c0d]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-40">
            <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#F97316]/15 to-[#F59E0B]/5 blur-[120px]" />
            <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-[#FB923C]/10 to-transparent blur-[100px]" />
          </div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-30">
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#0D9488]/10 to-transparent blur-[120px]" />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-300 mb-6 border border-orange-500/20 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                  {t('hero.badge')}
                </motion.div>
              </ScrollReveal>

              <motion.h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-extrabold text-gray-100 leading-[0.95] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="block" style={{ fontWeight: 900 }}>
                  {t('hero.title1')}
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="block bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent" style={{ fontWeight: 300 }}>
                  {t('hero.title2')}
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="block text-[2rem] md:text-[2.8rem] lg:text-[3.2rem] text-gray-400 font-bold mt-2">
                  {t('hero.title3')}
                </motion.span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.65 }}
                className="text-sm font-medium tracking-[3px] uppercase text-teal-400 mt-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                {t('hero.tagline')}
              </motion.p>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-6 text-lg text-gray-400 max-w-lg leading-relaxed">
                {t('hero.desc')}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-8 flex flex-wrap items-center gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
                  className="flex items-center gap-2.5 bg-orange-500 text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {t('hero.exploreDemo')}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
                  className="flex items-center gap-2 text-gray-200 px-6 py-3.5 rounded-full text-sm font-semibold border border-[#333] hover:border-orange-500/50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  {t('hero.askAI')}
                </motion.button>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }} className="mt-12 flex items-center gap-8">
                {[
                  { value: '18+', label: 'AI Features' },
                  { value: '10', label: t('hero.stat2Label') },
                  { value: '6', label: 'Languages' },
                  { value: '100%', label: 'Serverless' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-extrabold text-gray-100">{stat.value}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden lg:flex justify-center items-start pt-24"
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLATFORM OVERVIEW — All 18 features grid
          ═══════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════
          PLATFORM FEATURES — Interactive tabbed showcase (Hero195)
          ═══════════════════════════════════════════ */}
      <Hero195 />

      {/* ═══════════════════════════════════════════
          ORDER FLOW — Visual step-by-step
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-8 bg-[#111113]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">End-to-End Commerce</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">
              End-to-End Commerce Flow
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
              From AI-powered pricing to delivery tracking & customer ledger — a complete B2B commerce experience for Indian retailers.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ORDER_FLOW.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-[#1a1a1d] rounded-2xl p-5 border border-[#2a2a2d] shadow-sm hover:shadow-md hover:shadow-black/20 transition-all text-center h-full">
                  <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider mb-1">Step {step.step}</div>
                  <h4 className="text-sm font-bold text-gray-200 mb-1">{step.title}</h4>
                  <p className="text-[10px] text-gray-500">{step.desc}</p>
                </div>
                {i < ORDER_FLOW.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 z-10">
                    <ArrowRight className="w-4 h-4 text-[#F97316]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED CATEGORIES — 4 cards
          ═══════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-[#0c0c0d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <ScrollReveal>
              <div>
                <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">{t('features.subtitle')}</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight whitespace-pre-line">
                  {t('features.title')}
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <motion.button whileHover={{ gap: '12px' }} onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-[#F97316] transition-colors">
                {t('features.exploreAll')} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </ScrollReveal>
          </div>

          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" staggerDelay={0.1}>
            {FEATURE_CARDS.map((card) => (
              <StaggerItem key={card.title}>
                <motion.div whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/login')}
                  className={`${card.bg} rounded-3xl p-6 lg:p-8 cursor-pointer group relative overflow-hidden h-[260px] lg:h-[300px] flex flex-col justify-between transition-shadow hover:shadow-xl hover:shadow-black/30 border border-[#2a2a2d]`}>
                  <div className="self-end">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-sm group-hover:bg-white/15 transition-all">
                      <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-orange-400 transition-colors" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <card.icon className="w-10 h-10 text-[#F97316]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-200">{card.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{card.subtitle}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCT SHOWCASE — Tabs + demo cards
          ═══════════════════════════════════════════ */}
      <section id="showcase" className="py-24 px-6 lg:px-8 bg-[#111113]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="mb-12">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">{t('showcase.subtitle')}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight whitespace-pre-line">
              {t('showcase.title')}
            </h2>
          </ScrollReveal>

          <div className="flex items-center gap-1 mb-10 bg-white/5 rounded-full p-1 w-fit border border-[#2a2a2d]">
            {SHOWCASE_TABS.map(tab => (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale: 0.97 }}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
                }`}>
                {tab.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {activeShowcase.cards.map((card, i) => (
                <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d] hover:shadow-lg hover:shadow-black/20 transition-all cursor-pointer"
                  onClick={() => navigate('/login')}>
                  <span className="text-2xl mb-3 block">{card.icon}</span>
                  <h4 className="font-bold text-gray-200 text-sm mb-1">{card.title}</h4>
                  <p className={`text-xl font-extrabold ${card.color} mb-2`}>{card.price}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${card.bg} px-2 py-0.5 rounded-full ${card.color}`}>{card.change}</span>
                    <span className="text-[10px] text-gray-500">{card.confidence}%</span>
                  </div>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                whileHover={{ y: -4, scale: 1.02 }} onClick={() => navigate('/login')}
                className="bg-gradient-to-br from-[#F97316] to-[#F59E0B] rounded-2xl p-5 shadow-lg cursor-pointer flex flex-col justify-between text-white min-h-[180px]">
                <div>
                  <h4 className="font-bold text-lg">{t('showcase.explore')}</h4>
                  <p className="text-sm text-white/70 mt-1">{t('showcase.exploreSub')}</p>
                </div>
                <motion.div whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 bg-white text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-semibold w-fit mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                  {t('showcase.viewDashboard')}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          AWS ARCHITECTURE — Technical showcase
          ═══════════════════════════════════════════ */}
      <section id="architecture" className="py-24 px-6 lg:px-8 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">Built on AWS</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Production-Grade Architecture
            </h2>
            <p className="text-white/50 mt-4 text-lg max-w-2xl mx-auto">
              Containerized on AWS App Runner with Amazon Bedrock AI, single-table DynamoDB, and 4-tier model fallback chain.
            </p>
          </ScrollReveal>

          {/* Architecture Diagram */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Frontend */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider mb-3">Frontend Layer</p>
                <div className="space-y-2">
                  {['React 18 + TypeScript + Vite', 'Tailwind CSS + Framer Motion', 'Recharts Data Visualization', 'Radix UI Primitives'].map(tech => (
                    <div key={tech} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider mb-3">API Layer</p>
                <div className="space-y-2">
                  {['Express.js on AWS App Runner', 'API Gateway + Lambda ready', '4-tier AI model fallback', 'Auto-scaling, zero cold starts'].map(tech => (
                    <div key={tech} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider mb-3">AI/ML Layer</p>
                <div className="space-y-2">
                  {['Bedrock Claude 3 Haiku (primary)', 'Amazon Nova Lite (cross-region)', 'Gemini 1.5 Flash (fallback)', 'Smart demo mode (always works)'].map(tech => (
                    <div key={tech} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Flow Arrow */}
            <div className="flex items-center justify-center my-6">
              <div className="flex items-center gap-3 text-white/30">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-white/20" />
                <ArrowDown className="w-5 h-5 text-[#F97316]" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-white/20" />
              </div>
            </div>

            {/* REST API Data Flow Visualization */}
            <div className="flex justify-center my-4">
              <DatabaseWithRestApi
                circleText="API"
                badgeTexts={{
                  first: 'GET',
                  second: 'POST',
                  third: 'PUT',
                  fourth: 'DELETE',
                }}
                buttonTexts={{
                  first: 'Bedrock',
                  second: 'DynamoDB',
                }}
                title="Data exchange using a customized REST API"
                lightColor="#F97316"
              />
            </div>

            {/* Flow Arrow */}
            <div className="flex items-center justify-center my-6">
              <div className="flex items-center gap-3 text-white/30">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-white/20" />
                <ArrowDown className="w-5 h-5 text-[#F97316]" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-white/20" />
              </div>
            </div>

            {/* AWS Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {AWS_SERVICES.map((service, i) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:border-[#F97316]/30 transition-colors"
                >
                  <service.icon className="w-5 h-5 text-[#F97316] mx-auto mb-2" />
                  <p className="text-xs font-bold text-white/90">{service.name}</p>
                  <p className="text-[9px] text-white/40 mt-0.5">{service.category}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '18', label: 'Pages & Features', sub: 'Complete platform' },
              { value: '6', label: 'AWS Services', sub: 'Bedrock, DynamoDB, ECR...' },
              { value: '4-tier', label: 'AI Fallback', sub: 'Always works' },
              { value: '100%', label: 'Serverless', sub: 'Auto-scaling infra' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center p-5 bg-white/5 rounded-2xl border border-white/10"
              >
                <p className="text-3xl font-extrabold text-[#F97316]">{stat.value}</p>
                <p className="text-sm font-semibold text-white/80 mt-1">{stat.label}</p>
                <p className="text-[10px] text-white/40">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          IMPACT NUMBERS — Big stats with context
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-8 bg-[#0c0c0d]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">Built for Bharat</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">
              Designed for 12M+ Indian SMBs
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '10', label: 'Indian Cities', desc: 'Mumbai, Delhi, Bangalore, Lucknow, Chennai, Kolkata, Ahmedabad, Pune, Jaipur, Indore', icon: MapPin },
              { value: '6', label: 'Languages', desc: 'English, Hindi, Tamil, Bengali, Gujarati, Marathi — culturally adapted', icon: Globe },
              { value: '130+', label: 'Wholesale Products', desc: 'Groceries, Fashion, Electronics, Beauty, Home & Kitchen categories', icon: Package },
              { value: '40+', label: 'Verified Suppliers', desc: 'Rated wholesalers with MOQ, delivery days, and specialties', icon: Shield },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }}
                  className="bg-[#1a1a1d] rounded-2xl p-6 border border-[#2a2a2d] shadow-sm hover:shadow-lg hover:shadow-black/20 transition-all h-full"
                >
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-3">
                    <stat.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-gray-100">{stat.value}</p>
                  <p className="text-sm font-bold text-gray-200 mt-1">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{stat.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROMOTIONAL SPLIT ═══ */}
      <section className="py-24 px-6 lg:px-8 bg-[#111113]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            <ScrollReveal direction="left">
              <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl overflow-hidden h-[400px] lg:h-[480px] relative">
                <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80&fit=crop" alt="Indian kirana store" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium text-white/70">{t('promo.builtFor')}</p>
                  <p className="text-2xl font-extrabold">{t('promo.indianRetailer')}</p>
                </div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="bg-gradient-to-br from-[#F97316] to-[#F59E0B] rounded-3xl p-8 lg:p-12 flex flex-col justify-center h-[400px] lg:h-[480px] relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10" />
                <div className="absolute bottom-[-80px] left-[-40px] w-[250px] h-[250px] rounded-full bg-white/5" />
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">{t('promo.openForAll')}</p>
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight whitespace-pre-line">{t('promo.freeForAll')}</h3>
                  <p className="text-white/80 mt-4 text-lg leading-relaxed max-w-md">
                    {t('promo.desc')}
                  </p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
                    className="mt-8 flex items-center gap-2.5 bg-white text-[#1a1a1a] px-7 py-3.5 rounded-full text-sm font-semibold shadow-xl shadow-black/10 hover:shadow-2xl transition-shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                    {t('promo.startFree')}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section id="benefits" className="py-24 px-6 lg:px-8 bg-[#0c0c0d]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">{t('benefits.subtitle')}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">{t('benefits.title')}</h2>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
              {t('benefits.desc')}
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.12}>
            {BENEFITS.map((b) => (
              <StaggerItem key={b.title}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-[#1a1a1d] rounded-2xl p-8 shadow-sm border border-[#2a2a2d] hover:shadow-lg hover:shadow-black/20 transition-all relative">
                  <div className={`absolute top-6 right-6 w-12 h-12 ${b.color} rounded-xl flex items-center justify-center`}>
                    <b.icon className={`w-6 h-6 ${b.iconColor}`} />
                  </div>
                  <div className="mt-2">
                    <h4 className="text-xl font-extrabold text-gray-100 mb-2">{b.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-24 px-6 lg:px-8 bg-[#111113]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">{t('testimonials.subtitle')}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">{t('testimonials.title')}</h2>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <ScrollReveal key={testimonial.name} delay={i * 0.15}>
                <motion.div whileHover={{ y: -4 }} className="bg-[#1a1a1d] rounded-2xl p-8 border border-[#2a2a2d]">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-[#F97316] text-[#F97316]" />
                    ))}
                  </div>
                  <p className="text-gray-200 text-lg font-medium leading-relaxed mb-6">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-gray-200 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                    {testimonial.badge && (
                      <span className="ml-auto text-[10px] font-semibold bg-green-500/10 text-green-400 px-3 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> {testimonial.badge}
                      </span>
                    )}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHATSAPP DEMO ═══ */}
      <WhatsAppDemo />

      {/* ═══ FOOTER CTA + FOOTER ═══ */}
      <section className="relative overflow-hidden">
        <div className="relative py-24 px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] via-[#FB923C] to-[#F59E0B]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] rounded-full bg-white/20 blur-[100px]" />
            <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] rounded-full bg-[#1a1a1a]/10 blur-[80px]" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight whitespace-pre-line">{t('cta.title')}</h2>
              <p className="text-white/80 mt-4 text-lg">{t('cta.desc')}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
                  className="bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-sm font-semibold shadow-xl shadow-black/20 whitespace-nowrap flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                  Explore Live Demo
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="bg-[#1a1a1a] pt-8 pb-2 overflow-hidden">
          <div className="text-center relative">
            <h2 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-extrabold text-white/[0.04] leading-none tracking-tighter select-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <span style={{ fontWeight: 900 }}>Bharat</span><span style={{ fontWeight: 300 }}>Bazaar</span>
            </h2>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
              <IconLogo mode="dark" size={160} />
            </div>
          </div>
        </div>

        <footer className="bg-[#1a1a1a] text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <div className="col-span-2">
                <div className="mb-4">
                  <NavbarLogo mode="dark" />
                </div>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                  {t('footer.desc')}
                </p>
                <div className="flex items-center gap-3 mt-6 flex-wrap">
                  {['AWS Bedrock', 'DynamoDB', 'App Runner', 'ECR', 'React', 'TypeScript'].map(tech => (
                    <span key={tech} className="text-[10px] px-3 py-1 border border-white/10 rounded-full text-white/30 font-medium">{tech}</span>
                  ))}
                </div>
              </div>
              {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                <div key={title}>
                  <h4 className="font-semibold text-sm mb-4 text-white/60">{title}</h4>
                  <ul className="space-y-2.5">
                    {links.map(link => (
                      <li key={link}><a href="#" className="text-sm text-white/30 hover:text-white/70 transition-colors">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/30">&copy; 2026 ParityAI. All rights reserved.</p>
              <p className="text-xs text-white/20">AI for Bharat Hackathon 2026 — Track: Retail, Commerce & Market Intelligence</p>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}
