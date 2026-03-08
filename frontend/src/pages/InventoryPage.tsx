import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Plus, Trash2, AlertTriangle, TrendingDown, ShoppingCart, Edit2, Check, X, RefreshCw, Loader2, Camera, FileText, MessageCircle, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useSales } from '../utils/SalesContext'
import { useToast } from '../components/Toast'
import { getOnboardingData } from '../components/OnboardingModal'
import { buildInventoryFromOnboarding } from '../utils/productCatalog'

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
  source?: 'bill_scan' | 'manual' | 'wholesale' | 'whatsapp'
}

const SOURCE_CONFIG = {
  bill_scan: { label: 'Bill Scan', icon: Camera, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  manual: { label: 'Manual', icon: FileText, color: 'text-gray-400', bg: 'bg-white/[0.04]' },
  wholesale: { label: 'Wholesale Order', icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
}

// Build demo inventory from onboarding selections (personalized) or fallback to defaults
function getDemoInventory(): InventoryItem[] {
  const onboarding = getOnboardingData()
  if (onboarding && onboarding.products && onboarding.products.length > 0) {
    // Personalized: use what the store owner said they sell
    return buildInventoryFromOnboarding(onboarding.products, onboarding.category).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      quantity: p.defaultQuantity,
      dailySellRate: p.dailySellRate,
      reorderLevel: p.reorderLevel,
      lastUpdated: new Date().toISOString(),
      source: p.source as InventoryItem['source'],
    }))
  }

  // Fallback: default groceries store
  return [
    { id: 'demo-1', name: 'Toor Dal (1kg)', category: 'Groceries', costPrice: 120, sellingPrice: 155, quantity: 45, dailySellRate: 5, reorderLevel: 15, lastUpdated: new Date().toISOString(), source: 'bill_scan' },
    { id: 'demo-2', name: 'Basmati Rice (5kg)', category: 'Groceries', costPrice: 280, sellingPrice: 380, quantity: 22, dailySellRate: 3, reorderLevel: 10, lastUpdated: new Date().toISOString(), source: 'wholesale' },
    { id: 'demo-3', name: 'Surf Excel (1kg)', category: 'Home & Kitchen', costPrice: 180, sellingPrice: 220, quantity: 8, dailySellRate: 4, reorderLevel: 12, lastUpdated: new Date().toISOString(), source: 'bill_scan' },
    { id: 'demo-4', name: 'Parle-G Biscuit (Pack of 12)', category: 'Groceries', costPrice: 60, sellingPrice: 84, quantity: 5, dailySellRate: 6, reorderLevel: 20, lastUpdated: new Date().toISOString(), source: 'whatsapp' },
    { id: 'demo-5', name: 'Sugar (5kg)', category: 'Groceries', costPrice: 195, sellingPrice: 250, quantity: 35, dailySellRate: 4, reorderLevel: 10, lastUpdated: new Date().toISOString(), source: 'wholesale' },
    { id: 'demo-6', name: 'Amul Butter (500g)', category: 'Groceries', costPrice: 220, sellingPrice: 275, quantity: 12, dailySellRate: 3, reorderLevel: 8, lastUpdated: new Date().toISOString(), source: 'bill_scan' },
    { id: 'demo-7', name: 'Vim Dishwash Bar (3 pack)', category: 'Home & Kitchen', costPrice: 55, sellingPrice: 72, quantity: 18, dailySellRate: 2, reorderLevel: 8, lastUpdated: new Date().toISOString(), source: 'manual' },
    { id: 'demo-8', name: 'Maggi Noodles (Family Pack)', category: 'Groceries', costPrice: 96, sellingPrice: 120, quantity: 0, dailySellRate: 8, reorderLevel: 15, lastUpdated: new Date().toISOString(), source: 'whatsapp' },
    { id: 'demo-9', name: 'Clinic Plus Shampoo (340ml)', category: 'Beauty & Personal Care', costPrice: 155, sellingPrice: 199, quantity: 14, dailySellRate: 1, reorderLevel: 5, lastUpdated: new Date().toISOString(), source: 'bill_scan' },
    { id: 'demo-10', name: 'Fortune Sunflower Oil (1L)', category: 'Groceries', costPrice: 130, sellingPrice: 165, quantity: 28, dailySellRate: 3, reorderLevel: 10, lastUpdated: new Date().toISOString(), source: 'wholesale' },
    { id: 'demo-11', name: 'Colgate MaxFresh (150g)', category: 'Beauty & Personal Care', costPrice: 85, sellingPrice: 110, quantity: 20, dailySellRate: 2, reorderLevel: 8, lastUpdated: new Date().toISOString(), source: 'manual' },
    { id: 'demo-12', name: 'Britannia Good Day (Pack of 8)', category: 'Groceries', costPrice: 70, sellingPrice: 96, quantity: 3, dailySellRate: 5, reorderLevel: 15, lastUpdated: new Date().toISOString(), source: 'bill_scan' },
  ]
}

export default function InventoryPage() {
  const { toast } = useToast()
  const { getItemSoldCount } = useSales()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState('')
  const [newItem, setNewItem] = useState({ name: '', category: 'Groceries', costPrice: '', sellingPrice: '', quantity: '', dailySellRate: '', reorderLevel: '' })

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getInventory()
      const items = data.items || []
      setInventory(items.length > 0 ? items : getDemoInventory())
    } catch (err: any) {
      // Fallback to demo data on error
      setInventory(getDemoInventory())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  async function addItem() {
    if (!newItem.name || !newItem.costPrice || !newItem.quantity) return
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      costPrice: Number(newItem.costPrice),
      sellingPrice: Number(newItem.sellingPrice) || Math.round(Number(newItem.costPrice) * 1.3),
      quantity: Number(newItem.quantity),
      dailySellRate: Number(newItem.dailySellRate) || 2,
      reorderLevel: Number(newItem.reorderLevel) || 10,
      lastUpdated: new Date().toISOString(),
    }
    try {
      setSaving(true)
      await api.updateInventoryItem({ item })
      setInventory(prev => [...prev, item])
      setNewItem({ name: '', category: 'Groceries', costPrice: '', sellingPrice: '', quantity: '', dailySellRate: '', reorderLevel: '' })
      setShowAddForm(false)
      toast('success', `${item.name} added to inventory!`)
    } catch (err: any) {
      setError(err.message || 'Failed to add item')
      toast('error', 'Failed to add item')
    } finally {
      setSaving(false)
    }
  }

  async function removeItem(id: string) {
    try {
      setSaving(true)
      await api.deleteInventoryItem({ itemId: id })
      setInventory(prev => prev.filter(item => item.id !== id))
      toast('success', 'Item removed from inventory')
    } catch (err: any) {
      setError(err.message || 'Failed to delete item')
      toast('error', 'Failed to delete item')
    } finally {
      setSaving(false)
    }
  }

  async function updateQuantity(id: string) {
    try {
      setSaving(true)
      await api.updateInventoryQuantity({ itemId: id, quantity: Number(editQuantity) })
      setInventory(prev => prev.map(item =>
        item.id === id ? { ...item, quantity: Number(editQuantity), lastUpdated: new Date().toISOString() } : item
      ))
      setEditingId(null)
      toast('success', 'Quantity updated!')
    } catch (err: any) {
      setError(err.message || 'Failed to update quantity')
      toast('error', 'Failed to update quantity')
    } finally {
      setSaving(false)
    }
  }

  function getDaysLeft(item: InventoryItem) {
    return item.dailySellRate > 0 ? Math.round(item.quantity / item.dailySellRate) : 999
  }

  function getStatus(item: InventoryItem) {
    const daysLeft = getDaysLeft(item)
    if (item.quantity <= 0) return { label: 'Out of Stock', color: 'bg-red-500/15 text-red-400', severity: 'critical' }
    if (item.quantity <= item.reorderLevel) return { label: 'Low Stock', color: 'bg-yellow-500/15 text-yellow-400', severity: 'warning' }
    if (daysLeft <= 3) return { label: `${daysLeft}d left`, color: 'bg-red-500/15 text-red-400', severity: 'warning' }
    if (daysLeft <= 7) return { label: `${daysLeft}d left`, color: 'bg-yellow-500/15 text-yellow-400', severity: 'info' }
    return { label: 'In Stock', color: 'bg-green-500/15 text-green-400', severity: 'ok' }
  }

  const alerts = inventory
    .filter(item => getStatus(item).severity !== 'ok')
    .sort((a, b) => getDaysLeft(a) - getDaysLeft(b))

  const totalValue = inventory.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)
  const totalCost = inventory.reduce((sum, item) => sum + item.costPrice * item.quantity, 0)
  const lowStockCount = alerts.length

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1400px] flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-saffron-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading inventory...</p>
        </div>
      </div>
    )
  }

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
            <p className="text-sm text-white/60">Real-time stock management</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={fetchInventory}
              disabled={saving}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/25 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: inventory.length, icon: Package, color: 'text-bazaar-500', bg: 'bg-bazaar-500/10' },
          { label: 'Inventory Value', value: `Rs.${totalValue.toLocaleString()}`, icon: ShoppingCart, color: 'text-saffron-500', bg: 'bg-saffron-500/10' },
          { label: 'Total Cost', value: `Rs.${totalCost.toLocaleString()}`, icon: TrendingDown, color: 'text-gray-500', bg: 'bg-white/[0.03]' },
          { label: 'Low Stock Alerts', value: lowStockCount, icon: AlertTriangle, color: lowStockCount > 0 ? 'text-red-500' : 'text-green-500', bg: lowStockCount > 0 ? 'bg-red-500/10' : 'bg-green-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d] hover:shadow-md transition-all">
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
        <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-red-500/20 mb-6">
          <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Reorder Alerts
          </h3>
          <div className="space-y-2">
            {alerts.map(item => {
              const daysLeft = getDaysLeft(item)
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-100">{item.name}</p>
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
            <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-saffron-500/20">
              <h3 className="font-semibold text-gray-100 mb-3">Add New Product</h3>
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
                <button onClick={addItem} disabled={saving} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} {saving ? 'Saving...' : 'Add'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Table */}
      <div className="bg-[#1a1a1d] rounded-2xl p-5 shadow-sm border border-[#2a2a2d] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2d]">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Source</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Category</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Cost</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Selling</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Quantity</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Daily Rate</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Days Left</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Sold Today</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Sold/Week</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-12 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No inventory items yet. Add your first product above.</p>
                </td>
              </tr>
            ) : inventory.map(item => {
              const status = getStatus(item)
              const daysLeft = getDaysLeft(item)
              return (
                <tr key={item.id} className="border-b border-[#2a2a2d] hover:bg-white/[0.06]">
                  <td className="py-3 px-4 font-medium text-gray-100">{item.name}</td>
                  <td className="text-center py-3 px-4">
                    {(() => {
                      const src = SOURCE_CONFIG[item.source || 'manual']
                      const SrcIcon = src.icon
                      return (
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${src.bg} ${src.color}`}>
                          <SrcIcon className="w-3 h-3" />
                          {src.label}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="text-xs px-2 py-1 bg-white/[0.03] text-gray-400 rounded-md">{item.category}</span>
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
                          className="w-16 px-2 py-1 border border-[#333] bg-[#141416] text-gray-100 rounded text-center text-sm"
                          autoFocus
                        />
                        <button onClick={() => updateQuantity(item.id)} disabled={saving} className="p-1 text-green-400 hover:bg-green-500/10 rounded disabled:opacity-50">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-white/[0.06] rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <span className="font-bold">{item.quantity}</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4 text-gray-500">{item.dailySellRate}/day</td>
                  <td className="text-center py-3 px-4">
                    <span className={`font-medium ${daysLeft <= 3 ? 'text-red-400' : daysLeft <= 7 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {daysLeft < 999 ? `${daysLeft}d` : '—'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    {(() => {
                      const sold = getItemSoldCount(item.name, 'today')
                      return sold > 0
                        ? <span className="text-xs font-bold text-green-400">{sold}</span>
                        : <span className="text-xs text-gray-600">—</span>
                    })()}
                  </td>
                  <td className="text-center py-3 px-4">
                    {(() => {
                      const sold = getItemSoldCount(item.name, 'week')
                      return sold > 0
                        ? <span className="text-xs font-bold text-saffron-400">{sold}</span>
                        : <span className="text-xs text-gray-600">—</span>
                    })()}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        onClick={() => { setEditingId(item.id); setEditQuantity(item.quantity.toString()) }}
                        className="p-1.5 text-gray-400 hover:text-saffron-400 hover:bg-saffron-500/10 rounded-lg transition-all"
                        title="Update quantity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={saving}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
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
