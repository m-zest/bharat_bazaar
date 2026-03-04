import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'
import {
  Receipt, Plus, Trash2, Download, Printer, IndianRupee,
  Building2, MapPin, Phone, Hash, Calendar, CheckCircle2,
  FileText, Eye, MessageCircle, Mail, Share2, X
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
  const [shareModal, setShareModal] = useState<'whatsapp' | 'email' | null>(null)
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

  const invoiceDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const invoiceDateLong = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 })

  // ── PDF Generation ──
  const generatePDF = (): jsPDF => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('TAX INVOICE', pageWidth / 2, y, { align: 'center' })
    y += 6
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text('Original for Recipient', pageWidth / 2, y, { align: 'center' })
    doc.setTextColor(0, 0, 0)
    y += 10

    // Divider line
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(15, y, pageWidth - 15, y)
    y += 8

    // Invoice number and date
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(`Invoice No: ${invoiceNum}`, 15, y)
    doc.text(`Date: ${invoiceDateLong}`, pageWidth - 15, y, { align: 'right' })
    y += 10

    // From / To
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 100)
    doc.text('FROM', 15, y)
    doc.text('TO', pageWidth / 2 + 5, y)
    y += 5

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Sharma Kirana Store', 15, y)
    doc.text(customer.name, pageWidth / 2 + 5, y)
    y += 5

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Shop No. 42, Aminabad Market', 15, y)
    doc.text(customer.address, pageWidth / 2 + 5, y)
    y += 4
    doc.text('Lucknow - 226018', 15, y)
    doc.text(`GSTIN: ${customer.gstin}`, pageWidth / 2 + 5, y)
    y += 4
    doc.text('GSTIN: 09AABCS1234A1ZX', 15, y)
    doc.text(`Phone: +91 ${customer.phone}`, pageWidth / 2 + 5, y)
    y += 4
    doc.text('Phone: +91 98765 43210', 15, y)
    y += 10

    // Table header
    const colX = [15, 22, 90, 110, 130, 152, 175]
    const colLabels = ['#', 'Item', 'HSN', 'Qty', 'Rate (Rs)', 'GST %', 'Amount (Rs)']

    doc.setFillColor(245, 245, 245)
    doc.rect(15, y - 4, pageWidth - 30, 8, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    colLabels.forEach((label, idx) => {
      const align = idx >= 3 ? 'right' : 'left'
      const xPos = idx >= 3 ? colX[idx] + 15 : colX[idx]
      doc.text(label, xPos, y, { align })
    })
    y += 7

    // Table rows
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    items.forEach((item, i) => {
      const amount = item.qty * item.rate
      doc.text(String(i + 1), colX[0], y)
      doc.text(item.name.substring(0, 35), colX[1], y)
      doc.text(item.hsn, colX[2], y)
      doc.text(String(item.qty), colX[3] + 15, y, { align: 'right' })
      doc.text(fmt(item.rate), colX[4] + 15, y, { align: 'right' })
      doc.text(`${item.gstPercent}%`, colX[5] + 15, y, { align: 'right' })
      doc.text(fmt(amount), colX[6] + 15, y, { align: 'right' })
      y += 6

      // Light row separator
      doc.setDrawColor(230, 230, 230)
      doc.setLineWidth(0.2)
      doc.line(15, y - 3, pageWidth - 15, y - 3)
    })

    y += 5

    // Totals
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(130, y, pageWidth - 15, y)
    y += 6

    const totalsX = 140
    const totalsValX = pageWidth - 15

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Subtotal:', totalsX, y)
    doc.text(`Rs ${fmt(subtotal)}`, totalsValX, y, { align: 'right' })
    y += 5

    doc.text('CGST:', totalsX, y)
    doc.text(`Rs ${fmt(cgst)}`, totalsValX, y, { align: 'right' })
    y += 5

    doc.text('SGST:', totalsX, y)
    doc.text(`Rs ${fmt(sgst)}`, totalsValX, y, { align: 'right' })
    y += 3

    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.5)
    doc.line(130, y, pageWidth - 15, y)
    y += 6

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Grand Total:', totalsX, y)
    doc.text(`Rs ${fmt(grandTotal)}`, totalsValX, y, { align: 'right' })
    y += 3

    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.8)
    doc.line(130, y, pageWidth - 15, y)

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.setLineDashPattern([2, 2], 0)
    doc.line(15, footerY - 5, pageWidth - 15, footerY - 5)
    doc.setLineDashPattern([], 0)

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(140, 140, 140)
    doc.text('This is a computer-generated invoice. No signature required.', pageWidth / 2, footerY, { align: 'center' })
    doc.text('Generated by BharatBazaar AI | Powered by AWS', pageWidth / 2, footerY + 4, { align: 'center' })
    doc.setTextColor(0, 0, 0)

    return doc
  }

  const handleDownloadPDF = () => {
    const doc = generatePDF()
    doc.save(`${invoiceNum}.pdf`)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // ── Share Text Builders ──
  const buildWhatsAppText = (): string => {
    let text = `🧾 *TAX INVOICE*\n`
    text += `📄 ${invoiceNum} | ${invoiceDate}\n`
    text += `━━━━━━━━━━━━━━━\n`
    text += `*From:* Sharma Kirana Store\n`
    text += `*To:* ${customer.name}\n\n`
    text += `📦 *Items:*\n`
    items.forEach((item, i) => {
      const amount = item.qty * item.rate
      text += `${i + 1}. ${item.name}\n`
      text += `   ${item.qty} x ₹${fmt(item.rate)} = ₹${fmt(amount)} (GST ${item.gstPercent}%)\n`
    })
    text += `\n━━━━━━━━━━━━━━━\n`
    text += `💰 Subtotal: ₹${fmt(subtotal)}\n`
    text += `📊 CGST: ₹${fmt(cgst)}\n`
    text += `📊 SGST: ₹${fmt(sgst)}\n`
    text += `━━━━━━━━━━━━━━━\n`
    text += `✅ *Grand Total: ₹${fmt(grandTotal)}*\n\n`
    text += `Generated by BharatBazaar AI`
    return text
  }

  const buildEmailBody = (): string => {
    let text = `TAX INVOICE\n`
    text += `Invoice: ${invoiceNum} | Date: ${invoiceDate}\n`
    text += `-------------------------------------------\n`
    text += `From: Sharma Kirana Store\n`
    text += `Shop No. 42, Aminabad Market, Lucknow - 226018\n`
    text += `GSTIN: 09AABCS1234A1ZX\n\n`
    text += `To: ${customer.name}\n`
    text += `${customer.address}\n`
    text += `GSTIN: ${customer.gstin}\n\n`
    text += `Items:\n`
    items.forEach((item, i) => {
      const amount = item.qty * item.rate
      text += `${i + 1}. ${item.name} (HSN: ${item.hsn})\n`
      text += `   Qty: ${item.qty} x Rs ${fmt(item.rate)} = Rs ${fmt(amount)} [GST ${item.gstPercent}%]\n`
    })
    text += `\n-------------------------------------------\n`
    text += `Subtotal:    Rs ${fmt(subtotal)}\n`
    text += `CGST:        Rs ${fmt(cgst)}\n`
    text += `SGST:        Rs ${fmt(sgst)}\n`
    text += `-------------------------------------------\n`
    text += `Grand Total: Rs ${fmt(grandTotal)}\n\n`
    text += `This is a computer-generated invoice.\n`
    text += `Generated by BharatBazaar AI | Powered by AWS`
    return text
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppText())
    window.open(`https://wa.me/?text=${text}`, '_blank')
    setShareModal(null)
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Invoice ${invoiceNum} - Sharma Kirana Store`)
    const body = encodeURIComponent(buildEmailBody())
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self')
    setShareModal(null)
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">GST Invoice Generator</h1>
          <p className="text-gray-400 text-sm">Create GST-compliant invoices for your customers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1a1d] border border-[#2a2a2d] rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4" />
          Invoice saved! PDF download started.
        </motion.div>
      )}

      {/* ── Share / Download Button Group ── */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={() => setShareModal('whatsapp')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-green-600/20"
        >
          <MessageCircle className="w-4 h-4" />
          Send via WhatsApp
        </button>
        <button
          onClick={() => setShareModal('email')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          <Mail className="w-4 h-4" />
          Send via Email
        </button>
      </div>

      {/* ── PDF Preview Info ── */}
      <div className="mb-4 bg-[#1a1a1d] border border-[#2a2a2d] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">PDF will include</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
          <span>TAX INVOICE header</span>
          <span>From/To business details</span>
          <span>Invoice #{invoiceNum}</span>
          <span>Itemized table with HSN codes</span>
          <span>GST breakdown (CGST + SGST)</span>
          <span>Grand total</span>
          <span>BharatBazaar AI footer</span>
        </div>
      </div>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {shareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShareModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#1a1a1d] border border-[#2a2a2d] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2d]">
                <div className="flex items-center gap-2">
                  {shareModal === 'whatsapp' ? (
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Mail className="w-5 h-5 text-blue-400" />
                  )}
                  <h3 className="text-base font-bold text-gray-100">
                    {shareModal === 'whatsapp' ? 'Share via WhatsApp' : 'Share via Email'}
                  </h3>
                </div>
                <button
                  onClick={() => setShareModal(null)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body - Preview */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</p>
                <div className="bg-[#141416] border border-[#333] rounded-xl p-4 max-h-60 overflow-y-auto">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {shareModal === 'whatsapp' ? buildWhatsAppText() : buildEmailBody()}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-4 border-t border-[#2a2a2d] flex gap-2 justify-end">
                <button
                  onClick={() => setShareModal(null)}
                  className="px-4 py-2 bg-[#141416] border border-[#333] rounded-xl text-sm text-gray-300 hover:bg-white/[0.06] transition-colors"
                >
                  Cancel
                </button>
                {shareModal === 'whatsapp' ? (
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Open WhatsApp
                  </button>
                ) : (
                  <button
                    onClick={handleShareEmail}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Open Email Client
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showPreview ? (
        /* ── Edit Mode ── */
        <div className="space-y-4">
          {/* Invoice Meta */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-5">
              <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-orange-500" />
                From (Your Store)
              </h3>
              <div className="space-y-1 text-sm text-gray-400">
                <p className="font-semibold text-gray-100">Sharma Kirana Store</p>
                <p>Shop No. 42, Aminabad Market, Lucknow - 226018</p>
                <p>GSTIN: 09AABCS1234A1ZX</p>
                <p>Phone: +91 98765 43210</p>
              </div>
            </div>

            <div className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-5">
              <h3 className="font-bold text-gray-100 mb-3 flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-blue-500" />
                To (Customer)
              </h3>
              <div className="space-y-2">
                <input
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Address"
                  className="w-full px-3 py-2 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={customer.gstin}
                    onChange={e => setCustomer({ ...customer, gstin: e.target.value })}
                    placeholder="GSTIN"
                    className="w-full px-3 py-2 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="Phone"
                    className="w-full px-3 py-2 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Number & Date */}
          <div className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">Invoice No:</span>
              <span className="font-bold text-gray-100">{invoiceNum}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">Date:</span>
              <span className="font-bold text-gray-100">{invoiceDate}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-[#2a2a2d]">
                    <th className="text-left px-4 py-3 font-semibold text-gray-400">Item</th>
                    <th className="text-left px-3 py-3 font-semibold text-gray-400 w-20">HSN</th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-400 w-16">Qty</th>
                    <th className="text-right px-3 py-3 font-semibold text-gray-400 w-24">Rate</th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-400 w-20">GST %</th>
                    <th className="text-right px-3 py-3 font-semibold text-gray-400 w-24">Amount</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-[#2a2a2d]">
                      <td className="px-4 py-2">
                        <input
                          value={item.name}
                          onChange={e => updateItem(item.id, 'name', e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Product name"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={item.hsn}
                          onChange={e => updateItem(item.id, 'hsn', e.target.value)}
                          className="w-full px-2 py-1.5 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500 text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500 text-center"
                          min={1}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={e => updateItem(item.id, 'rate', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500 text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={item.gstPercent}
                          onChange={e => updateItem(item.id, 'gstPercent', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-[#141416] border border-[#333] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-orange-500 text-center"
                        >
                          {[0, 5, 12, 18, 28].map(g => <option key={g} value={g}>{g}%</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-100">
                        &#8377;{(item.qty * item.rate).toLocaleString('en-IN')}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-[#2a2a2d]">
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-5">
            <div className="max-w-xs ml-auto space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>&#8377;{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>CGST</span>
                <span>&#8377;{cgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>SGST</span>
                <span>&#8377;{sgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-[#2a2a2d] pt-2 flex justify-between text-base font-bold text-gray-100">
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
          className="bg-[#1a1a1d] rounded-xl border border-[#2a2a2d] p-8 max-w-3xl mx-auto"
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-[#2a2a2d] pb-5 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-100">TAX INVOICE</h2>
              <p className="text-xs text-gray-500 mt-1">Original for Recipient</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-100">{invoiceNum}</p>
              <p className="text-xs text-gray-400">{invoiceDateLong}</p>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">From</p>
              <p className="text-sm font-semibold text-gray-100">Sharma Kirana Store</p>
              <p className="text-xs text-gray-400">Shop No. 42, Aminabad Market, Lucknow - 226018</p>
              <p className="text-xs text-gray-400">GSTIN: 09AABCS1234A1ZX</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">To</p>
              <p className="text-sm font-semibold text-gray-100">{customer.name}</p>
              <p className="text-xs text-gray-400">{customer.address}</p>
              <p className="text-xs text-gray-400">GSTIN: {customer.gstin}</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400">#</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-400">Item</th>
                <th className="text-center px-3 py-2 text-xs font-semibold text-gray-400">HSN</th>
                <th className="text-center px-3 py-2 text-xs font-semibold text-gray-400">Qty</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-400">Rate</th>
                <th className="text-center px-3 py-2 text-xs font-semibold text-gray-400">GST</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="border-b border-[#2a2a2d]">
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-100">{item.name}</td>
                  <td className="px-3 py-2 text-center text-gray-400">{item.hsn}</td>
                  <td className="px-3 py-2 text-center">{item.qty}</td>
                  <td className="px-3 py-2 text-right">&#8377;{item.rate}</td>
                  <td className="px-3 py-2 text-center">{item.gstPercent}%</td>
                  <td className="px-3 py-2 text-right font-semibold">&#8377;{(item.qty * item.rate).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-[#2a2a2d] pt-4">
            <div className="max-w-xs ml-auto space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>&#8377;{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>CGST</span>
                <span>&#8377;{cgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>SGST</span>
                <span>&#8377;{sgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-[#333] pt-2 flex justify-between text-lg font-bold text-gray-100">
                <span>Grand Total</span>
                <span>&#8377;{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-dashed border-[#333] text-center">
            <p className="text-xs text-gray-500">This is a computer-generated invoice. No signature required.</p>
            <p className="text-xs text-gray-500 mt-1">Generated by BharatBazaar AI &middot; Powered by AWS</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
