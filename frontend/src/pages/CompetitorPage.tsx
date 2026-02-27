import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, TrendingUp, TrendingDown, Minus, AlertTriangle, Bell, Sparkles, Loader2 } from 'lucide-react'
import { api } from '../utils/api'

const PRODUCTS_TO_MONITOR = [
  { name: 'Premium Basmati Rice 5kg', category: 'Groceries', yourPrice: 449, costPrice: 320 },
  { name: 'Handloom Cotton Kurta - Men', category: 'Fashion', yourPrice: 899, costPrice: 450 },
  { name: 'Wireless Bluetooth Earbuds', category: 'Electronics', yourPrice: 1299, costPrice: 600 },
]

export default function CompetitorPage() {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function analyzeCompetitors() {
    setLoading(true)
    setError('')
    try {
      const data = await api.analyzeCompetitors({ products: PRODUCTS_TO_MONITOR, city: 'Lucknow' })
      setResult(data)
      if (data.products?.length > 0) setExpandedProduct(data.products[0].name)
    } catch (err: any) {
      setError(err.message || 'AI analysis failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const products = result?.products || []
  const alerts = result?.alerts || []

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Page Header */}
      <div className="page-header rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-400 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Eye className="w-6 h-6 text-red-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">AI Competitor Monitor</h1>
            <p className="text-sm text-white/60">Bedrock-powered competitive pricing intelligence</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={analyzeCompetitors}
            disabled={loading}
            className="ml-auto flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/25 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-saffron-300" />}
            {loading ? 'Analyzing...' : 'Analyze Competitors'}
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-saffron-400 animate-spin" />
          <p className="text-lg font-medium text-gray-600">AI is scanning competitor prices...</p>
          <p className="text-sm text-gray-400 mt-1">Analyzing Amazon, Flipkart, BigBasket, JioMart & more</p>
        </div>
      )}

      {!loading && !result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 text-gray-400">
          <Eye className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium">Click "Analyze Competitors" to scan pricing data</p>
          <p className="text-sm mt-1">AI will analyze competitor prices, trends, and give you strategic advice</p>
        </div>
      )}

      {!loading && result && (
        <>
          {/* Strategic Insights Banner */}
          {result.strategicInsights && (
            <div className="bg-gradient-to-r from-[#1E1B4B] to-[#312e81] rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-saffron-300" />
                <h3 className="font-semibold">AI Strategic Insights</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">{result.strategicInsights.overallPosition}</p>
              <div className="grid md:grid-cols-2 gap-3">
                {result.strategicInsights.recommendations?.map((rec: string, i: number) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-saffron-500/30 text-saffron-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-white/70">{rec}</p>
                  </div>
                ))}
              </div>
              {result.strategicInsights.festivalStrategy && (
                <p className="text-xs text-white/50 mt-3 border-t border-white/10 pt-3">{result.strategicInsights.festivalStrategy}</p>
              )}
            </div>
          )}

          {/* Price Alerts */}
          {alerts.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-200 bg-red-50/50 mb-6">
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5" /> AI Price Alerts ({alerts.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {alerts.map((alert: any, i: number) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl bg-white border ${
                    alert.severity === 'high' ? 'border-red-200' : alert.severity === 'medium' ? 'border-yellow-200' : 'border-gray-200'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      alert.severity === 'high' ? 'text-red-500' : alert.severity === 'medium' ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-700">{alert.product}</p>
                      <p className="text-xs text-gray-500">{alert.message}</p>
                      {alert.actionItem && (
                        <p className="text-xs text-saffron-600 font-medium mt-1">{alert.actionItem}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Cards */}
          <div className="space-y-4">
            {products.map((product: any) => {
              const isExpanded = expandedProduct === product.name
              const competitors = product.competitors || []
              const avgCompetitorPrice = competitors.length > 0
                ? Math.round(competitors.reduce((sum: number, c: any) => sum + c.price, 0) / competitors.length)
                : product.yourPrice
              const yourPosition = product.yourPrice <= avgCompetitorPrice ? 'below' : 'above'
              const priceDiff = Math.abs(product.yourPrice - avgCompetitorPrice)
              const margin = Math.round(((product.yourPrice - product.costPrice) / product.yourPrice) * 100)

              return (
                <motion.div
                  key={product.name}
                  layout
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedProduct(isExpanded ? null : product.name)}>
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <span className="text-xs text-gray-400">{product.category}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Your Price</p>
                        <p className="text-xl font-display font-bold text-saffron-600">Rs.{product.yourPrice}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Avg Competitor</p>
                        <p className="text-xl font-display font-bold text-gray-700">Rs.{avgCompetitorPrice}</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        yourPosition === 'below' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <span className="flex items-center gap-1">
                          {yourPosition === 'below' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                          Rs.{priceDiff} {yourPosition === 'below' ? 'cheaper' : 'higher'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Margin</p>
                        <p className="text-lg font-bold text-green-600">{margin}%</p>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-gray-100">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-2 px-3 text-gray-500 font-medium">Seller</th>
                              <th className="text-center py-2 px-3 text-gray-500 font-medium">Current Price</th>
                              <th className="text-center py-2 px-3 text-gray-500 font-medium">Previous</th>
                              <th className="text-center py-2 px-3 text-gray-500 font-medium">Change</th>
                              <th className="text-center py-2 px-3 text-gray-500 font-medium">vs You</th>
                              <th className="text-center py-2 px-3 text-gray-500 font-medium">Rating</th>
                              <th className="text-center py-2 px-3 text-gray-500 font-medium">Stock</th>
                              <th className="text-center py-2 px-3 text-gray-500 font-medium">Updated</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-saffron-50 font-medium">
                              <td className="py-2 px-3 text-saffron-700 font-semibold">You (Sharma Store)</td>
                              <td className="text-center py-2 px-3 font-display font-bold text-saffron-600">Rs.{product.yourPrice}</td>
                              <td className="text-center py-2 px-3">—</td>
                              <td className="text-center py-2 px-3">—</td>
                              <td className="text-center py-2 px-3">—</td>
                              <td className="text-center py-2 px-3">—</td>
                              <td className="text-center py-2 px-3 text-green-600">In Stock</td>
                              <td className="text-center py-2 px-3">Now</td>
                            </tr>
                            {competitors.map((comp: any) => {
                              const priceChange = (comp.price || 0) - (comp.prevPrice || comp.price || 0)
                              const vsYou = (comp.price || 0) - product.yourPrice
                              return (
                                <tr key={comp.seller} className="border-b border-gray-50 hover:bg-gray-50/50">
                                  <td className="py-2 px-3 font-medium text-gray-700">{comp.seller}</td>
                                  <td className="text-center py-2 px-3 font-mono font-medium">Rs.{comp.price}</td>
                                  <td className="text-center py-2 px-3 font-mono text-gray-400">Rs.{comp.prevPrice || comp.price}</td>
                                  <td className="text-center py-2 px-3">
                                    {priceChange === 0 ? (
                                      <span className="text-gray-400 flex items-center justify-center gap-1"><Minus className="w-3 h-3" /> —</span>
                                    ) : priceChange < 0 ? (
                                      <span className="text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" /> Rs.{Math.abs(priceChange)}</span>
                                    ) : (
                                      <span className="text-red-600 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" /> +Rs.{priceChange}</span>
                                    )}
                                  </td>
                                  <td className="text-center py-2 px-3">
                                    <span className={`font-medium ${vsYou > 0 ? 'text-green-600' : vsYou < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                      {vsYou > 0 ? `+Rs.${vsYou}` : vsYou < 0 ? `-Rs.${Math.abs(vsYou)}` : 'Same'}
                                    </span>
                                  </td>
                                  <td className="text-center py-2 px-3">
                                    {comp.rating ? <span className="text-yellow-600">{comp.rating}/5</span> : <span className="text-gray-300">—</span>}
                                  </td>
                                  <td className="text-center py-2 px-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${comp.inStock !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                      {comp.inStock !== false ? 'Yes' : 'No'}
                                    </span>
                                  </td>
                                  <td className="text-center py-2 px-3 text-xs text-gray-400">{comp.lastUpdated || '—'}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Price Trend */}
                      {product.priceHistory && product.priceHistory.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">7-Day Price Trend</h4>
                          <div className="flex items-center gap-6">
                            {product.priceHistory.map((h: any, i: number) => (
                              <div key={i} className="text-center flex-1">
                                <p className="text-[10px] text-gray-400">{h.date}</p>
                                <div className="mt-1 space-y-1">
                                  <div className="h-1 bg-saffron-400 rounded" style={{ opacity: 0.5 + (i / product.priceHistory.length) * 0.5 }} />
                                  <p className="text-[10px] text-gray-500">Rs.{h.avgCompetitor}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Competitor average: Rs.{product.priceHistory[0]?.avgCompetitor} → Rs.{product.priceHistory[product.priceHistory.length - 1]?.avgCompetitor}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
