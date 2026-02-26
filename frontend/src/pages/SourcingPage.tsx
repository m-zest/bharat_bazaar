import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Search, MapPin, Star, Truck, ShieldCheck, ArrowRight, Check, IndianRupee, Filter, ChevronDown } from 'lucide-react'
import { api } from '../utils/api'

const CATEGORIES = ['All', 'Groceries', 'Fashion', 'Electronics', 'Beauty & Personal Care', 'Home & Kitchen']
const CITIES = ['Lucknow', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Jaipur', 'Indore']

export default function SourcingPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('Lucknow')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [orderModal, setOrderModal] = useState<any>(null)
  const [orderQuantity, setOrderQuantity] = useState('')
  const [orderSuccess, setOrderSuccess] = useState<any>(null)
  const [ordering, setOrdering] = useState(false)

  useEffect(() => {
    loadSourcing()
  }, [city, selectedCategory])

  async function loadSourcing() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ city })
      if (selectedCategory !== 'All') params.set('category', selectedCategory)
      if (search) params.set('search', search)
      const result = await api.getSourcing(city, selectedCategory === 'All' ? undefined : selectedCategory, search || undefined)
      setData(result)
    } catch (err) {
      console.error('Sourcing error:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadSourcing()
  }

  async function handleOrder() {
    if (!orderModal || !orderQuantity) return
    setOrdering(true)
    try {
      const result = await api.placeOrder({
        productName: orderModal.productName,
        wholesalerId: orderModal.wholesaler.id,
        quantity: Number(orderQuantity),
        city,
      })
      setOrderSuccess(result)
    } catch (err) {
      console.error('Order error:', err)
    } finally {
      setOrdering(false)
    }
  }

  const filteredProducts = data?.products?.filter((p: any) =>
    !search || p.productName.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-bazaar-500 flex items-center justify-center">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Smart Sourcing</h1>
          <p className="text-sm text-gray-500">Find best wholesale prices from verified suppliers near you</p>
        </div>
      </div>

      {/* Summary Stats */}
      {data?.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Products Available', value: data.summary.totalProducts, icon: Package, color: 'text-bazaar-500', bg: 'bg-bazaar-50' },
            { label: 'Nearby Wholesalers', value: data.summary.totalWholesalers, icon: MapPin, color: 'text-saffron-500', bg: 'bg-saffron-50' },
            { label: 'Avg Savings vs MRP', value: data.summary.avgSavings, icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Verified Suppliers', value: data.summary.verifiedWholesalers, icon: ShieldCheck, color: 'text-royal-500', bg: 'bg-royal-50' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products... (e.g., Basmati Rice, Earbuds, Kurta)"
            className="input-field pl-11 pr-4"
          />
        </form>
        <select value={city} onChange={e => setCity(e.target.value)} className="input-field w-auto">
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-bazaar-500 text-white shadow-lg shadow-bazaar-500/25'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-bazaar-300 hover:text-bazaar-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Wholesalers Row */}
      {data?.wholesalers && (
        <div className="mb-6">
          <h3 className="font-display font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-saffron-500" />
            Wholesalers Near {city}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.wholesalers.map((w: any) => (
              <div key={w.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm leading-tight">{w.name}</h4>
                  {w.verified && <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" /> {w.area} — {w.distance}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-0.5 text-xs text-yellow-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {w.rating}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-0.5">
                    <Truck className="w-3 h-3" /> {w.deliveryDays}d
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {w.specialties.map((s: string) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <h3 className="font-display font-semibold text-gray-900 mb-3">
        {selectedCategory === 'All' ? 'All Products' : selectedCategory} — Wholesale Prices
      </h3>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card">
              <div className="skeleton h-5 w-3/4 mb-3" />
              <div className="skeleton h-8 w-1/2 mb-3" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredProducts.map((product: any, i: number) => (
              <motion.div
                key={`${product.productName}-${product.wholesaler.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{product.productName}</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">{product.category}</span>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    Save {product.savings}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 my-3">
                  <span className="text-2xl font-display font-extrabold text-gray-900">
                    ₹{product.wholesalePrice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">MRP ₹{product.mrp}</span>
                  <span className="text-xs text-gray-500">/{product.unit}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {product.wholesaler.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" /> {product.wholesaler.deliveryDays}d delivery
                  </span>
                  <span>MOQ: {product.moq}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {product.wholesaler.name}
                    {product.wholesaler.verified && <ShieldCheck className="w-3 h-3 text-green-500 inline ml-1" />}
                  </span>
                  <button
                    onClick={() => { setOrderModal(product); setOrderQuantity(product.moq.toString()); setOrderSuccess(null) }}
                    disabled={!product.inStock}
                    className={`text-sm px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                      product.inStock
                        ? 'bg-bazaar-500 text-white hover:bg-bazaar-600 shadow-sm'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? <>Order <ArrowRight className="w-3 h-3" /></> : 'Out of Stock'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="card text-center py-16 text-gray-400">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-2">Try a different search or category</p>
        </div>
      )}

      {/* Order Modal */}
      <AnimatePresence>
        {orderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setOrderModal(null); setOrderSuccess(null) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              {orderSuccess ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
                  <p className="text-sm text-gray-500 mb-4">{orderSuccess.message}</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Order ID</span>
                      <span className="font-mono font-bold">{orderSuccess.orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Amount</span>
                      <span className="font-bold">₹{orderSuccess.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">You Save</span>
                      <span className="font-bold text-green-600">₹{orderSuccess.savings?.total?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery</span>
                      <span className="font-medium">{orderSuccess.estimatedDelivery}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setOrderModal(null); setOrderSuccess(null) }}
                    className="btn-secondary w-full"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-1">Place Order</h3>
                  <p className="text-sm text-gray-500 mb-4">Order from {orderModal.wholesaler.name}</p>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-gray-900">{orderModal.productName}</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-display font-bold">₹{orderModal.wholesalePrice}</span>
                      <span className="text-sm text-gray-400 line-through">MRP ₹{orderModal.mrp}</span>
                      <span className="text-xs text-green-600 font-bold">Save {orderModal.savings}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity (Min: {orderModal.moq} {orderModal.unit}s)
                    </label>
                    <input
                      type="number"
                      value={orderQuantity}
                      onChange={e => setOrderQuantity(e.target.value)}
                      min={orderModal.moq}
                      className="input-field"
                    />
                    {Number(orderQuantity) > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Total: <span className="font-bold text-gray-900">₹{(orderModal.wholesalePrice * Number(orderQuantity)).toLocaleString()}</span>
                        <span className="text-green-600 ml-2">
                          (Save ₹{((orderModal.mrp - orderModal.wholesalePrice) * Number(orderQuantity)).toLocaleString()})
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setOrderModal(null); setOrderSuccess(null) }}
                      className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleOrder}
                      disabled={ordering || Number(orderQuantity) < orderModal.moq}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {ordering ? 'Placing...' : 'Confirm Order'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
