import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export interface SaleItem {
  name: string
  qty: number
  rate: number
  gstPercent: number
  category?: string
}

export interface Sale {
  id: string
  invoiceNum: string
  customerName: string
  items: SaleItem[]
  subtotal: number
  gst: number
  grandTotal: number
  timestamp: string
}

interface SalesContextType {
  sales: Sale[]
  recordSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void
  todaySales: Sale[]
  todayRevenue: number
  todayItemsSold: number
  topSellingItems: { name: string; qty: number; revenue: number }[]
  weeklySales: Sale[]
  weeklyRevenue: number
  getItemSoldCount: (itemName: string, period: 'today' | 'week') => number
}

const STORAGE_KEY = 'bb_sales'

function getStartOfDay(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function getStartOfWeek(): Date {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  d.setHours(0, 0, 0, 0)
  return d
}

// Demo sales to show judges the flow works
const DEMO_SALES: Sale[] = [
  {
    id: 'sale-demo-1', invoiceNum: 'INV-2026-1001', customerName: 'Ramesh General Store',
    items: [
      { name: 'Toor Dal (1kg)', qty: 10, rate: 155, gstPercent: 5, category: 'Groceries' },
      { name: 'Basmati Rice (5kg)', qty: 5, rate: 380, gstPercent: 5, category: 'Groceries' },
      { name: 'Sugar (5kg)', qty: 3, rate: 250, gstPercent: 5, category: 'Groceries' },
    ],
    subtotal: 4200, gst: 210, grandTotal: 4410,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
  },
  {
    id: 'sale-demo-2', invoiceNum: 'INV-2026-1002', customerName: 'Priya Beauty Parlour',
    items: [
      { name: 'Clinic Plus Shampoo (340ml)', qty: 6, rate: 199, gstPercent: 18, category: 'Beauty & Personal Care' },
      { name: 'Colgate MaxFresh (150g)', qty: 12, rate: 110, gstPercent: 18, category: 'Beauty & Personal Care' },
    ],
    subtotal: 2514, gst: 452.52, grandTotal: 2966.52,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
  },
  {
    id: 'sale-demo-3', invoiceNum: 'INV-2026-1003', customerName: 'Verma Kirana',
    items: [
      { name: 'Surf Excel (1kg)', qty: 8, rate: 220, gstPercent: 18, category: 'Home & Kitchen' },
      { name: 'Vim Dishwash Bar (3 pack)', qty: 10, rate: 72, gstPercent: 18, category: 'Home & Kitchen' },
      { name: 'Maggi Noodles (Family Pack)', qty: 15, rate: 120, gstPercent: 12, category: 'Groceries' },
      { name: 'Parle-G Biscuit (Pack of 12)', qty: 20, rate: 84, gstPercent: 5, category: 'Groceries' },
    ],
    subtotal: 4760, gst: 714, grandTotal: 5474,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hrs ago
  },
  {
    id: 'sale-demo-4', invoiceNum: 'INV-2026-0998', customerName: 'Hotel Shanti',
    items: [
      { name: 'Fortune Sunflower Oil (1L)', qty: 20, rate: 165, gstPercent: 5, category: 'Groceries' },
      { name: 'Toor Dal (1kg)', qty: 15, rate: 155, gstPercent: 5, category: 'Groceries' },
      { name: 'Basmati Rice (5kg)', qty: 10, rate: 380, gstPercent: 5, category: 'Groceries' },
    ],
    subtotal: 9425, gst: 471.25, grandTotal: 9896.25,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
  },
  {
    id: 'sale-demo-5', invoiceNum: 'INV-2026-0995', customerName: 'Gupta Medical',
    items: [
      { name: 'Colgate MaxFresh (150g)', qty: 24, rate: 110, gstPercent: 18, category: 'Beauty & Personal Care' },
      { name: 'Clinic Plus Shampoo (340ml)', qty: 12, rate: 199, gstPercent: 18, category: 'Beauty & Personal Care' },
    ],
    subtotal: 5028, gst: 905.04, grandTotal: 5933.04,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
]

function loadSales(): Sale[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return DEMO_SALES
}

const SalesContext = createContext<SalesContextType | undefined>(undefined)

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>(loadSales)

  const recordSale = useCallback((sale: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...sale,
      id: `sale-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    }
    setSales(prev => {
      const updated = [newSale, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const todayStart = getStartOfDay()
  const weekStart = getStartOfWeek()

  const todaySales = sales.filter(s => new Date(s.timestamp) >= todayStart)
  const weeklySales = sales.filter(s => new Date(s.timestamp) >= weekStart)

  const todayRevenue = todaySales.reduce((sum, s) => sum + s.grandTotal, 0)
  const weeklyRevenue = weeklySales.reduce((sum, s) => sum + s.grandTotal, 0)
  const todayItemsSold = todaySales.reduce((sum, s) => sum + s.items.reduce((is, i) => is + i.qty, 0), 0)

  // Top selling items (by quantity, this week)
  const itemMap = new Map<string, { qty: number; revenue: number }>()
  weeklySales.forEach(sale => {
    sale.items.forEach(item => {
      const existing = itemMap.get(item.name) || { qty: 0, revenue: 0 }
      itemMap.set(item.name, {
        qty: existing.qty + item.qty,
        revenue: existing.revenue + item.qty * item.rate,
      })
    })
  })
  const topSellingItems = [...itemMap.entries()]
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)

  const getItemSoldCount = useCallback((itemName: string, period: 'today' | 'week') => {
    const filterDate = period === 'today' ? todayStart : weekStart
    return sales
      .filter(s => new Date(s.timestamp) >= filterDate)
      .reduce((sum, s) => sum + s.items
        .filter(i => i.name.toLowerCase().includes(itemName.toLowerCase()))
        .reduce((is, i) => is + i.qty, 0), 0)
  }, [sales, todayStart, weekStart])

  return (
    <SalesContext.Provider value={{
      sales, recordSale, todaySales, todayRevenue, todayItemsSold,
      topSellingItems, weeklySales, weeklyRevenue, getItemSoldCount,
    }}>
      {children}
    </SalesContext.Provider>
  )
}

export function useSales() {
  const context = useContext(SalesContext)
  if (!context) throw new Error('useSales must be used within SalesProvider')
  return context
}
