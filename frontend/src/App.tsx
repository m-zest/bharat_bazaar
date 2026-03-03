import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import PricingPage from './pages/PricingPage'
import ContentPage from './pages/ContentPage'
import SentimentPage from './pages/SentimentPage'
import SourcingPage from './pages/SourcingPage'
import ChatPage from './pages/ChatPage'
import ComparePage from './pages/ComparePage'
import InventoryPage from './pages/InventoryPage'
import CompetitorPage from './pages/CompetitorPage'
import ScannerPage from './pages/ScannerPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import TrackingPage from './pages/TrackingPage'
import ProfilePage from './pages/ProfilePage'
import NotificationsPage from './pages/NotificationsPage'
import ReportsPage from './pages/ReportsPage'
import InvoicePage from './pages/InvoicePage'
import KhataPage from './pages/KhataPage'
import Layout from './components/Layout'
import { ToastProvider } from './components/Toast'
import { LanguageProvider } from './utils/LanguageContext'
import { AuthProvider, useAuth } from './utils/AuthContext'
import { CartProvider } from './utils/CartContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/sourcing" element={<SourcingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/sentiment" element={<SentimentPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/competitors" element={<CompetitorPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/invoices" element={<InvoicePage />} />
        <Route path="/khata" element={<KhataPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  )
}
