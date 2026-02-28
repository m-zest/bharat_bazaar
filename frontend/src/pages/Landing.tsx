import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IndianRupee, Languages, MessageSquareText, ArrowRight, ArrowUpRight, Sparkles, Package, MessageCircle, Globe, BarChart3, Star, Zap, Check, Mail } from 'lucide-react'
import { NavbarLogo, FullLogo, IconLogo, WordmarkLogo } from '../components/TarazuLogo'
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/AnimatedComponents'
import PhoneMockup from '../components/PhoneMockup'

/* ──────────────── DATA ──────────────── */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#showcase' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Testimonials', href: '#testimonials' },
]

const FEATURE_CARDS = [
  { icon: IndianRupee, title: 'Smart Pricing', subtitle: 'AI-optimized prices for your region', bg: 'bg-[#FEF3C7]', route: '/pricing' },
  { icon: Languages, title: 'AI Content', subtitle: 'Descriptions in 6 Indian languages', bg: 'bg-[#F0FDFA]', route: '/content' },
  { icon: MessageSquareText, title: 'Sentiment', subtitle: 'Understands Hinglish reviews', bg: 'bg-[#FFF7ED]', route: '/sentiment' },
  { icon: Package, title: 'Sourcing', subtitle: 'Wholesale prices near you', bg: 'bg-[#FEF3C7]', route: '/sourcing' },
]

const SHOWCASE_TABS = [
  {
    id: 'pricing',
    label: 'Pricing',
    cards: [
      { title: 'Competitive Strategy', price: '₹415', confidence: 92, change: '+18% demand', color: 'text-blue-600', bg: 'bg-blue-50', icon: '🎯' },
      { title: 'Premium Strategy', price: '₹469', confidence: 87, change: '+12% revenue', color: 'text-orange-600', bg: 'bg-orange-50', icon: '✨' },
      { title: 'Value Strategy', price: '₹389', confidence: 78, change: '+35% volume', color: 'text-teal-600', bg: 'bg-teal-50', icon: '🛡️' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    cards: [
      { title: 'English Description', price: 'Premium aged rice...', confidence: 95, change: 'SEO optimized', color: 'text-blue-600', bg: 'bg-blue-50', icon: '🇬🇧' },
      { title: 'Hindi Description', price: 'प्रीमियम बासमती चावल...', confidence: 90, change: 'Culturally adapted', color: 'text-orange-600', bg: 'bg-orange-50', icon: '🇮🇳' },
      { title: 'Tamil Description', price: 'பிரீமியம் பாஸ்மதி...', confidence: 88, change: 'Regional keywords', color: 'text-teal-600', bg: 'bg-teal-50', icon: '🇮🇳' },
    ],
  },
  {
    id: 'sourcing',
    label: 'Sourcing',
    cards: [
      { title: 'Gupta Wholesale', price: '₹285/5kg', confidence: 96, change: 'Save ₹35', color: 'text-green-600', bg: 'bg-green-50', icon: '🏪' },
      { title: 'Mehta Distributors', price: '₹295/5kg', confidence: 92, change: '2-day delivery', color: 'text-blue-600', bg: 'bg-blue-50', icon: '🚛' },
      { title: 'Sharma Trading', price: '₹310/5kg', confidence: 85, change: 'Verified ✓', color: 'text-orange-600', bg: 'bg-orange-50', icon: '✅' },
    ],
  },
]

const BENEFITS = [
  { icon: Globe, title: '6 Indian Languages', desc: 'Hindi, Tamil, Bengali, Gujarati, Marathi & English. Not translations — true cultural adaptation.', color: 'bg-[#FEF3C7]', iconColor: 'text-orange-500' },
  { icon: BarChart3, title: 'Real Market Data', desc: 'Live competitor prices from Amazon, Flipkart, BigBasket. Festival trends. Weather impact analysis.', color: 'bg-[#F0FDFA]', iconColor: 'text-teal-500' },
  { icon: Zap, title: 'Zero Setup', desc: 'No login, no credit card, no downloads. Open the link and start exploring in under 30 seconds.', color: 'bg-[#FFF7ED]', iconColor: 'text-orange-500' },
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

const FOOTER_LINKS: Record<string, string[]> = {
  Features: ['Smart Pricing', 'AI Content', 'Sentiment Analysis', 'Smart Sourcing', 'AI Advisor'],
  Resources: ['Documentation', 'API Reference', 'Case Studies', 'Blog'],
  Company: ['About ParityAI', 'Careers', 'Contact', 'Press Kit'],
}

/* ──────────────── COMPONENT ──────────────── */

export default function Landing() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pricing')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activeShowcase = SHOWCASE_TABS.find(t => t.id === activeTab)!

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* ═══════════════════════════════════════════
          NAVBAR — Minimal, pill CTA, dot indicator
          ═══════════════════════════════════════════ */}
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="block">
            <NavbarLogo mode={scrolled ? 'light' : 'light'} />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#333] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            Try Demo
          </motion.button>
        </div>
      </motion.header>

      {/* ═══════════════════════════════════════════
          HERO — Giant text, silk gradient, floating cards
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Saffron silk gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FEF3C7]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-30">
            <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#F97316]/40 to-[#F59E0B]/20 blur-[100px]" />
            <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-[#FB923C]/30 to-transparent blur-[80px]" />
          </div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-20">
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#0D9488]/20 to-transparent blur-[100px]" />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div>
              <ScrollReveal>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-[#666] mb-8 border border-[#F97316]/20 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                  Powered by Amazon Bedrock
                </motion.div>
              </ScrollReveal>

              <motion.h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-extrabold text-[#1a1a1a] leading-[0.95] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="block" style={{ fontWeight: 900 }}>
                  Bharat
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="block bg-gradient-to-r from-[#F97316] to-[#F59E0B] bg-clip-text text-transparent" style={{ fontWeight: 300 }}>
                  Bazaar
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="block text-[2rem] md:text-[2.8rem] lg:text-[3.2rem] text-[#666] font-bold mt-2">
                  AI Intelligence
                </motion.span>
              </motion.h1>

              {/* Tagline */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.65 }}
                className="text-sm font-medium tracking-[3px] uppercase text-[#0D9488] mt-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                Weighed by Intelligence
              </motion.p>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-6 text-lg text-[#666] max-w-lg leading-relaxed">
                The AI-powered market intelligence platform built for 12 million Indian retailers.
                Smart pricing, multilingual content, and real-time insights — in your language.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-8 flex flex-wrap items-center gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2.5 bg-[#1a1a1a] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#333] transition-colors shadow-xl shadow-black/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                  Explore Demo
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/chat')}
                  className="flex items-center gap-2 text-[#1a1a1a] px-6 py-3.5 rounded-full text-sm font-semibold border-2 border-[#e5e5e5] hover:border-[#F97316] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Ask AI in Hindi
                </motion.button>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }} className="mt-12 flex items-center gap-8">
                {[
                  { value: '12M+', label: 'Kirana Stores' },
                  { value: '10', label: 'Cities' },
                  { value: '₹40L', label: 'Prize Pool' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-extrabold text-[#1a1a1a]">{stat.value}</p>
                    <p className="text-xs text-[#999] font-medium mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Phone Mockup with live chat */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden lg:flex justify-center items-center"
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED CATEGORIES — 4 cards with arrow
          ═══════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <ScrollReveal>
              <div>
                <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">Our AI Features</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight">
                  Everything your store<br />needs to grow
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <motion.button whileHover={{ gap: '12px' }} onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] hover:text-[#F97316] transition-colors">
                Explore All Features <ArrowRight className="w-4 h-4" />
              </motion.button>
            </ScrollReveal>
          </div>

          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" staggerDelay={0.1}>
            {FEATURE_CARDS.map((card) => (
              <StaggerItem key={card.title}>
                <motion.div whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(card.route)}
                  className={`${card.bg} rounded-3xl p-6 lg:p-8 cursor-pointer group relative overflow-hidden h-[260px] lg:h-[300px] flex flex-col justify-between transition-shadow hover:shadow-xl`}>
                  <div className="self-end">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm group-hover:bg-white group-hover:shadow-md transition-all">
                      <ArrowUpRight className="w-5 h-5 text-[#1a1a1a] group-hover:text-[#F97316] transition-colors" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <card.icon className="w-10 h-10 text-[#F97316]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1a1a1a]">{card.title}</h3>
                    <p className="text-xs text-[#999] mt-0.5">{card.subtitle}</p>
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
      <section id="showcase" className="py-24 px-6 lg:px-8 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="mb-12">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">See it in action</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight">
              What BharatBazaar AI<br />can do for you
            </h2>
          </ScrollReveal>

          <div className="flex items-center gap-1 mb-10 bg-gray-100 rounded-full p-1 w-fit">
            {SHOWCASE_TABS.map(tab => (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale: 0.97 }}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id ? 'bg-[#1a1a1a] text-white shadow-lg' : 'text-[#666] hover:text-[#1a1a1a]'
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
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/${activeTab === 'pricing' ? 'pricing' : activeTab === 'content' ? 'content' : 'sourcing'}`)}>
                  <span className="text-2xl mb-3 block">{card.icon}</span>
                  <h4 className="font-bold text-[#1a1a1a] text-sm mb-1">{card.title}</h4>
                  <p className={`text-xl font-extrabold ${card.color} mb-2`}>{card.price}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${card.bg} px-2 py-0.5 rounded-full ${card.color}`}>{card.change}</span>
                    <span className="text-[10px] text-[#999]">{card.confidence}%</span>
                  </div>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                whileHover={{ y: -4, scale: 1.02 }} onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-br from-[#F97316] to-[#F59E0B] rounded-2xl p-5 shadow-lg cursor-pointer flex flex-col justify-between text-white min-h-[180px]">
                <div>
                  <h4 className="font-bold text-lg">Explore 8+ more features</h4>
                  <p className="text-sm text-white/70 mt-1">Inventory, competitors, compare & more</p>
                </div>
                <motion.div whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 bg-white text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-semibold w-fit mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                  View Dashboard
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROMOTIONAL SPLIT — Image + gradient card
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            <ScrollReveal direction="left">
              <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl overflow-hidden h-[400px] lg:h-[480px] relative">
                <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80&fit=crop" alt="Indian kirana store" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium text-white/70">Built for every</p>
                  <p className="text-2xl font-extrabold">Indian Retailer</p>
                </div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="bg-gradient-to-br from-[#F97316] to-[#F59E0B] rounded-3xl p-8 lg:p-12 flex flex-col justify-center h-[400px] lg:h-[480px] relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10" />
                <div className="absolute bottom-[-80px] left-[-40px] w-[250px] h-[250px] rounded-full bg-white/5" />
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Open for All</p>
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">Free for All<br />Retailers</h3>
                  <p className="text-white/80 mt-4 text-lg leading-relaxed max-w-md">
                    AI-powered intelligence that was only available to Amazon & Flipkart. Now free for every dukandaar across India.
                  </p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/dashboard')}
                    className="mt-8 flex items-center gap-2.5 bg-white text-[#1a1a1a] px-7 py-3.5 rounded-full text-sm font-semibold shadow-xl shadow-black/10 hover:shadow-2xl transition-shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                    Start Free
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BENEFITS — 3 cards, icon badges
          ═══════════════════════════════════════════ */}
      <section id="benefits" className="py-24 px-6 lg:px-8 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">What makes us different</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight">Why BharatBazaar AI?</h2>
            <p className="text-[#666] mt-4 text-lg max-w-2xl mx-auto">
              Purpose-built for Indian retail. Not a generic SaaS — every feature understands your market.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.12}>
            {BENEFITS.map((b) => (
              <StaggerItem key={b.title}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all relative">
                  <div className={`absolute top-6 right-6 w-12 h-12 ${b.color} rounded-xl flex items-center justify-center`}>
                    <b.icon className={`w-6 h-6 ${b.iconColor}`} />
                  </div>
                  <div className="mt-2">
                    <h4 className="text-xl font-extrabold text-[#1a1a1a] mb-2">{b.title}</h4>
                    <p className="text-[#666] text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS — Large + small card
          ═══════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-sm font-semibold text-[#F97316] uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight">Built for Indian Retailers</h2>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.15}>
                <motion.div whileHover={{ y: -4 }} className="bg-[#FAFAF9] rounded-2xl p-8 border border-gray-100">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-[#F97316] text-[#F97316]" />
                    ))}
                  </div>
                  <p className="text-[#1a1a1a] text-lg font-medium leading-relaxed mb-6">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-[#1a1a1a] text-sm">{t.name}</p>
                      <p className="text-xs text-[#999]">{t.role}</p>
                    </div>
                    {t.badge && (
                      <span className="ml-auto text-[10px] font-semibold bg-green-50 text-green-600 px-3 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> {t.badge}
                      </span>
                    )}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER CTA + FOOTER
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* CTA with saffron silk bg */}
        <div className="relative py-24 px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] via-[#FB923C] to-[#F59E0B]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] rounded-full bg-white/20 blur-[100px]" />
            <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] rounded-full bg-[#1a1a1a]/10 blur-[80px]" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Transform your retail<br />business today</h2>
              <p className="text-white/80 mt-4 text-lg">Join the AI revolution. No login needed — start in 30 seconds.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <div className="flex-1 w-full relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
                  <input type="email" placeholder="Enter your email" className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm border-0 outline-none shadow-lg" />
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/dashboard')}
                  className="bg-[#1a1a1a] text-white px-7 py-3.5 rounded-full text-sm font-semibold shadow-xl shadow-black/20 whitespace-nowrap">
                  Get Started
                </motion.button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Giant BharatBazaar watermark text + Tarazu icon */}
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

        {/* Footer */}
        <footer className="bg-[#1a1a1a] text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <div className="col-span-2">
                <div className="mb-4">
                  <NavbarLogo mode="dark" />
                </div>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                  AI-powered market intelligence for Indian retail. Built for the AI for Bharat Hackathon 2026.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  {['AWS', 'Bedrock', 'React', 'Vercel'].map(tech => (
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
