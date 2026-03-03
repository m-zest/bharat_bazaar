import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Package, Clock, CheckCircle2, Truck, MapPin, Filter,
  Search, Download, Eye, ChevronDown, IndianRupee, RefreshCw,
  XCircle, AlertCircle
} from 'lucide-react'
import { api } from '../utils/api'

interface Order {
  orderId: string
  productName: string
  wholesaler: string
  quantity: number
  totalAmount: number
  status: string
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  confirmed: { label: 'Confirmed', color: 'text-blue-600', icon: CheckCircle2, bg: 'bg-blue-50 border-blue-200' },
  processing: { label: 'Processing', color: 'text-amber-600', icon: Clock, bg: 'bg-amber-50 border-amber-200' },
  shipped: { label: 'Shipped', color: 'text-purple-600', icon: Truck, bg: 'bg-purple-50 border-purple-200' },
  delivered: { label: 'Delivered', color: 'text-green-600', icon: CheckCircle2, bg: 'bg-green-50 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', icon: XCircle, bg: 'bg-red-50 border-red-200' },
}

// Demo orders to show when DynamoDB is empty
const DEMO_ORDERS: Order[] = [
  {
    orderId: 'BB-ORD-2024-001',
    productName: 'Tata Salt (1kg x 24 pack)',
    wholesaler: 'Gupta Wholesale, Aminabad',
    quantity: 5,
    totalAmount: 4200,
    status: 'delivered',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-002',
    productName: 'Fortune Sunflower Oil 5L',
    wholesaler: 'Sharma Traders, Charbagh',
    quantity: 10,
    totalAmount: 7500,
    status: 'shipped',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-003',
    productName: 'Aashirvaad Atta 10kg',
    wholesaler: 'Om Trading Co., Hazratganj',
    quantity: 8,
    totalAmount: 3520,
    status: 'processing',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-004',
    productName: 'Parle-G Biscuit (800g x 12)',
    wholesaler: 'Gupta Wholesale, Aminabad',
    quantity: 3,
    totalAmount: 1680,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-005',
    productName: 'Cotton Kurta Set (M, L, XL)',
    wholesaler: 'Kapoor Garments, Chowk',
    quantity: 15,
    totalAmount: 12750,
    status: 'delivered',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-006',
    productName: 'Wireless Earbuds (Bulk)',
    wholesaler: 'TechZone, Naka Hindola',
    quantity: 20,
    totalAmount: 15000,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
]

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await api.getOrders()
      // Merge demo orders with real ones
      const allOrders = [...data, ...DEMO_ORDERS]
      // Deduplicate by orderId
      const uniqueOrders = allOrders.filter((o, i, arr) => arr.findIndex(x => x.orderId === o.orderId) === i)
      setOrders(uniqueOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch {
      setOrders(DEMO_ORDERS)
    }
    setLoading(false)
  }

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || o.productName.toLowerCase().includes(search.toLowerCase()) || o.orderId.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: orders.length,
    active: orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalSpent: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0),
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order History</h1>
          <p className="text-slate-500 text-sm">Track and manage your wholesale orders</p>
        </div>
        <button
          onClick={loadOrders}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Orders', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active', value: stats.active, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-slate-700', bg: 'bg-slate-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 mt-3">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed
            const isExpanded = expandedOrder === order.orderId
            return (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-800 text-sm truncate">{order.productName}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${config.bg} ${config.color}`}>
                          <config.icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{order.orderId}</span>
                        <span>&middot;</span>
                        <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-slate-800">&#8377;{order.totalAmount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-slate-400">Qty: {order.quantity}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-slate-100 px-4 pb-4 pt-3"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Wholesaler</p>
                        <p className="text-slate-700 font-medium">{order.wholesaler}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Payment</p>
                        <p className="text-slate-700 font-medium">Cash on Delivery</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Estimated Delivery</p>
                        <p className="text-slate-700 font-medium">
                          {new Date(new Date(order.createdAt).getTime() + 3 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Delivery Address</p>
                        <p className="text-slate-700 font-medium">Shop No. 42, Aminabad Market, Lucknow</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/tracking?orderId=${order.orderId}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Track Order
                      </Link>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Invoice
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reorder
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
