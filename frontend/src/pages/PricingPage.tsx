import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IndianRupee, TrendingUp, TrendingDown, Minus, Sparkles, RotateCcw, Zap, ShieldCheck, Target, Download, Share2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { api } from '../utils/api'
import { ScrollReveal } from '../components/AnimatedComponents'

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

const strategyGradients: Record<string, { gradient: string; glow: string; badge: string; text: string }> = {
  competitive: { gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/20', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-600' },
  premium: { gradient: 'from-saffron-400 to-orange-500', glow: 'shadow-saffron-500/20', badge: 'bg-saffron-100 text-saffron-700', text: 'text-saffron-600' },
  value: { gradient: 'from-bazaar-400 to-teal-500', glow: 'shadow-bazaar-500/20', badge: 'bg-bazaar-100 text-bazaar-700', text: 'text-bazaar-600' },
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

  function downloadPDF() {
    if (!result) return
    const doc = new jsPDF()
    const margin = 20
    let y = margin

    doc.setFontSize(20)
    doc.setTextColor(255, 153, 51)
    doc.text('BharatBazaar AI', margin, y)
    y += 8
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text('Pricing Strategy Report', margin, y)
    y += 10
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    doc.text(`Product: ${productName} | City: ${city} | Generated: ${new Date().toLocaleDateString('en-IN')}`, margin, y)
    y += 12

    if (result.marketContext) {
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.text('Market Context', margin, y)
      y += 7
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      doc.text(`Avg Competitor Price: Rs.${result.marketContext.averageCompetitorPrice}`, margin, y); y += 6
      doc.text(`Price Range: Rs.${result.marketContext.priceRange?.min} - Rs.${result.marketContext.priceRange?.max}`, margin, y); y += 6
      doc.text(`Regional Purchasing Power: ${result.marketContext.regionalPurchasingPower}/100`, margin, y); y += 10
    }

    result.recommendations?.forEach((rec: any, i: number) => {
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.text(`${i + 1}. ${rec.strategy.toUpperCase()} Strategy — Rs.${rec.suggestedPrice}`, margin, y)
      y += 7
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      doc.text(`Confidence: ${rec.confidenceScore}% | Demand: ${rec.expectedImpact?.demandChange} | Revenue: ${rec.expectedImpact?.revenueChange}`, margin, y)
      y += 6
      if (rec.reasoning) {
        const lines = doc.splitTextToSize(rec.reasoning, 170)
        doc.text(lines, margin, y)
        y += lines.length * 5
      }
      y += 5
    })

    if (result.festivalInsight) {
      y += 3
      doc.setFontSize(11)
      doc.setTextColor(255, 153, 51)
      doc.text('Festival Insight', margin, y); y += 7
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      const lines = doc.splitTextToSize(result.festivalInsight, 170)
      doc.text(lines, margin, y); y += lines.length * 5
    }

    if (result.keyTakeaway) {
      y += 5
      doc.setFontSize(11)
      doc.setTextColor(40, 40, 40)
      doc.text('Key Takeaway', margin, y); y += 7
      doc.setFontSize(9)
      const lines = doc.splitTextToSize(result.keyTakeaway, 170)
      doc.text(lines, margin, y)
    }

    doc.save(`BharatBazaar-Pricing-${productName.replace(/\s+/g, '-')}.pdf`)
  }

  function shareWhatsApp() {
    if (!result) return
    const bestRec = result.recommendations?.[0]
    const text = `*BharatBazaar AI Pricing Report*\n\nProduct: ${productName}\nCity: ${city}\n\nBest Strategy: ${bestRec?.strategy?.toUpperCase()}\nSuggested Price: Rs.${bestRec?.suggestedPrice}\nConfidence: ${bestRec?.confidenceScore}%\nExpected Impact: Demand ${bestRec?.expectedImpact?.demandChange}, Revenue ${bestRec?.expectedImpact?.revenueChange}\n\n${result.keyTakeaway ? `Key Takeaway: ${result.keyTakeaway}` : ''}\n\nPowered by BharatBazaar AI`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Calculate margin if we have both prices
  const marginPct = costPrice && currentPrice
    ? Math.round(((Number(currentPrice) - Number(costPrice)) / Number(currentPrice)) * 100)
    : null

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Page Header */}
      <div className="page-header rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-saffron-300" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Smart Pricing Engine</h1>
              <p className="text-sm text-white/60">AI-powered pricing strategies adjusted for your region</p>
            </div>
          </div>
          {result && (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/25 transition-all text-white"
              >
                <Download className="w-4 h-4" /> PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareWhatsApp}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/30"
              >
                <Share2 className="w-4 h-4" /> WhatsApp
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-500 py-2">Quick Demo:</span>
        {DEMO_PRODUCTS.map(demo => (
          <motion.button
            key={demo.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadDemo(demo)}
            className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-saffron-300 hover:bg-saffron-50 transition-all shadow-sm"
          >
            {demo.name}
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 h-fit">
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

          {/* Live margin indicator */}
          {marginPct !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-3 rounded-xl ${marginPct >= 30 ? 'bg-green-50 border border-green-200' : marginPct >= 15 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Current Margin</span>
                <span className={`text-lg font-bold ${marginPct >= 30 ? 'text-green-600' : marginPct >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {marginPct}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(marginPct, 100)}%` }}
                  className={`h-1.5 rounded-full ${marginPct >= 30 ? 'bg-green-500' : marginPct >= 15 ? 'bg-yellow-500' : 'bg-red-500'}`}
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City / Region</label>
            <select value={city} onChange={e => setCity(e.target.value)} className="input-field">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
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
          </motion.button>

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
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="skeleton h-6 w-32 mb-3 rounded-lg" />
                    <div className="skeleton h-10 w-24 mb-3 rounded-lg" />
                    <div className="skeleton h-4 w-full mb-2 rounded-lg" />
                    <div className="skeleton h-4 w-3/4 rounded-lg" />
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
                <ScrollReveal>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Market Context — {city}</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Competitor</p>
                        <p className="text-xl font-bold text-gray-900 font-display">₹{result.marketContext?.averageCompetitorPrice}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Price Range</p>
                        <p className="text-xl font-bold text-gray-900 font-display">₹{result.marketContext?.priceRange?.min} — ₹{result.marketContext?.priceRange?.max}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Purchasing Power</p>
                        <p className="text-xl font-bold text-gray-900 font-display">{result.marketContext?.regionalPurchasingPower}/100</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Pricing Strategies */}
                {result.recommendations?.map((rec: any, i: number) => {
                  const style = strategyGradients[rec.strategy] || strategyGradients.competitive
                  const Icon = strategyIcons[rec.strategy] || Target
                  return (
                    <motion.div
                      key={rec.strategy}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      whileHover={{ y: -2 }}
                      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg ${style.glow} transition-all`}
                    >
                      {/* Gradient top accent */}
                      <div className={`h-1 bg-gradient-to-r ${style.gradient}`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${style.badge} flex items-center justify-center`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                                {rec.strategy} Strategy
                              </span>
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-3xl font-display font-extrabold text-gray-900">₹{rec.suggestedPrice}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase">Confidence</p>
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${rec.confidenceScore}%` }}
                                  transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }}
                                  className={`h-full rounded-full bg-gradient-to-r ${style.gradient}`}
                                />
                              </div>
                              <span className={`text-sm font-bold ${style.text}`}>{rec.confidenceScore}%</span>
                            </div>
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
                            Demand: <span className="font-medium">{rec.expectedImpact?.demandChange}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            Revenue: <span className="font-medium">{rec.expectedImpact?.revenueChange}</span>
                          </span>
                          {rec.expectedImpact?.monthlyProfitImpact && (
                            <span className="font-semibold text-green-600">
                              {rec.expectedImpact.monthlyProfitImpact}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Festival Insight */}
                {result.festivalInsight && (
                  <ScrollReveal>
                    <div className="bg-gradient-to-r from-saffron-50 to-orange-50 rounded-2xl p-5 border border-saffron-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-saffron-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-saffron-500" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-saffron-600 uppercase tracking-wider">Festival Insight</p>
                          <p className="text-sm text-gray-700 mt-1">{result.festivalInsight}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Key Takeaway */}
                {result.keyTakeaway && (
                  <ScrollReveal>
                    <div className="bg-gradient-to-br from-[#1E1B4B] to-[#312e81] rounded-2xl p-5 text-white relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-saffron-500 rounded-full blur-[80px]" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-xs font-semibold text-saffron-300 uppercase tracking-wider mb-1">Key Takeaway</p>
                        <p className="text-white/90 leading-relaxed">{result.keyTakeaway}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 text-gray-400">
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
