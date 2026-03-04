import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, Copy, Check, RotateCcw, Zap, ChevronDown, ChevronUp, Search, Share2, Eye, Smartphone, ShoppingBag, Globe, MessageCircle, Hash } from 'lucide-react'
import { api } from '../utils/api'
import { ScrollReveal } from '../components/AnimatedComponents'
import DemoModeBadge from '../components/DemoModeBadge'
import { useToast } from '../components/Toast'

const DEMO_PRODUCTS = [
  {
    name: 'Premium Basmati Rice 5kg',
    category: 'Groceries',
    features: ['Aged 2 years', 'Extra-long grain', 'Aromatic', 'Pesticide-free', 'From Dehradun valley'],
    specifications: { weight: '5kg', grain_length: '8.4mm', aging: '2 years', origin: 'Dehradun, Uttarakhand' },
  },
  {
    name: 'Handloom Cotton Kurta - Men',
    category: 'Fashion',
    features: ['Pure cotton handloom', 'Chikankari embroidery', 'Comfortable fit', 'Machine washable', 'Available in 5 colors'],
    specifications: { fabric: '100% Cotton', type: 'Chikankari', sizes: 'S, M, L, XL, XXL', origin: 'Lucknow' },
  },
  {
    name: 'Organic Turmeric Powder 500g',
    category: 'Groceries',
    features: ['Organic certified', 'High curcumin 7.5%', 'Lakadong variety', 'Lab tested', 'No artificial color'],
    specifications: { weight: '500g', curcumin: '7.5%', type: 'Lakadong', origin: 'Meghalaya' },
  },
  {
    name: 'Ghee (Pure Desi) 1L',
    category: 'Groceries',
    features: ['A2 cow milk', 'Bilona method', 'Rich aroma', 'No preservatives', 'Grass-fed cows'],
    specifications: { volume: '1 litre', type: 'A2 Bilona', fat: '99.7%', origin: 'Gujarat' },
  },
  {
    name: 'Neem Wood Comb Set',
    category: 'Home & Kitchen',
    features: ['100% Neem wood', 'Anti-dandruff', 'Anti-static', 'Eco-friendly', 'Set of 3 sizes'],
    specifications: { material: 'Neem Wood', pieces: '3', type: 'Wide + Fine + Pocket', origin: 'Rajasthan' },
  },
]

const LANGUAGES = [
  { code: 'en', name: 'English', nameNative: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nameNative: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nameNative: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nameNative: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nameNative: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nameNative: 'मराठी', flag: '🇮🇳' },
]

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', badge: 'IG', color: 'from-pink-500 to-purple-500' },
  { id: 'amazon', name: 'Amazon', badge: 'AMZ', color: 'from-orange-400 to-yellow-500' },
  { id: 'flipkart', name: 'Flipkart', badge: 'FK', color: 'from-blue-400 to-blue-600' },
  { id: 'website', name: 'Website/SEO', badge: 'WEB', color: 'from-teal-400 to-green-500' },
  { id: 'whatsapp', name: 'WhatsApp Catalog', badge: 'WA', color: 'from-green-400 to-green-600' },
  { id: 'jiomart', name: 'JioMart', badge: 'JM', color: 'from-blue-600 to-indigo-600' },
]

const PLATFORM_TIPS: Record<string, string> = {
  instagram: 'Best: 125 chars visible, use 20-30 hashtags, emoji-friendly',
  amazon: 'Best: 200 char title, 5 bullet points, 2000 char description',
  flipkart: 'Best: Short title, 6 highlights, detailed description',
  website: 'Best: 60 char meta title, 160 char meta desc, keyword-rich',
  whatsapp: 'Best: Short, emoji-rich, price prominent, CTA clear',
  jiomart: 'Best: Clear title, weight/size in title, regional appeal',
}

/* ── Platform Preview Components ── */

function InstagramPreview({ desc }: { desc: any }) {
  const caption = desc.description || ''
  const truncated = caption.length > 125 ? caption.slice(0, 125) : caption
  const hashtags = desc.localSearchTerms?.map((t: string) => `#${t.replace(/\s+/g, '')}`) || []

  return (
    <div className="flex justify-center">
      <div className="w-[320px] bg-black rounded-[2rem] border-4 border-gray-700 p-2 shadow-xl">
        <div className="bg-[#121212] rounded-[1.5rem] overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 text-[10px] text-gray-400">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-600 rounded-sm" />
              <div className="w-3 h-3 bg-gray-600 rounded-sm" />
            </div>
          </div>
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
            <span className="text-xs font-semibold text-white">your_brand</span>
          </div>
          {/* Image placeholder */}
          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-600" />
          </div>
          {/* Action row */}
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="text-lg">♡</span>
            <MessageCircle className="w-5 h-5 text-white" />
            <Share2 className="w-5 h-5 text-white" />
          </div>
          {/* Caption */}
          <div className="px-3 pb-2">
            <p className="text-xs text-white leading-relaxed">
              <span className="font-semibold mr-1">your_brand</span>
              {truncated}
              {caption.length > 125 && (
                <span className="text-gray-500 ml-1 cursor-pointer">... more</span>
              )}
            </p>
          </div>
          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="px-3 pb-3">
              <p className="text-[10px] text-blue-400 leading-relaxed break-all">
                {hashtags.slice(0, 15).join(' ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AmazonPreview({ desc }: { desc: any }) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="p-4">
        {/* Amazon header bar */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
          <span className="text-sm font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">amazon.in</span>
          <div className="flex-1 h-7 bg-gray-100 rounded-md border border-orange-300 flex items-center px-2">
            <Search className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 ml-1">Search Amazon.in</span>
          </div>
        </div>
        {/* Product image placeholder */}
        <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center mb-3 border border-gray-100">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 leading-snug mb-2">{desc.title}</h3>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-orange-400 text-xs">{'★★★★☆'}</div>
          <span className="text-[10px] text-blue-600">1,234 ratings</span>
        </div>
        {/* Price */}
        <div className="mb-3">
          <span className="text-xs text-gray-500">M.R.P.: <span className="line-through">₹999</span></span>
          <span className="text-lg font-medium text-gray-900 ml-2">₹749</span>
          <span className="text-xs text-green-700 ml-1">(25% off)</span>
        </div>
        {/* About this item */}
        {desc.bulletPoints?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold text-gray-900 mb-1">About this item</p>
            <ul className="space-y-1">
              {desc.bulletPoints.slice(0, 5).map((bp: string, j: number) => (
                <li key={j} className="flex items-start gap-1.5 text-xs text-gray-700">
                  <span className="text-gray-900 mt-0.5 font-bold">•</span>
                  {bp}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Description */}
        <div className="border-t border-gray-200 pt-2">
          <p className="text-xs font-bold text-gray-900 mb-1">Product Description</p>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{desc.description}</p>
        </div>
      </div>
    </div>
  )
}

function FlipkartPreview({ desc }: { desc: any }) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="p-4">
        {/* Flipkart header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
          <span className="text-sm font-bold text-blue-600">Flipkart</span>
          <div className="flex-1 h-7 bg-blue-50 rounded-md flex items-center px-2">
            <Search className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-blue-300 ml-1">Search for products</span>
          </div>
        </div>
        {/* Product row */}
        <div className="flex gap-3 mb-3">
          <div className="w-28 h-28 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 leading-snug mb-1">{desc.title}</h3>
            <div className="flex items-center gap-1 mb-1">
              <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">4.2 ★</span>
              <span className="text-[10px] text-gray-500">1,847 Ratings</span>
            </div>
            <div>
              <span className="text-base font-bold text-gray-900">₹749</span>
              <span className="text-xs text-gray-500 line-through ml-1">₹999</span>
              <span className="text-xs text-green-600 ml-1">25% off</span>
            </div>
          </div>
        </div>
        {/* Highlights */}
        {desc.bulletPoints?.length > 0 && (
          <div className="mb-3 bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-bold text-gray-900 mb-2">Highlights</p>
            <ul className="space-y-1.5">
              {desc.bulletPoints.slice(0, 6).map((bp: string, j: number) => (
                <li key={j} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                  {bp}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Description */}
        <div className="border-t border-gray-200 pt-2">
          <p className="text-xs font-bold text-gray-900 mb-1">Description</p>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{desc.description}</p>
        </div>
      </div>
    </div>
  )
}

function WebsitePreview({ desc }: { desc: any }) {
  const metaTitle = desc.title?.slice(0, 60) || ''
  const metaDesc = desc.description?.slice(0, 160) || ''

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Google search result card */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <p className="text-xs text-gray-500 mb-1">Google Search Preview</p>
        <div className="border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-green-700 mb-0.5">www.yourstore.com &rsaquo; products</p>
          <p className="text-base text-blue-700 font-medium leading-snug hover:underline cursor-pointer">{metaTitle}</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{metaDesc}...</p>
        </div>
      </div>
      {/* SEO optimized page card */}
      <div className="bg-white rounded-xl p-5 shadow-lg">
        <p className="text-xs text-gray-500 mb-3">Page Preview</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded font-mono">&lt;title&gt;</span>
            <span className="text-gray-600">{metaTitle}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded font-mono">meta desc</span>
            <span className="text-gray-600 line-clamp-2">{metaDesc}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">{desc.title}</h1>
          <p className="text-sm text-gray-700 leading-relaxed">{desc.description}</p>
          {desc.bulletPoints?.length > 0 && (
            <ul className="space-y-1 list-disc list-inside">
              {desc.bulletPoints.map((bp: string, j: number) => (
                <li key={j} className="text-sm text-gray-600">{bp}</li>
              ))}
            </ul>
          )}
          {desc.localSearchTerms?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
              {desc.localSearchTerms.map((kw: string, j: number) => (
                <span key={j} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{kw}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function WhatsAppPreview({ desc }: { desc: any }) {
  return (
    <div className="flex justify-center">
      <div className="w-[320px] rounded-2xl overflow-hidden shadow-xl">
        {/* WhatsApp header */}
        <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Your Store</p>
            <p className="text-[10px] text-green-200">online</p>
          </div>
        </div>
        {/* Chat background */}
        <div className="bg-[#0b141a] p-3 min-h-[280px]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'none\'/%3E%3Cpath d=\'M10 3a1 1 0 110-2 1 1 0 010 2z\' fill=\'%23ffffff08\'/%3E%3C/svg%3E")' }}>
          {/* Catalog message bubble */}
          <div className="bg-[#202c33] rounded-lg rounded-tl-none max-w-[85%] overflow-hidden">
            {/* Product image area */}
            <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-500" />
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-white mb-1">{desc.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-2 line-clamp-3">{desc.description}</p>
              {desc.bulletPoints?.length > 0 && (
                <div className="mb-2">
                  {desc.bulletPoints.slice(0, 3).map((bp: string, j: number) => (
                    <p key={j} className="text-[11px] text-gray-400">✓ {bp}</p>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-sm font-bold text-green-400">₹749</span>
                <span className="text-[10px] text-gray-500">12:34 PM ✓✓</span>
              </div>
            </div>
          </div>
          {/* View catalog button */}
          <div className="mt-2 bg-[#202c33] rounded-lg py-2 text-center max-w-[85%]">
            <p className="text-xs text-[#00a884] font-medium">View Catalog →</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function JioMartPreview({ desc }: { desc: any }) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="p-4">
        {/* JioMart header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
          <span className="text-sm font-bold text-blue-700">Jio</span>
          <span className="text-sm font-bold text-blue-500">Mart</span>
          <div className="flex-1 h-7 bg-gray-100 rounded-md flex items-center px-2">
            <Search className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 ml-1">Search JioMart</span>
          </div>
        </div>
        {/* Product card */}
        <div className="text-center mb-3">
          <div className="w-32 h-32 mx-auto bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 mb-3">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 leading-snug mb-1">{desc.title}</h3>
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">4.0 ★</span>
            <span className="text-[10px] text-gray-500">856 Ratings</span>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">₹749</span>
            <span className="text-xs text-gray-500 line-through ml-1">₹999</span>
          </div>
          <p className="text-[10px] text-green-600 mt-0.5">Inclusive of all taxes</p>
        </div>
        {/* Description */}
        {desc.bulletPoints?.length > 0 && (
          <div className="mb-3 bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-bold text-gray-900 mb-2">Product Details</p>
            <ul className="space-y-1.5">
              {desc.bulletPoints.slice(0, 5).map((bp: string, j: number) => (
                <li key={j} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  {bp}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="border-t border-gray-200 pt-2">
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{desc.description}</p>
        </div>
        {/* CTA */}
        <button className="w-full mt-3 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

function PlatformPreview({ platform, desc }: { platform: string; desc: any }) {
  switch (platform) {
    case 'instagram': return <InstagramPreview desc={desc} />
    case 'amazon': return <AmazonPreview desc={desc} />
    case 'flipkart': return <FlipkartPreview desc={desc} />
    case 'website': return <WebsitePreview desc={desc} />
    case 'whatsapp': return <WhatsAppPreview desc={desc} />
    case 'jiomart': return <JioMartPreview desc={desc} />
    default: return <WebsitePreview desc={desc} />
  }
}

/* ── Main Page Component ── */

export default function ContentPage() {
  const { toast } = useToast()
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('Groceries')
  const [features, setFeatures] = useState('')
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['en', 'hi'])
  const [tone, setTone] = useState('persuasive')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)
  const [selectedPlatform, setSelectedPlatform] = useState('website')
  const [previewMode, setPreviewMode] = useState(false)

  function loadDemo(demo: typeof DEMO_PRODUCTS[0]) {
    setProductName(demo.name)
    setCategory(demo.category)
    setFeatures(demo.features.join(', '))
    setResult(null)
  }

  function toggleLang(code: string) {
    setSelectedLangs(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    )
  }

  async function handleCopy(text: string, idx: number) {
    await navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast('success', 'Copied to clipboard!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedLangs.length === 0) {
      setError('Select at least one language')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await api.generateDescription({
        productName,
        category,
        features: features.split(',').map(f => f.trim()).filter(Boolean),
        specifications: {},
        targetLanguages: selectedLangs,
        tone,
      })
      setResult(data)
      setExpandedIdx(0)
      if (data.demoMode) toast('info', 'AI demo mode — smart fallback data')
      else toast('success', `${selectedLangs.length} descriptions generated!`)
    } catch (err: any) {
      setError(err.message || 'Failed to generate descriptions')
      toast('error', 'AI temporarily unavailable. Try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  function shareDescriptionWhatsApp(desc: any) {
    const text = `*${desc.title}*\n\n${desc.description}\n\n${desc.bulletPoints?.map((b: string) => `• ${b}`).join('\n') || ''}\n\nGenerated by BharatBazaar AI`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Page Header */}
      <div className="page-header rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Languages className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Multilingual Content Generator</h1>
            <p className="text-sm text-white/60">Culturally adapted descriptions — not just translations</p>
          </div>
        </div>
      </div>

      {/* Demo Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-500 py-2">Quick Demo:</span>
        {DEMO_PRODUCTS.map(demo => (
          <motion.button
            key={demo.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadDemo(demo)}
            className="text-sm px-4 py-2 bg-[#1a1a1d] border border-[#2a2a2d] rounded-xl hover:border-bazaar-300 hover:bg-bazaar-500/10 transition-all shadow-sm shadow-black/20"
          >
            {demo.name}
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#1a1a1d] rounded-2xl p-6 shadow-sm shadow-black/20 border border-[#2a2a2d] space-y-4 h-fit">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g., Premium Basmati Rice 5kg"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
              {['Electronics', 'Fashion', 'Groceries', 'Home & Kitchen', 'Beauty & Personal Care'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Key Features (comma separated)</label>
            <textarea
              value={features}
              onChange={e => setFeatures(e.target.value)}
              placeholder="Aged 2 years, Extra-long grain, Aromatic..."
              className="input-field min-h-[80px] resize-y"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)} className="input-field">
              <option value="persuasive">Persuasive (Marketing)</option>
              <option value="formal">Formal (Professional)</option>
              <option value="casual">Casual (Friendly)</option>
            </select>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(platform => (
                <motion.button
                  key={platform.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                    selectedPlatform === platform.id
                      ? 'border-bazaar-400 bg-bazaar-500/10 text-bazaar-400 font-medium shadow-sm'
                      : 'border-[#2a2a2d] text-gray-500 hover:border-[#333]'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r ${platform.color} text-white`}>
                    {platform.badge}
                  </span>
                  <span className="truncate">{platform.name}</span>
                </motion.button>
              ))}
            </div>
            {/* Platform Tip */}
            <motion.div
              key={selectedPlatform}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 px-3 py-2 bg-white/[0.03] border border-[#2a2a2d] rounded-lg"
            >
              <p className="text-xs text-gray-400">
                <span className="text-bazaar-400 font-medium mr-1">Tip:</span>
                {PLATFORM_TIPS[selectedPlatform]}
              </p>
            </motion.div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Languages</label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map(lang => (
                <motion.button
                  key={lang.code}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleLang(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                    selectedLangs.includes(lang.code)
                      ? 'border-bazaar-400 bg-bazaar-500/10 text-bazaar-400 font-medium shadow-sm'
                      : 'border-[#2a2a2d] text-gray-500 hover:border-[#333]'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="text-xs opacity-60">{lang.nameNative}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Generating in {selectedLangs.length} languages...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Descriptions
              </>
            )}
          </motion.button>

          {error && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400">
              AI features temporarily limited. Our servers are experiencing high demand. Please try again in a few minutes.
            </div>
          )}
        </form>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results / Preview Tab Toggle */}
          {result && !loading && (
            <div className="flex items-center gap-1 bg-[#1a1a1d] border border-[#2a2a2d] rounded-xl p-1">
              <button
                onClick={() => setPreviewMode(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !previewMode
                    ? 'bg-bazaar-500/20 text-bazaar-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Languages className="w-4 h-4" />
                Results
              </button>
              <button
                onClick={() => setPreviewMode(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  previewMode
                    ? 'bg-bazaar-500/20 text-bazaar-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                Live Preview
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r ${PLATFORMS.find(p => p.id === selectedPlatform)?.color} text-white`}>
                  {PLATFORMS.find(p => p.id === selectedPlatform)?.badge}
                </span>
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {selectedLangs.map((_, i) => (
                  <div key={i} className="bg-[#1a1a1d] rounded-2xl p-6 shadow-sm shadow-black/20 border border-[#2a2a2d]">
                    <div className="skeleton h-6 w-24 mb-3 rounded-lg" />
                    <div className="skeleton h-4 w-full mb-2 rounded-lg" />
                    <div className="skeleton h-4 w-full mb-2 rounded-lg" />
                    <div className="skeleton h-4 w-3/4 mb-4 rounded-lg" />
                    <div className="space-y-2">
                      {[1,2,3].map(j => <div key={j} className="skeleton h-4 w-5/6 rounded-lg" />)}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {result && !loading && !previewMode && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {result.descriptions?.map((desc: any, i: number) => {
                  const isExpanded = expandedIdx === i
                  const fullText = `${desc.title}\n\n${desc.description}\n\n${desc.bulletPoints?.map((b: string) => `• ${b}`).join('\n')}`

                  return (
                    <motion.div
                      key={desc.language}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -1 }}
                      className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm shadow-black/20 border border-[#2a2a2d] hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* Language Header */}
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedIdx(isExpanded ? null : i)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{LANGUAGES.find(l => l.code === desc.language)?.flag || '🌐'}</span>
                          <div>
                            <h3 className="font-semibold text-gray-100">{desc.languageName}</h3>
                            <p className="text-xs text-gray-400">{desc.language.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); shareDescriptionWhatsApp(desc) }}
                            className="p-2 hover:bg-green-500/10 rounded-lg transition-all"
                            title="Share on WhatsApp"
                          >
                            <Share2 className="w-4 h-4 text-green-500" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); handleCopy(fullText, i) }}
                            className="p-2 hover:bg-white/[0.06] rounded-lg transition-all"
                            title="Copy to clipboard"
                          >
                            {copiedIdx === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                          </motion.button>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="mt-4 pt-4 border-t border-[#2a2a2d]">
                              <h4 className={`text-lg font-bold text-gray-100 mb-3 ${['hi', 'mr'].includes(desc.language) ? 'font-hindi' : ''}`}>
                                {desc.title}
                              </h4>
                              <p className={`text-gray-400 leading-relaxed whitespace-pre-wrap mb-4 ${['hi', 'mr'].includes(desc.language) ? 'font-hindi' : ''}`}>
                                {desc.description}
                              </p>
                              {desc.bulletPoints?.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Selling Points</p>
                                  <ul className={`space-y-1 ${['hi', 'mr'].includes(desc.language) ? 'font-hindi' : ''}`}>
                                    {desc.bulletPoints.map((bp: string, j: number) => (
                                      <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                                        <span className="text-bazaar-500 mt-0.5">•</span>
                                        {bp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {desc.culturalNotes && (
                                <div className="p-3 bg-saffron-500/10 rounded-xl mb-3 border border-saffron-500/20">
                                  <p className="text-xs font-semibold text-saffron-400 uppercase tracking-wider">Cultural Adaptation</p>
                                  <p className="text-sm text-saffron-400 mt-1">{desc.culturalNotes}</p>
                                </div>
                              )}
                              {desc.localSearchTerms?.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Search className="w-3 h-3" /> SEO Keywords
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {desc.localSearchTerms.map((kw: string, j: number) => (
                                      <motion.span
                                        key={j}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: j * 0.05 }}
                                        className="text-xs px-2 py-1 bg-white/[0.03] text-gray-400 rounded-md"
                                      >
                                        {kw}
                                      </motion.span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* Live Preview Mode */}
            {result && !loading && previewMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Platform label */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded bg-gradient-to-r ${PLATFORMS.find(p => p.id === selectedPlatform)?.color} text-white`}>
                    {PLATFORMS.find(p => p.id === selectedPlatform)?.badge}
                  </span>
                  <span className="text-sm text-gray-400">
                    {PLATFORMS.find(p => p.id === selectedPlatform)?.name} Preview
                  </span>
                </div>

                {/* Language selector for preview */}
                {result.descriptions?.length > 1 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.descriptions.map((desc: any, i: number) => (
                      <motion.button
                        key={desc.language}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpandedIdx(i)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                          expandedIdx === i
                            ? 'bg-bazaar-500/20 text-bazaar-400 border border-bazaar-400'
                            : 'bg-[#1a1a1d] text-gray-500 border border-[#2a2a2d] hover:border-[#333]'
                        }`}
                      >
                        <span>{LANGUAGES.find(l => l.code === desc.language)?.flag || '🌐'}</span>
                        {desc.languageName}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Preview card */}
                {result.descriptions?.[expandedIdx ?? 0] && (
                  <motion.div
                    key={`${selectedPlatform}-${expandedIdx}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="bg-[#1a1a1d] rounded-2xl p-6 shadow-sm shadow-black/20 border border-[#2a2a2d]"
                  >
                    <PlatformPreview
                      platform={selectedPlatform}
                      desc={result.descriptions[expandedIdx ?? 0]}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {!result && !loading && (
              <div className="bg-[#1a1a1d] rounded-2xl shadow-sm shadow-black/20 border border-[#2a2a2d] text-center py-16 text-gray-400">
                <Languages className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg font-medium">Generate multilingual product descriptions</p>
                <p className="text-sm mt-2">Click a "Quick Demo" button to try with a pre-loaded product</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <DemoModeBadge visible={!!result?.demoMode} />
    </div>
  )
}
