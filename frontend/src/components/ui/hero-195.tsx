import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  IndianRupee, Languages, MessageSquareText, Package, MessageCircle,
  ClipboardList, ShoppingCart, Truck, Receipt, Eye, GitCompare, Bell,
  BarChart3, Users, BookOpen, Camera, ArrowRight, Check, Star, TrendingUp,
  Sparkles, Lock, RefreshCw, ChevronLeft, ChevronRight, Search,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card"
import { BorderBeam } from "./border-beam"

/* ─── Browser Window Mockup — Dark ─── */

const BrowserFrame = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-[#2a2a2d]"
  >
    {/* Title Bar */}
    <div className="bg-[#1a1a1d] px-4 py-2.5 flex items-center gap-3 border-b border-[#2a2a2d]">
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d4a528]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#24a938]" />
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1 ml-2">
        <div className="p-0.5 rounded hover:bg-white/5 text-gray-500">
          <ChevronLeft className="w-3.5 h-3.5" />
        </div>
        <div className="p-0.5 rounded hover:bg-white/5 text-gray-500">
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* URL Bar */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 bg-[#0c0c0d] rounded-lg px-3 py-1.5 w-full max-w-md border border-[#333] shadow-sm">
          <Lock className="w-3 h-3 text-gray-500" />
          <span className="text-[11px] text-gray-400 flex-1 text-center font-medium">
            bharatbazaar.ai/platform
          </span>
          <RefreshCw className="w-3 h-3 text-gray-500" />
        </div>
      </div>

      {/* Right side placeholder */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-white/5" />
        <div className="w-5 h-5 rounded bg-white/5" />
      </div>
    </div>

    {/* Browser Content */}
    <div className="bg-[#111113] max-h-[700px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      {children}
    </div>
  </motion.div>
)

/* ─── Mini UI Mockups — Dark ─── */

const PricingMockup = () => (
  <div className="space-y-2">
    {[
      { strategy: 'Competitive', price: '₹415', confidence: 92, change: '+18% demand', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '🎯' },
      { strategy: 'Premium', price: '₹469', confidence: 87, change: '+12% revenue', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '✨' },
      { strategy: 'Value', price: '₹389', confidence: 78, change: '+35% volume', color: 'text-teal-400', bg: 'bg-teal-500/10', icon: '🛡️' },
    ].map(s => (
      <div key={s.strategy} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-[#2a2a2d]">
        <div className="flex items-center gap-2">
          <span className="text-sm">{s.icon}</span>
          <div>
            <p className="text-[11px] font-bold text-gray-200">{s.strategy}</p>
            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.change}</span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-extrabold ${s.color}`}>{s.price}</p>
          <div className="flex items-center gap-0.5">
            <div className="h-1 rounded-full bg-white/10 w-12"><div className={`h-1 rounded-full ${s.color === 'text-blue-400' ? 'bg-blue-500' : s.color === 'text-orange-400' ? 'bg-orange-500' : 'bg-teal-500'}`} style={{ width: `${s.confidence}%` }} /></div>
            <span className="text-[8px] text-gray-500">{s.confidence}%</span>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const SourcingMockup = () => (
  <div className="space-y-2">
    {[
      { name: 'Gupta Wholesale', price: '₹285/5kg', rating: 4.8, save: 'Save ₹35', delivery: '2 days', city: 'Delhi' },
      { name: 'Mehta Distributors', price: '₹295/5kg', rating: 4.6, save: 'Save ₹25', delivery: '3 days', city: 'Mumbai' },
      { name: 'Sharma Trading', price: '₹310/5kg', rating: 4.5, save: 'Save ₹10', delivery: '1 day', city: 'Lucknow' },
    ].map(s => (
      <div key={s.name} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-[#2a2a2d]">
        <div>
          <p className="text-[11px] font-bold text-gray-200">{s.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] text-gray-500">{s.city}</span>
            <span className="text-[9px] text-gray-600">•</span>
            <span className="text-[9px] text-gray-500">{s.delivery}</span>
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[9px] text-gray-500">{s.rating}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-extrabold text-green-400">{s.price}</p>
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400">{s.save}</span>
        </div>
      </div>
    ))}
  </div>
)

const ChatMockup = () => (
  <div className="space-y-2">
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0"><span className="text-[10px]">🧮</span></div>
      <div className="bg-white/[0.03] rounded-lg rounded-tl-none p-2 max-w-[85%] border border-[#2a2a2d]">
        <p className="text-[10px] text-gray-300">Namaste! Main Munim-ji hoon. Aapka digital munshi. Kya madad chahiye — pricing, inventory, ya kuch aur?</p>
      </div>
    </div>
    <div className="flex gap-2 justify-end">
      <div className="bg-orange-500 rounded-lg rounded-tr-none p-2 max-w-[80%]">
        <p className="text-[10px] text-white">Aaj atta ka price kya rakhna chahiye?</p>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0"><span className="text-[10px]">🧮</span></div>
      <div className="bg-white/[0.03] rounded-lg rounded-tl-none p-2 max-w-[85%] border border-[#2a2a2d]">
        <p className="text-[10px] text-gray-300">Market analysis ke hisaab se: <span className="font-bold text-orange-400">₹52/kg</span> rakhiye. Competitor price ₹55 hai, toh competitive advantage milega aur volume 20% badhega.</p>
      </div>
    </div>
  </div>
)

const DashboardMockup = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: 'Revenue', value: '₹4.2L', change: '+12%', up: true },
        { label: 'Orders', value: '847', change: '+8%', up: true },
        { label: 'Customers', value: '2.3K', change: '+15%', up: true },
      ].map(s => (
        <div key={s.label} className="bg-white/[0.03] rounded-lg p-2 border border-[#2a2a2d] text-center">
          <p className="text-[9px] text-gray-500">{s.label}</p>
          <p className="text-sm font-extrabold text-gray-200">{s.value}</p>
          <span className="text-[9px] font-medium text-green-400">{s.change}</span>
        </div>
      ))}
    </div>
    <div className="bg-white/[0.03] rounded-lg p-2 border border-[#2a2a2d]">
      <p className="text-[9px] font-bold text-gray-400 mb-1.5">Revenue Trend</p>
      <div className="flex items-end gap-1 h-10">
        {[35, 42, 38, 55, 48, 62, 70].map((h, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => (
          <span key={m} className="text-[7px] text-gray-600 flex-1 text-center">{m}</span>
        ))}
      </div>
    </div>
  </div>
)

const TrackingMockup = () => (
  <div className="space-y-1">
    {[
      { step: 'Order Placed', time: '10:30 AM', done: true },
      { step: 'Processing', time: '11:15 AM', done: true },
      { step: 'Picked Up', time: '2:00 PM', done: true },
      { step: 'In Transit', time: '4:30 PM', done: true, current: true },
      { step: 'Out for Delivery', time: 'Expected 6 PM', done: false },
      { step: 'Delivered', time: '--', done: false },
    ].map((s, i) => (
      <div key={s.step} className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full flex items-center justify-center ${s.current ? 'bg-orange-500 ring-2 ring-orange-500/30' : s.done ? 'bg-green-500' : 'bg-[#333]'}`}>
            {s.done && !s.current && <Check className="w-2 h-2 text-white" />}
            {s.current && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
          </div>
          {i < 5 && <div className={`w-0.5 h-3 ${s.done ? 'bg-green-500/40' : 'bg-[#333]'}`} />}
        </div>
        <div className="flex-1 flex items-center justify-between">
          <p className={`text-[10px] ${s.current ? 'font-bold text-orange-400' : s.done ? 'text-gray-300' : 'text-gray-600'}`}>{s.step}</p>
          <span className="text-[8px] text-gray-600">{s.time}</span>
        </div>
      </div>
    ))}
  </div>
)

const InvoiceMockup = () => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-gray-200">GST Invoice #BB-2024-001</p>
        <p className="text-[8px] text-gray-500">GSTIN: 09AABCU9603R1ZM</p>
      </div>
      <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">Verified</span>
    </div>
    <div className="border border-[#2a2a2d] rounded-md overflow-hidden">
      <table className="w-full text-[8px]">
        <thead><tr className="bg-white/[0.03]">
          <th className="text-left p-1.5 font-medium text-gray-500">Item</th>
          <th className="text-right p-1.5 font-medium text-gray-500">Qty</th>
          <th className="text-right p-1.5 font-medium text-gray-500">Rate</th>
          <th className="text-right p-1.5 font-medium text-gray-500">GST</th>
          <th className="text-right p-1.5 font-medium text-gray-500">Total</th>
        </tr></thead>
        <tbody>
          {[
            { item: 'Basmati Rice 5kg', qty: 10, rate: 285, gst: 5, total: 2993 },
            { item: 'Toor Dal 1kg', qty: 20, rate: 120, gst: 5, total: 2520 },
            { item: 'Mustard Oil 1L', qty: 15, rate: 165, gst: 5, total: 2599 },
          ].map(r => (
            <tr key={r.item} className="border-t border-[#2a2a2d]">
              <td className="p-1.5 text-gray-300">{r.item}</td>
              <td className="p-1.5 text-right text-gray-300">{r.qty}</td>
              <td className="p-1.5 text-right text-gray-300">₹{r.rate}</td>
              <td className="p-1.5 text-right text-gray-500">{r.gst}%</td>
              <td className="p-1.5 text-right font-bold text-gray-200">₹{r.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-end">
      <div className="text-right">
        <p className="text-[9px] text-gray-500">CGST + SGST: <span className="font-medium text-gray-300">₹405</span></p>
        <p className="text-[11px] font-extrabold text-gray-200">Grand Total: ₹8,517</p>
      </div>
    </div>
  </div>
)

const KhataMockup = () => (
  <div className="space-y-2">
    <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20">
      <div>
        <p className="text-[11px] font-bold text-gray-200">Rajesh Kumar</p>
        <p className="text-[9px] text-gray-500">Last txn: 2 days ago</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-extrabold text-red-400">₹12,500</p>
        <span className="text-[8px] text-red-400/70">Outstanding</span>
      </div>
    </div>
    <div className="space-y-1">
      {[
        { desc: 'Grocery purchase', amount: '₹5,000', type: 'credit', date: '28 Feb' },
        { desc: 'Payment received', amount: '₹3,000', type: 'payment', date: '25 Feb' },
        { desc: 'Grocery purchase', amount: '₹8,500', type: 'credit', date: '20 Feb' },
      ].map((t, i) => (
        <div key={i} className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${t.type === 'credit' ? 'bg-red-400' : 'bg-green-400'}`} />
            <div>
              <p className="text-[9px] text-gray-300">{t.desc}</p>
              <p className="text-[8px] text-gray-600">{t.date}</p>
            </div>
          </div>
          <p className={`text-[10px] font-bold ${t.type === 'credit' ? 'text-red-400' : 'text-green-400'}`}>
            {t.type === 'credit' ? '-' : '+'}{t.amount}
          </p>
        </div>
      ))}
    </div>
  </div>
)

const ContentMockup = () => (
  <div className="space-y-2">
    {[
      { lang: '🇬🇧 English', text: 'Premium aged Basmati rice, sourced directly from Punjab fields. Perfect grain length, rich aroma.', score: 95 },
      { lang: '🇮🇳 Hindi', text: 'प्रीमियम बासमती चावल, पंजाब के खेतों से सीधे। बेहतरीन दाने, भरपूर खुशबू।', score: 90 },
      { lang: '🇮🇳 Tamil', text: 'பிரீமியம் பாஸ்மதி அரிசி, பஞ்சாப் வயல்களிலிருந்து நேரடியாக.', score: 88 },
    ].map(l => (
      <div key={l.lang} className="p-2 rounded-lg bg-white/[0.03] border border-[#2a2a2d]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-gray-200">{l.lang}</span>
          <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400">{l.score}% quality</span>
        </div>
        <p className="text-[9px] text-gray-400 leading-relaxed">{l.text}</p>
      </div>
    ))}
  </div>
)

const SentimentMockup = () => (
  <div className="space-y-2">
    {[
      { review: '"Saman bahut accha hai, delivery bhi fast thi!"', sentiment: 'Positive', score: 94, lang: 'Hinglish' },
      { review: '"Packaging thik thi but price zyada hai."', sentiment: 'Mixed', score: 62, lang: 'Hinglish' },
      { review: '"Best rice in this price range. Will order again."', sentiment: 'Positive', score: 97, lang: 'English' },
    ].map((r, i) => (
      <div key={i} className="p-2 rounded-lg bg-white/[0.03] border border-[#2a2a2d]">
        <p className="text-[9px] text-gray-400 italic mb-1">{r.review}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${r.sentiment === 'Positive' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{r.sentiment}</span>
            <span className="text-[8px] text-gray-500">{r.lang}</span>
          </div>
          <span className="text-[9px] font-bold text-gray-300">{r.score}%</span>
        </div>
      </div>
    ))}
  </div>
)

/* ─── Feature Data ─── */

interface Feature {
  icon: React.ElementType
  title: string
  description: string
  route: string
  mockup: React.ReactNode
  badge?: string
}

const AI_FEATURES: Feature[] = [
  { icon: IndianRupee, title: 'AI Smart Pricing', description: '3 strategies per product with confidence scores, competitor analysis & demand forecasting', route: '/pricing', mockup: <PricingMockup />, badge: 'Bedrock' },
  { icon: MessageCircle, title: 'Munim-ji AI Chat', description: 'Hinglish business advisor with full context — pricing, inventory & market insights', route: '/chat', mockup: <ChatMockup />, badge: 'Claude 3' },
  { icon: Languages, title: 'AI Content Generator', description: '6 Indian languages with cultural adaptation, SEO optimization & transliteration', route: '/content', mockup: <ContentMockup />, badge: '6 Languages' },
  { icon: MessageSquareText, title: 'Sentiment Analysis', description: 'Hinglish review analysis with sarcasm detection, aspect extraction & emotion mapping', route: '/sentiment', mockup: <SentimentMockup />, badge: 'NLP' },
]

const COMMERCE_FEATURES: Feature[] = [
  { icon: Package, title: 'Smart Sourcing', description: '130+ wholesale products from 40+ verified suppliers across 10 Indian cities', route: '/sourcing', mockup: <SourcingMockup />, badge: '10 Cities' },
  { icon: ShoppingCart, title: 'Cart & Checkout', description: 'Full e-commerce flow with COD, UPI & 30-day credit payment options', route: '/cart', mockup: <TrackingMockup />, badge: 'Full Flow' },
  { icon: Truck, title: 'Delivery Tracking', description: '6-step live shipment timeline with delivery agent info & ETA', route: '/tracking', mockup: <TrackingMockup />, badge: 'Real-time' },
  { icon: Receipt, title: 'Order History', description: 'Complete order management with status filters, reorder & invoice download', route: '/orders', mockup: <InvoiceMockup />, badge: 'Manage' },
]

const STORE_FEATURES: Feature[] = [
  { icon: ClipboardList, title: 'Inventory Manager', description: 'DynamoDB-backed real-time stock management with low-stock alerts', route: '/inventory', mockup: <DashboardMockup />, badge: 'DynamoDB' },
  { icon: Receipt, title: 'GST Invoice Generator', description: 'Auto-generate GST-compliant invoices with HSN codes, CGST/SGST split', route: '/invoices', mockup: <InvoiceMockup />, badge: 'GST Ready' },
  { icon: BookOpen, title: 'Customer Khata', description: 'Digital credit ledger for regular customers with transaction history & reminders', route: '/khata', mockup: <KhataMockup />, badge: 'Udhar' },
  { icon: Camera, title: 'Bill Scanner (OCR)', description: 'Claude Vision-powered invoice scanning — snap a photo, extract all data', route: '/scanner', mockup: <ContentMockup />, badge: 'Vision AI' },
]

const ANALYTICS_FEATURES: Feature[] = [
  { icon: BarChart3, title: 'AI Dashboard', description: 'Real-time business command center with revenue charts, KPIs & AI insights', route: '/dashboard', mockup: <DashboardMockup />, badge: 'Live' },
  { icon: TrendingUp, title: 'Business Reports', description: 'Revenue trends, category analysis, daily sales & top-selling products', route: '/reports', mockup: <DashboardMockup />, badge: 'Charts' },
  { icon: Eye, title: 'Competitor Monitor', description: 'Track Amazon, Flipkart, JioMart prices — real-time market intelligence', route: '/competitors', mockup: <PricingMockup />, badge: 'Market Intel' },
  { icon: GitCompare, title: 'Product Compare', description: 'Side-by-side AI analysis of margins, demand trends & supplier options', route: '/compare', mockup: <SourcingMockup />, badge: 'AI Analysis' },
]

/* ─── Feature Card Component — Dark ─── */

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Card
        className="group relative overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 bg-[#1a1a1d] border-[#2a2a2d]"
        onClick={() => navigate('/login')}
      >
        <BorderBeam size={180} duration={12} colorFrom="#F97316" colorTo="#F59E0B" delay={index * 3} />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
              <feature.icon className="w-5 h-5 text-orange-400" />
            </div>
            {feature.badge && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {feature.badge}
              </span>
            )}
          </div>
          <CardTitle className="text-base font-extrabold text-gray-200 group-hover:text-orange-400 transition-colors">
            {feature.title}
          </CardTitle>
          <CardDescription className="text-[11px] text-gray-500 leading-relaxed">
            {feature.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-[#2a2a2d] bg-[#111113] p-3">
            {feature.mockup}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Try it live <ArrowRight className="w-3 h-3" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ─── Main Hero195 Component — Dark ─── */

export function Hero195() {
  const navigate = useNavigate()

  const TABS = [
    { id: 'ai', label: 'AI Tools', icon: Sparkles, features: AI_FEATURES },
    { id: 'commerce', label: 'Commerce', icon: ShoppingCart, features: COMMERCE_FEATURES },
    { id: 'store', label: 'Store Mgmt', icon: ClipboardList, features: STORE_FEATURES },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, features: ANALYTICS_FEATURES },
  ]

  return (
    <section id="platform" className="py-24 px-6 lg:px-8 bg-[#0c0c0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">
            Complete Platform — 18 Features
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">
            See Every Feature in Action
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Explore real UI previews — AI pricing, chat, invoices, tracking & more.
            Login as <span className="font-bold text-gray-200">admin / admin</span> to try everything live.
          </p>
        </motion.div>

        {/* Tabbed Feature Showcase inside Browser Frame */}
        <BrowserFrame>
          <div className="px-6 py-8 lg:px-10">
            <Tabs defaultValue="ai" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/5 p-1 rounded-full h-auto flex-wrap gap-1 border border-[#2a2a2d]">
                  {TABS.map(tab => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-400 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all flex items-center gap-2"
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {TABS.map(tab => (
                <TabsContent key={tab.id} value={tab.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
                  >
                    {tab.features.map((feature, i) => (
                      <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Stats row inside browser */}
            <div className="mt-8 pt-6 border-t border-[#2a2a2d] flex items-center gap-8 flex-wrap justify-center">
              {[
                { value: '18', label: 'Features' },
                { value: '7', label: 'AI Models' },
                { value: '14', label: 'API Endpoints' },
                { value: '6', label: 'Languages' },
                { value: '10', label: 'Cities' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-extrabold text-gray-200">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </BrowserFrame>

        {/* CTA below browser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2.5 bg-orange-500 text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Try All 18 Features — Login as admin/admin
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero195
