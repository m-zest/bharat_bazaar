import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, IndianRupee, Languages, MessageSquareText,
  Store, Package, MessageCircle, GitCompare, Eye, ClipboardList,
  Menu, X, ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
  { path: '/sourcing', label: 'Smart Sourcing', labelHi: 'स्मार्ट सोर्सिंग', icon: Package },
  { path: '/pricing', label: 'Smart Pricing', labelHi: 'स्मार्ट प्राइसिंग', icon: IndianRupee },
  { path: '/chat', label: 'AI Advisor', labelHi: 'AI सलाहकार', icon: MessageCircle },
  { path: '/inventory', label: 'Inventory', labelHi: 'इन्वेंटरी', icon: ClipboardList },
  { path: '/competitors', label: 'Competitors', labelHi: 'प्रतिस्पर्धी', icon: Eye },
  { path: '/compare', label: 'Compare', labelHi: 'तुलना करें', icon: GitCompare },
  { path: '/content', label: 'Content Generator', labelHi: 'कंटेंट जेनरेटर', icon: Languages },
  { path: '/sentiment', label: 'Sentiment Analyzer', labelHi: 'सेंटिमेंट', icon: MessageSquareText },
]

// Bottom nav for mobile — show most-used 5
const mobileNav = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/sourcing', label: 'Source', icon: Package },
  { path: '/pricing', label: 'Price', icon: IndianRupee },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/inventory', label: 'Stock', icon: ClipboardList },
]

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-gradient-to-b from-[#1E1B4B] via-[#1E1B4B] to-[#312e81] text-white">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-lg shadow-saffron-500/30 group-hover:shadow-saffron-500/50 transition-all">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight bg-gradient-to-r from-saffron-300 to-saffron-500 bg-clip-text text-transparent">BharatBazaar</h1>
              <p className="text-[10px] text-white/40 font-medium tracking-wider uppercase">AI Market Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                    : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-saffron-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-saffron-300' : 'text-white/40 group-hover:text-white/70'}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">{item.label}</span>
                  <span className="text-[9px] text-white/30 font-hindi">{item.labelHi}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-saffron-400/60" />}
              </Link>
            )
          })}
        </nav>

        {/* Business Info */}
        <div className="p-3">
          <div className="bg-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-[10px] font-medium text-green-300 uppercase tracking-wider">Active</p>
            </div>
            <p className="text-sm font-semibold text-white">Sharma Kirana Store</p>
            <p className="text-xs text-white/40 mt-0.5">Lucknow, Uttar Pradesh</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1E1B4B]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">BharatBazaar</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-[#1E1B4B] pt-16 p-4"
              onClick={e => e.stopPropagation()}
            >
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-saffron-300' : 'text-white/40'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-14 pb-16 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 px-2 py-1">
        <div className="flex items-center justify-around">
          {mobileNav.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative ${
                  isActive ? 'text-saffron-600' : 'text-gray-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab"
                    className="absolute -top-1 w-8 h-0.5 rounded-full bg-saffron-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-saffron-500' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
