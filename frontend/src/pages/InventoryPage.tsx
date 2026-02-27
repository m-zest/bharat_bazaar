import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Plus, Trash2, AlertTriangle, TrendingDown, ShoppingCart, Edit2, Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface InventoryItem {
  id: string
  name: string
  category: string
  costPrice: number
  sellingPrice: number
  quantity: number
  dailySellRate: number
  reorderLevel: number
  lastUpdated: string
}

const DEMO_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Premium Basmati Rice 5kg', category: 'Groceries', costPrice: 320, sellingPrice: 449, quantity: 22, dailySellRate: 5, reorderLevel: 15, lastUpdated: new Date().toISOString() },
  { id: 'inv-2', name: 'Surf Excel 1kg', category: 'Groceries', costPrice: 155, sellingPrice: 210, quantity: 8, dailySellRate: 3, reorderLevel: 10, lastUpdated: new Date().toISOString() },
  { id: 'inv-3', name: 'Handloom Cotton Kurta', category: 'Fashion', costPrice: 450, sellingPrice: 899, quantity: 35, dailySellRate: 2, reorderLevel: 10, lastUpdated: new Date().toISOString() },
  { id: 'inv-4', name: 'Wireless Bluetooth Earbuds', category: 'Electronics', costPrice: 600, sellingPrice: 1299, quantity: 12, dailySellRate: 1, reorderLevel: 5, lastUpdated: new Date().toISOString() },
  { id: 'inv-5', name: 'Colgate MaxFresh 150g', category: 'Groceries', costPrice: 75, sellingPrice: 105, quantity: 45, dailySellRate: 4, reorderLevel: 20, lastUpdated: new Date().toISOString() },
  { id: 'inv-6', name: 'Tata Salt 1kg', category: 'Groceries', costPrice: 22, sellingPrice: 28, quantity: 60, dailySellRate: 6, reorderLevel: 25, lastUpdated: new Date().toISOString() },
]

const STORAGE_KEY = 'bharatbazaar_inventory'

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEMO_INVENTORY
    } catch {
      return DEMO_INVENTORY
    }
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState('')
  const [newItem, setNewItem] = useState({ name: '', category: 'Groceries', costPrice: '', sellingPrice: '', quantity: '', dailySellRate: '', reorderLevel: '' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory))
  }, [inventory])

  function addItem() {
    if (!newItem.name || !newItem.costPrice || !newItem.quantity) return
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      costPrice: Number(newItem.costPrice),
      sellingPrice: Number(newItem.sellingPrice) || Number(newItem.costPrice) * 1.3,
      quantity: Number(newItem.quantity),
      dailySellRate: Number(newItem.dailySellRate) || 2,
      reorderLevel: Number(newItem.reorderLevel) || 10,
      lastUpdated: new Date().toISOString(),
    }
    setInventory(prev => [...prev, item])
    setNewItem({ name: '', category: 'Groceries', costPrice: '', sellingPrice: '', quantity: '', dailySellRate: '', reorderLevel: '' })
    setShowAddForm(false)
  }

  function removeItem(id: string) {
    setInventory(prev => prev.filter(item => item.id !== id))
  }

  function updateQuantity(id: string) {
    setInventory(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Number(editQuantity), lastUpdated: new Date().toISOString() } : item
    ))
    setEditingId(null)
  }

  function getDaysLeft(item: InventoryItem) {
    return item.dailySellRate > 0 ? Math.round(item.quantity / item.dailySellRate) : 999
  }

  function getStatus(item: InventoryItem) {
    const daysLeft = getDaysLeft(item)
    if (item.quantity <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700', severity: 'critical' }
    if (item.quantity <= item.reorderLevel) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700', severity: 'warning' }
    if (daysLeft <= 3) return { label: `${daysLeft}d left`, color: 'bg-red-100 text-red-700', severity: 'warning' }
    if (daysLeft <= 7) return { label: `${daysLeft}d left`, color: 'bg-yellow-100 text-yellow-700', severity: 'info' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700', severity: 'ok' }
  }

  const alerts = inventory
    .filter(item => getStatus(item).severity !== 'ok')
    .sort((a, b) => getDaysLeft(a) - getDaysLeft(b))

  const totalValue = inventory.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)
  const totalCost = inventory.reduce((sum, item) => sum + item.costPrice * item.quantity, 0)
  const lowStockCount = alerts.length

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Page Header */}
      <div className="page-header rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-saffron-400 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Package className="w-6 h-6 text-saffron-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Inventory Tracker</h1>
            <p className="text-sm text-white/60">Track stock levels, get reorder alerts, never run out</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="ml-auto flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: inventory.length, icon: Package, color: 'text-bazaar-500', bg: 'bg-bazaar-50' },
          { label: 'Inventory Value', value: `Rs.${totalValue.toLocaleString()}`, icon: ShoppingCart, color: 'text-saffron-500', bg: 'bg-saffron-50' },
          { label: 'Total Cost', value: `Rs.${totalCost.toLocaleString()}`, icon: TrendingDown, color: 'text-gray-500', bg: 'bg-gray-50' },
          { label: 'Low Stock Alerts', value: lowStockCount, icon: AlertTriangle, color: lowStockCount > 0 ? 'text-red-500' : 'text-green-500', bg: lowStockCount > 0 ? 'bg-red-50' : 'bg-green-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-200 bg-red-50/50 mb-6">
          <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Reorder Alerts
          </h3>
          <div className="space-y-2">
            {alerts.map(item => {
              const daysLeft = getDaysLeft(item)
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} units left{daysLeft < 999 ? ` — runs out in ~${daysLeft} days` : ''} at {item.dailySellRate}/day
                    </p>
                  </div>
                  <Link
                    to="/sourcing"
                    className="text-xs px-3 py-1.5 bg-bazaar-500 text-white rounded-lg hover:bg-bazaar-600 transition-all"
                  >
                    Reorder Now
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Product Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-saffron-200 bg-saffron-50/30">
              <h3 className="font-semibold text-gray-900 mb-3">Add New Product</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Product name" className="input-field" required />
                <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="input-field">
                  {['Groceries', 'Fashion', 'Electronics', 'Home & Kitchen', 'Beauty & Personal Care'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" value={newItem.costPrice} onChange={e => setNewItem({ ...newItem, costPrice: e.target.value })} placeholder="Cost price (Rs.)" className="input-field" required />
                <input type="number" value={newItem.sellingPrice} onChange={e => setNewItem({ ...newItem, sellingPrice: e.target.value })} placeholder="Selling price (Rs.)" className="input-field" />
                <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} placeholder="Current quantity" className="input-field" required />
                <input type="number" value={newItem.dailySellRate} onChange={e => setNewItem({ ...newItem, dailySellRate: e.target.value })} placeholder="Daily sell rate" className="input-field" />
                <input type="number" value={newItem.reorderLevel} onChange={e => setNewItem({ ...newItem, reorderLevel: e.target.value })} placeholder="Reorder level" className="input-field" />
                <button onClick={addItem} className="btn-primary flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Category</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Cost</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Selling</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Quantity</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Daily Rate</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Days Left</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const status = getStatus(item)
              const daysLeft = getDaysLeft(item)
              return (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                  <td className="text-center py-3 px-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{item.category}</span>
                  </td>
                  <td className="text-center py-3 px-4 font-mono text-gray-500">Rs.{item.costPrice}</td>
                  <td className="text-center py-3 px-4 font-mono font-medium">Rs.{item.sellingPrice}</td>
                  <td className="text-center py-3 px-4">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1 justify-center">
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={e => setEditQuantity(e.target.value)}
                          className="w-16 px-2 py-1 border border-saffron-300 rounded text-center text-sm"
                          autoFocus
                        />
                        <button onClick={() => updateQuantity(item.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <span className="font-bold">{item.quantity}</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4 text-gray-500">{item.dailySellRate}/day</td>
                  <td className="text-center py-3 px-4">
                    <span className={`font-medium ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysLeft < 999 ? `${daysLeft}d` : '—'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        onClick={() => { setEditingId(item.id); setEditQuantity(item.quantity.toString()) }}
                        className="p-1.5 text-gray-400 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition-all"
                        title="Update quantity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
