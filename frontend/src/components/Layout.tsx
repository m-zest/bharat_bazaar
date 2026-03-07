import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, IndianRupee, Languages, MessageSquareText,
  Package, MessageCircle, GitCompare, Eye, ClipboardList,
  Menu, X, ChevronRight, Camera, ShoppingCart, Truck,
  Bell, BarChart3, User, LogOut, Store, MapPin, Receipt, BookOpen,
  Sun, Moon, Brain, Briefcase, ScanLine,
} from 'lucide-react'
import { SidebarLogo, NavbarLogo } from './TarazuLogo'
import { useState, useEffect } from 'react'
import { useAuth } from '../utils/AuthContext'
import { useCart } from '../utils/CartContext'
import { useTheme } from '../utils/ThemeContext'

const navSections = [
  {
    title: 'Dashboard',
    items: [
      { path: '/dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
    ],
  },
  {
    title: 'AI Assistant',
    items: [
      { path: '/chat', label: 'Munim-ji AI', labelHi: 'मुनीम-जी AI', icon: MessageCircle },
      { path: '/content', label: 'Content Generator', labelHi: 'कंटेंट जेनरेटर', icon: Languages },
      { path: '/sentiment', label: 'Sentiment Analyzer', labelHi: 'सेंटिमेंट', icon: MessageSquareText },
    ],
  },
  {
    title: 'Store',
    items: [
      { path: '/inventory', label: 'Inventory', labelHi: 'इन्वेंटरी', icon: ClipboardList },
      { path: '/orders', label: 'Orders', labelHi: 'ऑर्डर', icon: ShoppingCart },
      { path: '/tracking', label: 'Delivery', labelHi: 'डिलीवरी ट्रैकिंग', icon: Truck },
    ],
  },
  {
    title: 'Pricing AI',
    items: [
      { path: '/pricing', label: 'Smart Pricing', labelHi: 'स्मार्ट प्राइसिंग', icon: IndianRupee },
      { path: '/competitors', label: 'Competitor Monitor', labelHi: 'प्रतिस्पर्धी', icon: Eye },
      { path: '/compare', label: 'Price Compare', labelHi: 'तुलना करें', icon: GitCompare },
    ],
  },
  {
    title: 'Operations',
    items: [
      { path: '/scanner', label: 'Bill Scanner', labelHi: 'बिल स्कैनर', icon: ScanLine },
      { path: '/sourcing', label: 'Smart Sourcing', labelHi: 'स्मार्ट सोर्सिंग', icon: Package },
    ],
  },
  {
    title: 'Business & Finance',
    items: [
      { path: '/invoices', label: 'GST Invoices', labelHi: 'GST बिल', icon: Receipt },
      { path: '/khata', label: 'Khata Book', labelHi: 'ग्राहक खाता', icon: BookOpen },
      { path: '/reports', label: 'Reports', labelHi: 'रिपोर्ट्स', icon: BarChart3 },
      { path: '/notifications', label: 'Notifications', labelHi: 'नोटिफिकेशन', icon: Bell },
    ],
  },
]

// Flat list for page title lookup and mobile nav
const allNavItems = navSections.flatMap(s => s.items)

const mobileNav = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/pricing', label: 'Price', icon: IndianRupee },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/inventory', label: 'Stock', icon: ClipboardList },
]

// Page title mapping
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard — BharatBazaar AI',
  '/scanner': 'Khata Scanner — BharatBazaar AI',
  '/pricing': 'AI Pricing — BharatBazaar AI',
  '/chat': 'Munim-ji AI Advisor — BharatBazaar AI',
  '/content': 'Content Generator — BharatBazaar AI',
  '/sentiment': 'Sentiment Analyzer — BharatBazaar AI',
  '/sourcing': 'Smart Sourcing — BharatBazaar AI',
  '/inventory': 'Inventory — BharatBazaar AI',
  '/competitors': 'Competitor Monitor — BharatBazaar AI',
  '/compare': 'Product Compare — BharatBazaar AI',
  '/orders': 'Order History — BharatBazaar AI',
  '/tracking': 'Delivery Tracking — BharatBazaar AI',
  '/cart': 'Shopping Cart — BharatBazaar AI',
  '/checkout': 'Checkout — BharatBazaar AI',
  '/profile': 'Store Profile — BharatBazaar AI',
  '/notifications': 'Notifications — BharatBazaar AI',
  '/reports': 'Business Reports — BharatBazaar AI',
  '/invoices': 'GST Invoices — BharatBazaar AI',
  '/khata': 'Customer Khata — BharatBazaar AI',
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const { theme, toggleTheme } = useTheme()
  const dk = theme === 'dark'

  useEffect(() => {
    document.title = pageTitles[location.pathname] || 'BharatBazaar AI — Weighed by Intelligence'
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`flex h-screen overflow-hidden ${dk ? 'bg-[#0c0c0d]' : 'bg-[#f5f5f4]'}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex w-72 flex-col ${dk ? 'bg-[#141416] border-r border-[#222]' : 'bg-white border-r border-gray-200'}`}>
        {/* Logo + Theme Toggle */}
        <div className={`p-6 ${dk ? 'border-b border-[#222]' : 'border-b border-gray-200'} flex items-center justify-between`}>
          <Link to="/" className="block group">
            <SidebarLogo mode={theme === 'dark' ? 'dark' : 'light'} className="group-hover:opacity-80 transition-opacity" />
          </Link>
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dk ? 'text-gray-400 hover:text-orange-400 hover:bg-white/[0.06]' : 'text-gray-500 hover:text-orange-500 hover:bg-black/[0.06]'}`}
            title={dk ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dk ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Items — Sectioned */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="mb-3">
              <p className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500 pl-3'
                          : dk ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200' : 'text-gray-600 hover:bg-black/[0.04] hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-orange-400' : dk ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm block truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                        <span className={`text-[9px] font-hindi ${dk ? 'text-gray-600' : 'text-gray-400'}`}>{item.labelHi}</span>
                      </div>
                      {item.path === '/notifications' && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">4</span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-orange-400/60" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className={`p-3 ${dk ? 'border-t border-[#222]' : 'border-t border-gray-200'}`}>
          {/* Cart Badge */}
          {totalItems > 0 && (
            <Link
              to="/cart"
              className="flex items-center gap-3 px-4 py-2.5 mb-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 hover:bg-orange-500/15 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium flex-1">Cart</span>
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">{totalItems}</span>
            </Link>
          )}

          {/* User Info */}
          <div className={`rounded-xl p-3 border ${dk ? 'bg-[#1a1a1d] border-[#2a2a2d]' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold hover:bg-orange-600 transition-colors"
              >
                {user?.avatar || 'RS'}
              </Link>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${dk ? 'text-gray-200' : 'text-gray-800'}`}>{user?.name || 'Rajesh Sharma'}</p>
                <p className={`text-[10px] ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{user?.role || 'Store Owner'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <div className={`flex items-center gap-1.5 mt-2 pt-2 ${dk ? 'border-t border-[#2a2a2d]' : 'border-t border-gray-200'}`}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className={`text-[10px] ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
                <span className={`font-medium ${dk ? 'text-gray-400' : 'text-gray-600'}`}>{user?.store || 'Sharma Kirana Store'}</span> &middot; {user?.city || 'Lucknow'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 backdrop-blur-xl px-4 py-3 flex items-center justify-between ${dk ? 'bg-[#141416]/90 border-b border-[#222]' : 'bg-white/90 border-b border-gray-200'}`}>
        <Link to="/" className="block">
          <NavbarLogo mode={theme === 'dark' ? 'dark' : 'light'} className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${dk ? 'bg-white/5 text-gray-300' : 'bg-black/[0.04] text-gray-600'}`}
          >
            {dk ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {totalItems > 0 && (
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className={`w-5 h-5 ${dk ? 'text-gray-300' : 'text-gray-600'}`} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
          )}
          <Link to="/notifications" className="relative p-2">
            <Bell className={`w-5 h-5 ${dk ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              4
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${dk ? 'bg-white/5 text-gray-300' : 'bg-black/[0.04] text-gray-600'}`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-72 h-full pt-16 p-4 shadow-xl overflow-y-auto ${dk ? 'bg-[#141416] border-r border-[#222]' : 'bg-white border-r border-gray-200'}`}
              onClick={e => e.stopPropagation()}
            >
              {/* User Card */}
              <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-xl mb-4 border border-orange-500/20">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {user?.avatar || 'RS'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${dk ? 'text-gray-200' : 'text-gray-800'}`}>{user?.name || 'Rajesh Sharma'}</p>
                  <p className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{user?.store || 'Sharma Kirana Store'}</p>
                </div>
              </div>

              <nav>
                {navSections.map(section => (
                  <div key={section.title} className="mb-3">
                    <p className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{section.title}</p>
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-h-[44px] ${
                            isActive
                              ? 'bg-orange-500/10 text-orange-400'
                              : dk ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200' : 'text-gray-600 hover:bg-black/[0.04] hover:text-gray-900'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : dk ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </nav>

              {/* Mobile Links */}
              <div className={`mt-3 pt-3 space-y-1 ${dk ? 'border-t border-[#222]' : 'border-t border-gray-200'}`}>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${dk ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-black/[0.04]'}`}
                >
                  <User className={`w-5 h-5 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">Store Profile</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto lg:pt-0 pt-14 pb-16 lg:pb-0 ${dk ? 'bg-[#0c0c0d]' : 'bg-[#f5f5f4]'}`}>
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
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl px-2 py-1 safe-area-bottom ${dk ? 'bg-[#141416]/95 border-t border-[#222]' : 'bg-white/95 border-t border-gray-200'}`}>
        <div className="flex items-center justify-around">
          {mobileNav.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative min-h-[44px] justify-center ${
                  isActive ? 'text-orange-400' : dk ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab"
                    className="absolute -top-1 w-8 h-0.5 rounded-full bg-orange-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
