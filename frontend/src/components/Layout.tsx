import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, IndianRupee, Languages, MessageSquareText,
  Package, MessageCircle, GitCompare, Eye, ClipboardList,
  Menu, X, ChevronRight, Camera, ShoppingCart, Truck,
  Bell, BarChart3, User, LogOut, Store, MapPin,
} from 'lucide-react'
import { SidebarLogo, NavbarLogo } from './TarazuLogo'
import { useState, useEffect } from 'react'
import { useAuth } from '../utils/AuthContext'
import { useCart } from '../utils/CartContext'

const navSections = [
  {
    title: 'Main',
    items: [
      { path: '/dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
      { path: '/scanner', label: 'Bill Scanner', labelHi: 'बिल स्कैनर', icon: Camera },
      { path: '/sourcing', label: 'Smart Sourcing', labelHi: 'स्मार्ट सोर्सिंग', icon: Package },
      { path: '/pricing', label: 'Smart Pricing', labelHi: 'स्मार्ट प्राइसिंग', icon: IndianRupee },
      { path: '/chat', label: 'Munim-ji AI', labelHi: 'मुनीम-जी AI', icon: MessageCircle },
    ],
  },
  {
    title: 'Store Management',
    items: [
      { path: '/inventory', label: 'Inventory', labelHi: 'इन्वेंटरी', icon: ClipboardList },
      { path: '/orders', label: 'Order History', labelHi: 'ऑर्डर हिस्ट्री', icon: ShoppingCart },
      { path: '/tracking', label: 'Delivery Tracking', labelHi: 'डिलीवरी ट्रैकिंग', icon: Truck },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { path: '/competitors', label: 'Competitors', labelHi: 'प्रतिस्पर्धी', icon: Eye },
      { path: '/compare', label: 'Compare', labelHi: 'तुलना करें', icon: GitCompare },
      { path: '/content', label: 'Content Generator', labelHi: 'कंटेंट जेनरेटर', icon: Languages },
      { path: '/sentiment', label: 'Sentiment Analyzer', labelHi: 'सेंटिमेंट', icon: MessageSquareText },
    ],
  },
  {
    title: 'Analytics',
    items: [
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
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems } = useCart()

  useEffect(() => {
    document.title = pageTitles[location.pathname] || 'BharatBazaar AI — Weighed by Intelligence'
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar — Light Theme */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="block group">
            <SidebarLogo mode="light" className="group-hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        {/* Nav Items — Sectioned */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="mb-3">
              <p className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
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
                          ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500 pl-3'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm block truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                        <span className="text-[9px] text-slate-400 font-hindi">{item.labelHi}</span>
                      </div>
                      {item.path === '/notifications' && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">4</span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-orange-400" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-slate-100">
          {/* Cart Badge */}
          {totalItems > 0 && (
            <Link
              to="/cart"
              className="flex items-center gap-3 px-4 py-2.5 mb-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium flex-1">Cart</span>
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">{totalItems}</span>
            </Link>
          )}

          {/* User Info */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold hover:bg-orange-600 transition-colors"
              >
                {user?.avatar || 'RS'}
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Rajesh Sharma'}</p>
                <p className="text-[10px] text-slate-400">{user?.role || 'Store Owner'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-200/50">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-[10px] text-slate-400">
                <span className="font-medium text-slate-600">{user?.store || 'Sharma Kirana Store'}</span> &middot; {user?.city || 'Lucknow'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header — Light */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="block">
          <NavbarLogo mode="light" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
          )}
          <Link to="/notifications" className="relative p-2">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              4
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"
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
            className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-white pt-16 p-4 shadow-xl overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* User Card */}
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl mb-4 border border-orange-100">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {user?.avatar || 'RS'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Rajesh Sharma'}</p>
                  <p className="text-xs text-slate-500">{user?.store || 'Sharma Kirana Store'}</p>
                </div>
              </div>

              <nav>
                {navSections.map(section => (
                  <div key={section.title} className="mb-3">
                    <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{section.title}</p>
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-h-[44px] ${
                            isActive
                              ? 'bg-orange-50 text-orange-600'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                          <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </nav>

              {/* Mobile Links */}
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50"
                >
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium">Store Profile</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full"
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
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-14 pb-16 lg:pb-0 bg-slate-50">
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-1 safe-area-bottom">
        <div className="flex items-center justify-around">
          {mobileNav.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative min-h-[44px] justify-center ${
                  isActive ? 'text-orange-600' : 'text-slate-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab"
                    className="absolute -top-1 w-8 h-0.5 rounded-full bg-orange-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
