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
  confirmed: { label: 'Confirmed', color: 'text-blue-400', icon: CheckCircle2, bg: 'bg-blue-500/10 border-blue-500/20' },
  processing: { label: 'Processing', color: 'text-amber-400', icon: Clock, bg: 'bg-amber-500/10 border-amber-500/20' },
  shipped: { label: 'Shipped', color: 'text-purple-400', icon: Truck, bg: 'bg-purple-500/10 border-purple-500/20' },
  delivered: { label: 'Delivered', color: 'text-green-400', icon: CheckCircle2, bg: 'bg-green-500/10 border-green-500/20' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', icon: XCircle, bg: 'bg-red-500/10 border-red-500/20' },
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
          <h1 className="text-2xl font-bold text-gray-100">Order History</h1>
          <p className="text-gray-400 text-sm">Track and manage your wholesale orders</p>
        </div>
        <button
          onClick={loadOrders}
          className="p-2.5 bg-[#1a1a1d] border border-[#2a2a2d] rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Orders', value: stats.total, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Active', value: stats.active, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-gray-300', bg: 'bg-white/[0.03]' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-4"
          >
            <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-100">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 outline-none"
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
                  : 'bg-[#1a1a1d] border border-[#2a2a2d] text-gray-400 hover:bg-white/[0.06]'
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
          <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 mt-3">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-[#1a1a1d] rounded-xl border border-[#2a2a2d]">
          <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No orders found</p>
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
                className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-white/[0.06] transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-100 text-sm truncate">{order.productName}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${config.bg} ${config.color}`}>
                          <config.icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{order.orderId}</span>
                        <span>&middot;</span>
                        <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-100">&#8377;{order.totalAmount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-[#2a2a2d] px-4 pb-4 pt-3"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Wholesaler</p>
                        <p className="text-gray-300 font-medium">{order.wholesaler}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Payment</p>
                        <p className="text-gray-300 font-medium">Cash on Delivery</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Estimated Delivery</p>
                        <p className="text-gray-300 font-medium">
                          {new Date(new Date(order.createdAt).getTime() + 3 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Delivery Address</p>
                        <p className="text-gray-300 font-medium">Shop No. 42, Aminabad Market, Lucknow</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/tracking?orderId=${order.orderId}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/15 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Track Order
                      </Link>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.03] text-gray-400 rounded-lg text-xs font-medium hover:bg-white/[0.06] transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Invoice
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.03] text-gray-400 rounded-lg text-xs font-medium hover:bg-white/[0.06] transition-colors">
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
