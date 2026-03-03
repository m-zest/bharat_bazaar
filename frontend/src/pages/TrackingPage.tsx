import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package, CheckCircle2, Truck, MapPin, Clock, Phone,
  Building2, Search, ArrowRight, Box, Warehouse, Store
} from 'lucide-react'

interface TrackingStep {
  id: string
  label: string
  description: string
  time: string
  icon: any
  completed: boolean
  active: boolean
  location?: string
}

const DEMO_TRACKING: Record<string, { orderId: string; product: string; status: string; eta: string; steps: TrackingStep[] }> = {
  'BB-ORD-2024-002': {
    orderId: 'BB-ORD-2024-002',
    product: 'Fortune Sunflower Oil 5L',
    status: 'shipped',
    eta: 'Tomorrow by 6 PM',
    steps: [
      { id: '1', label: 'Order Placed', description: 'Your order has been confirmed', time: '28 Feb, 10:30 AM', icon: CheckCircle2, completed: true, active: false, location: 'Lucknow' },
      { id: '2', label: 'Order Processed', description: 'Wholesaler has packed your order', time: '28 Feb, 2:15 PM', icon: Box, completed: true, active: false, location: 'Sharma Traders, Charbagh' },
      { id: '3', label: 'Picked Up', description: 'Shipment picked up from warehouse', time: '1 Mar, 9:00 AM', icon: Warehouse, completed: true, active: false, location: 'Central Warehouse, Lucknow' },
      { id: '4', label: 'In Transit', description: 'Package is on its way to you', time: '1 Mar, 3:45 PM', icon: Truck, completed: true, active: true, location: 'Aminabad Area' },
      { id: '5', label: 'Out for Delivery', description: 'Delivery agent is heading to your store', time: 'Expected today', icon: MapPin, completed: false, active: false, location: 'Near Aminabad Market' },
      { id: '6', label: 'Delivered', description: 'Package delivered to your store', time: 'Expected tomorrow', icon: Store, completed: false, active: false, location: 'Shop No. 42, Aminabad' },
    ],
  },
  'BB-ORD-2024-003': {
    orderId: 'BB-ORD-2024-003',
    product: 'Aashirvaad Atta 10kg',
    status: 'processing',
    eta: 'In 2-3 days',
    steps: [
      { id: '1', label: 'Order Placed', description: 'Your order has been confirmed', time: '1 Mar, 4:20 PM', icon: CheckCircle2, completed: true, active: false, location: 'Lucknow' },
      { id: '2', label: 'Order Processed', description: 'Wholesaler is packing your order', time: 'In progress', icon: Box, completed: false, active: true, location: 'Om Trading Co., Hazratganj' },
      { id: '3', label: 'Picked Up', description: 'Waiting for pickup', time: 'Pending', icon: Warehouse, completed: false, active: false },
      { id: '4', label: 'In Transit', description: 'Not yet shipped', time: 'Pending', icon: Truck, completed: false, active: false },
      { id: '5', label: 'Out for Delivery', description: 'Awaiting dispatch', time: 'Pending', icon: MapPin, completed: false, active: false },
      { id: '6', label: 'Delivered', description: 'Pending delivery', time: 'Pending', icon: Store, completed: false, active: false },
    ],
  },
  'BB-ORD-2024-004': {
    orderId: 'BB-ORD-2024-004',
    product: 'Parle-G Biscuit (800g x 12)',
    status: 'confirmed',
    eta: 'In 2-3 days',
    steps: [
      { id: '1', label: 'Order Placed', description: 'Your order has been confirmed', time: 'Today, 11:00 AM', icon: CheckCircle2, completed: true, active: true, location: 'Lucknow' },
      { id: '2', label: 'Order Processed', description: 'Waiting for wholesaler confirmation', time: 'Pending', icon: Box, completed: false, active: false },
      { id: '3', label: 'Picked Up', description: 'Waiting for pickup', time: 'Pending', icon: Warehouse, completed: false, active: false },
      { id: '4', label: 'In Transit', description: 'Not yet shipped', time: 'Pending', icon: Truck, completed: false, active: false },
      { id: '5', label: 'Out for Delivery', description: 'Awaiting dispatch', time: 'Pending', icon: MapPin, completed: false, active: false },
      { id: '6', label: 'Delivered', description: 'Pending delivery', time: 'Pending', icon: Store, completed: false, active: false },
    ],
  },
}

export default function TrackingPage() {
  const [searchParams] = useSearchParams()
  const [trackingId, setTrackingId] = useState(searchParams.get('orderId') || '')
  const [searchInput, setSearchInput] = useState(searchParams.get('orderId') || '')
  const [tracking, setTracking] = useState<typeof DEMO_TRACKING[string] | null>(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (trackingId) {
      handleTrack(trackingId)
    }
  }, [])

  const handleTrack = async (id?: string) => {
    const tid = id || searchInput
    if (!tid.trim()) return
    setSearching(true)
    setTrackingId(tid)

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000))

    // Check demo data or generate default tracking
    const found = DEMO_TRACKING[tid]
    if (found) {
      setTracking(found)
    } else {
      // Generate default tracking for any order ID
      setTracking({
        orderId: tid,
        product: 'Wholesale Order',
        status: 'confirmed',
        eta: 'In 2-3 days',
        steps: [
          { id: '1', label: 'Order Placed', description: 'Your order has been confirmed', time: 'Just now', icon: CheckCircle2, completed: true, active: true, location: 'Lucknow' },
          { id: '2', label: 'Order Processed', description: 'Waiting for wholesaler confirmation', time: 'Pending', icon: Box, completed: false, active: false },
          { id: '3', label: 'Picked Up', description: 'Waiting for pickup', time: 'Pending', icon: Warehouse, completed: false, active: false },
          { id: '4', label: 'In Transit', description: 'Not yet shipped', time: 'Pending', icon: Truck, completed: false, active: false },
          { id: '5', label: 'Out for Delivery', description: 'Awaiting dispatch', time: 'Pending', icon: MapPin, completed: false, active: false },
          { id: '6', label: 'Delivered', description: 'Pending delivery', time: 'Pending', icon: Store, completed: false, active: false },
        ],
      })
    }
    setSearching(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Delivery Tracking</h1>
        <p className="text-slate-500 text-sm">Track your wholesale orders in real-time</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <form
          onSubmit={e => { e.preventDefault(); handleTrack() }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Enter Order ID (e.g., BB-ORD-2024-002)"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {searching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Track
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        {/* Quick links */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-xs text-slate-400">Quick track:</span>
          {Object.keys(DEMO_TRACKING).map(id => (
            <button
              key={id}
              onClick={() => { setSearchInput(id); handleTrack(id) }}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium hover:underline"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Tracking Result */}
      {tracking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Order Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Order ID</p>
                <p className="font-bold text-slate-800">{tracking.orderId}</p>
                <p className="text-sm text-slate-500 mt-0.5">{tracking.product}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Estimated Delivery</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {tracking.eta}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-6">Shipment Progress</h3>
            <div className="relative">
              {tracking.steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 relative"
                >
                  {/* Connector Line */}
                  {i < tracking.steps.length - 1 && (
                    <div className={`absolute left-[19px] top-10 w-0.5 h-full ${
                      step.completed ? 'bg-green-400' : 'bg-slate-200'
                    }`} />
                  )}

                  {/* Icon */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.active
                      ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                      : step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    <step.icon className="w-4.5 h-4.5" />
                    {step.active && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-8 flex-1 ${i === tracking.steps.length - 1 ? 'pb-0' : ''}`}>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-semibold ${
                        step.completed || step.active ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </h4>
                      {step.active && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${step.completed || step.active ? 'text-slate-500' : 'text-slate-300'}`}>
                      {step.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${step.completed || step.active ? 'text-slate-400' : 'text-slate-300'}`}>
                        {step.time}
                      </span>
                      {step.location && (
                        <span className="text-xs text-slate-400 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />
                          {step.location}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Delivery Agent Card */}
          {tracking.status === 'shipped' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-5 mt-4 text-white"
            >
              <h4 className="font-semibold mb-3">Delivery Partner</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Ravi Kumar</p>
                  <p className="text-white/80 text-sm">Vehicle: UP32 AT 1234</p>
                </div>
                <a
                  href="tel:+919876543210"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* No tracking shown yet */}
      {!tracking && !searching && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 text-sm">Enter an order ID to track your delivery</p>
        </div>
      )}
    </div>
  )
}
