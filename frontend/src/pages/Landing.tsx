import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, IndianRupee, Languages, MessageSquareText, ArrowRight, Sparkles, MapPin, TrendingUp, Zap, Package, MessageCircle, CloudSun, Eye, Shield, Users, Globe, BarChart3 } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem, CountUp, TextReveal, ParallaxTilt, FloatingElement, GlowButton, Marquee } from '../components/AnimatedComponents'

const features = [
  {
    icon: Package,
    title: 'Smart Sourcing',
    titleHi: 'स्मार्ट सोर्सिंग',
    description: 'Find cheapest wholesale prices from verified suppliers near you. Order directly — we earn commission, you save money.',
    color: 'from-teal-400 to-emerald-500',
    route: '/sourcing',
    tag: 'KILLER FEATURE',
  },
  {
    icon: IndianRupee,
    title: 'Dynamic Pricing',
    titleHi: 'डायनामिक प्राइसिंग',
    description: 'AI analyzes competitor prices + weather + festivals + regional purchasing power to suggest optimal pricing.',
    color: 'from-saffron-400 to-orange-500',
    route: '/pricing',
  },
  {
    icon: MessageCircle,
    title: 'AI Business Advisor',
    titleHi: 'AI बिज़नेस सलाहकार',
    description: '"Diwali ke liye kya stock karun?" — Ask in Hindi, English, or Hinglish. Get real answers with real prices.',
    color: 'from-violet-400 to-purple-500',
    route: '/chat',
    tag: 'HINDI VOICE',
  },
  {
    icon: Languages,
    title: 'Multilingual Content',
    titleHi: 'बहुभाषी कंटेंट',
    description: 'Culturally adapted product descriptions in 6 Indian languages. Not translation — true cultural adaptation.',
    color: 'from-teal-400 to-cyan-500',
    route: '/content',
  },
  {
    icon: MessageSquareText,
    title: 'Hinglish Sentiment',
    titleHi: 'हिंगलिश सेंटिमेंट',
    description: 'Understands "Product accha hai but delivery slow thi" — real Indian language intelligence for reviews.',
    color: 'from-indigo-400 to-violet-500',
    route: '/sentiment',
  },
]

const stats = [
  { value: 12, suffix: 'M+', label: 'Small Retailers in India', icon: Store },
  { value: 1.3, suffix: 'T', prefix: '₹', label: 'Retail Market Size', icon: IndianRupee },
  { value: 10, suffix: '', label: 'Indian Cities Covered', icon: MapPin },
  { value: 6, suffix: '', label: 'Languages Supported', icon: Globe },
]

const howItWorks = [
  { time: '6 AM', title: 'Morning Alert', titleHi: 'सुबह की अलर्ट', desc: '"Heavy rain predicted in Lucknow. Umbrella demand will spike 60%. Best price: ₹45/unit from Gupta Wholesale."', icon: CloudSun, color: 'from-blue-400 to-cyan-500' },
  { time: '9 AM', title: 'Price Intelligence', titleHi: 'प्राइस इंटेलिजेंस', desc: '"Your competitor dropped Basmati Rice to ₹420. Amazon: ₹449. Recommended: ₹415 (₹95 profit per unit)."', icon: TrendingUp, color: 'from-saffron-400 to-orange-500' },
  { time: '12 PM', title: 'Stock Alert', titleHi: 'स्टॉक अलर्ट', desc: '"~20 units of Surf Excel left. Stockout in 3 days. Best wholesale: ₹185/unit from Mehta Distributors."', icon: Package, color: 'from-emerald-400 to-teal-500' },
  { time: '4 PM', title: 'Customer Insights', titleHi: 'ग्राहक इनसाइट', desc: '"15 customers mentioned delivery speed negatively. Consider partnering with Dunzo for ₹15/delivery."', icon: MessageSquareText, color: 'from-violet-400 to-purple-500' },
]

const awsTech = ['Amazon Bedrock', 'Claude AI', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'S3', 'CloudFront', 'CloudWatch']

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ========= HEADER ========= */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-bazaar-500 flex items-center justify-center shadow-lg shadow-saffron-500/20"
            >
              <Store className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text">BharatBazaar AI</h1>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase">by ParityAI</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block font-hindi">भारत के लिए AI</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
            >
              Try Live Demo <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* ========= HERO SECTION ========= */}
      <section className="relative pt-32 pb-24 px-6 min-h-screen flex items-center">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient" />

        {/* Floating decorative elements */}
        <FloatingElement className="absolute top-32 left-[10%] opacity-20" delay={0} duration={8}>
          <IndianRupee className="w-16 h-16 text-saffron-400" />
        </FloatingElement>
        <FloatingElement className="absolute top-48 right-[15%] opacity-15" delay={2} duration={7}>
          <Package className="w-12 h-12 text-bazaar-400" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-32 left-[20%] opacity-15" delay={1} duration={9}>
          <BarChart3 className="w-14 h-14 text-royal-400" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-48 right-[10%] opacity-20" delay={3} duration={6}>
          <Store className="w-10 h-10 text-saffron-300" />
        </FloatingElement>

        {/* Sparkle dots */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-saffron-400/30"
            style={{
              left: `${15 + (i * 10)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
          />
        ))}

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <ScrollReveal>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-saffron-600 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-saffron-100/50 shadow-lg shadow-saffron-500/10"
              >
                <Sparkles className="w-4 h-4" />
                Powered by Amazon Bedrock (Claude AI)
              </motion.div>
            </ScrollReveal>

            {/* Headline with text reveal */}
            <h2 className="font-display text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1]">
              <TextReveal text="The" className="inline" />
              {' '}
              <span className="gradient-text">
                <TextReveal text="Intelligence Layer" delay={0.3} className="inline" />
              </span>
              <br />
              <TextReveal text="for Indian Retail" delay={0.6} className="inline" />
            </h2>

            <ScrollReveal delay={0.8}>
              <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                12 million kirana stores operate on gut feeling. BharatBazaar AI connects them to
                <span className="font-semibold text-gray-700"> wholesale prices, market intelligence, and AI-powered business advice </span>
                — all in their own language.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <p className="mt-3 text-lg font-hindi text-saffron-500 font-medium">
                हर दुकानदार के लिए AI की ताक़त — बिल्कुल FREE
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal delay={1.2}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <GlowButton
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary text-lg px-8 py-4 rounded-2xl shadow-xl shadow-saffron-500/25"
                >
                  <Zap className="w-5 h-5" />
                  Try Live Demo — No Login
                </GlowButton>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/chat')}
                  className="btn-outline text-lg px-8 py-4 rounded-2xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Talk to AI Advisor
                </motion.button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1.4}>
              <p className="mt-4 text-sm text-gray-400">
                Pre-loaded with Ramesh's Kirana Store in Lucknow. Click and explore instantly.
              </p>
            </ScrollReveal>
          </div>

          {/* Dashboard Preview with Parallax Tilt */}
          <ScrollReveal delay={0.5} className="mt-16">
            <ParallaxTilt intensity={5} className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/20 border border-gray-200/50">
                {/* Browser chrome */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 ml-4">
                    bharatbazaar.ai/dashboard
                  </div>
                </div>
                {/* Mock dashboard content */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {['Trending: 8', 'Confidence: 87%', 'Sentiment: 72/100', 'Growth: +14%'].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.8 + i * 0.15 }}
                        className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                      >
                        <p className="text-[10px] text-gray-400">
                          {stat.split(':')[0]}
                        </p>
                        <p className="text-lg font-bold text-gray-800">{stat.split(': ')[1]}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-32">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Sentiment Trend</p>
                      <div className="flex items-end gap-1 h-16">
                        {[40, 55, 45, 65, 60, 72, 68, 75, 80].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 2 + i * 0.1, duration: 0.5 }}
                            className="flex-1 bg-gradient-to-t from-saffron-500 to-saffron-300 rounded-sm"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-32">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Demand Forecast</p>
                      <svg viewBox="0 0 200 60" className="w-full h-16">
                        <motion.path
                          d="M0,50 C40,45 60,20 100,25 C140,30 160,10 200,15"
                          fill="none"
                          stroke="#0D9488"
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 2, duration: 1.5, ease: 'easeOut' }}
                        />
                        <motion.path
                          d="M0,50 C40,45 60,20 100,25 C140,30 160,10 200,15 L200,60 L0,60 Z"
                          fill="url(#areaGradient)"
                          opacity="0.15"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.15 }}
                          viewport={{ once: true }}
                          transition={{ delay: 2.5, duration: 0.5 }}
                        />
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0D9488" />
                            <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floating annotation labels */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.5 }}
                  className="absolute left-[-80px] top-1/3 hidden xl:flex items-center gap-2 text-xs font-medium text-saffron-600 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-saffron-100"
                >
                  Real-time alerts <ArrowRight className="w-3 h-3" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.7 }}
                  className="absolute right-[-100px] top-1/4 hidden xl:flex items-center gap-2 text-xs font-medium text-bazaar-600 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-bazaar-100"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" /> Weather intelligence
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.9 }}
                  className="absolute right-[-70px] bottom-1/3 hidden xl:flex items-center gap-2 text-xs font-medium text-royal-600 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-royal-100"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" /> AI pricing
                </motion.div>
              </div>
            </ParallaxTilt>
          </ScrollReveal>
        </div>
      </section>

      {/* ========= STATS COUNTER SECTION ========= */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#312e81] to-[#1E1B4B]" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="max-w-7xl mx-auto px-6 relative">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center group"
                >
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors border border-white/10">
                    <stat.icon className="w-6 h-6 text-saffron-300" />
                  </div>
                  <div className="text-4xl md:text-5xl font-display font-extrabold text-white">
                    <CountUp end={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-medium">{stat.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========= RAMESH'S DAY - STORY TIMELINE ========= */}
      <section className="py-24 px-6 bg-gray-50 relative wave-separator">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h3 className="font-display text-3xl md:text-5xl font-bold text-gray-900">
              A Day in <span className="gradient-text">Ramesh's</span> Life
            </h3>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">How BharatBazaar AI transforms a kirana store owner's decisions — from morning to evening</p>
          </ScrollReveal>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-saffron-300 via-bazaar-300 to-royal-300 hidden md:block" />

            <div className="space-y-8">
              {howItWorks.map((step, i) => (
                <ScrollReveal key={step.time} delay={i * 0.15} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex gap-6 items-start ml-0 md:ml-4"
                  >
                    {/* Time badge */}
                    <div className="flex-shrink-0 relative">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}
                      >
                        <step.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-saffron-600 whitespace-nowrap">{step.time}</span>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80 hover:shadow-xl transition-all">
                      <h4 className="font-display text-lg font-bold text-gray-900">{step.title}</h4>
                      <p className="text-xs font-hindi text-gray-400 mb-2">{step.titleHi}</p>
                      <p className="text-gray-600 leading-relaxed italic text-sm">"{step.desc}"</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========= FEATURE SHOWCASE ========= */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 mesh-gradient opacity-50" />

        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal className="text-center mb-16">
            <h3 className="font-display text-3xl md:text-5xl font-bold text-gray-900">
              5 Connected Features That <span className="gradient-text">Win</span>
            </h3>
            <p className="mt-4 text-gray-500 text-lg">Not isolated tools — an integrated ecosystem powered by Amazon Bedrock</p>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.12}>
            {features.map((feature, i) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative bg-white/60 backdrop-blur-xl rounded-2xl p-7 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
                    i === 0 ? 'ring-2 ring-bazaar-200/50 md:col-span-1' : ''
                  }`}
                  onClick={() => navigate(feature.route)}
                >
                  {feature.tag && (
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className={`absolute -top-2.5 right-4 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg ${
                        feature.tag === 'KILLER FEATURE' ? 'bg-gradient-to-r from-bazaar-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-royal-500 to-violet-500 text-white'
                      }`}
                    >
                      <span className="shimmer absolute inset-0 rounded-full" />
                      <span className="relative">{feature.tag}</span>
                    </motion.span>
                  )}

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  <h4 className="font-display text-xl font-bold text-gray-900">{feature.title}</h4>
                  <p className="text-xs font-hindi text-gray-400 mt-0.5">{feature.titleHi}</p>
                  <p className="mt-3 text-gray-500 leading-relaxed text-sm">{feature.description}</p>

                  <div className="mt-5 flex items-center text-saffron-500 text-sm font-semibold gap-1 group-hover:gap-3 transition-all">
                    Try it now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========= BUSINESS MODEL ========= */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#1E1B4B] via-[#2d2874] to-[#1E1B4B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="max-w-5xl mx-auto relative">
          <ScrollReveal className="text-center mb-14">
            <h3 className="font-display text-3xl md:text-4xl font-bold">How BharatBazaar AI Makes Money</h3>
            <p className="text-white/50 mt-3 text-lg">Free for retailers. Commission from wholesalers. Premium subscriptions later.</p>
          </ScrollReveal>

          {/* Animated Pipeline */}
          <StaggerContainer className="grid md:grid-cols-3 gap-0 mb-16 relative" staggerDelay={0.3}>
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-1/2 left-[33%] w-[34%] h-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-saffron-500 to-bazaar-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.8 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
            <div className="hidden md:block absolute top-1/2 left-[67%] w-[33%] h-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-bazaar-500 to-royal-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5, duration: 0.8 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>

            {[
              { step: '1', title: 'FREE AI Advice', desc: 'Retailers get pricing, content & sentiment analysis at zero cost', icon: Sparkles, color: 'from-saffron-400 to-orange-500' },
              { step: '2', title: 'Wholesale Orders', desc: 'Retailers order stock through us. We take 2-3% commission from wholesalers', icon: Package, color: 'from-bazaar-400 to-emerald-500' },
              { step: '3', title: 'Premium Upsell', desc: 'Power users pay ₹999/month for advanced forecasting & priority alerts', icon: Zap, color: 'from-royal-400 to-violet-500' },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all relative"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-xl`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h4 className="font-display font-bold text-xl">{item.title}</h4>
                  <p className="text-sm text-white/50 mt-3 leading-relaxed">{item.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Tech Stack Marquee */}
          <ScrollReveal>
            <p className="text-sm text-white/30 text-center mb-6 uppercase tracking-wider font-medium">Built on</p>
            <Marquee speed={25} className="py-2">
              {awsTech.map((tech) => (
                <span key={tech} className="px-5 py-2.5 border border-white/10 rounded-full text-sm text-white/40 hover:text-white/70 hover:border-white/30 transition-colors whitespace-nowrap bg-white/5">
                  {tech}
                </span>
              ))}
            </Marquee>
          </ScrollReveal>
        </div>
      </section>

      {/* ========= TRUST SECTION ========= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <h3 className="font-display text-3xl font-bold text-gray-900">Why <span className="gradient-text">BharatBazaar AI</span> Wins</h3>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {[
              { icon: Globe, title: 'India-First Design', desc: 'Deep regional awareness — 10 cities, festivals, purchasing power, cultural preferences. Not a generic SaaS.', color: 'from-saffron-400 to-orange-500' },
              { icon: Users, title: 'Zero Friction', desc: 'No login, no credit card. Judges click URL → see a working demo instantly with pre-loaded kirana store data.', color: 'from-bazaar-400 to-emerald-500' },
              { icon: Shield, title: 'Hinglish Intelligence', desc: 'Our AI understands code-mixed reviews like "Packaging tuti hui thi, not happy" — real Indian language.', color: 'from-royal-400 to-violet-500' },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <motion.div whileHover={{ y: -5 }} className="card text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========= FINAL CTA ========= */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="max-w-3xl mx-auto text-center relative">
          <ScrollReveal>
            <h3 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Ready to see it in <span className="gradient-text">action?</span>
            </h3>
            <p className="mt-5 text-gray-500 text-lg">No login. No credit card. Just click and explore Ramesh's store.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <GlowButton
              onClick={() => navigate('/dashboard')}
              className="mt-10 btn-primary text-lg px-10 py-5 rounded-2xl shadow-xl shadow-saffron-500/25 mx-auto"
            >
              <Store className="w-5 h-5" />
              Enter Ramesh's Store
              <ArrowRight className="w-5 h-5" />
            </GlowButton>
          </ScrollReveal>
        </div>
      </section>

      {/* ========= FOOTER ========= */}
      <footer className="py-8 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-bazaar-500 flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white">BharatBazaar AI</span>
            <span className="text-sm text-gray-500">by ParityAI</span>
          </div>
          <p className="text-sm text-gray-500">
            AI for Bharat Hackathon 2026 — Track: Retail, Commerce & Market Intelligence
          </p>
        </div>
      </footer>
    </div>
  )
}
