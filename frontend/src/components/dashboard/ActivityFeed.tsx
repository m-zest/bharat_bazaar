import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IndianRupee, Languages, MessageSquareText, TrendingUp,
  Camera, MessageCircle, Package, Receipt, Database, ChevronRight,
} from 'lucide-react'
import { useTheme } from '../../utils/ThemeContext'

interface Sale {
  timestamp: string
  customerName: string
  grandTotal: number
  items: { qty: number }[]
  invoiceNum: string
}

interface ActivityItem {
  description: string
  type: string
  time: string
}

interface ActivityFeedProps {
  todaySales: Sale[]
  recentActivity: ActivityItem[]
}

export default function ActivityFeed({ todaySales, recentActivity }: ActivityFeedProps) {
  const { theme } = useTheme()
  const dk = theme === 'dark'

  const liveEvents = [
    ...todaySales.slice(0, 2).map(sale => ({
      time: new Date(sale.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      icon: Receipt,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      action: `Sale: ${sale.customerName}`,
      detail: `₹${Math.round(sale.grandTotal).toLocaleString('en-IN')} | ${sale.items.reduce((s, i) => s + i.qty, 0)} items`,
      link: '/invoices',
      tag: sale.invoiceNum,
    })),
    { time: '2 min ago', icon: Camera, color: 'text-violet-400', bg: 'bg-violet-500/10', action: 'Bill Scanned', detail: '8 items extracted via AI', link: '/scanner', tag: 'AI Vision' },
    ...(todaySales.length === 0 ? [{ time: '15 min ago', icon: Receipt, color: 'text-emerald-400', bg: 'bg-emerald-500/10', action: 'Invoice Generated', detail: '₹4,580 sale recorded', link: '/invoices', tag: 'GST Invoice' }] : []),
    { time: '1 hr ago', icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-500/10', action: 'WhatsApp Order', detail: '"50 Surf Excel" reserved', link: '/chat', tag: 'WhatsApp AI' },
    { time: '3 hrs ago', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', action: 'Wholesale Order', detail: '200 units incoming', link: '/sourcing', tag: 'Sourcing' },
    { time: '5 hrs ago', icon: IndianRupee, color: 'text-orange-400', bg: 'bg-orange-500/10', action: 'Price Updated', detail: 'Margins optimized to 22%', link: '/pricing', tag: 'Smart Pricing' },
  ].slice(0, 5)

  return (
    <div className={`rounded-xl p-4 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Live Activity
      </h3>
      <div className="space-y-1.5">
        {liveEvents.map((event, i) => (
          <Link key={i} to={event.link}>
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors group ${dk ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-6 h-6 rounded-lg ${event.bg} flex items-center justify-center flex-shrink-0`}>
                <event.icon className={`w-3 h-3 ${event.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-semibold ${dk ? 'text-gray-200' : 'text-gray-800'}`}>{event.action}</span>
                  <span className={`text-[8px] px-1 py-0.5 rounded font-medium ${dk ? 'bg-white/[0.04] text-gray-500' : 'bg-gray-100 text-gray-500'}`}>{event.tag}</span>
                </div>
                <p className={`text-[10px] truncate ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{event.detail}</p>
              </div>
              <span className="text-[9px] text-gray-600 flex-shrink-0">{event.time}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent activity from API */}
      {recentActivity.length > 0 && (
        <>
          <div className={`mt-3 pt-2 ${dk ? 'border-t border-[#2a2a2d]' : 'border-t border-gray-200'}`}>
            <p className={`text-[10px] font-semibold mb-2 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>Recent</p>
          </div>
          <div className="space-y-1 max-h-[100px] overflow-y-auto">
            {recentActivity.slice(0, 4).map((a: any, i: number) => (
              <div key={i} className={`flex items-center gap-2 p-1.5 rounded-lg ${dk ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  a.type === 'pricing' ? 'bg-saffron-500/10 text-saffron-400' :
                  a.type === 'content' ? 'bg-bazaar-500/10 text-bazaar-400' :
                  a.type === 'sentiment' ? 'bg-royal-500/10 text-royal-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {a.type === 'pricing' ? <IndianRupee className="w-2.5 h-2.5" /> :
                   a.type === 'content' ? <Languages className="w-2.5 h-2.5" /> :
                   a.type === 'sentiment' ? <MessageSquareText className="w-2.5 h-2.5" /> :
                   <TrendingUp className="w-2.5 h-2.5" />}
                </div>
                <p className={`text-[10px] flex-1 truncate ${dk ? 'text-gray-400' : 'text-gray-600'}`}>{a.description}</p>
                <span className="text-[9px] text-gray-600 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className={`mt-3 pt-2 flex items-center gap-1.5 ${dk ? 'border-t border-[#2a2a2d]' : 'border-t border-gray-200'}`}>
        <Database className="w-3 h-3 text-orange-500" />
        <p className="text-[9px] text-gray-500">
          <span className="text-orange-400 font-semibold">Zero manual entry.</span> Actions auto-feed analytics via AI.
        </p>
      </div>
    </div>
  )
}
