import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ShoppingBag, ArrowRight, Sparkles, Check } from 'lucide-react'
import { IconLogo } from './TarazuLogo'

interface OnboardingData {
  storeName: string
  ownerName: string
  city: string
  category: string
  products: string[]
}

const CITIES = ['Lucknow', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Jaipur', 'Indore']
const CATEGORIES = ['Groceries', 'Fashion', 'Electronics', 'Home & Kitchen', 'Beauty & Personal Care']
const POPULAR_PRODUCTS: Record<string, string[]> = {
  Groceries: ['Basmati Rice', 'Atta (Flour)', 'Cooking Oil', 'Toor Dal', 'Sugar', 'Salt', 'Spices', 'Tea/Coffee'],
  Fashion: ['Cotton Kurta', 'Saree', 'T-Shirt', 'Jeans', 'Dupatta', 'Sandals', 'Watch'],
  Electronics: ['Bluetooth Earbuds', 'Power Bank', 'Phone Case', 'USB Cable', 'LED Bulb', 'Extension Board'],
  'Home & Kitchen': ['Pressure Cooker', 'Water Bottle', 'Tiffin Box', 'Bedsheet', 'Towel Set'],
  'Beauty & Personal Care': ['Shampoo', 'Face Wash', 'Hair Oil', 'Soap', 'Toothpaste', 'Deodorant'],
}

const STORAGE_KEY = 'bharatbazaar_onboarded'

interface Props {
  onComplete: (data: OnboardingData) => void
}

export default function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    storeName: '',
    ownerName: '',
    city: 'Lucknow',
    category: 'Groceries',
    products: [],
  })

  function toggleProduct(product: string) {
    setData(prev => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product],
    }))
  }

  function handleComplete() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    onComplete(data)
  }

  const steps = [
    // Step 0: Welcome
    <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
      <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
        <IconLogo mode="dark" size={48} />
      </div>
      <h2 className="font-display text-2xl font-bold text-gray-100">BharatBazaar AI mein aapka swagat hai!</h2>
      <p className="text-gray-500 mt-2">Let's set up your store in 30 seconds</p>
      <p className="text-sm text-saffron-500 mt-1 font-hindi">30 second mein apni dukaan setup karein</p>
      <button onClick={() => setStep(1)} className="btn-primary mt-8 px-8 py-3 flex items-center gap-2 mx-auto">
        Shuru Karein <ArrowRight className="w-4 h-4" />
      </button>
      <button onClick={() => { localStorage.setItem(STORAGE_KEY, 'skipped'); onComplete(data) }} className="text-sm text-gray-500 mt-4 hover:text-gray-300">
        Skip — use demo store
      </button>
    </motion.div>,

    // Step 1: Store Info
    <motion.div key="store" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-saffron-500/10 flex items-center justify-center">
          <IconLogo mode="dark" size={28} />
        </div>
        <div>
          <h3 className="font-display font-bold text-gray-100">Your Store Details</h3>
          <p className="text-xs text-gray-400">Step 1 of 3</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Store Name</label>
          <input
            type="text"
            value={data.storeName}
            onChange={e => setData({ ...data, storeName: e.target.value })}
            placeholder="e.g., Sharma Kirana Store"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
          <input
            type="text"
            value={data.ownerName}
            onChange={e => setData({ ...data, ownerName: e.target.value })}
            placeholder="e.g., Ramesh Sharma"
            className="input-field"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setStep(0)} className="flex-1 py-3 px-4 border border-[#2a2a2d] rounded-xl text-gray-400 hover:bg-white/[0.06]">Back</button>
        <button onClick={() => setStep(2)} className="flex-1 btn-primary flex items-center justify-center gap-2">
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>,

    // Step 2: City & Category
    <motion.div key="city" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-bazaar-500/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-bazaar-400" />
        </div>
        <div>
          <h3 className="font-display font-bold text-gray-100">Location & Category</h3>
          <p className="text-xs text-gray-400">Step 2 of 3</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your City</label>
          <div className="grid grid-cols-5 gap-2">
            {CITIES.map(city => (
              <button
                key={city}
                onClick={() => setData({ ...data, city })}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  data.city === city
                    ? 'border-bazaar-400 bg-bazaar-500/10 text-bazaar-400'
                    : 'border-[#2a2a2d] text-gray-400 hover:border-[#333]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Primary Category</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setData({ ...data, category: cat, products: [] })}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  data.category === cat
                    ? 'border-saffron-400 bg-saffron-500/10 text-saffron-400'
                    : 'border-[#2a2a2d] text-gray-400 hover:border-[#333]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setStep(1)} className="flex-1 py-3 px-4 border border-[#2a2a2d] rounded-xl text-gray-400 hover:bg-white/[0.06]">Back</button>
        <button onClick={() => setStep(3)} className="flex-1 btn-primary flex items-center justify-center gap-2">
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>,

    // Step 3: Products
    <motion.div key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-royal-500/10 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-royal-400" />
        </div>
        <div>
          <h3 className="font-display font-bold text-gray-100">What do you sell?</h3>
          <p className="text-xs text-gray-400">Step 3 of 3 — Select your products</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {(POPULAR_PRODUCTS[data.category] || POPULAR_PRODUCTS.Groceries).map(product => (
          <button
            key={product}
            onClick={() => toggleProduct(product)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
              data.products.includes(product)
                ? 'border-royal-400 bg-royal-500/10 text-royal-400'
                : 'border-[#2a2a2d] text-gray-400 hover:border-[#333]'
            }`}
          >
            {data.products.includes(product) && <Check className="w-3 h-3" />}
            {product}
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setStep(2)} className="flex-1 py-3 px-4 border border-[#2a2a2d] rounded-xl text-gray-400 hover:bg-white/[0.06]">Back</button>
        <button onClick={handleComplete} className="flex-1 btn-primary flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> Setup My Store
        </button>
      </div>
    </motion.div>,
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1a1d] border border-[#2a2a2d] rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-black/40"
      >
        {/* Progress */}
        {step > 0 && (
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${
                step >= s ? 'bg-saffron-500' : 'bg-[#2a2a2d]'
              }`} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function isOnboarded(): boolean {
  return !!localStorage.getItem(STORAGE_KEY)
}

export function getOnboardingData(): OnboardingData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved || saved === 'skipped') return null
    return JSON.parse(saved)
  } catch {
    return null
  }
}
