import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Check, X, Package, Loader2, RotateCcw, ArrowRight, Database, BarChart3, IndianRupee, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useToast } from '../components/Toast'
import DemoModeBadge from '../components/DemoModeBadge'

interface ExtractedItem {
  name: string
  nameHi?: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalPrice: number
  category: string
  checked: boolean
}

const SCAN_STAGES = [
  'Reading items...',
  'Detecting prices...',
  'Identifying products...',
  'Preparing results...',
]

export default function ScannerPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanStage, setScanStage] = useState(0)
  const [items, setItems] = useState<ExtractedItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [demoMode, setDemoMode] = useState(false)
  const [addingToInventory, setAddingToInventory] = useState(false)
  const [addedToInventory, setAddedToInventory] = useState(false)
  const [addedCount, setAddedCount] = useState(0)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Scan the bill
    scanBill(file)
  }

  async function scanBill(file: File) {
    setScanning(true)
    setScanStage(0)
    setItems([])

    // Animate through scan stages
    const stageInterval = setInterval(() => {
      setScanStage(prev => Math.min(prev + 1, SCAN_STAGES.length - 1))
    }, 1200)

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = reject
      })

      const result = await api.scanBill({ image: base64, mimeType: file.type })

      if (result?.items) {
        setItems(result.items.map((item: any) => ({ ...item, checked: true })))
        setTotalAmount(result.totalAmount || 0)
        setDemoMode(result.demoMode || false)
        if (result.demoMode) {
          toast('info', 'AI demo mode — showing sample bill data')
        } else {
          toast('success', `${result.items.length} items detected!`)
        }
      } else {
        toast('error', 'Could not read the bill. Try a clearer photo.')
      }
    } catch (err) {
      toast('error', 'Scan failed. Try again.')
    } finally {
      clearInterval(stageInterval)
      setScanning(false)
    }
  }

  function toggleItem(index: number) {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    ))
  }

  async function addToInventory() {
    const checkedItems = items.filter(i => i.checked)
    if (checkedItems.length === 0) {
      toast('warning', 'Select at least one item')
      return
    }

    setAddingToInventory(true)

    try {
      for (const item of checkedItems) {
        await api.updateInventoryItem({
          item: {
            id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: item.name,
            category: item.category,
            costPrice: item.pricePerUnit,
            sellingPrice: Math.round(item.pricePerUnit * 1.25),
            quantity: item.quantity,
            dailySellRate: 2,
            reorderLevel: 10,
            lastUpdated: new Date().toISOString(),
            source: 'bill_scan',
          },
        })
      }

      setAddedCount(checkedItems.length)
      setAddedToInventory(true)
      toast('success', `${checkedItems.length} items added to inventory!`)
    } catch {
      toast('error', 'Failed to add some items. Try again.')
    } finally {
      setAddingToInventory(false)
    }
  }

  function reset() {
    setImagePreview(null)
    setItems([])
    setTotalAmount(0)
    setDemoMode(false)
    setAddedToInventory(false)
    setAddedCount(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="p-6 lg:p-8 max-w-[900px]">
      {/* Page Header */}
      <div className="page-header rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-violet-400 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Camera className="w-6 h-6 text-violet-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Khata Scanner</h1>
            <p className="text-sm text-white/60">Photo lo, inventory update ho! 📸</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {!imagePreview && !scanning && items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1d] rounded-2xl shadow-sm border-2 border-dashed border-[#333] hover:border-orange-500/30 transition-colors"
        >
          <div className="flex flex-col items-center justify-center py-16 px-8">
            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-20 h-20 rounded-2xl bg-orange-500/5 flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-100 mb-1">Upload Wholesale Bill</h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Take a photo of your wholesale bill or upload from gallery. AI will extract all items automatically.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] text-gray-300 rounded-xl text-sm font-semibold cursor-pointer hover:bg-white/[0.06] transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Scanning Animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#1a1a1d] rounded-2xl shadow-sm border border-[#2a2a2d] overflow-hidden"
          >
            {/* Image with scanning overlay */}
            {imagePreview && (
              <div className="relative h-48 overflow-hidden">
                <img src={imagePreview} alt="Bill" className="w-full h-full object-cover" />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40" />
                {/* Scanning laser line */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-lg shadow-green-400/50"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-green-400" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-green-400" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-green-400" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-400" />
              </div>
            )}

            {/* Status */}
            <div className="p-6 text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-3 text-orange-500 animate-spin" />
              <p className="text-sm font-semibold text-gray-300 mb-2">
                {SCAN_STAGES[scanStage]}
              </p>
              {/* Progress bar */}
              <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden max-w-xs mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-green-500 rounded-full"
                  animate={{ width: `${((scanStage + 1) / SCAN_STAGES.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">AI is reading your bill...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {!scanning && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Image preview (small) */}
          {imagePreview && (
            <div className="flex gap-4 items-start">
              <img src={imagePreview} alt="Scanned bill" className="w-20 h-20 rounded-xl object-cover border border-[#2a2a2d]" />
              <div>
                <p className="text-sm font-bold text-gray-100">
                  {items.length} items detected
                </p>
                <p className="text-xs text-gray-500">
                  Total: ₹{totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          )}

          {/* Items list */}
          <div className="bg-[#1a1a1d] rounded-2xl shadow-sm border border-[#2a2a2d] overflow-hidden">
            <div className="px-5 py-3 bg-green-500/10 border-b border-green-500/20 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">
                {items.filter(i => i.checked).length} of {items.length} items selected
              </span>
            </div>

            <div className="divide-y divide-[#2a2a2d]">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 px-5 py-3 hover:bg-white/[0.06] transition-colors ${
                    !item.checked ? 'opacity-50' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                      item.checked
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-[#333] bg-[#141416]'
                    }`}
                  >
                    {item.checked && <Check className="w-3 h-3" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-100">{item.name}</p>
                    {item.nameHi && (
                      <p className="text-[10px] text-gray-400 font-hindi">{item.nameHi}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {item.quantity} {item.unit} × ₹{item.pricePerUnit}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-100">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.03] text-gray-500">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <div className="px-5 py-3 bg-white/[0.03] border-t border-[#2a2a2d] flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-300">Total</span>
              <span className="text-lg font-bold text-gray-100">
                ₹{items.filter(i => i.checked).reduce((sum, i) => sum + i.totalPrice, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addToInventory}
              disabled={addingToInventory || items.filter(i => i.checked).length === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors disabled:opacity-40"
            >
              {addingToInventory ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Package className="w-4 h-4" />
              )}
              {addingToInventory ? 'Adding...' : 'Add All to Inventory'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reset}
              className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] text-gray-300 rounded-xl text-sm font-semibold hover:bg-white/[0.06] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Scan Another
            </motion.button>
          </div>

          {/* Data Flow Success Banner */}
          {addedToInventory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <h4 className="text-sm font-bold text-green-400">Data Flow Complete!</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Camera, label: 'Bill Scanned', detail: 'AI Vision extracted items', color: 'text-violet-400' },
                  { icon: Database, label: 'Inventory Updated', detail: `${addedCount} items saved to DynamoDB`, color: 'text-blue-400' },
                  { icon: IndianRupee, label: 'Prices Set', detail: 'Auto 25% markup applied', color: 'text-orange-400' },
                  { icon: BarChart3, label: 'Analytics Fed', detail: 'Dashboard insights updated', color: 'text-teal-400' },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-start gap-2 p-2 bg-white/[0.03] rounded-lg">
                    <step.icon className={`w-4 h-4 ${step.color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-[11px] font-semibold text-gray-200">{step.label}</p>
                      <p className="text-[9px] text-gray-500">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate('/inventory')}
                  className="flex items-center gap-2 text-sm text-orange-400 font-semibold bg-orange-500/10 px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-colors"
                >
                  View Inventory <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-sm text-gray-400 font-medium hover:text-gray-300 transition-colors"
                >
                  Back to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {!addedToInventory && (
            <button
              onClick={() => navigate('/inventory')}
              className="flex items-center gap-2 text-sm text-orange-400 font-medium hover:text-orange-300 transition-colors"
            >
              View Inventory <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}

      <DemoModeBadge visible={demoMode} />
    </div>
  )
}
