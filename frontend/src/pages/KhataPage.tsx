import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, Search, Phone, IndianRupee, TrendingUp, TrendingDown,
  Users, ArrowUpRight, ArrowDownRight, Check, Clock, AlertTriangle,
  ChevronDown, Calendar, X
} from 'lucide-react'

interface KhataEntry {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'payment'
}

interface Customer {
  id: string
  name: string
  phone: string
  balance: number
  lastTransaction: string
  entries: KhataEntry[]
}

const DEMO_CUSTOMERS: Customer[] = [
  {
    id: '1', name: 'Rajiv Kumar', phone: '9876543201', balance: 2450, lastTransaction: '2 days ago',
    entries: [
      { id: 'e1', date: '2026-03-01', description: 'Groceries - Rice, Oil, Dal', amount: 1250, type: 'credit' },
      { id: 'e2', date: '2026-02-28', description: 'Partial payment', amount: 500, type: 'payment' },
      { id: 'e3', date: '2026-02-25', description: 'Monthly grocery', amount: 1700, type: 'credit' },
    ],
  },
  {
    id: '2', name: 'Sunita Devi', phone: '9876543202', balance: 850, lastTransaction: '5 days ago',
    entries: [
      { id: 'e4', date: '2026-02-26', description: 'Atta, Sugar, Tea', amount: 850, type: 'credit' },
      { id: 'e5', date: '2026-02-20', description: 'Full payment', amount: 1200, type: 'payment' },
      { id: 'e6', date: '2026-02-15', description: 'Monthly grocery', amount: 1200, type: 'credit' },
    ],
  },
  {
    id: '3', name: 'Mohammed Ali', phone: '9876543203', balance: 0, lastTransaction: '1 week ago',
    entries: [
      { id: 'e7', date: '2026-02-24', description: 'Full payment - settled', amount: 3200, type: 'payment' },
      { id: 'e8', date: '2026-02-01', description: 'Bulk grocery order', amount: 3200, type: 'credit' },
    ],
  },
  {
    id: '4', name: 'Priya Sharma', phone: '9876543204', balance: 4200, lastTransaction: '1 day ago',
    entries: [
      { id: 'e9', date: '2026-03-02', description: 'Festival supplies - Holi colors, sweets', amount: 2200, type: 'credit' },
      { id: 'e10', date: '2026-02-28', description: 'Monthly grocery', amount: 2000, type: 'credit' },
    ],
  },
  {
    id: '5', name: 'Ramesh Verma', phone: '9876543205', balance: 1100, lastTransaction: '3 days ago',
    entries: [
      { id: 'e11', date: '2026-02-28', description: 'Groceries - Oil, Spices', amount: 1100, type: 'credit' },
      { id: 'e12', date: '2026-02-25', description: 'Payment received', amount: 2000, type: 'payment' },
      { id: 'e13', date: '2026-02-10', description: 'Monthly supply', amount: 2000, type: 'credit' },
    ],
  },
  {
    id: '6', name: 'Anjali Singh', phone: '9876543206', balance: 6800, lastTransaction: '2 weeks ago',
    entries: [
      { id: 'e14', date: '2026-02-18', description: 'Bulk order - Wedding supplies', amount: 6800, type: 'credit' },
    ],
  },
]

export default function KhataPage() {
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [entryType, setEntryType] = useState<'credit' | 'payment'>('credit')
  const [entryAmount, setEntryAmount] = useState('')
  const [entryDesc, setEntryDesc] = useState('')

  const totalOutstanding = customers.reduce((s, c) => s + c.balance, 0)
  const totalCustomers = customers.length
  const overdueCount = customers.filter(c => c.balance > 3000).length

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  const addEntry = () => {
    if (!selectedCustomer || !entryAmount) return
    const amount = Number(entryAmount)
    const newEntry: KhataEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: entryDesc || (entryType === 'credit' ? 'Credit given' : 'Payment received'),
      amount,
      type: entryType,
    }

    setCustomers(prev => prev.map(c => {
      if (c.id !== selectedCustomer.id) return c
      return {
        ...c,
        balance: entryType === 'credit' ? c.balance + amount : Math.max(0, c.balance - amount),
        lastTransaction: 'Just now',
        entries: [newEntry, ...c.entries],
      }
    }))

    setSelectedCustomer(prev => prev ? {
      ...prev,
      balance: entryType === 'credit' ? prev.balance + amount : Math.max(0, prev.balance - amount),
      lastTransaction: 'Just now',
      entries: [newEntry, ...prev.entries],
    } : null)

    setShowAddModal(false)
    setEntryAmount('')
    setEntryDesc('')
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Customer Khata</h1>
          <p className="text-gray-400 text-sm">Digital credit ledger — track udhar for regular customers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Outstanding', value: `₹${totalOutstanding.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Total Customers', value: totalCustomers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Overdue (>₹3K)', value: overdueCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Settled This Month', value: 1, icon: Check, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-4"
          >
            <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-100">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Customer List */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] overflow-hidden">
            <div className="p-3 border-b border-[#2a2a2d]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {filtered.map((customer, i) => (
                <motion.button
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`w-full p-3 text-left border-b border-[#2a2a2d] hover:bg-white/[0.06] transition-colors ${
                    selectedCustomer?.id === customer.id ? 'bg-orange-500/10 border-l-4 border-l-orange-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-100">{customer.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${customer.balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {customer.balance > 0 ? `₹${customer.balance.toLocaleString('en-IN')}` : 'Settled'}
                      </p>
                      <p className="text-[10px] text-gray-500">{customer.lastTransaction}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Khata Detail */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] overflow-hidden"
            >
              {/* Customer Header */}
              <div className="p-5 border-b border-[#2a2a2d] bg-white/[0.03]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-gray-100">{selectedCustomer.name}</p>
                      <p className="text-xs text-gray-400">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Balance Due</p>
                    <p className={`text-xl font-bold ${selectedCustomer.balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      ₹{selectedCustomer.balance.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { setEntryType('credit'); setShowAddModal(true) }}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/15 transition-colors"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    Add Credit (Udhar)
                  </button>
                  <button
                    onClick={() => { setEntryType('payment'); setShowAddModal(true) }}
                    className="flex items-center gap-1 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/15 transition-colors"
                  >
                    <ArrowDownRight className="w-3 h-3" />
                    Record Payment
                  </button>
                </div>
              </div>

              {/* Entries */}
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {selectedCustomer.entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      entry.type === 'credit'
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-green-500/5 border-green-500/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      entry.type === 'credit' ? 'bg-red-500/15' : 'bg-green-500/15'
                    }`}>
                      {entry.type === 'credit'
                        ? <ArrowUpRight className="w-4 h-4 text-red-500" />
                        : <ArrowDownRight className="w-4 h-4 text-green-500" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-100">{entry.description}</p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <p className={`font-bold text-sm ${entry.type === 'credit' ? 'text-red-400' : 'text-green-400'}`}>
                      {entry.type === 'credit' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] flex items-center justify-center h-[400px]">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Select a customer to view their khata</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showAddModal && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1a1a1d] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-100">
                  {entryType === 'credit' ? 'Add Credit (Udhar)' : 'Record Payment'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-500 hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Customer: <span className="font-semibold text-gray-100">{selectedCustomer.name}</span>
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={entryAmount}
                    onChange={e => setEntryAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                  <input
                    value={entryDesc}
                    onChange={e => setEntryDesc(e.target.value)}
                    placeholder={entryType === 'credit' ? 'e.g., Monthly grocery' : 'e.g., Cash payment'}
                    className="w-full px-4 py-3 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                onClick={addEntry}
                disabled={!entryAmount}
                className={`w-full mt-4 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                  entryType === 'credit'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {entryType === 'credit' ? (
                  <><ArrowUpRight className="w-4 h-4" /> Add ₹{entryAmount || '0'} Credit</>
                ) : (
                  <><ArrowDownRight className="w-4 h-4" /> Record ₹{entryAmount || '0'} Payment</>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
