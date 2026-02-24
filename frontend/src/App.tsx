import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import PricingPage from './pages/PricingPage'
import ContentPage from './pages/ContentPage'
import SentimentPage from './pages/SentimentPage'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/sentiment" element={<SentimentPage />} />
      </Route>
    </Routes>
  )
}
