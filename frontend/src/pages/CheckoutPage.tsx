import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Phone, User, CreditCard, Truck, CheckCircle2,
  IndianRupee, Package, ArrowRight, Shield, Clock
} from 'lucide-react'
import { useCart } from '../utils/CartContext'
import { useAuth } from '../utils/AuthContext'
import { api } from '../utils/api'

export default function CheckoutPage() {
  const { items, totalAmount, totalSavings, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '9876543210',
    address: 'Shop No. 42, Aminabad Market',
    city: user?.city || 'Lucknow',
    pincode: '226018',
    paymentMethod: 'cod',
  })

  const handlePlaceOrder = async () => {
    setPlacing(true)
    const id = `BB-${Date.now().toString(36).toUpperCase()}`

    // Place each item as an order
    for (const item of items) {
      try {
        await api.placeOrder({
          productName: item.name,
          wholesalerId: item.wholesalerId,
          quantity: item.quantity,
          city: item.city || form.city,
        })
      } catch {
        // Continue even if individual order fails (demo mode)
      }
    }

    setOrderId(id)
    setStep(3)
    setPlacing(false)
    clearCart()
  }

  if (items.length === 0 && step !== 3) {
    navigate('/cart')
    return null
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[
          { num: 1, label: 'Delivery' },
          { num: 2, label: 'Payment' },
          { num: 3, label: 'Confirmed' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= s.num
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-slate-800' : 'text-slate-400'}`}>
              {s.label}
            </span>
            {i < 2 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-orange-500' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Delivery Address */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Store Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      rows={2}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PIN Code</label>
                  <input
                    value={form.pincode}
                    onChange={e => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mini Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">Order ({items.length} items)</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate flex-1 mr-2">{item.name} x{item.quantity}</span>
                  <span className="text-slate-800 font-medium whitespace-nowrap">&#8377;{(item.wholesalePrice * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold text-slate-800">
              <span>Total</span>
              <span>&#8377;{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              Payment Method
            </h2>
            <div className="space-y-3">
              {[
                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when goods arrive at your store', icon: IndianRupee },
                { id: 'upi', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm', icon: Phone },
                { id: 'credit', label: 'Credit (30 days)', desc: 'Pay within 30 days of delivery', icon: Clock },
              ].map(method => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.paymentMethod === method.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={form.paymentMethod === method.id}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-4 h-4 text-orange-500 accent-orange-500"
                  />
                  <method.icon className={`w-5 h-5 ${form.paymentMethod === method.id ? 'text-orange-500' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{method.label}</p>
                    <p className="text-xs text-slate-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items)</span>
                <span>&#8377;{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>You Save</span>
                <span>&#8377;{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-bold text-slate-800">
                <span>Total to Pay</span>
                <span>&#8377;{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {placing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Place Order &middot; &#8377;{totalAmount.toLocaleString('en-IN')}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Order Confirmed */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Placed!</h2>
            <p className="text-slate-500 mb-1">Your wholesale order has been confirmed</p>
            <div className="inline-flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2 mt-2 mb-6">
              <span className="text-sm text-slate-500">Order ID:</span>
              <span className="text-sm font-bold text-slate-800">{orderId}</span>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left mb-6">
              <div className="flex items-center gap-2 text-green-700 font-medium text-sm mb-2">
                <Truck className="w-4 h-4" />
                Estimated Delivery
              </div>
              <p className="text-green-800 font-semibold">2-3 business days</p>
              <p className="text-green-600 text-xs mt-1">Delivery to: {form.address}, {form.city}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                View Orders
              </button>
              <button
                onClick={() => navigate('/tracking')}
                className="flex-1 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Track Order
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
