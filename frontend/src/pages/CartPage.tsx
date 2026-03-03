import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, IndianRupee, TrendingDown, ArrowLeft } from 'lucide-react'
import { useCart } from '../utils/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalAmount, totalSavings, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Browse wholesale products and add items to your cart</p>
          <Link
            to="/sourcing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
          >
            <Package className="w-4 h-4" />
            Browse Products
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Shopping Cart</h1>
          <p className="text-gray-400 text-sm">{totalItems} items from wholesale suppliers</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-4"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-7 h-7 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-100 text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.wholesaler} &middot; {item.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-gray-100">&#8377;{item.wholesalePrice}</span>
                      <span className="text-xs text-gray-500">/{item.unit}</span>
                      <span className="text-xs text-gray-500 line-through ml-2">&#8377;{item.mrp}</span>
                      <span className="text-xs text-green-400 font-medium ml-1">{item.savings}% off</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg border border-[#2a2a2d]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - item.moq)}
                        className="p-2 hover:bg-white/[0.06] rounded-l-lg transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <span className="text-sm font-semibold text-gray-100 w-10 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + item.moq)}
                        className="p-2 hover:bg-white/[0.06] rounded-r-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-sm font-semibold text-gray-300">
                      Subtotal: &#8377;{(item.wholesalePrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-5 sticky top-6"
          >
            <h3 className="font-bold text-gray-100 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Items ({totalItems})</span>
                <span>&#8377;{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className="text-green-400 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-green-400 font-medium">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Total Savings
                </span>
                <span>&#8377;{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-[#2a2a2d] pt-3 flex justify-between">
                <span className="font-bold text-gray-100">Total</span>
                <span className="font-bold text-gray-100 flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/sourcing"
              className="w-full mt-2 py-2.5 text-center text-sm text-orange-400 hover:bg-orange-500/10 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
