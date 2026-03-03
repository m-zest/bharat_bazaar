import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, IndianRupee, Package, Users, Calendar,
  Download, ArrowUpRight, ArrowDownRight, PieChart, ShoppingCart,
  Target, Award
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart as RPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const revenueData = [
  { month: 'Sep', revenue: 285000, orders: 145, profit: 52000 },
  { month: 'Oct', revenue: 340000, orders: 178, profit: 68000 },
  { month: 'Nov', revenue: 520000, orders: 256, profit: 112000 },
  { month: 'Dec', revenue: 410000, orders: 198, profit: 85000 },
  { month: 'Jan', revenue: 380000, orders: 190, profit: 78000 },
  { month: 'Feb', revenue: 425000, orders: 215, profit: 92000 },
  { month: 'Mar', revenue: 465000, orders: 232, profit: 98000 },
]

const categoryData = [
  { name: 'Groceries', value: 45, color: '#f97316' },
  { name: 'Fashion', value: 20, color: '#3b82f6' },
  { name: 'Electronics', value: 15, color: '#8b5cf6' },
  { name: 'Beauty', value: 12, color: '#ec4899' },
  { name: 'Home', value: 8, color: '#10b981' },
]

const topProducts = [
  { name: 'Premium Basmati Rice 5kg', sold: 234, revenue: 105066, trend: 12 },
  { name: 'Aashirvaad Atta 10kg', sold: 189, revenue: 83160, trend: 8 },
  { name: 'Fortune Sunflower Oil 5L', sold: 156, revenue: 117000, trend: -3 },
  { name: 'Cotton Kurta Set', sold: 87, revenue: 78213, trend: 25 },
  { name: 'Wireless Earbuds', sold: 64, revenue: 83136, trend: 18 },
]

const dailySales = [
  { day: 'Mon', sales: 14200 },
  { day: 'Tue', sales: 18500 },
  { day: 'Wed', sales: 16800 },
  { day: 'Thu', sales: 22100 },
  { day: 'Fri', sales: 19400 },
  { day: 'Sat', sales: 28600 },
  { day: 'Sun', sales: 25300 },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly')

  const kpis = [
    { label: 'Total Revenue', value: '₹4.25L', change: '+12.3%', positive: true, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: '232', change: '+8.1%', positive: true, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. Order Value', value: '₹1,832', change: '+3.7%', positive: true, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Profit Margin', value: '23.1%', change: '-1.2%', positive: false, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Business Reports</h1>
          <p className="text-slate-500 text-sm">Analytics and insights for Sharma Kirana Store</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
            {['weekly', 'monthly', 'yearly'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                  period === p ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.positive ? 'text-green-600' : 'text-red-500'}`}>
                {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-800">{kpi.value}</p>
            <p className="text-xs text-slate-500">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5"
        >
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-500" />
            Revenue & Profit Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="#fed7aa" fillOpacity={0.5} name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#a7f3d0" fillOpacity={0.5} name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-orange-500" />
            Sales by Category
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RPieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
            </RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="font-medium text-slate-700">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Daily Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            This Week&apos;s Daily Sales
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-500" />
            Top Selling Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-slate-100 text-slate-600' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.sold} sold &middot; ₹{(product.revenue / 1000).toFixed(1)}K revenue</p>
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${product.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(product.trend)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-5 text-white"
      >
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          AI Business Summary — March 2026
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/15 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-white/80 text-xs mb-1">Key Insight</p>
            <p className="font-medium">Saturday sales are 65% higher than weekday average. Consider weekend-specific promotions.</p>
          </div>
          <div className="bg-white/15 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-white/80 text-xs mb-1">Growth Opportunity</p>
            <p className="font-medium">Electronics category growing 18% MoM. Increase inventory allocation by 10-15%.</p>
          </div>
          <div className="bg-white/15 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-white/80 text-xs mb-1">Action Required</p>
            <p className="font-medium">Holi stock preparation needed. Predicted demand surge of 45% in colors and sweets.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
