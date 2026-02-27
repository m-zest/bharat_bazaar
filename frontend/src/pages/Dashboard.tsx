import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { TrendingUp, IndianRupee, Languages, MessageSquareText, Calendar, MapPin, ArrowRight, Sparkles, Package, BarChart3, Activity, CloudSun, Sun, Cloud, CloudRain, Thermometer, Bell, MessageCircle, AlertTriangle, ShieldCheck, Eye, GitCompare } from 'lucide-react'
import { api } from '../utils/api'
import OnboardingModal, { isOnboarded, getOnboardingData } from '../components/OnboardingModal'

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

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboarded())
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = getOnboardingData()
    return saved?.city || 'Lucknow'
  })

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
      <div className="p-8 space-y-6">
        <div className="skeleton h-20 w-full" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-28" />)}
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="skeleton h-64" />)}
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

  const featureCards = [
    { path: '/sourcing', label: 'Smart Sourcing', labelHi: 'स्मार्ट सोर्सिंग', icon: Package, color: 'green', desc: 'Find wholesale prices' },
    { path: '/pricing', label: 'Smart Pricing', labelHi: 'स्मार्ट प्राइसिंग', icon: IndianRupee, color: 'saffron', desc: 'Get AI pricing strategies' },
    { path: '/chat', label: 'AI Advisor', labelHi: 'AI सलाहकार', icon: MessageCircle, color: 'royal', desc: 'Ask anything in Hindi' },
    { path: '/inventory', label: 'Inventory', labelHi: 'इन्वेंटरी', icon: Package, color: 'bazaar', desc: 'Track stock levels' },
    { path: '/competitors', label: 'Competitors', labelHi: 'प्रतिस्पर्धी', icon: Eye, color: 'saffron', desc: 'Monitor rival prices' },
    { path: '/compare', label: 'Compare', labelHi: 'तुलना करें', icon: GitCompare, color: 'royal', desc: 'Side-by-side analysis' },
    { path: '/content', label: 'Content', labelHi: 'कंटेंट', icon: Languages, color: 'bazaar', desc: 'Multilingual descriptions' },
    { path: '/sentiment', label: 'Sentiment', labelHi: 'सेंटिमेंट', icon: MessageSquareText, color: 'royal', desc: 'Analyze reviews' },
  ]

  return (
    <div className="p-8 max-w-[1400px]">
      {showOnboarding && (
        <OnboardingModal onComplete={(d) => {
          setShowOnboarding(false)
          if (d.city) setSelectedCity(d.city)
        }} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Namaste, {onboardingData?.ownerName || data.business.owner} <span className="text-2xl">🙏</span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {onboardingData?.storeName || data.business.name} — {data.business.city}
          </p>
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="input-field w-auto"
        >
          {data.supportedCities.map((c: string) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Quick Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-saffron-500 to-bazaar-500 rounded-2xl p-5 text-white mb-8 flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <p className="font-medium text-sm text-white/80">AI Insight</p>
          <p className="font-semibold">{data.quickInsight}</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Trending Products', value: data.summary.trendingProductsCount, icon: TrendingUp, color: 'text-saffron-500', bg: 'bg-saffron-50' },
          { label: 'Pricing Confidence', value: `${data.summary.avgPricingConfidence}%`, icon: IndianRupee, color: 'text-bazaar-500', bg: 'bg-bazaar-50' },
          { label: 'Sentiment Score', value: `${data.summary.overallSentimentScore}/100`, icon: Activity, color: 'text-royal-500', bg: 'bg-royal-50' },
          { label: 'Monthly Growth', value: data.summary.monthlySalesGrowth, icon: BarChart3, color: 'text-green-500', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sentiment Trend */}
        <div className="card">
          <h3 className="font-display font-semibold text-gray-900 mb-4">Sentiment Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sentimentData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#FF9933" strokeWidth={3} dot={{ fill: '#FF9933', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Demand Forecast */}
        <div className="card">
          <h3 className="font-display font-semibold text-gray-900 mb-4">Demand Forecast</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip />
              <Area type="monotone" dataKey="upper" fill="#138d7520" stroke="none" />
              <Area type="monotone" dataKey="lower" fill="#ffffff" stroke="none" />
              <Line type="monotone" dataKey="demand" stroke="#138d75" strokeWidth={3} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution + Upcoming Festivals */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-display font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.charts.categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name} ${value}%`}
              >
                {data.charts.categoryDistribution.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-saffron-500" />
            Upcoming Festivals — {selectedCity}
          </h3>
          <div className="space-y-3">
            {data.regionalInfo.festivals.length > 0 ? data.regionalInfo.festivals.map((f: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{f.name}</p>
                  <p className="text-xs text-gray-500">{f.daysAway} days away</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  f.impact === 'very_high' ? 'bg-clay-100 text-clay-500' :
                  f.impact === 'high' ? 'bg-saffron-100 text-saffron-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {f.impact.replace('_', ' ')} impact
                </span>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">No major festivals in the next few months</p>
            )}
          </div>
        </div>
      </div>

      {/* Weather + Smart Alerts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Weather Widget */}
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <h3 className="font-display font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-blue-500" />
            Weather — {selectedCity}
          </h3>
          {weather ? (
            <>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl font-display font-extrabold text-gray-900">{weather.temperature}°C</div>
                <div>
                  <p className="font-medium text-gray-700">{weather.condition}</p>
                  <p className="text-xs text-gray-500">Feels like {weather.feelsLike}°C | {weather.humidity}% humidity</p>
                </div>
              </div>
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {weather.forecast?.slice(0, 5).map((day: any) => (
                  <div key={day.day} className="flex-shrink-0 text-center bg-white/60 rounded-lg px-3 py-2 min-w-[56px]">
                    <p className="text-[10px] font-medium text-gray-500">{day.day}</p>
                    <p className="text-sm font-bold text-gray-900">{day.tempHigh}°</p>
                    <p className="text-[10px] text-gray-400">{day.tempLow}°</p>
                    {day.rainChance > 30 && <p className="text-[10px] text-blue-500">{day.rainChance}%</p>}
                  </div>
                ))}
              </div>
              {weather.businessImpact && (
                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Business Impact</p>
                  <p className="text-xs text-gray-600">{weather.businessImpact.summary}</p>
                </div>
              )}
            </>
          ) : (
            <div className="skeleton h-32" />
          )}
        </div>

        {/* Smart Alerts */}
        <div className="lg:col-span-2 card">
          <h3 className="font-display font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-saffron-500" />
            Smart Alerts
          </h3>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {data.alerts?.map((alert: any) => {
              const AlertIcon = ALERT_ICONS[alert.icon] || Sparkles
              return (
                <Link key={alert.id} to={alert.actionRoute} className="block">
                  <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${
                    alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'medium' ? 'bg-saffron-50 border-saffron-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                      alert.severity === 'medium' ? 'bg-saffron-100 text-saffron-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <AlertIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-hindi">{alert.titleHi}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{alert.message}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Feature Quick Access */}
      <h3 className="font-display text-xl font-bold text-gray-900 mb-4">AI Features — Try Now</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {featureCards.map((f, i) => (
          <Link key={f.path} to={f.path}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="card group cursor-pointer hover:-translate-y-1 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                f.color === 'saffron' ? 'bg-saffron-100 text-saffron-600' :
                f.color === 'bazaar' ? 'bg-bazaar-100 text-bazaar-600' :
                f.color === 'green' ? 'bg-green-100 text-green-600' :
                'bg-royal-100 text-royal-600'
              }`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900">{f.label}</h4>
              <p className="text-xs font-hindi text-gray-400">{f.labelHi}</p>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
              <div className="mt-3 flex items-center text-saffron-500 text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="font-display font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {data.recentActivity.map((a: any, i: number) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                a.type === 'pricing' ? 'bg-saffron-100 text-saffron-600' :
                a.type === 'content' ? 'bg-bazaar-100 text-bazaar-600' :
                a.type === 'sentiment' ? 'bg-royal-100 text-royal-600' :
                'bg-green-100 text-green-600'
              }`}>
                {a.type === 'pricing' ? <IndianRupee className="w-4 h-4" /> :
                 a.type === 'content' ? <Languages className="w-4 h-4" /> :
                 a.type === 'sentiment' ? <MessageSquareText className="w-4 h-4" /> :
                 <TrendingUp className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{a.description}</p>
              </div>
              <span className="text-xs text-gray-400">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
