import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { TrendingUp, IndianRupee, Languages, MessageSquareText, Calendar, MapPin, ArrowRight, Sparkles, Package, BarChart3, Activity } from 'lucide-react'
import { api } from '../utils/api'

const COLORS = ['#FF9933', '#138d75', '#7c3aed', '#C0392B']

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('Lucknow')

  useEffect(() => {
    loadDashboard()
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

  const featureCards = [
    { path: '/pricing', label: 'Smart Pricing', labelHi: 'स्मार्ट प्राइसिंग', icon: IndianRupee, color: 'saffron', desc: 'Get AI pricing strategies' },
    { path: '/content', label: 'Content Generator', labelHi: 'कंटेंट जेनरेटर', icon: Languages, color: 'bazaar', desc: 'Create multilingual descriptions' },
    { path: '/sentiment', label: 'Sentiment Analyzer', labelHi: 'सेंटिमेंट एनालाइज़र', icon: MessageSquareText, color: 'royal', desc: 'Analyze customer reviews' },
  ]

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Namaste, {data.business.owner} <span className="text-2xl">🙏</span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {data.business.name} — {data.business.city}
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

      {/* Feature Quick Access */}
      <h3 className="font-display text-xl font-bold text-gray-900 mb-4">AI Features — Try Now</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {featureCards.map((f, i) => (
          <Link key={f.path} to={f.path}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="card group cursor-pointer hover:-translate-y-1 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                f.color === 'saffron' ? 'bg-saffron-100 text-saffron-600' :
                f.color === 'bazaar' ? 'bg-bazaar-100 text-bazaar-600' :
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
