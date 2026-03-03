import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Package, TrendingDown, AlertTriangle, Truck, IndianRupee,
  CheckCircle2, Clock, Trash2, Check, Filter, Star,
  ShoppingCart, Megaphone, Zap
} from 'lucide-react'

interface Notification {
  id: string
  type: 'order' | 'price' | 'stock' | 'delivery' | 'promo' | 'insight'
  title: string
  message: string
  time: string
  read: boolean
  icon: any
  color: string
  bg: string
  action?: string
  actionLink?: string
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1', type: 'delivery', title: 'Order Out for Delivery',
    message: 'Fortune Sunflower Oil 5L (BB-ORD-2024-002) is out for delivery. Expected by 6 PM today.',
    time: '10 min ago', read: false, icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10',
    action: 'Track Order', actionLink: '/tracking?orderId=BB-ORD-2024-002',
  },
  {
    id: '2', type: 'price', title: 'Competitor Price Drop Alert',
    message: 'Amazon dropped Basmati Rice 5kg price by 8% to ₹412. Your current price: ₹449. Consider adjusting.',
    time: '25 min ago', read: false, icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10',
    action: 'Review Pricing', actionLink: '/pricing',
  },
  {
    id: '3', type: 'stock', title: 'Low Stock Alert',
    message: 'Tata Salt (1kg) has only 5 units left. Daily sell rate: 3 units/day. Will run out in ~2 days.',
    time: '1 hour ago', read: false, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10',
    action: 'Reorder Now', actionLink: '/sourcing',
  },
  {
    id: '4', type: 'insight', title: 'AI Insight: Holi Preparation',
    message: 'Holi is in 2 weeks! Stock up on colors, sweets & snacks. Demand expected to increase 40-60% in your area.',
    time: '2 hours ago', read: false, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10',
    action: 'View Recommendations', actionLink: '/chat',
  },
  {
    id: '5', type: 'order', title: 'Order Confirmed',
    message: 'Your order for Parle-G Biscuit (800g x 12) has been confirmed. Order ID: BB-ORD-2024-004.',
    time: '3 hours ago', read: true, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10',
    action: 'View Order', actionLink: '/orders',
  },
  {
    id: '6', type: 'promo', title: 'Wholesale Deal: Extra 5% Off',
    message: 'Gupta Wholesale is offering extra 5% off on all grocery orders above ₹5000 this week only.',
    time: '5 hours ago', read: true, icon: Star, color: 'text-orange-400', bg: 'bg-orange-500/10',
    action: 'Shop Now', actionLink: '/sourcing',
  },
  {
    id: '7', type: 'delivery', title: 'Order Delivered',
    message: 'Tata Salt order (BB-ORD-2024-001) has been delivered to your store. Please verify the items.',
    time: 'Yesterday', read: true, icon: Package, color: 'text-green-400', bg: 'bg-green-500/10',
  },
  {
    id: '8', type: 'insight', title: 'Weekly Sales Summary',
    message: 'Last week: ₹42,500 revenue (+12% vs previous week). Top seller: Premium Basmati Rice. 23 orders fulfilled.',
    time: 'Yesterday', read: true, icon: IndianRupee, color: 'text-gray-400', bg: 'bg-white/[0.03]',
    action: 'View Reports', actionLink: '/reports',
  },
  {
    id: '9', type: 'price', title: 'Price Suggestion Accepted',
    message: 'Your AI-recommended price of ₹469 for Cotton Kurta Set increased margin by 4.2%. Great decision!',
    time: '2 days ago', read: true, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10',
  },
  {
    id: '10', type: 'stock', title: 'Auto-Reorder Triggered',
    message: 'Aashirvaad Atta 10kg dropped below reorder level. Auto-order placed with Om Trading Co.',
    time: '3 days ago', read: true, icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10',
    action: 'View Order', actionLink: '/orders',
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'all') return true
    return n.type === filter
  })

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-400 text-sm">Stay updated with your store activity</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors font-medium"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'order', label: 'Orders' },
          { id: 'price', label: 'Pricing' },
          { id: 'stock', label: 'Stock' },
          { id: 'delivery', label: 'Delivery' },
          { id: 'insight', label: 'AI Insights' },
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

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((notification, i) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-[#1a1a1d] rounded-xl border p-4 transition-all ${
                notification.read ? 'border-[#2a2a2d]' : 'border-orange-500/20 bg-orange-500/5'
              }`}
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 ${notification.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <notification.icon className={`w-5 h-5 ${notification.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${notification.read ? 'text-gray-300' : 'text-gray-100'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{notification.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </span>
                    {notification.action && (
                      <a
                        href={notification.actionLink}
                        className="text-[10px] text-orange-400 font-semibold hover:text-orange-300"
                      >
                        {notification.action} →
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No notifications to show</p>
          </div>
        )}
      </div>
    </div>
  )
}
