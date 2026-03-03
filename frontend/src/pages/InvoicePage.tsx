import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Receipt, Plus, Trash2, Download, Printer, IndianRupee,
  Building2, MapPin, Phone, Hash, Calendar, CheckCircle2,
  FileText, Eye
} from 'lucide-react'

interface InvoiceItem {
  id: string
  name: string
  hsn: string
  qty: number
  rate: number
  gstPercent: number
}

const DEMO_ITEMS: InvoiceItem[] = [
  { id: '1', name: 'Premium Basmati Rice 5kg', hsn: '1006', qty: 10, rate: 449, gstPercent: 5 },
  { id: '2', name: 'Fortune Sunflower Oil 5L', hsn: '1512', qty: 5, rate: 750, gstPercent: 5 },
  { id: '3', name: 'Cotton Kurta Set', hsn: '6109', qty: 3, rate: 899, gstPercent: 12 },
]

export default function InvoicePage() {
  const [items, setItems] = useState<InvoiceItem[]>(DEMO_ITEMS)
  const [invoiceNum] = useState(`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`)
  const [showPreview, setShowPreview] = useState(false)
  const [saved, setSaved] = useState(false)
  const [customer, setCustomer] = useState({
    name: 'Verma General Store',
    address: '15, Civil Lines, Lucknow - 226001',
    gstin: '09AABCV1234B1ZX',
    phone: '9876543210',
  })

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', hsn: '', qty: 1, rate: 0, gstPercent: 18 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const subtotal = items.reduce((s, i) => s + (i.qty * i.rate), 0)
  const totalGst = items.reduce((s, i) => s + (i.qty * i.rate * i.gstPercent / 100), 0)
  const cgst = totalGst / 2
  const sgst = totalGst / 2
  const grandTotal = subtotal + totalGst

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">GST Invoice Generator</h1>
          <p className="text-slate-500 text-sm">Create GST-compliant invoices for your customers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Save & Download
          </button>
        </div>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4" />
          Invoice saved! PDF download started.
        </motion.div>
      )}

      {!showPreview ? (
        /* ── Edit Mode ── */
        <div className="space-y-4">
          {/* Invoice Meta */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-orange-500" />
                From (Your Store)
              </h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Sharma Kirana Store</p>
                <p>Shop No. 42, Aminabad Market, Lucknow - 226018</p>
                <p>GSTIN: 09AABCS1234A1ZX</p>
                <p>Phone: +91 98765 43210</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-blue-500" />
                To (Customer)
              </h3>
              <div className="space-y-2">
                <input
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Address"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={customer.gstin}
                    onChange={e => setCustomer({ ...customer, gstin: e.target.value })}
                    placeholder="GSTIN"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="Phone"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Number & Date */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Invoice No:</span>
              <span className="font-bold text-slate-800">{invoiceNum}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Date:</span>
              <span className="font-bold text-slate-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Item</th>
                    <th className="text-left px-3 py-3 font-semibold text-slate-600 w-20">HSN</th>
                    <th className="text-center px-3 py-3 font-semibold text-slate-600 w-16">Qty</th>
                    <th className="text-right px-3 py-3 font-semibold text-slate-600 w-24">Rate</th>
                    <th className="text-center px-3 py-3 font-semibold text-slate-600 w-20">GST %</th>
                    <th className="text-right px-3 py-3 font-semibold text-slate-600 w-24">Amount</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-4 py-2">
                        <input
                          value={item.name}
                          onChange={e => updateItem(item.id, 'name', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Product name"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={item.hsn}
                          onChange={e => updateItem(item.id, 'hsn', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 text-center"
                          min={1}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={e => updateItem(item.id, 'rate', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={item.gstPercent}
                          onChange={e => updateItem(item.id, 'gstPercent', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 text-center"
                        >
                          {[0, 5, 12, 18, 28].map(g => <option key={g} value={g}>{g}%</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-800">
                        &#8377;{(item.qty * item.rate).toLocaleString('en-IN')}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-slate-200">
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="max-w-xs ml-auto space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>&#8377;{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST</span>
                <span>&#8377;{cgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST</span>
                <span>&#8377;{sgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-bold text-slate-800">
                <span>Grand Total</span>
                <span className="flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Preview Mode ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-slate-200 p-8 max-w-3xl mx-auto"
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5 mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">TAX INVOICE</h2>
              <p className="text-xs text-slate-400 mt-1">Original for Recipient</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{invoiceNum}</p>
              <p className="text-xs text-slate-500">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">From</p>
              <p className="text-sm font-semibold text-slate-800">Sharma Kirana Store</p>
              <p className="text-xs text-slate-500">Shop No. 42, Aminabad Market, Lucknow - 226018</p>
              <p className="text-xs text-slate-500">GSTIN: 09AABCS1234A1ZX</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">To</p>
              <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
              <p className="text-xs text-slate-500">{customer.address}</p>
              <p className="text-xs text-slate-500">GSTIN: {customer.gstin}</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-600">#</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-600">Item</th>
                <th className="text-center px-3 py-2 text-xs font-semibold text-slate-600">HSN</th>
                <th className="text-center px-3 py-2 text-xs font-semibold text-slate-600">Qty</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600">Rate</th>
                <th className="text-center px-3 py-2 text-xs font-semibold text-slate-600">GST</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-slate-800">{item.name}</td>
                  <td className="px-3 py-2 text-center text-slate-500">{item.hsn}</td>
                  <td className="px-3 py-2 text-center">{item.qty}</td>
                  <td className="px-3 py-2 text-right">&#8377;{item.rate}</td>
                  <td className="px-3 py-2 text-center">{item.gstPercent}%</td>
                  <td className="px-3 py-2 text-right font-semibold">&#8377;{(item.qty * item.rate).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-slate-200 pt-4">
            <div className="max-w-xs ml-auto space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>&#8377;{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CGST</span>
                <span>&#8377;{cgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SGST</span>
                <span>&#8377;{sgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between text-lg font-bold text-slate-800">
                <span>Grand Total</span>
                <span>&#8377;{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400">This is a computer-generated invoice. No signature required.</p>
            <p className="text-xs text-slate-400 mt-1">Generated by BharatBazaar AI &middot; Powered by AWS</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
