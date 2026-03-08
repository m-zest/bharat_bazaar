import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import {
  TrendingUp, IndianRupee, Languages, MessageSquareText, Calendar, MapPin,
  ArrowRight, Sparkles, Package, BarChart3, Activity, CloudSun, Sun, Cloud,
  CloudRain, Thermometer, Bell, MessageCircle, Eye, GitCompare, ClipboardList,
  Zap, Receipt, Truck, ShieldCheck, ScanLine, FileText, Camera, Database,
  PlayCircle, CheckCircle2, ChevronRight, Store, ShoppingBag, Brain,
  Briefcase, LayoutGrid,
} from 'lucide-react'
import { api } from '../utils/api'
import { useSales } from '../utils/SalesContext'
import { useTheme } from '../utils/ThemeContext'
import OnboardingModal, { isOnboarded, getOnboardingData } from '../components/OnboardingModal'
import { CountUp } from '../components/AnimatedComponents'
import { DashboardSection, ModuleCard, QuickActionCard, InsightsPanel, ActivityFeed } from '../components/dashboard'

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
  const { todaySales, todayRevenue, todayItemsSold, topSellingItems, weeklyRevenue } = useSales()
  const [data, setData] = useState<any>(null)
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboarded())
  const [dashRole, setDashRole] = useState<'retailer' | 'supplier' | 'customer'>('retailer')
  const { theme } = useTheme()
  const dk = theme === 'dark'
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
    { path: '/inventory', label: 'Inventory', labelHi: 'इन्वेंटरी', icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'Real-time stock tracker' },
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

      {/* ═══ ROLE SWITCHER — For Judges ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between rounded-xl p-3 mb-4 border ${dk ? 'bg-gradient-to-r from-[#1E1B4B] to-[#1a1a1d] border-[#2a2a2d]' : 'bg-gradient-to-r from-indigo-50 to-white border-gray-200'}`}
      >
        <div className="flex items-center gap-2">
          <Store className={`w-4 h-4 ${dk ? 'text-orange-400' : 'text-orange-500'}`} />
          <span className={`text-xs font-semibold ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Switch Dashboard View</span>
          <span className={`text-[9px] px-2 py-0.5 rounded-full ${dk ? 'bg-white/[0.06] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>Prototype Demo</span>
        </div>
        <div className="flex items-center gap-1.5">
          {([
            { key: 'retailer' as const, label: '🏪 Retailer', desc: 'Kirana Store' },
            { key: 'supplier' as const, label: '🚚 Supplier', desc: 'Wholesale' },
            { key: 'customer' as const, label: '🛒 Customer', desc: 'End User' },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setDashRole(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                dashRole === tab.key
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : dk ? 'bg-white/[0.06] text-gray-400 hover:bg-white/[0.1] hover:text-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ═══ RETAILER DASHBOARD ═══ */}
      {dashRole === 'retailer' && <>

      {/* ═══ ROW 1: Header + City Selector ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className={`font-display text-xl lg:text-2xl font-bold ${dk ? 'text-gray-100' : 'text-gray-900'}`}>
            {greeting.text}, {onboardingData?.ownerName || data.business.owner} <span>{greeting.emoji}</span>
          </h1>
          <p className={`flex items-center gap-2 text-xs mt-0.5 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
            <MapPin className="w-3 h-3 text-saffron-500" />
            {onboardingData?.storeName || data.business.name} — {data.business.city}
            <span className={dk ? 'text-gray-600' : 'text-gray-300'}>|</span>
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
                  : dk ? 'bg-[#1a1a1d] border border-[#2a2a2d] text-gray-400 hover:border-orange-500/30' : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-500/30'
              }`}
            >
              {c}
            </button>
          ))}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={`px-2 py-1 rounded-full text-[11px] border ${dk ? 'border-[#2a2a2d] text-gray-400 bg-[#1a1a1d]' : 'border-gray-200 text-gray-500 bg-white'}`}
          >
            {data.supportedCities.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
        </motion.div>
      </div>

      {/* ═══ SECTION 1: QUICK ACTIONS — Top priority workflows ═══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className={`w-4 h-4 ${dk ? 'text-saffron-400' : 'text-saffron-500'}`} />
          <h3 className={`text-sm font-semibold ${dk ? 'text-gray-200' : 'text-gray-800'}`}>Quick Actions</h3>
          <span className={`text-[10px] ${dk ? 'text-gray-500' : 'text-gray-400'}`}>Start here</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
          <QuickActionCard path="/scanner" label="Scan Bill" description="OCR extract items from photo" icon={ScanLine} gradient="from-violet-500 to-purple-600" index={0} />
          <QuickActionCard path="/pricing" label="Check Pricing" description="AI-optimized profit margins" icon={IndianRupee} gradient="from-saffron-400 to-orange-500" index={1} />
          <QuickActionCard path="/sourcing" label="Source Products" description="Best wholesale deals nearby" icon={Package} gradient="from-teal-400 to-emerald-500" index={2} />
          <QuickActionCard path="/chat" label="Ask Munim-ji" description="AI business advisor in Hinglish" icon={MessageCircle} gradient="from-indigo-500 to-violet-600" index={3} />
          <QuickActionCard path="/content" label="Create Content" description="Marketing in 6 languages" icon={Languages} gradient="from-cyan-400 to-teal-500" index={4} />
        </div>
      </motion.div>

      {/* ═══ SECTION 2: AI Stats Row ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {[
          { label: 'Trending Products', value: data.summary.trendingProductsCount, icon: TrendingUp, color: 'text-saffron-500', bg: 'bg-saffron-500/10' },
          { label: 'Price Confidence', value: data.summary.avgPricingConfidence, suffix: '%', icon: IndianRupee, color: 'text-bazaar-500', bg: 'bg-bazaar-500/10' },
          { label: 'Sentiment Score', value: data.summary.overallSentimentScore, suffix: '/100', icon: Activity, color: 'text-royal-500', bg: 'bg-royal-500/10' },
          { label: "Today's Revenue", value: Math.round(todayRevenue), prefix: '₹', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-500/10', sub: `${todaySales.length} invoices` },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`rounded-xl p-3.5 border hover:shadow-md transition-all ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[10px] font-medium ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                <p className={`text-xl font-display font-bold mt-0.5 ${dk ? 'text-gray-100' : 'text-gray-900'}`}>
                  {stat.prefix || ''}<CountUp end={typeof stat.value === 'number' ? stat.value : parseInt(stat.value)} duration={1.2} />
                  {stat.suffix || ''}
                </p>
                {stat.sub && <p className="text-[9px] text-gray-600">{stat.sub}</p>}
              </div>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ SECTION 3: INSIGHTS — AI + Alerts + Festivals ═══ */}
      <InsightsPanel
        quickInsight={data.quickInsight}
        alerts={data.alerts}
        festivals={data.regionalInfo.festivals}
        selectedCity={selectedCity}
      />

      {/* ═══ SECTION 4: SALES OVERVIEW — Compact row ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {[
          { label: 'Items Sold Today', value: todayItemsSold.toString(), icon: Package, color: 'text-saffron-400', bg: 'bg-saffron-500/10', sub: 'units moved' },
          { label: 'Weekly Revenue', value: `₹${Math.round(weeklyRevenue).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-royal-400', bg: 'bg-royal-500/10', sub: 'last 7 days' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`rounded-xl p-3 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[10px] font-medium ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                <p className={`text-lg font-display font-bold mt-0.5 ${dk ? 'text-gray-100' : 'text-gray-900'}`}>{stat.value}</p>
                <p className="text-[9px] text-gray-600">{stat.sub}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
        {/* Top Selling Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`col-span-2 rounded-xl p-3 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}
        >
          <h4 className="text-[10px] text-gray-500 font-medium mb-1.5 flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-saffron-500" /> Top Selling (This Week)
          </h4>
          <div className="flex items-center gap-4">
            {topSellingItems.length > 0 ? topSellingItems.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-gray-600">{i + 1}.</span>
                <span className={`text-[10px] truncate ${dk ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
                <span className="text-[10px] font-semibold text-saffron-400">{item.qty}</span>
              </div>
            )) : (
              <p className="text-[10px] text-gray-600">Generate invoices to see sales data</p>
            )}
            <Link to="/invoices" className="ml-auto flex items-center gap-1 text-[9px] text-orange-400 font-medium hover:text-orange-300">
              Create Invoice <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ═══ SECTION 5: CHARTS + WEATHER — Analytics row ═══ */}
      <div className="grid lg:grid-cols-3 gap-3 mb-6">
        {/* Sentiment Trend */}
        <div className={`rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
            Sentiment Trend
          </h3>
          <ResponsiveContainer width="100%" height={130}>
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

        {/* Demand Forecast + Category Pie */}
        <div className={`rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-bazaar-500" />
            Demand Forecast
          </h3>
          <ResponsiveContainer width="100%" height={130}>
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

        {/* Weather Widget */}
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

      {/* ═══ SECTION 6: GROUPED FEATURE MODULES + ACTIVITY SIDEBAR ═══ */}
      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        {/* Left: Grouped modules — 3 cols */}
        <div className="lg:col-span-3 space-y-1">

          {/* AI Tools */}
          <DashboardSection
            title="AI Tools"
            titleHi="AI टूल्स"
            description="Your intelligent business assistants"
            icon={Brain}
            iconColor="text-royal-400"
            columns={3}
          >
            <ModuleCard path="/chat" label="Munim-ji AI" labelHi="AI सलाहकार" description="AI business advisor — ask anything in Hindi or English" icon={MessageCircle} color="text-royal-400" bg="bg-royal-500/10" index={0} badge="Popular" />
            <ModuleCard path="/content" label="Content Generator" labelHi="कंटेंट" description="Marketing content in 6 languages for all platforms" icon={Languages} color="text-bazaar-400" bg="bg-bazaar-500/10" index={1} />
            <ModuleCard path="/sentiment" label="Sentiment Analyzer" labelHi="सेंटिमेंट" description="Analyze customer reviews and market sentiment" icon={MessageSquareText} color="text-pink-400" bg="bg-pink-500/10" index={2} />
          </DashboardSection>

          {/* Pricing & Competition */}
          <DashboardSection
            title="Pricing & Competition"
            titleHi="मूल्य निर्धारण"
            description="Stay ahead with smart pricing intelligence"
            icon={IndianRupee}
            iconColor="text-saffron-400"
            columns={4}
          >
            <ModuleCard path="/pricing" label="Smart Pricing" labelHi="स्मार्ट प्राइसिंग" description="AI-optimized pricing with competitor data" icon={IndianRupee} color="text-saffron-400" bg="bg-saffron-500/10" index={0} badge="AI" />
            <ModuleCard path="/competitors" label="Competitors" labelHi="प्रतिस्पर्धी" description="Monitor rival prices in real-time" icon={Eye} color="text-amber-400" bg="bg-amber-500/10" index={1} />
            <ModuleCard path="/compare" label="Compare" labelHi="तुलना करें" description="Side-by-side product analysis" icon={GitCompare} color="text-cyan-400" bg="bg-cyan-500/10" index={2} />
            <ModuleCard path="/sourcing" label="Smart Sourcing" labelHi="स्मार्ट सोर्सिंग" description="Best wholesale deals from nearby suppliers" icon={Package} color="text-green-400" bg="bg-green-500/10" index={3} />
          </DashboardSection>

          {/* Store Management */}
          <DashboardSection
            title="Store Management"
            titleHi="स्टोर प्रबंधन"
            description="Run your daily operations smoothly"
            icon={Store}
            iconColor="text-blue-400"
            columns={4}
          >
            <ModuleCard path="/inventory" label="Inventory" labelHi="इन्वेंटरी" description="Real-time stock tracking" icon={ClipboardList} color="text-blue-400" bg="bg-blue-500/10" index={0} />
            <ModuleCard path="/orders" label="Orders" labelHi="ऑर्डर" description="Track and manage all orders" icon={Truck} color="text-indigo-400" bg="bg-indigo-500/10" index={1} />
            <ModuleCard path="/scanner" label="Bill Scanner" labelHi="बिल स्कैनर" description="OCR + AI to extract bill items" icon={ScanLine} color="text-teal-400" bg="bg-teal-500/10" index={2} badge="AI" />
            <ModuleCard path="/tracking" label="Delivery Tracking" labelHi="डिलीवरी ट्रैकिंग" description="Real-time shipment status" icon={Truck} color="text-violet-400" bg="bg-violet-500/10" index={3} />
          </DashboardSection>

          {/* Business & Finance */}
          <DashboardSection
            title="Business & Finance"
            titleHi="व्यापार और वित्त"
            description="Invoicing, credit tracking, and compliance"
            icon={Briefcase}
            iconColor="text-emerald-400"
            columns={3}
          >
            <ModuleCard path="/invoices" label="GST Invoice" labelHi="GST बिल" description="Generate PDF invoices with WhatsApp share" icon={Receipt} color="text-emerald-400" bg="bg-emerald-500/10" index={0} />
            <ModuleCard path="/khata" label="Khata Book" labelHi="खाता बुक" description="Digital credit and payment tracking" icon={FileText} color="text-orange-400" bg="bg-orange-500/10" index={1} />
          </DashboardSection>

        </div>

        {/* Right: Activity Feed — 1 col */}
        <div className="lg:col-span-1">
          <ActivityFeed todaySales={todaySales} recentActivity={data.recentActivity} />
        </div>
      </div>

      {/* Category Distribution — compact */}
      <div className="grid lg:grid-cols-2 gap-3 mb-6">
        <div className={`rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xs font-semibold mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={data.charts.categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} innerRadius={30} label={({ name, value }) => `${name} ${value}%`} strokeWidth={2} stroke={dk ? '#1a1a1d' : '#fff'}>
                {data.charts.categoryDistribution.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #2a2a2d', background: '#1a1a1d', color: '#e5e7eb', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Getting Started Guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1E1B4B] via-[#312e81] to-[#1E1B4B] rounded-xl p-4 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-500 rounded-full blur-[80px]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <PlayCircle className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-semibold text-white/90">Getting Started</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">For new users</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { step: '1', label: 'Scan a Bill', desc: 'AI extracts items', path: '/scanner', icon: Camera },
                { step: '2', label: 'Check Inventory', desc: 'Items auto-added', path: '/inventory', icon: ClipboardList },
                { step: '3', label: 'Create Invoice', desc: 'GST bill → sale', path: '/invoices', icon: Receipt },
                { step: '4', label: 'Ask Munim-ji', desc: 'Get AI advice', path: '/chat', icon: MessageCircle },
              ].map((step, i) => (
                <Link key={step.step} to={step.path}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer group"
                  >
                    <div className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center text-[9px] font-bold text-orange-400 flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-white/90">{step.label}</p>
                      <p className="text-[8px] text-white/40">{step.desc}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div className={`text-center py-4 ${dk ? 'border-t border-[#2a2a2d]' : 'border-t border-gray-200'}`}>
        <p className={`text-[10px] ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
          Built with ❤️ for 15M+ Indian Kirana Stores | Team ParityAI — AI4Bharat Hackathon 2026
        </p>
        <p className={`text-[9px] mt-0.5 ${dk ? 'text-gray-600' : 'text-gray-400'}`}>
          AWS Bedrock (Claude 3 Haiku + Nova Lite) · Amazon DynamoDB · App Runner · Google Gemini Fallback · Twilio WhatsApp · React 18 · TypeScript
        </p>
      </div>

      </>}

      {/* ═══ SUPPLIER DASHBOARD ═══ */}
      {dashRole === 'supplier' && (
        <div className="space-y-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className={`font-display text-xl lg:text-2xl font-bold ${dk ? 'text-gray-100' : 'text-gray-900'}`}>
              {greeting.text}, Priya <span>{greeting.emoji}</span>
            </h1>
            <p className={`flex items-center gap-2 text-xs mt-0.5 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
              <MapPin className="w-3 h-3 text-saffron-500" />
              Priya Enterprises — Mumbai, Maharashtra
              <span className={`ml-1 text-[9px] px-2 py-0.5 rounded-full font-medium ${dk ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>✓ Verified Supplier</span>
            </p>
          </motion.div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total Orders', value: '284', change: '+24 today', up: true, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Monthly Revenue', value: '₹8.4L', change: '+22% vs last month', up: true, icon: IndianRupee, color: 'text-green-400', bg: 'bg-green-500/10' },
              { label: 'Active Retailers', value: '67', change: '+5 this week', up: true, icon: Store, color: 'text-saffron-400', bg: 'bg-saffron-500/10' },
              { label: 'Products Listed', value: '342', change: '12 low stock', up: false, icon: ClipboardList, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            ].map((kpi, i) => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-xl p-3.5 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] font-medium ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{kpi.label}</p>
                    <p className={`text-xl font-display font-bold ${dk ? 'text-gray-100' : 'text-gray-900'} mt-0.5`}>
                      <CountUp end={typeof kpi.value === 'string' && kpi.value.includes('₹') ? 8.4 : parseInt(kpi.value)} duration={1.2} />{kpi.value.includes('L') ? 'L' : kpi.value.includes('₹') ? '' : ''}
                    </p>
                    <p className={`text-[9px] font-medium mt-0.5 ${kpi.up ? 'text-green-500' : 'text-amber-500'}`}>{kpi.change}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Orders + Top Retailers */}
          <div className="grid lg:grid-cols-3 gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`lg:col-span-2 rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Recent Orders
              </h3>
              <div className="space-y-0">
                {[
                  { store: 'Rajesh General Store', city: 'Lucknow', items: 12, total: '₹18,450', status: 'Delivered', sc: 'text-green-500 bg-green-500/10' },
                  { store: 'Sharma Kirana', city: 'Delhi', items: 8, total: '₹12,200', status: 'In Transit', sc: 'text-blue-500 bg-blue-500/10' },
                  { store: 'Gupta Traders', city: 'Pune', items: 22, total: '₹35,800', status: 'Processing', sc: 'text-amber-500 bg-amber-500/10' },
                  { store: 'Patel Corner Shop', city: 'Ahmedabad', items: 6, total: '₹7,600', status: 'Delivered', sc: 'text-green-500 bg-green-500/10' },
                  { store: 'Singh Provisions', city: 'Jaipur', items: 15, total: '₹24,100', status: 'In Transit', sc: 'text-blue-500 bg-blue-500/10' },
                  { store: 'Verma General Store', city: 'Bhopal', items: 9, total: '₹14,300', status: 'Delivered', sc: 'text-green-500 bg-green-500/10' },
                ].map(o => (
                  <div key={o.store} className={`flex items-center justify-between py-2.5 ${dk ? 'border-b border-white/5' : 'border-b border-gray-100'} last:border-0`}>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${dk ? 'text-gray-200' : 'text-gray-800'}`}>{o.store}</p>
                      <p className={`text-[10px] ${dk ? 'text-gray-600' : 'text-gray-400'}`}>{o.city} · {o.items} items</p>
                    </div>
                    <p className={`text-xs font-semibold mx-4 font-mono ${dk ? 'text-gray-300' : 'text-gray-700'}`}>{o.total}</p>
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-medium ${o.sc}`}>{o.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={`rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-saffron-500" /> Top Retailers
              </h3>
              {[
                { name: 'Rajesh General Store', orders: 48, revenue: '₹2.1L', city: 'Lucknow' },
                { name: 'Gupta Traders', orders: 42, revenue: '₹1.8L', city: 'Pune' },
                { name: 'Sharma Kirana', orders: 36, revenue: '₹1.5L', city: 'Delhi' },
                { name: 'Singh Provisions', orders: 31, revenue: '₹1.3L', city: 'Jaipur' },
                { name: 'Patel Corner Shop', orders: 25, revenue: '₹1.0L', city: 'Ahmedabad' },
                { name: 'Verma General Store', orders: 20, revenue: '₹0.8L', city: 'Bhopal' },
              ].map((r, i) => (
                <div key={r.name} className={`flex items-center gap-3 py-2 ${dk ? 'border-b border-white/5' : 'border-b border-gray-100'} last:border-0`}>
                  <span className={`text-[10px] font-bold w-5 ${dk ? 'text-gray-600' : 'text-gray-300'}`}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${dk ? 'text-gray-300' : 'text-gray-700'}`}>{r.name}</p>
                    <p className={`text-[10px] ${dk ? 'text-gray-600' : 'text-gray-400'}`}>{r.city} · {r.orders} orders</p>
                  </div>
                  <p className={`text-xs font-semibold font-mono ${dk ? 'text-gray-400' : 'text-gray-600'}`}>{r.revenue}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Product Performance + AI Forecast */}
          <div className="grid lg:grid-cols-2 gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Product Performance
              </h3>
              {[
                { name: 'Basmati Rice 5kg', stock: 1240, sold: 856, pct: 69 },
                { name: 'Toor Dal 1kg', stock: 890, sold: 678, pct: 76 },
                { name: 'Sunflower Oil 1L', stock: 560, sold: 420, pct: 75 },
                { name: 'Sugar 5kg', stock: 720, sold: 310, pct: 43 },
                { name: 'Surf Excel 1kg', stock: 450, sold: 380, pct: 84 },
              ].map(p => (
                <div key={p.name} className="mb-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className={`font-medium ${dk ? 'text-gray-300' : 'text-gray-700'}`}>{p.name}</span>
                    <span className={`font-mono ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{p.sold}/{p.stock} sold</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${dk ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={`rounded-xl p-4 border ${dk ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className={`w-4 h-4 ${dk ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-xs font-semibold ${dk ? 'text-blue-400' : 'text-blue-700'}`}>AI Demand Forecast</h3>
              </div>
              <div className="space-y-3">
                {[
                  { emoji: '📈', text: 'Basmati Rice demand expected +35% next week due to festival season — increase stock by 500 units' },
                  { emoji: '🚨', text: 'Sugar stock critically low — 15 retailers awaiting restock. Expected stockout in 2 days' },
                  { emoji: '⭐', text: '3 new retail stores in Pune have requested wholesale quotes — respond within 24hrs for best conversion' },
                  { emoji: '🌧️', text: 'Weather forecast: Heavy rains in Maharashtra next week — Dal & cooking oil demand will spike 40%' },
                  { emoji: '💡', text: 'Consider bundling Surf Excel + Vim at 5% discount — competitor analysis shows high demand for combo' },
                ].map((insight, i) => (
                  <div key={i} className={`flex items-start gap-2.5 text-xs ${dk ? 'text-blue-300/80' : 'text-blue-700'}`}>
                    <span className="mt-0.5 flex-shrink-0">{insight.emoji}</span>
                    <span className="leading-relaxed">{insight.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className={`text-center py-4 ${dk ? 'border-t border-[#2a2a2d]' : 'border-t border-gray-200'}`}>
            <p className={`text-[10px] ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
              Supplier Dashboard Prototype | Team ParityAI — AI4Bharat Hackathon 2026
            </p>
          </div>
        </div>
      )}

      {/* ═══ CUSTOMER DASHBOARD ═══ */}
      {dashRole === 'customer' && (
        <div className="space-y-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className={`font-display text-xl lg:text-2xl font-bold ${dk ? 'text-gray-100' : 'text-gray-900'}`}>
              {greeting.text}, Meera <span>{greeting.emoji}</span>
            </h1>
            <p className={`flex items-center gap-2 text-xs mt-0.5 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
              <MapPin className="w-3 h-3 text-saffron-500" />
              Bengaluru, Karnataka
              <span className={`ml-1 text-[9px] px-2 py-0.5 rounded-full font-medium ${dk ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-50 text-violet-600'}`}>₹2,340 saved this month</span>
            </p>
          </motion.div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Money Saved', value: '₹2,340', change: 'this month', up: true, icon: IndianRupee, color: 'text-green-400', bg: 'bg-green-500/10' },
              { label: 'Total Orders', value: '23', change: '3 in transit', up: true, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Stores Nearby', value: '14', change: '2 new this week', up: true, icon: MapPin, color: 'text-saffron-400', bg: 'bg-saffron-500/10' },
              { label: 'Active Deals', value: '8', change: '3 expiring soon', up: false, icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            ].map((kpi, i) => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-xl p-3.5 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] font-medium ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{kpi.label}</p>
                    <p className={`text-xl font-display font-bold ${dk ? 'text-gray-100' : 'text-gray-900'} mt-0.5`}>{kpi.value}</p>
                    <p className={`text-[9px] font-medium mt-0.5 ${kpi.up ? 'text-green-500' : 'text-amber-500'}`}>{kpi.change}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Price Comparison + Nearby Stores */}
          <div className="grid lg:grid-cols-3 gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`lg:col-span-2 rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Price Comparison — Best deals near you
              </h3>
              {[
                { item: 'Basmati Rice 5kg', stores: [{ name: 'Rajesh Store', price: '₹335', best: true }, { name: 'Gupta Traders', price: '₹355', best: false }, { name: 'Singh Mart', price: '₹360', best: false }] },
                { item: 'Toor Dal 1kg', stores: [{ name: 'Sharma Kirana', price: '₹142', best: true }, { name: 'Rajesh Store', price: '₹148', best: false }, { name: 'Patel Shop', price: '₹155', best: false }] },
                { item: 'Amul Butter 500g', stores: [{ name: 'Singh Mart', price: '₹195', best: true }, { name: 'Sharma Kirana', price: '₹198', best: false }, { name: 'Gupta Traders', price: '₹205', best: false }] },
                { item: 'Surf Excel 1kg', stores: [{ name: 'Patel Shop', price: '₹198', best: true }, { name: 'Rajesh Store', price: '₹210', best: false }, { name: 'Singh Mart', price: '₹215', best: false }] },
              ].map(comp => (
                <div key={comp.item} className={`py-3 ${dk ? 'border-b border-white/5' : 'border-b border-gray-100'} last:border-0`}>
                  <p className={`text-xs font-medium mb-2 ${dk ? 'text-gray-200' : 'text-gray-800'}`}>{comp.item}</p>
                  <div className="flex gap-2">
                    {comp.stores.map(s => (
                      <div key={s.name} className={`flex-1 rounded-xl px-3 py-2 border text-center ${
                        s.best
                          ? dk ? 'border-green-500/20 bg-green-500/5' : 'border-green-200 bg-green-50'
                          : dk ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50'
                      }`}>
                        <p className={`text-[10px] ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{s.name}</p>
                        <p className={`text-sm font-bold font-mono ${s.best ? 'text-green-500' : dk ? 'text-gray-300' : 'text-gray-600'}`}>{s.price}</p>
                        {s.best && <p className="text-[9px] text-green-500 font-semibold mt-0.5">BEST PRICE</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={`rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                <MapPin className="w-3.5 h-3.5 text-saffron-500" /> Nearby Stores
              </h3>
              {[
                { name: 'Rajesh General Store', dist: '0.3 km', rating: '4.8', deals: 3 },
                { name: 'Sharma Kirana', dist: '0.7 km', rating: '4.6', deals: 2 },
                { name: 'Singh Mart', dist: '1.1 km', rating: '4.5', deals: 5 },
                { name: 'Gupta Traders', dist: '1.4 km', rating: '4.7', deals: 1 },
                { name: 'Patel Corner Shop', dist: '1.8 km', rating: '4.3', deals: 4 },
                { name: 'Verma Store', dist: '2.2 km', rating: '4.4', deals: 2 },
              ].map(store => (
                <div key={store.name} className={`flex items-center gap-3 py-2 ${dk ? 'border-b border-white/5' : 'border-b border-gray-100'} last:border-0`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dk ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <Store className={`w-3.5 h-3.5 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${dk ? 'text-gray-300' : 'text-gray-700'}`}>{store.name}</p>
                    <p className={`text-[10px] ${dk ? 'text-gray-600' : 'text-gray-400'}`}>{store.dist} · ⭐ {store.rating}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-orange-500/10 text-orange-400 font-medium">{store.deals} deals</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Recent Orders + Smart Suggestions */}
          <div className="grid lg:grid-cols-2 gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Recent Orders
              </h3>
              {[
                { store: 'Rajesh Store', date: '6 Mar', items: 5, total: '₹1,240', status: 'Delivered' },
                { store: 'Sharma Kirana', date: '4 Mar', items: 3, total: '₹680', status: 'Delivered' },
                { store: 'Singh Mart', date: '3 Mar', items: 8, total: '₹2,150', status: 'Delivered' },
                { store: 'Gupta Traders', date: '1 Mar', items: 4, total: '₹920', status: 'Delivered' },
                { store: 'Patel Shop', date: '28 Feb', items: 6, total: '₹1,580', status: 'Delivered' },
              ].map(o => (
                <div key={o.store + o.date} className={`flex items-center justify-between py-2 ${dk ? 'border-b border-white/5' : 'border-b border-gray-100'} last:border-0`}>
                  <div>
                    <p className={`text-xs font-medium ${dk ? 'text-gray-300' : 'text-gray-700'}`}>{o.store}</p>
                    <p className={`text-[10px] ${dk ? 'text-gray-600' : 'text-gray-400'}`}>{o.date} · {o.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold font-mono ${dk ? 'text-gray-200' : 'text-gray-800'}`}>{o.total}</p>
                    <p className="text-[10px] text-green-500 font-medium">{o.status}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={`rounded-xl p-4 border ${dk ? 'bg-violet-500/5 border-violet-500/10' : 'bg-violet-50 border-violet-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className={`w-4 h-4 ${dk ? 'text-violet-400' : 'text-violet-600'}`} />
                <h3 className={`text-xs font-semibold ${dk ? 'text-violet-400' : 'text-violet-700'}`}>Smart Suggestions</h3>
              </div>
              <div className="space-y-3">
                {[
                  { emoji: '💰', text: 'Save ₹25 on Toor Dal — Sharma Kirana has the best price today (₹142 vs avg ₹155)' },
                  { emoji: '🛒', text: 'Your usual Rice order is due — you buy Basmati 5kg every 12 days. Rajesh Store has stock at ₹335' },
                  { emoji: '🎉', text: 'Holi deals starting: 5 stores near you are offering 10-15% off on festive essentials' },
                  { emoji: '📦', text: 'Singh Mart just added 12 new products including organic options you might like' },
                  { emoji: '⏰', text: 'Price alert: Amul Butter dropped ₹8 at Singh Mart — lowest in 30 days' },
                ].map((s, i) => (
                  <div key={i} className={`flex items-start gap-2.5 text-xs ${dk ? 'text-violet-300/80' : 'text-violet-700'}`}>
                    <span className="mt-0.5 flex-shrink-0">{s.emoji}</span>
                    <span className="leading-relaxed">{s.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className={`text-center py-4 ${dk ? 'border-t border-[#2a2a2d]' : 'border-t border-gray-200'}`}>
            <p className={`text-[10px] ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
              Customer Dashboard Prototype | Team ParityAI — AI4Bharat Hackathon 2026
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
