import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
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
import Layout from './components/Layout'
import { ToastProvider } from './components/Toast'
import { LanguageProvider } from './utils/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
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
          </Route>
        </Routes>
      </ToastProvider>
    </LanguageProvider>
  )
}
