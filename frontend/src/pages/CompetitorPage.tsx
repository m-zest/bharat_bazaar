import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, TrendingUp, TrendingDown, Minus, AlertTriangle, Bell, ArrowRight, IndianRupee, ExternalLink } from 'lucide-react'

interface CompetitorPrice {
  seller: string
  price: number
  prevPrice: number
  rating: number | null
  lastUpdated: string
  inStock: boolean
}

interface MonitoredProduct {
  id: string
  name: string
  category: string
  yourPrice: number
  costPrice: number
  competitors: CompetitorPrice[]
  priceHistory: { date: string; yourPrice: number; avgCompetitor: number }[]
}

const MONITORED_PRODUCTS: MonitoredProduct[] = [
  {
    id: 'mp-1',
    name: 'Premium Basmati Rice 5kg',
    category: 'Groceries',
    yourPrice: 449,
    costPrice: 320,
    competitors: [
      { seller: 'Amazon', price: 469, prevPrice: 485, rating: 4.2, lastUpdated: '2h ago', inStock: true },
      { seller: 'Flipkart', price: 445, prevPrice: 445, rating: 4.0, lastUpdated: '3h ago', inStock: true },
      { seller: 'BigBasket', price: 459, prevPrice: 469, rating: 4.3, lastUpdated: '1h ago', inStock: true },
      { seller: 'JioMart', price: 435, prevPrice: 449, rating: 3.9, lastUpdated: '4h ago', inStock: true },
      { seller: 'DMart Online', price: 419, prevPrice: 429, rating: 3.7, lastUpdated: '5h ago', inStock: false },
    ],
    priceHistory: [
      { date: 'Feb 20', yourPrice: 449, avgCompetitor: 465 },
      { date: 'Feb 21', yourPrice: 449, avgCompetitor: 462 },
      { date: 'Feb 22', yourPrice: 449, avgCompetitor: 458 },
      { date: 'Feb 23', yourPrice: 449, avgCompetitor: 455 },
      { date: 'Feb 24', yourPrice: 449, avgCompetitor: 450 },
      { date: 'Feb 25', yourPrice: 449, avgCompetitor: 448 },
      { date: 'Feb 26', yourPrice: 449, avgCompetitor: 445 },
    ],
  },
  {
    id: 'mp-2',
    name: 'Handloom Cotton Kurta - Men',
    category: 'Fashion',
    yourPrice: 899,
    costPrice: 450,
    competitors: [
      { seller: 'Myntra', price: 1199, prevPrice: 1199, rating: 4.1, lastUpdated: '2h ago', inStock: true },
      { seller: 'Amazon', price: 999, prevPrice: 1049, rating: 3.8, lastUpdated: '3h ago', inStock: true },
      { seller: 'Flipkart', price: 849, prevPrice: 899, rating: 3.6, lastUpdated: '1h ago', inStock: true },
      { seller: 'Ajio', price: 1099, prevPrice: 1099, rating: 4.0, lastUpdated: '6h ago', inStock: true },
      { seller: 'Meesho', price: 699, prevPrice: 749, rating: 3.2, lastUpdated: '4h ago', inStock: true },
    ],
    priceHistory: [
      { date: 'Feb 20', yourPrice: 899, avgCompetitor: 1050 },
      { date: 'Feb 21', yourPrice: 899, avgCompetitor: 1040 },
      { date: 'Feb 22', yourPrice: 899, avgCompetitor: 1020 },
      { date: 'Feb 23', yourPrice: 899, avgCompetitor: 1010 },
      { date: 'Feb 24', yourPrice: 899, avgCompetitor: 980 },
      { date: 'Feb 25', yourPrice: 899, avgCompetitor: 960 },
      { date: 'Feb 26', yourPrice: 899, avgCompetitor: 949 },
    ],
  },
  {
    id: 'mp-3',
    name: 'Wireless Bluetooth Earbuds',
    category: 'Electronics',
    yourPrice: 1299,
    costPrice: 600,
    competitors: [
      { seller: 'Amazon', price: 1499, prevPrice: 1499, rating: 4.0, lastUpdated: '1h ago', inStock: true },
      { seller: 'Flipkart', price: 1399, prevPrice: 1449, rating: 3.9, lastUpdated: '2h ago', inStock: true },
      { seller: 'Croma', price: 1599, prevPrice: 1599, rating: 4.2, lastUpdated: '5h ago', inStock: true },
      { seller: 'Reliance Digital', price: 1449, prevPrice: 1499, rating: 4.1, lastUpdated: '3h ago', inStock: true },
      { seller: 'Local Market', price: 1199, prevPrice: 1199, rating: null, lastUpdated: '1d ago', inStock: true },
    ],
    priceHistory: [
      { date: 'Feb 20', yourPrice: 1299, avgCompetitor: 1480 },
      { date: 'Feb 21', yourPrice: 1299, avgCompetitor: 1475 },
      { date: 'Feb 22', yourPrice: 1299, avgCompetitor: 1460 },
      { date: 'Feb 23', yourPrice: 1299, avgCompetitor: 1455 },
      { date: 'Feb 24', yourPrice: 1299, avgCompetitor: 1440 },
      { date: 'Feb 25', yourPrice: 1299, avgCompetitor: 1430 },
      { date: 'Feb 26', yourPrice: 1299, avgCompetitor: 1429 },
    ],
  },
]

function getPriceAlerts(products: MonitoredProduct[]) {
  const alerts: { product: string; message: string; severity: 'high' | 'medium' | 'low' }[] = []
  for (const p of products) {
    const cheaperCompetitors = p.competitors.filter(c => c.price < p.yourPrice && c.inStock)
    if (cheaperCompetitors.length > 0) {
      const cheapest = cheaperCompetitors.sort((a, b) => a.price - b.price)[0]
      const diff = p.yourPrice - cheapest.price
      const pct = Math.round((diff / p.yourPrice) * 100)
      alerts.push({
        product: p.name,
        message: `${cheapest.seller} is selling at Rs.${cheapest.price} — Rs.${diff} cheaper (${pct}% less) than your price of Rs.${p.yourPrice}`,
        severity: pct > 10 ? 'high' : pct > 5 ? 'medium' : 'low',
      })
    }
    const droppedPrices = p.competitors.filter(c => c.price < c.prevPrice)
    for (const comp of droppedPrices) {
      alerts.push({
        product: p.name,
        message: `${comp.seller} dropped price from Rs.${comp.prevPrice} to Rs.${comp.price} (${comp.lastUpdated})`,
        severity: 'medium',
      })
    }
  }
  return alerts.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.severity] - order[b.severity]
  })
}

export default function CompetitorPage() {
  const [expandedProduct, setExpandedProduct] = useState<string | null>('mp-1')

  const alerts = getPriceAlerts(MONITORED_PRODUCTS)

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
            <h1 className="font-display text-2xl font-bold">Competitor Price Monitor</h1>
            <p className="text-sm text-white/60">Track competitor prices across Amazon, Flipkart, BigBasket & more</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-white/40">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Updated every few hours
          </div>
        </div>
      </div>

      {/* Price Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-200 bg-red-50/50 mb-6">
          <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5" /> Price Alerts ({alerts.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {alerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl bg-white border ${
                alert.severity === 'high' ? 'border-red-200' : alert.severity === 'medium' ? 'border-yellow-200' : 'border-gray-200'
              }`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  alert.severity === 'high' ? 'text-red-500' : alert.severity === 'medium' ? 'text-yellow-500' : 'text-gray-400'
                }`} />
                <div>
                  <p className="text-xs font-semibold text-gray-700">{alert.product}</p>
                  <p className="text-xs text-gray-500">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Cards */}
      <div className="space-y-4">
        {MONITORED_PRODUCTS.map((product) => {
          const isExpanded = expandedProduct === product.id
          const avgCompetitorPrice = Math.round(product.competitors.reduce((sum, c) => sum + c.price, 0) / product.competitors.length)
          const yourPosition = product.yourPrice <= avgCompetitorPrice ? 'below' : 'above'
          const priceDiff = Math.abs(product.yourPrice - avgCompetitorPrice)
          const margin = Math.round(((product.yourPrice - product.costPrice) / product.yourPrice) * 100)

          return (
            <motion.div
              key={product.id}
              layout
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Product Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-xs text-gray-400">{product.category}</span>
                  </div>
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
                    {yourPosition === 'below' ? (
                      <span className="flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Rs.{priceDiff} cheaper</span>
                    ) : (
                      <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Rs.{priceDiff} higher</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Margin</p>
                    <p className="text-lg font-bold text-green-600">{margin}%</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
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
                        {/* Your price row */}
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
                        {product.competitors.map((comp) => {
                          const priceChange = comp.price - comp.prevPrice
                          const vsYou = comp.price - product.yourPrice
                          return (
                            <tr key={comp.seller} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="py-2 px-3 font-medium text-gray-700">{comp.seller}</td>
                              <td className="text-center py-2 px-3 font-mono font-medium">Rs.{comp.price}</td>
                              <td className="text-center py-2 px-3 font-mono text-gray-400">Rs.{comp.prevPrice}</td>
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
                                <span className={`text-xs px-2 py-0.5 rounded-full ${comp.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {comp.inStock ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="text-center py-2 px-3 text-xs text-gray-400">{comp.lastUpdated}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Price Trend Summary */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">7-Day Price Trend</h4>
                    <div className="flex items-center gap-6">
                      {product.priceHistory.map((h, i) => (
                        <div key={h.date} className="text-center flex-1">
                          <p className="text-[10px] text-gray-400">{h.date}</p>
                          <div className="mt-1 space-y-1">
                            <div className="h-1 bg-saffron-400 rounded" style={{ opacity: 0.5 + (i / product.priceHistory.length) * 0.5 }} />
                            <p className="text-[10px] text-gray-500">Rs.{h.avgCompetitor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Competitor average dropped from Rs.{product.priceHistory[0].avgCompetitor} to Rs.{product.priceHistory[product.priceHistory.length - 1].avgCompetitor} this week
                      ({Math.round(((product.priceHistory[0].avgCompetitor - product.priceHistory[product.priceHistory.length - 1].avgCompetitor) / product.priceHistory[0].avgCompetitor) * 100)}% decline)
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
