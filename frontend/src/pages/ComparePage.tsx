import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { GitCompare, Check, TrendingUp, TrendingDown, Sparkles, Loader2 } from 'lucide-react'
import { api } from '../utils/api'

const PRODUCTS = [
  { id: 'demo-1', name: 'Premium Basmati Rice 5kg', category: 'Groceries', costPrice: 320, currentPrice: 449 },
  { id: 'demo-2', name: 'Handloom Cotton Kurta', category: 'Fashion', costPrice: 450, currentPrice: 899 },
  { id: 'demo-3', name: 'Wireless Bluetooth Earbuds', category: 'Electronics', costPrice: 600, currentPrice: 1299 },
]

const COMPARE_COLORS = ['#FF9933', '#138d75', '#7c3aed']

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(['demo-1', 'demo-2'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  function toggleProduct(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id)
      if (prev.length >= 3) return [...prev.slice(1), id]
      return [...prev, id]
    })
    setResult(null)
  }

  async function runComparison() {
    const products = PRODUCTS.filter(p => selected.includes(p.id))
    if (products.length < 2) return

    setLoading(true)
    setError('')
    try {
      const data = await api.compareProducts({ products, city: 'Lucknow' })
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'AI comparison failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const compared = result?.products || []

  const priceData = compared.map((p: any, i: number) => ({
    name: p.name?.split(' ').slice(0, 2).join(' '),
    cost: p.costPrice,
    selling: p.currentPrice,
    fill: COMPARE_COLORS[i],
  }))

  const marginData = compared.map((p: any, i: number) => ({
    name: p.name?.split(' ').slice(0, 2).join(' '),
    margin: parseFloat(p.margin),
    fill: COMPARE_COLORS[i],
  }))

  const sentimentData = compared.map((p: any, i: number) => ({
    name: p.name?.split(' ').slice(0, 2).join(' '),
    sentiment: p.sentiment || 0,
    fill: COMPARE_COLORS[i],
  }))

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="page-header rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <GitCompare className="w-6 h-6 text-violet-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">AI Product Comparison</h1>
            <p className="text-sm text-white/60">Bedrock-powered pricing, demand & sentiment comparison</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-white/40">
            <Sparkles className="w-4 h-4 text-saffron-300" />
            Powered by Claude AI
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm text-gray-500 py-2">Select 2-3 products:</span>
        {PRODUCTS.map(product => (
          <button
            key={product.id}
            onClick={() => toggleProduct(product.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              selected.includes(product.id)
                ? 'border-saffron-400 bg-saffron-50 text-saffron-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {selected.includes(product.id) && <Check className="w-4 h-4" />}
            {product.name}
          </button>
        ))}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={runComparison}
          disabled={selected.length < 2 || loading}
          className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-saffron-500/25"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'AI Analyzing...' : 'Compare with AI'}
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-saffron-400 animate-spin" />
          <p className="text-lg font-medium text-gray-600">AI is analyzing your products...</p>
          <p className="text-sm text-gray-400 mt-1">Comparing prices, margins, demand trends & sentiment</p>
        </div>
      )}

      {!loading && !result && selected.length >= 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 text-gray-400">
          <GitCompare className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium">Click "Compare with AI" to get intelligent analysis</p>
          <p className="text-sm mt-1">Powered by Amazon Bedrock Claude AI</p>
        </div>
      )}

      {!loading && result && compared.length >= 2 && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* AI Recommendation */}
            {result.recommendation && (
              <div className="bg-gradient-to-r from-[#1E1B4B] to-[#312e81] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-saffron-300" />
                  <h3 className="font-semibold">AI Recommendation</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-white/50">Best Margin</p>
                    <p className="font-semibold text-sm text-saffron-300">{result.recommendation.bestMargin}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-white/50">Best Demand</p>
                    <p className="font-semibold text-sm text-green-300">{result.recommendation.bestDemand}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-white/50">Best Overall</p>
                    <p className="font-semibold text-sm text-yellow-300">{result.recommendation.bestOverall}</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">{result.recommendation.reasoning}</p>
              </div>
            )}

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Metric</th>
                    {compared.map((p: any, i: number) => (
                      <th key={i} className="text-center py-3 px-4" style={{ color: COMPARE_COLORS[i] }}>
                        <span className="font-semibold">{p.name}</span>
                        <span className="block text-xs text-gray-400 font-normal">{p.category}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Cost Price', key: 'costPrice', fmt: (v: any) => `Rs.${v}` },
                    { label: 'Selling Price', key: 'currentPrice', fmt: (v: any) => `Rs.${v}`, bold: true },
                    { label: 'Margin', key: 'margin', fmt: (v: any) => v, color: 'text-green-600' },
                    { label: 'Competitor Avg', key: 'competitorAvg', fmt: (v: any) => `Rs.${v}` },
                    { label: 'Demand Trend', key: 'demandTrend', fmt: (v: any) => v, trend: true },
                    { label: 'Sentiment Score', key: 'sentiment', fmt: (v: any) => `${v}/100`, sentiment: true },
                    { label: 'Monthly Units', key: 'avgMonthlyUnits', fmt: (v: any) => String(v) },
                    { label: 'Festival Impact', key: 'festivalImpact', fmt: (v: any) => v, color: 'text-saffron-600' },
                  ].map(row => (
                    <tr key={row.label} className="border-b border-gray-50">
                      <td className="py-3 px-4 text-gray-600 font-medium">{row.label}</td>
                      {compared.map((p: any, i: number) => {
                        const val = p[row.key]
                        return (
                          <td key={i} className={`text-center py-3 px-4 ${row.bold ? 'font-display font-bold text-lg' : ''} ${row.color || ''}`}>
                            {row.trend ? (
                              <span className={`inline-flex items-center gap-1 font-medium ${String(val).startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {String(val).startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {val}
                              </span>
                            ) : row.sentiment ? (
                              <span className={`font-bold ${Number(val) >= 60 ? 'text-green-600' : Number(val) >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{row.fmt(val)}</span>
                            ) : row.fmt(val)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-4 text-gray-600 font-medium">Monthly Revenue Est.</td>
                    {compared.map((p: any, i: number) => (
                      <td key={i} className="text-center py-3 px-4 font-display font-bold text-gray-900">
                        Rs.{((p.currentPrice || 0) * (p.avgMonthlyUnits || 0)).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Price Comparison', data: priceData, keys: ['cost', 'selling'] },
                { title: 'Margin %', data: marginData, keys: ['margin'] },
                { title: 'Sentiment Score', data: sentimentData, keys: ['sentiment'] },
              ].map(chart => (
                <div key={chart.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">{chart.title}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chart.data}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                      <YAxis axisLine={false} tickLine={false} className="text-xs" />
                      <Tooltip />
                      {chart.keys.length === 2 ? (
                        <>
                          <Bar dataKey="cost" name="Cost" radius={[4, 4, 0, 0]} fill="#d1d5db" />
                          <Bar dataKey="selling" name="Selling" radius={[4, 4, 0, 0]}>
                            {chart.data.map((_: any, i: number) => <Cell key={i} fill={COMPARE_COLORS[i]} />)}
                          </Bar>
                        </>
                      ) : (
                        <Bar dataKey={chart.keys[0]} name={chart.title} radius={[4, 4, 0, 0]}>
                          {chart.data.map((_: any, i: number) => <Cell key={i} fill={COMPARE_COLORS[i]} />)}
                        </Bar>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>

            {/* AI Insights */}
            {result.insights && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-saffron-500" /> AI Insights
                </h3>
                <div className="space-y-2">
                  {result.insights.map((insight: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Risks */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compared.map((p: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-sm mb-3" style={{ color: COMPARE_COLORS[i] }}>{p.name}</h4>
                  {p.strengths?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-green-600 mb-1">Strengths</p>
                      {p.strengths.map((s: string, j: number) => (
                        <p key={j} className="text-xs text-gray-600 flex items-start gap-1.5 mb-0.5"><span className="text-green-500 mt-0.5">+</span> {s}</p>
                      ))}
                    </div>
                  )}
                  {p.risks?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-600 mb-1">Risks</p>
                      {p.risks.map((r: string, j: number) => (
                        <p key={j} className="text-xs text-gray-600 flex items-start gap-1.5 mb-0.5"><span className="text-red-500 mt-0.5">!</span> {r}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
