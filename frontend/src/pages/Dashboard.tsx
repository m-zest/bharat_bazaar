import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import {
  TrendingUp, IndianRupee, Languages, MessageSquareText, Calendar, MapPin,
  ArrowRight, Sparkles, Package, BarChart3, Activity, CloudSun, Sun, Cloud,
  CloudRain, Thermometer, Bell, MessageCircle, Eye, GitCompare, ClipboardList,
  Zap, Receipt, Truck, ShieldCheck, ScanLine, FileText,
} from 'lucide-react'
import { api } from '../utils/api'
import OnboardingModal, { isOnboarded, getOnboardingData } from '../components/OnboardingModal'
import { CountUp } from '../components/AnimatedComponents'

const COLORS = ['#FF9933', '#138d75', '#7c3aed', '#C0392B', '#3b82f6']

const WEATHER_ICONS: Record<string, any> = {
  'sun': Sun, 'cloud-sun': CloudSun, 'cloud': Cloud, 'cloud-rain': CloudRain,
  'cloud-fog': Cloud, 'cloud-lightning': CloudRain, 'thermometer-sun': Thermometer, 'droplets': CloudRain,
}

const ALERT_ICONS: Record<string, any> = {
  'cloud-rain': CloudRain, 'trending-down': TrendingUp, 'trending-up': TrendingUp,
  'package': Package, 'sparkles': Sparkles,
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
      <div className="p-4 lg:p-6 space-y-4">
        <div className="skeleton h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-52 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const sentimentData = data.charts.sentimentTrend.labels.map((l: string, i: number) => ({
    month: l, score: data.charts.sentimentTrend.data[i],
  }))

  const forecastData = data.charts.demandForecast.labels.map((l: string, i: number) => ({
    month: l, demand: data.charts.demandForecast.data[i],
    upper: data.charts.demandForecast.upper[i], lower: data.charts.demandForecast.lower[i],
  }))

  const onboardingData = getOnboardingData()
  const greeting = getGreeting()

  const allFeatures = [
    { path: '/sourcing', label: 'Smart Sourcing', labelHi: 'स्मार्ट सोर्सिंग', icon: Package, color: 'text-green-400', bg: 'bg-green-500/10', desc: 'Wholesale prices' },
    { path: '/pricing', label: 'Smart Pricing', labelHi: 'स्मार्ट प्राइसिंग', icon: IndianRupee, color: 'text-saffron-400', bg: 'bg-saffron-500/10', desc: 'AI price optimizer' },
    { path: '/chat', label: 'Munim-ji AI', labelHi: 'AI सलाहकार', icon: MessageCircle, color: 'text-royal-400', bg: 'bg-royal-500/10', desc: 'Business advisor' },
    { path: '/content', label: 'Content Gen', labelHi: 'कंटेंट', icon: Languages, color: 'text-bazaar-400', bg: 'bg-bazaar-500/10', desc: '6 languages + platforms' },
    { path: '/inventory', label: 'Inventory', labelHi: 'इन्वेंटरी', icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'DynamoDB stock tracker' },
    { path: '/competitors', label: 'Competitors', labelHi: 'प्रतिस्पर्धी', icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Monitor rival prices' },
    { path: '/compare', label: 'Compare', labelHi: 'तुलना करें', icon: GitCompare, color: 'text-cyan-400', bg: 'bg-cyan-500/10', desc: 'Side-by-side analysis' },
    { path: '/sentiment', label: 'Sentiment', labelHi: 'सेंटिमेंट', icon: MessageSquareText, color: 'text-pink-400', bg: 'bg-pink-500/10', desc: 'Review analyzer' },
    { path: '/scanner', label: 'Bill Scanner', labelHi: 'बिल स्कैनर', icon: ScanLine, color: 'text-teal-400', bg: 'bg-teal-500/10', desc: 'OCR + AI extraction' },
    { path: '/orders', label: 'Orders', labelHi: 'ऑर्डर', icon: Truck, color: 'text-indigo-400', bg: 'bg-indigo-500/10', desc: 'Order management' },
    { path: '/invoices', label: 'GST Invoice', labelHi: 'GST बिल', icon: Receipt, color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'PDF + WhatsApp share' },
    { path: '/khata', label: 'Khata Book', labelHi: 'खाता बुक', icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10', desc: 'Credit tracking' },
  ]

  return (
    <div className="p-4 lg:p-6 max-w-[1400px]">
      {showOnboarding && (
        <OnboardingModal onComplete={(d) => {
          setShowOnboarding(false)
          if (d.city) setSelectedCity(d.city)
        }} />
      )}

      {/* ═══ ROW 1: Header + City Selector ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-display text-xl lg:text-2xl font-bold text-gray-100">
            {greeting.text}, {onboardingData?.ownerName || data.business.owner} <span>{greeting.emoji}</span>
          </h1>
          <p className="text-gray-500 flex items-center gap-2 text-xs mt-0.5">
            <MapPin className="w-3 h-3 text-saffron-500" />
            {onboardingData?.storeName || data.business.name} — {data.business.city}
            <span className="text-gray-600">|</span>
            <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 flex-wrap">
          {data.supportedCities.slice(0, 5).map((c: string) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
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
            className="px-2 py-1 rounded-full text-[11px] border border-[#2a2a2d] text-gray-400 bg-[#1a1a1d]"
          >
            {data.supportedCities.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
        </motion.div>
      </div>

      {/* ═══ ROW 2: AI Insight + Quick Stats (single dense row) ═══ */}
      <div className="grid lg:grid-cols-5 gap-3 mb-4">
        {/* AI Insight — 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-[#1E1B4B] via-[#312e81] to-[#1E1B4B] rounded-xl p-4 text-white flex items-center gap-3 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-saffron-500 rounded-full blur-[80px]" />
          </div>
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 relative z-10">
            <Sparkles className="w-5 h-5 text-saffron-300" />
          </div>
          <div className="relative z-10 flex-1 min-w-0">
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">AI Insight</p>
            <p className="text-xs font-medium leading-relaxed mt-0.5 line-clamp-2">{data.quickInsight}</p>
          </div>
          <Link to="/chat" className="relative z-10 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-saffron-500 text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg shadow-saffron-500/30">
              <Zap className="w-3 h-3" /> Ask AI
            </motion.div>
          </Link>
        </motion.div>

        {/* 4 Stat Cards — 1 col each, compact */}
        {[
          { label: 'Trending', value: data.summary.trendingProductsCount, icon: TrendingUp, color: 'text-saffron-500', bg: 'bg-saffron-500/10' },
          { label: 'Price Confidence', value: data.summary.avgPricingConfidence, suffix: '%', icon: IndianRupee, color: 'text-bazaar-500', bg: 'bg-bazaar-500/10' },
          { label: 'Sentiment', value: data.summary.overallSentimentScore, suffix: '/100', icon: Activity, color: 'text-royal-500', bg: 'bg-royal-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1a1a1d] rounded-xl p-3.5 border border-[#2a2a2d] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-medium">{stat.label}</p>
                <p className="text-xl font-display font-bold text-gray-100 mt-0.5">
                  <CountUp end={typeof stat.value === 'number' ? stat.value : parseInt(stat.value)} duration={1.2} />
                  {stat.suffix || ''}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ ROW 3: Charts + Weather + Alerts (3-col dense grid) ═══ */}
      <div className="grid lg:grid-cols-3 gap-3 mb-4">
        {/* Sentiment Trend */}
        <div className="bg-[#1a1a1d] rounded-xl p-4 border border-[#2a2a2d]">
          <h3 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
            Sentiment Trend
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={sentimentData}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF9933" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #2a2a2d', background: '#1a1a1d', color: '#e5e7eb', fontSize: '11px' }} />
              <Line type="monotone" dataKey="score" stroke="url(#sentGrad)" strokeWidth={2.5} dot={{ fill: '#FF9933', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Demand Forecast */}
        <div className="bg-[#1a1a1d] rounded-xl p-4 border border-[#2a2a2d]">
          <h3 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-bazaar-500" />
            Demand Forecast
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#138d75" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#138d75" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #2a2a2d', background: '#1a1a1d', color: '#e5e7eb', fontSize: '11px' }} />
              <Area type="monotone" dataKey="upper" fill="#138d7510" stroke="none" />
              <Area type="monotone" dataKey="demand" fill="url(#demandGrad)" stroke="#138d75" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weather Widget — compact */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <h3 className="text-[10px] font-semibold text-white/70 flex items-center gap-1 mb-2">
            <CloudSun className="w-3 h-3" /> Weather — {selectedCity}
          </h3>
          {weather ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl font-display font-extrabold">{weather.temperature}°C</div>
                <div>
                  <p className="text-xs font-medium text-white/90">{weather.condition}</p>
                  <p className="text-[10px] text-white/50">{weather.humidity}% humidity</p>
                </div>
              </div>
              <div className="flex gap-1.5 mb-2 overflow-x-auto">
                {weather.forecast?.slice(0, 5).map((day: any) => (
                  <div key={day.day} className="flex-shrink-0 text-center bg-white/10 rounded-md px-2 py-1.5 min-w-[40px]">
                    <p className="text-[8px] text-white/50">{day.day}</p>
                    <p className="text-xs font-bold">{day.tempHigh}°</p>
                  </div>
                ))}
              </div>
              {weather.businessImpact && (
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-[9px] font-semibold text-white/50 uppercase tracking-wider mb-0.5">Business Impact</p>
                  <p className="text-[10px] text-white/80 line-clamp-2">{weather.businessImpact.summary}</p>
                </div>
              )}
            </>
          ) : (
            <div className="skeleton h-24 bg-white/10 rounded-lg" />
          )}
        </div>
      </div>

      {/* ═══ ROW 4: Category Pie + Festivals + Alerts (3-col) ═══ */}
      <div className="grid lg:grid-cols-3 gap-3 mb-4">
        {/* Category Distribution */}
        <div className="bg-[#1a1a1d] rounded-xl p-4 border border-[#2a2a2d]">
          <h3 className="text-xs font-semibold text-gray-300 mb-2">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={data.charts.categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={32}
                label={({ name, value }) => `${name} ${value}%`}
                strokeWidth={2}
                stroke="#1a1a1d"
              >
                {data.charts.categoryDistribution.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #2a2a2d', background: '#1a1a1d', color: '#e5e7eb', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Festivals */}
        <div className="bg-[#1a1a1d] rounded-xl p-4 border border-[#2a2a2d]">
          <h3 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-saffron-500" />
            Upcoming Festivals — {selectedCity}
          </h3>
          <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
            {data.regionalInfo.festivals.length > 0 ? data.regionalInfo.festivals.map((f: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-2 bg-white/[0.03] rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <div>
                  <p className="text-xs font-medium text-gray-200">{f.name}</p>
                  <p className="text-[10px] text-gray-500">{f.daysAway} days away</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                  f.impact === 'very_high' ? 'bg-red-500/10 text-red-400' :
                  f.impact === 'high' ? 'bg-saffron-500/10 text-saffron-400' :
                  'bg-white/[0.06] text-gray-400'
                }`}>
                  {f.impact.replace('_', ' ')}
                </span>
              </motion.div>
            )) : (
              <p className="text-gray-400 text-xs py-4 text-center">No major festivals upcoming</p>
            )}
          </div>
        </div>

        {/* Smart Alerts — compact */}
        <div className="bg-[#1a1a1d] rounded-xl p-4 border border-[#2a2a2d]">
          <h3 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-saffron-500" />
            Smart Alerts
          </h3>
          <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
            {data.alerts?.slice(0, 5).map((alert: any, i: number) => {
              const AlertIcon = ALERT_ICONS[alert.icon] || Sparkles
              return (
                <Link key={alert.id} to={alert.actionRoute}>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-start gap-2 p-2 rounded-lg border transition-all hover:shadow-sm ${
                      alert.severity === 'high' ? 'bg-red-500/5 border-red-500/15' :
                      alert.severity === 'medium' ? 'bg-saffron-500/5 border-saffron-500/15' :
                      'bg-white/[0.02] border-[#2a2a2d]'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'high' ? 'bg-red-500/15 text-red-400' :
                      alert.severity === 'medium' ? 'bg-saffron-500/15 text-saffron-400' :
                      'bg-white/[0.06] text-gray-400'
                    }`}>
                      <AlertIcon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-gray-200 truncate">{alert.title}</p>
                      <p className="text-[10px] text-gray-500 truncate">{alert.message}</p>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══ ROW 5: All 12 AI Features — Compact Grid ═══ */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-300 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
          All AI Features — 12 Modules
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {allFeatures.map((f, i) => (
            <Link key={f.path} to={f.path}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#1a1a1d] rounded-xl p-3 border border-[#2a2a2d] cursor-pointer hover:shadow-md hover:border-orange-500/20 transition-all group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${f.bg}`}>
                  <f.icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <h4 className="text-[11px] font-semibold text-gray-200 leading-tight">{f.label}</h4>
                <p className="text-[9px] font-hindi text-gray-500">{f.labelHi}</p>
                <p className="text-[9px] text-gray-500 mt-0.5">{f.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ ROW 6: Quick Actions + Recent Activity (side by side) ═══ */}
      <div className="grid lg:grid-cols-2 gap-3 mb-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { path: '/sourcing', label: 'Source Products', icon: Package, gradient: 'from-teal-400 to-emerald-500' },
            { path: '/pricing', label: 'Check Pricing', icon: IndianRupee, gradient: 'from-saffron-400 to-orange-500' },
            { path: '/chat', label: 'Ask AI Advisor', icon: MessageCircle, gradient: 'from-violet-400 to-purple-500' },
            { path: '/content', label: 'Create Content', icon: Languages, gradient: 'from-cyan-400 to-teal-500' },
          ].map((action, i) => (
            <Link key={action.path} to={action.path}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`bg-gradient-to-br ${action.gradient} rounded-xl p-3.5 text-white cursor-pointer shadow-lg hover:shadow-xl transition-shadow`}
              >
                <action.icon className="w-4 h-4 mb-1.5 text-white/80" />
                <p className="text-xs font-semibold">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1a1d] rounded-xl p-4 border border-[#2a2a2d]">
          <h3 className="text-xs font-semibold text-gray-300 mb-2">Recent Activity</h3>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
            {data.recentActivity.map((a: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-2 bg-white/[0.03] rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                  a.type === 'pricing' ? 'bg-saffron-500/10 text-saffron-400' :
                  a.type === 'content' ? 'bg-bazaar-500/10 text-bazaar-400' :
                  a.type === 'sentiment' ? 'bg-royal-500/10 text-royal-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {a.type === 'pricing' ? <IndianRupee className="w-3 h-3" /> :
                   a.type === 'content' ? <Languages className="w-3 h-3" /> :
                   a.type === 'sentiment' ? <MessageSquareText className="w-3 h-3" /> :
                   <TrendingUp className="w-3 h-3" />}
                </div>
                <p className="text-[11px] text-gray-300 flex-1 truncate">{a.description}</p>
                <span className="text-[10px] text-gray-500 flex-shrink-0">{a.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div className="text-center py-4 border-t border-[#2a2a2d]">
        <p className="text-[10px] text-gray-500">
          Built with love for Indian SMBs | Team ParityAi — AI4Bharat Hackathon 2026
        </p>
        <p className="text-[9px] text-gray-600 mt-0.5">
          AWS Bedrock · DynamoDB · App Runner · ECR · React · TypeScript
        </p>
      </div>
    </div>
  )
}
