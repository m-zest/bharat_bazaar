import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, IndianRupee, Languages, MessageSquareText, Store, ArrowLeft } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
  { path: '/pricing', label: 'Smart Pricing', labelHi: 'स्मार्ट प्राइसिंग', icon: IndianRupee },
  { path: '/content', label: 'Content Generator', labelHi: 'कंटेंट जेनरेटर', icon: Languages },
  { path: '/sentiment', label: 'Sentiment Analyzer', labelHi: 'सेंटिमेंट एनालाइज़र', icon: MessageSquareText },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight gradient-text">BharatBazaar</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">AI Market Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-saffron-50 text-saffron-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-saffron-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                <div>
                  <span className="text-sm font-medium block">{item.label}</span>
                  <span className="text-[10px] text-gray-400 font-hindi">{item.labelHi}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Business Info */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-bazaar-50 rounded-xl p-4">
            <p className="text-xs font-medium text-bazaar-700">Demo Mode</p>
            <p className="text-sm font-semibold text-bazaar-800 mt-1">Sharma Kirana Store</p>
            <p className="text-xs text-bazaar-600 mt-0.5">Lucknow, UP</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
