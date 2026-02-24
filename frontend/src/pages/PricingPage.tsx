import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IndianRupee, TrendingUp, TrendingDown, Minus, Sparkles, RotateCcw, Zap, ShieldCheck, Target } from 'lucide-react'
import { api } from '../utils/api'

const DEMO_PRODUCTS = [
  { name: 'Premium Basmati Rice 5kg', category: 'Groceries', costPrice: 320, currentPrice: 449 },
  { name: 'Handloom Cotton Kurta - Men', category: 'Fashion', costPrice: 450, currentPrice: 899 },
  { name: 'Wireless Bluetooth Earbuds', category: 'Electronics', costPrice: 600, currentPrice: 1299 },
]

const CITIES = ['Lucknow', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Jaipur', 'Indore']

const strategyIcons: Record<string, any> = {
  competitive: Target,
  premium: Sparkles,
  value: ShieldCheck,
}

const strategyColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  competitive: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  premium: { bg: 'bg-saffron-50', border: 'border-saffron-200', text: 'text-saffron-700', badge: 'bg-saffron-100 text-saffron-700' },
  value: { bg: 'bg-bazaar-50', border: 'border-bazaar-200', text: 'text-bazaar-700', badge: 'bg-bazaar-100 text-bazaar-700' },
}

export default function PricingPage() {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('Groceries')
  const [costPrice, setCostPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [city, setCity] = useState('Lucknow')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  function loadDemo(demo: typeof DEMO_PRODUCTS[0]) {
    setProductName(demo.name)
    setCategory(demo.category)
    setCostPrice(demo.costPrice.toString())
    setCurrentPrice(demo.currentPrice.toString())
    setResult(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await api.analyzePricing({
        productName,
        category,
        costPrice: Number(costPrice),
        currentPrice: currentPrice ? Number(currentPrice) : undefined,
        city,
      })
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze pricing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-saffron-100 flex items-center justify-center">
          <IndianRupee className="w-6 h-6 text-saffron-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Smart Pricing Engine</h1>
          <p className="text-sm text-gray-500">AI-powered pricing strategies adjusted for your region</p>
        </div>
      </div>

      {/* Demo Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-500 py-2">Quick Demo:</span>
        {DEMO_PRODUCTS.map(demo => (
          <button
            key={demo.name}
            onClick={() => loadDemo(demo)}
            className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-saffron-300 hover:bg-saffron-50 transition-all"
          >
            {demo.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g., Premium Basmati Rice 5kg"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
              {['Electronics', 'Fashion', 'Groceries', 'Home & Kitchen', 'Beauty & Personal Care', 'Books & Stationery', 'Sports & Fitness', 'Toys & Baby Products'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (₹)</label>
              <input
                type="number"
                value={costPrice}
                onChange={e => setCostPrice(e.target.value)}
                placeholder="₹320"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Price (₹)</label>
              <input
                type="number"
                value={currentPrice}
                onChange={e => setCurrentPrice(e.target.value)}
                placeholder="₹449 (optional)"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City / Region</label>
            <select value={city} onChange={e => setCity(e.target.value)} className="input-field">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Get Pricing Strategies
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
        </form>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="card">
                    <div className="skeleton h-6 w-32 mb-3" />
                    <div className="skeleton h-10 w-24 mb-3" />
                    <div className="skeleton h-4 w-full mb-2" />
                    <div className="skeleton h-4 w-3/4" />
                  </div>
                ))}
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Market Context */}
                <div className="card bg-gray-50">
                  <h3 className="font-semibold text-gray-700 mb-3">Market Context — {city}</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Avg Competitor Price</p>
                      <p className="text-xl font-bold text-gray-900">₹{result.marketContext?.averageCompetitorPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price Range</p>
                      <p className="text-xl font-bold text-gray-900">₹{result.marketContext?.priceRange?.min} — ₹{result.marketContext?.priceRange?.max}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Purchasing Power</p>
                      <p className="text-xl font-bold text-gray-900">{result.marketContext?.regionalPurchasingPower}/100</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Strategies */}
                {result.recommendations?.map((rec: any, i: number) => {
                  const colors = strategyColors[rec.strategy] || strategyColors.competitive
                  const Icon = strategyIcons[rec.strategy] || Target
                  return (
                    <motion.div
                      key={rec.strategy}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className={`card border-2 ${colors.border} ${colors.bg}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                              {rec.strategy} Strategy
                            </span>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-3xl font-display font-extrabold text-gray-900">₹{rec.suggestedPrice}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Confidence</p>
                          <p className={`text-lg font-bold ${colors.text}`}>{rec.confidenceScore}%</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{rec.reasoning}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          {rec.expectedImpact?.demandChange?.startsWith('+') ?
                            <TrendingUp className="w-4 h-4 text-green-500" /> :
                            rec.expectedImpact?.demandChange?.startsWith('-') ?
                            <TrendingDown className="w-4 h-4 text-red-500" /> :
                            <Minus className="w-4 h-4 text-gray-400" />
                          }
                          Demand: {rec.expectedImpact?.demandChange}
                        </span>
                        <span className="flex items-center gap-1">
                          Revenue: {rec.expectedImpact?.revenueChange}
                        </span>
                        {rec.expectedImpact?.monthlyProfitImpact && (
                          <span className="font-medium text-green-600">
                            {rec.expectedImpact.monthlyProfitImpact}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}

                {/* Festival Insight */}
                {result.festivalInsight && (
                  <div className="card bg-gradient-to-r from-saffron-50 to-bazaar-50 border-saffron-200">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-saffron-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-saffron-600 uppercase tracking-wider">Festival Insight</p>
                        <p className="text-sm text-gray-700 mt-1">{result.festivalInsight}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Takeaway */}
                {result.keyTakeaway && (
                  <div className="card bg-gray-900 text-white">
                    <p className="text-xs font-semibold text-saffron-400 uppercase tracking-wider mb-1">Key Takeaway</p>
                    <p className="text-white leading-relaxed">{result.keyTakeaway}</p>
                  </div>
                )}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="card text-center py-16 text-gray-400">
                <IndianRupee className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                <p className="text-lg font-medium">Enter a product to get AI pricing strategies</p>
                <p className="text-sm mt-2">Or click a "Quick Demo" button above to try instantly</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
