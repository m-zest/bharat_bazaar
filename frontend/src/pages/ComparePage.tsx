import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { GitCompare, Check, IndianRupee, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const PRODUCTS = [
  {
    id: 'demo-1',
    name: 'Premium Basmati Rice 5kg',
    category: 'Groceries',
    costPrice: 320,
    currentPrice: 449,
    margin: '40.3%',
    competitors: [
      { seller: 'Amazon', price: 469 },
      { seller: 'Flipkart', price: 445 },
      { seller: 'BigBasket', price: 459 },
      { seller: 'JioMart', price: 435 },
      { seller: 'Local Market', price: 399 },
    ],
    sentiment: 62,
    demandTrend: '+12%',
    festivalImpact: 'High (Diwali, Eid)',
    avgMonthlyUnits: 150,
  },
  {
    id: 'demo-2',
    name: 'Handloom Cotton Kurta',
    category: 'Fashion',
    costPrice: 450,
    currentPrice: 899,
    margin: '49.9%',
    competitors: [
      { seller: 'Myntra', price: 1199 },
      { seller: 'Amazon', price: 999 },
      { seller: 'Flipkart', price: 849 },
      { seller: 'Ajio', price: 1099 },
      { seller: 'Local Market', price: 750 },
    ],
    sentiment: 78,
    demandTrend: '+25%',
    festivalImpact: 'Very High (Eid, Diwali)',
    avgMonthlyUnits: 45,
  },
  {
    id: 'demo-3',
    name: 'Wireless Bluetooth Earbuds',
    category: 'Electronics',
    costPrice: 600,
    currentPrice: 1299,
    margin: '53.8%',
    competitors: [
      { seller: 'Amazon', price: 1499 },
      { seller: 'Flipkart', price: 1399 },
      { seller: 'Croma', price: 1599 },
      { seller: 'Reliance Digital', price: 1449 },
      { seller: 'Local Market', price: 1199 },
    ],
    sentiment: 71,
    demandTrend: '+8%',
    festivalImpact: 'High (Diwali)',
    avgMonthlyUnits: 30,
  },
]

const COMPARE_COLORS = ['#FF9933', '#138d75', '#7c3aed']

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(['demo-1', 'demo-2'])

  function toggleProduct(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id)
      if (prev.length >= 3) return [...prev.slice(1), id]
      return [...prev, id]
    })
  }

  const compared = PRODUCTS.filter(p => selected.includes(p.id))

  const priceData = compared.map((p, i) => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    cost: p.costPrice,
    selling: p.currentPrice,
    fill: COMPARE_COLORS[i],
  }))

  const marginData = compared.map((p, i) => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    margin: parseFloat(p.margin),
    fill: COMPARE_COLORS[i],
  }))

  const sentimentData = compared.map((p, i) => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    sentiment: p.sentiment,
    fill: COMPARE_COLORS[i],
  }))

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Page Header */}
      <div className="page-header rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <GitCompare className="w-6 h-6 text-violet-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Compare Products</h1>
            <p className="text-sm text-white/60">Side-by-side pricing, demand & sentiment comparison</p>
          </div>
        </div>
      </div>

      {/* Product Selector */}
      <div className="flex flex-wrap gap-3 mb-8">
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
      </div>

      {compared.length < 2 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 text-gray-400">
          <GitCompare className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium">Select at least 2 products to compare</p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Comparison Table */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Metric</th>
                    {compared.map((p, i) => (
                      <th key={p.id} className="text-center py-3 px-4" style={{ color: COMPARE_COLORS[i] }}>
                        <span className="font-semibold">{p.name}</span>
                        <span className="block text-xs text-gray-400 font-normal">{p.category}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-medium">Cost Price</td>
                    {compared.map(p => <td key={p.id} className="text-center py-3 px-4 font-mono">Rs.{p.costPrice}</td>)}
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-medium">Selling Price</td>
                    {compared.map(p => <td key={p.id} className="text-center py-3 px-4 font-display font-bold text-lg">Rs.{p.currentPrice}</td>)}
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-medium">Margin</td>
                    {compared.map(p => <td key={p.id} className="text-center py-3 px-4 font-bold text-green-600">{p.margin}</td>)}
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-medium">Demand Trend</td>
                    {compared.map(p => (
                      <td key={p.id} className="text-center py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          p.demandTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {p.demandTrend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {p.demandTrend}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-medium">Sentiment Score</td>
                    {compared.map(p => (
                      <td key={p.id} className="text-center py-3 px-4">
                        <span className={`font-bold ${p.sentiment >= 60 ? 'text-green-600' : p.sentiment >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {p.sentiment}/100
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-medium">Monthly Units</td>
                    {compared.map(p => <td key={p.id} className="text-center py-3 px-4 font-medium">{p.avgMonthlyUnits}</td>)}
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-medium">Festival Impact</td>
                    {compared.map(p => <td key={p.id} className="text-center py-3 px-4 text-saffron-600 font-medium text-xs">{p.festivalImpact}</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-600 font-medium">Monthly Revenue Est.</td>
                    {compared.map(p => (
                      <td key={p.id} className="text-center py-3 px-4 font-display font-bold text-gray-900">
                        Rs.{(p.currentPrice * p.avgMonthlyUnits).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Price Comparison</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={priceData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis axisLine={false} tickLine={false} className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="cost" name="Cost" radius={[4, 4, 0, 0]} fill="#d1d5db" />
                    <Bar dataKey="selling" name="Selling" radius={[4, 4, 0, 0]}>
                      {priceData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Margin %</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={marginData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 60]} className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="margin" name="Margin %" radius={[4, 4, 0, 0]}>
                      {marginData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Sentiment Score</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sentimentData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="sentiment" name="Score" radius={[4, 4, 0, 0]}>
                      {sentimentData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competitor Price Breakdown */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Competitor Price Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-4 text-gray-500 font-medium">Seller</th>
                      {compared.map((p, i) => (
                        <th key={p.id} className="text-center py-2 px-4 font-semibold" style={{ color: COMPARE_COLORS[i] }}>
                          {p.name.split(' ').slice(0, 3).join(' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['Amazon', 'Flipkart', 'Local Market'].map(seller => (
                      <tr key={seller} className="border-b border-gray-50">
                        <td className="py-2 px-4 text-gray-600">{seller}</td>
                        {compared.map(p => {
                          const comp = p.competitors.find(c => c.seller.includes(seller.split(' ')[0]))
                          const diff = comp ? comp.price - p.currentPrice : 0
                          return (
                            <td key={p.id} className="text-center py-2 px-4">
                              {comp ? (
                                <span className="font-mono">
                                  Rs.{comp.price}
                                  <span className={`ml-1 text-xs ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                    ({diff > 0 ? '+' : ''}{diff})
                                  </span>
                                </span>
                              ) : '—'}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="py-2 px-4 text-gray-700">Your Price</td>
                      {compared.map(p => (
                        <td key={p.id} className="text-center py-2 px-4 font-bold text-saffron-600">Rs.{p.currentPrice}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
