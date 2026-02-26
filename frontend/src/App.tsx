import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import PricingPage from './pages/PricingPage'
import ContentPage from './pages/ContentPage'
import SentimentPage from './pages/SentimentPage'
import SourcingPage from './pages/SourcingPage'
import ChatPage from './pages/ChatPage'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sourcing" element={<SourcingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/sentiment" element={<SentimentPage />} />
      </Route>
    </Routes>
  )
}
