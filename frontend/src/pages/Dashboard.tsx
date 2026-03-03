import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { TrendingUp, IndianRupee, Languages, MessageSquareText, Calendar, MapPin, ArrowRight, Sparkles, Package, BarChart3, Activity, CloudSun, Sun, Cloud, CloudRain, Thermometer, Bell, MessageCircle, Eye, GitCompare, ClipboardList, Zap } from 'lucide-react'
import { api } from '../utils/api'
import OnboardingModal, { isOnboarded, getOnboardingData } from '../components/OnboardingModal'
import { ScrollReveal, CountUp } from '../components/AnimatedComponents'

const COLORS = ['#FF9933', '#138d75', '#7c3aed', '#C0392B']

const WEATHER_ICONS: Record<string, any> = {
  'sun': Sun,
  'cloud-sun': CloudSun,
  'cloud': Cloud,
  'cloud-rain': CloudRain,
  'cloud-fog': Cloud,
  'cloud-lightning': CloudRain,
  'thermometer-sun': Thermometer,
  'droplets': CloudRain,
}

const ALERT_ICONS: Record<string, any> = {
  'cloud-rain': CloudRain,
  'trending-down': TrendingUp,
  'trending-up': TrendingUp,
  'package': Package,
  'sparkles': Sparkles,
}

function getGreeting(): { text: string; textHi: string; emoji: string } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', textHi: 'सुप्रभात', emoji: '☀️' }
  if (hour < 17) return { text: 'Good afternoon', textHi: 'नमस्ते', emoji: '🌤️' }
  if (hour < 21) return { text: 'Good evening', textHi: 'शुभ संध्या', emoji: '🌅' }
  return { text: 'Good night', textHi: 'शुभ रात्रि', emoji: '🌙' }
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboarded())
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = getOnboardingData()
    return saved?.city || 'Lucknow'
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadDashboard()
    loadWeather()
  }, [selectedCity])

  async function loadDashboard() {
    setLoading(true)
    try {
      const result = await api.getDashboard(selectedCity)
      setData(result)
    } catch (err) {
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadWeather() {
    try {
      const result = await api.getWeather(selectedCity)
      setWeather(result)
    } catch (err) {
      console.error('Weather error:', err)
    }
  }

  if (loading || !data) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const sentimentData = data.charts.sentimentTrend.labels.map((l: string, i: number) => ({
    month: l,
    score: data.charts.sentimentTrend.data[i],
  }))

  const forecastData = data.charts.demandForecast.labels.map((l: string, i: number) => ({
    month: l,
    demand: data.charts.demandForecast.data[i],
    upper: data.charts.demandForecast.upper[i],
    lower: data.charts.demandForecast.lower[i],
  }))

  const onboardingData = getOnboardingData()
  const greeting = getGreeting()

  const quickActions = [
    { path: '/sourcing', label: 'Source Products', icon: Package, gradient: 'from-teal-400 to-emerald-500' },
    { path: '/pricing', label: 'Check Pricing', icon: IndianRupee, gradient: 'from-saffron-400 to-orange-500' },
    { path: '/chat', label: 'Ask AI Advisor', icon: MessageCircle, gradient: 'from-violet-400 to-purple-500' },
    { path: '/content', label: 'Create Content', icon: Languages, gradient: 'from-cyan-400 to-teal-500' },
  ]

  const featureCards = [
    { path: '/sourcing', label: 'Smart Sourcing', labelHi: 'स्मार्ट सोर्सिंग', icon: Package, color: 'green', desc: 'Find wholesale prices' },
    { path: '/pricing', label: 'Smart Pricing', labelHi: 'स्मार्ट प्राइसिंग', icon: IndianRupee, color: 'saffron', desc: 'Get AI pricing strategies' },
    { path: '/chat', label: 'AI Advisor', labelHi: 'AI सलाहकार', icon: MessageCircle, color: 'royal', desc: 'Ask anything in Hindi' },
    { path: '/inventory', label: 'Inventory', labelHi: 'इन्वेंटरी', icon: ClipboardList, color: 'bazaar', desc: 'Track stock levels' },
    { path: '/competitors', label: 'Competitors', labelHi: 'प्रतिस्पर्धी', icon: Eye, color: 'saffron', desc: 'Monitor rival prices' },
    { path: '/compare', label: 'Compare', labelHi: 'तुलना करें', icon: GitCompare, color: 'royal', desc: 'Side-by-side analysis' },
    { path: '/content', label: 'Content', labelHi: 'कंटेंट', icon: Languages, color: 'bazaar', desc: 'Multilingual descriptions' },
    { path: '/sentiment', label: 'Sentiment', labelHi: 'सेंटिमेंट', icon: MessageSquareText, color: 'royal', desc: 'Analyze reviews' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {showOnboarding && (
        <OnboardingModal onComplete={(d) => {
          setShowOnboarding(false)
          if (d.city) setSelectedCity(d.city)
        }} />
      )}

      {/* ====== HEADER — TIME-BASED GREETING ====== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-100">
            {greeting.text}, {onboardingData?.ownerName || data.business.owner} <span>{greeting.emoji}</span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-saffron-500" />
            {onboardingData?.storeName || data.business.name} — {data.business.city}
            <span className="text-gray-600">|</span>
            <span className="text-gray-500">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </motion.div>

        {/* City selector pills */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {data.supportedCities.slice(0, 5).map((c: string) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCity === c
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-[#1a1a1d] border border-[#2a2a2d] text-gray-400 hover:border-orange-500/30'
              }`}
            >
              {c}
            </button>
          ))}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-2 py-1.5 rounded-full text-xs border border-[#2a2a2d] text-gray-400 bg-[#1a1a1d]"
          >
            {data.supportedCities.map((c: string) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* ====== QUICK ACTIONS BAR ====== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {quickActions.map((action, i) => (
          <Link key={action.path} to={action.path}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${action.gradient} rounded-xl p-4 text-white cursor-pointer shadow-lg hover:shadow-xl transition-shadow`}
            >
              <action.icon className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-semibold">{action.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* ====== AI INSIGHT BANNER ====== */}
      <ScrollReveal>
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="bg-gradient-to-r from-[#1E1B4B] via-[#312e81] to-[#1E1B4B] rounded-2xl p-5 text-white mb-6 flex items-center gap-4 overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-[80px]" />
          </div>
          <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
            <Sparkles className="w-6 h-6 text-saffron-300" />
          </div>
          <div className="relative z-10 flex-1">
            <p className="font-medium text-xs text-white/60 uppercase tracking-wider mb-0.5">AI Insight</p>
            <p className="font-semibold text-sm lg:text-base">{data.quickInsight}</p>
          </div>
          <Link to="/chat" className="relative z-10 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-saffron-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg shadow-saffron-500/30"
            >
              <Zap className="w-3.5 h-3.5" /> Ask AI
            </motion.div>
          </Link>
        </motion.div>
      </ScrollReveal>

      {/* ====== STATS CARDS ====== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Trending Products', value: data.summary.trendingProductsCount, icon: TrendingUp, color: 'text-saffron-500', bg: 'bg-saffron-500/10', border: 'border-[#2a2a2d]' },
          { label: 'Pricing Confidence', value: data.summary.avgPricingConfidence, suffix: '%', icon: IndianRupee, color: 'text-bazaar-500', bg: 'bg-bazaar-500/10', border: 'border-[#2a2a2d]' },
          { label: 'Sentiment Score', value: data.summary.overallSentimentScore, suffix: '/100', icon: Activity, color: 'text-royal-500', bg: 'bg-royal-500/10', border: 'border-[#2a2a2d]' },
          { label: 'Monthly Growth', valueText: data.summary.monthlySalesGrowth, icon: BarChart3, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-[#2a2a2d]' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            className={`bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border ${stat.border} hover:shadow-md hover:shadow-black/20 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-display font-bold mt-1 text-gray-100">
                  {stat.valueText || (
                    <>
                      <CountUp end={typeof stat.value === 'number' ? stat.value : parseInt(stat.value)} duration={1.5} />
                      {stat.suffix || ''}
                    </>
                  )}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ====== CHARTS ROW ====== */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ScrollReveal delay={0.1}>
          <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d] hover:shadow-md hover:shadow-black/20 transition-all">
            <h3 className="font-display font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-saffron-500" />
              Sentiment Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sentimentData}>
                <defs>
                  <linearGradient id="sentGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF9933" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #2a2a2d', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: '#1a1a1d', color: '#e5e7eb' }} />
                <Line type="monotone" dataKey="score" stroke="url(#sentGrad)" strokeWidth={3} dot={{ fill: '#FF9933', r: 4, strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d] hover:shadow-md hover:shadow-black/20 transition-all">
            <h3 className="font-display font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-bazaar-500" />
              Demand Forecast
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#138d75" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#138d75" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #2a2a2d', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: '#1a1a1d', color: '#e5e7eb' }} />
                <Area type="monotone" dataKey="upper" fill="#138d7510" stroke="none" />
                <Area type="monotone" dataKey="demand" fill="url(#demandGrad)" stroke="#138d75" strokeWidth={3} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      </div>

      {/* ====== CATEGORY + FESTIVALS ====== */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ScrollReveal delay={0.1}>
          <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d]">
            <h3 className="font-display font-semibold text-gray-100 mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.charts.categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  label={({ name, value }) => `${name} ${value}%`}
                  strokeWidth={2}
                  stroke="#1a1a1d"
                >
                  {data.charts.categoryDistribution.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #2a2a2d', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: '#1a1a1d', color: '#e5e7eb' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d]">
            <h3 className="font-display font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-saffron-500" />
              Upcoming Festivals — {selectedCity}
            </h3>
            <div className="space-y-3">
              {data.regionalInfo.festivals.length > 0 ? data.regionalInfo.festivals.map((f: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl hover:bg-white/[0.06] transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-200 text-sm">{f.name}</p>
                    <p className="text-xs text-gray-500">{f.daysAway} days away</p>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-semibold ${
                    f.impact === 'very_high' ? 'bg-red-500/10 text-red-400' :
                    f.impact === 'high' ? 'bg-saffron-500/10 text-saffron-400' :
                    'bg-white/[0.06] text-gray-400'
                  }`}>
                    {f.impact.replace('_', ' ')} impact
                  </span>
                </motion.div>
              )) : (
                <p className="text-gray-400 text-sm py-4 text-center">No major festivals upcoming</p>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ====== WEATHER + ALERTS ====== */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Weather Widget */}
        <ScrollReveal delay={0.1}>
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h3 className="font-semibold text-sm text-white/80 mb-3 flex items-center gap-2">
              <CloudSun className="w-4 h-4" />
              Weather — {selectedCity}
            </h3>
            {weather ? (
              <>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl font-display font-extrabold">{weather.temperature}°C</div>
                  <div>
                    <p className="font-medium text-white/90">{weather.condition}</p>
                    <p className="text-xs text-white/50">Feels like {weather.feelsLike}°C | {weather.humidity}% humidity</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {weather.forecast?.slice(0, 5).map((day: any) => (
                    <div key={day.day} className="flex-shrink-0 text-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[52px]">
                      <p className="text-[10px] text-white/60">{day.day}</p>
                      <p className="text-sm font-bold">{day.tempHigh}°</p>
                      <p className="text-[10px] text-white/40">{day.tempLow}°</p>
                    </div>
                  ))}
                </div>
                {weather.businessImpact && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1">Business Impact</p>
                    <p className="text-xs text-white/80">{weather.businessImpact.summary}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="skeleton h-32 bg-white/10 rounded-xl" />
            )}
          </div>
        </ScrollReveal>

        {/* Smart Alerts */}
        <ScrollReveal delay={0.15} className="lg:col-span-2">
          <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d]">
            <h3 className="font-display font-semibold text-gray-100 mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-saffron-500" />
              Smart Alerts
            </h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {data.alerts?.map((alert: any, i: number) => {
                const AlertIcon = ALERT_ICONS[alert.icon] || Sparkles
                return (
                  <Link key={alert.id} to={alert.actionRoute}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ x: 4 }}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${
                        alert.severity === 'high' ? 'bg-red-500/10 border-red-500/20' :
                        alert.severity === 'medium' ? 'bg-saffron-500/10 border-saffron-500/20' :
                        'bg-white/[0.03] border-[#2a2a2d]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        alert.severity === 'high' ? 'bg-red-500/15 text-red-400' :
                        alert.severity === 'medium' ? 'bg-saffron-500/15 text-saffron-400' :
                        'bg-white/[0.06] text-gray-400'
                      }`}>
                        <AlertIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-200">{alert.title}</p>
                          <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-hindi">{alert.titleHi}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{alert.message}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ====== AI FEATURES GRID ====== */}
      <ScrollReveal>
        <h3 className="font-display text-xl font-bold text-gray-100 mb-4">AI Features</h3>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {featureCards.map((f, i) => (
          <Link key={f.path} to={f.path}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1a1a1d] rounded-2xl p-4 shadow-sm border border-[#2a2a2d] cursor-pointer hover:shadow-md hover:shadow-black/20 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                f.color === 'saffron' ? 'bg-saffron-500/10 text-saffron-400' :
                f.color === 'bazaar' ? 'bg-bazaar-500/10 text-bazaar-400' :
                f.color === 'green' ? 'bg-green-500/10 text-green-400' :
                'bg-royal-500/10 text-royal-400'
              }`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-gray-200 text-sm">{f.label}</h4>
              <p className="text-[10px] font-hindi text-gray-400">{f.labelHi}</p>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
              <div className="mt-3 flex items-center text-saffron-500 text-xs font-medium gap-1 group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* ====== RECENT ACTIVITY ====== */}
      <ScrollReveal delay={0.1}>
        <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d] mb-6">
          <h3 className="font-display font-semibold text-gray-100 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {data.recentActivity.map((a: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 bg-white/[0.03] rounded-xl hover:bg-white/[0.06] transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  a.type === 'pricing' ? 'bg-saffron-500/10 text-saffron-400' :
                  a.type === 'content' ? 'bg-bazaar-500/10 text-bazaar-400' :
                  a.type === 'sentiment' ? 'bg-royal-500/10 text-royal-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {a.type === 'pricing' ? <IndianRupee className="w-4 h-4" /> :
                   a.type === 'content' ? <Languages className="w-4 h-4" /> :
                   a.type === 'sentiment' ? <MessageSquareText className="w-4 h-4" /> :
                   <TrendingUp className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300">{a.description}</p>
                </div>
                <span className="text-xs text-gray-400">{a.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ====== FOOTER ====== */}
      <div className="text-center py-6 border-t border-[#2a2a2d]">
        <p className="text-xs text-gray-500 mb-1">
          Built with ❤️ for Indian SMBs | Team ParityAi — AI4Bharat Hackathon 2026
        </p>
        <p className="text-[10px] text-gray-600">
          Powered by AWS Bedrock · DynamoDB · Lambda · S3 · CloudFront · API Gateway
        </p>
      </div>
    </div>
  )
}
