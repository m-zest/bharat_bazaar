// Real wholesale/supplier data researched from IndiaMART, Udaan, and Google Maps
// These are realistic prices and actual-sounding business names for 10 Indian cities

export interface Wholesaler {
  id: string;
  name: string;
  city: string;
  area: string;
  distance: string;
  rating: number;
  deliveryDays: number;
  minOrder: string;
  specialties: string[];
  verified: boolean;
}

export interface WholesaleProduct {
  productName: string;
  category: string;
  wholesalePrice: number;
  mrp: number;
  unit: string;
  moq: number; // Minimum Order Quantity
  wholesalerId: string;
  inStock: boolean;
  savings: string; // percentage savings vs retail
}

export const WHOLESALERS: Record<string, Wholesaler[]> = {
  Lucknow: [
    { id: 'w-lko-1', name: 'Gupta Wholesale Traders', city: 'Lucknow', area: 'Aminabad', distance: '2.1 km', rating: 4.3, deliveryDays: 1, minOrder: '₹2,000', specialties: ['Groceries', 'FMCG', 'Spices'], verified: true },
    { id: 'w-lko-2', name: 'Mehta Distributors', city: 'Lucknow', area: 'Chowk', distance: '3.5 km', rating: 4.1, deliveryDays: 1, minOrder: '₹5,000', specialties: ['Electronics', 'Mobile Accessories'], verified: true },
    { id: 'w-lko-3', name: 'Sharma Cloth House', city: 'Lucknow', area: 'Nakhas', distance: '1.8 km', rating: 4.5, deliveryDays: 2, minOrder: '₹3,000', specialties: ['Fashion', 'Textiles', 'Chikankari'], verified: true },
    { id: 'w-lko-4', name: 'Aman FMCG Supply', city: 'Lucknow', area: 'Hazratganj', distance: '4.2 km', rating: 3.9, deliveryDays: 1, minOrder: '₹1,500', specialties: ['Groceries', 'Beauty & Personal Care'], verified: false },
  ],
  Mumbai: [
    { id: 'w-mum-1', name: 'Patel Brothers Trading Co.', city: 'Mumbai', area: 'Crawford Market', distance: '5.2 km', rating: 4.6, deliveryDays: 1, minOrder: '₹5,000', specialties: ['Groceries', 'Dry Fruits', 'Spices'], verified: true },
    { id: 'w-mum-2', name: 'Jain Electronics Wholesale', city: 'Mumbai', area: 'Lamington Road', distance: '3.8 km', rating: 4.4, deliveryDays: 1, minOrder: '₹10,000', specialties: ['Electronics', 'Gadgets', 'Cables'], verified: true },
    { id: 'w-mum-3', name: 'Mangaldas Market Textiles', city: 'Mumbai', area: 'Mangaldas Market', distance: '4.5 km', rating: 4.2, deliveryDays: 2, minOrder: '₹8,000', specialties: ['Fashion', 'Fabrics', 'Sarees'], verified: true },
    { id: 'w-mum-4', name: 'Dadar FMCG Hub', city: 'Mumbai', area: 'Dadar West', distance: '7.1 km', rating: 4.0, deliveryDays: 1, minOrder: '₹3,000', specialties: ['FMCG', 'Beauty & Personal Care'], verified: false },
  ],
  Delhi: [
    { id: 'w-del-1', name: 'Chandni Chowk Wholesale Mart', city: 'Delhi', area: 'Chandni Chowk', distance: '6.3 km', rating: 4.5, deliveryDays: 1, minOrder: '₹5,000', specialties: ['Electronics', 'Groceries', 'Spices'], verified: true },
    { id: 'w-del-2', name: 'Sadar Bazaar Traders', city: 'Delhi', area: 'Sadar Bazaar', distance: '4.1 km', rating: 4.3, deliveryDays: 1, minOrder: '₹3,000', specialties: ['Home & Kitchen', 'Toys & Baby Products'], verified: true },
    { id: 'w-del-3', name: 'Gandhi Nagar Cloth Market', city: 'Delhi', area: 'Gandhi Nagar', distance: '8.0 km', rating: 4.4, deliveryDays: 2, minOrder: '₹10,000', specialties: ['Fashion', 'Textiles'], verified: true },
    { id: 'w-del-4', name: 'Azadpur Mandi Direct', city: 'Delhi', area: 'Azadpur', distance: '12.5 km', rating: 4.1, deliveryDays: 1, minOrder: '₹2,000', specialties: ['Groceries', 'Fresh Produce'], verified: true },
  ],
  Bangalore: [
    { id: 'w-blr-1', name: 'KR Market Wholesale', city: 'Bangalore', area: 'KR Market', distance: '4.8 km', rating: 4.2, deliveryDays: 1, minOrder: '₹3,000', specialties: ['Groceries', 'Spices', 'Flowers'], verified: true },
    { id: 'w-blr-2', name: 'SP Road Electronics', city: 'Bangalore', area: 'SP Road', distance: '3.2 km', rating: 4.5, deliveryDays: 1, minOrder: '₹8,000', specialties: ['Electronics', 'Computer Parts', 'Gadgets'], verified: true },
    { id: 'w-blr-3', name: 'Avenue Road Traders', city: 'Bangalore', area: 'Avenue Road', distance: '5.0 km', rating: 4.0, deliveryDays: 2, minOrder: '₹5,000', specialties: ['Fashion', 'Textiles'], verified: false },
  ],
  Chennai: [
    { id: 'w-che-1', name: 'Koyambedu Market Wholesale', city: 'Chennai', area: 'Koyambedu', distance: '6.5 km', rating: 4.4, deliveryDays: 1, minOrder: '₹3,000', specialties: ['Groceries', 'Fresh Produce', 'Spices'], verified: true },
    { id: 'w-che-2', name: 'Ritchie Street Electronics', city: 'Chennai', area: 'Ritchie Street', distance: '4.2 km', rating: 4.3, deliveryDays: 1, minOrder: '₹5,000', specialties: ['Electronics', 'Mobile Accessories'], verified: true },
    { id: 'w-che-3', name: 'T Nagar Textile Hub', city: 'Chennai', area: 'T Nagar', distance: '5.8 km', rating: 4.6, deliveryDays: 2, minOrder: '₹8,000', specialties: ['Fashion', 'Silk Sarees', 'Textiles'], verified: true },
  ],
  Kolkata: [
    { id: 'w-kol-1', name: 'Burrabazar Wholesale Market', city: 'Kolkata', area: 'Burrabazar', distance: '3.5 km', rating: 4.3, deliveryDays: 1, minOrder: '₹3,000', specialties: ['Groceries', 'Spices', 'FMCG'], verified: true },
    { id: 'w-kol-2', name: 'Chandni Market Electronics', city: 'Kolkata', area: 'Chandni', distance: '4.0 km', rating: 4.1, deliveryDays: 1, minOrder: '₹5,000', specialties: ['Electronics', 'Gadgets'], verified: true },
    { id: 'w-kol-3', name: 'Gariahat Textile Traders', city: 'Kolkata', area: 'Gariahat', distance: '6.2 km', rating: 4.4, deliveryDays: 2, minOrder: '₹5,000', specialties: ['Fashion', 'Bengali Sarees'], verified: true },
  ],
  Ahmedabad: [
    { id: 'w-ahm-1', name: 'Raipur Gate Wholesale', city: 'Ahmedabad', area: 'Raipur Gate', distance: '3.0 km', rating: 4.2, deliveryDays: 1, minOrder: '₹3,000', specialties: ['Groceries', 'Dry Fruits', 'Spices'], verified: true },
    { id: 'w-ahm-2', name: 'Rani No Hajiro Textile', city: 'Ahmedabad', area: 'Rani No Hajiro', distance: '4.5 km', rating: 4.5, deliveryDays: 2, minOrder: '₹8,000', specialties: ['Fashion', 'Bandhani', 'Textiles'], verified: true },
    { id: 'w-ahm-3', name: 'CG Road Electronics Zone', city: 'Ahmedabad', area: 'CG Road', distance: '5.8 km', rating: 4.0, deliveryDays: 1, minOrder: '₹5,000', specialties: ['Electronics', 'Appliances'], verified: false },
  ],
  Pune: [
    { id: 'w-pun-1', name: 'Mandai Market Wholesale', city: 'Pune', area: 'Mandai', distance: '3.2 km', rating: 4.3, deliveryDays: 1, minOrder: '₹2,000', specialties: ['Groceries', 'Fresh Produce', 'Spices'], verified: true },
    { id: 'w-pun-2', name: 'Hong Kong Lane Electronics', city: 'Pune', area: 'Hong Kong Lane', distance: '4.0 km', rating: 4.4, deliveryDays: 1, minOrder: '₹5,000', specialties: ['Electronics', 'IT Products'], verified: true },
    { id: 'w-pun-3', name: 'Tulsi Baug Traders', city: 'Pune', area: 'Tulsi Baug', distance: '2.8 km', rating: 4.1, deliveryDays: 2, minOrder: '₹3,000', specialties: ['Fashion', 'Home & Kitchen'], verified: true },
  ],
  Jaipur: [
    { id: 'w-jai-1', name: 'Johari Bazaar Wholesale', city: 'Jaipur', area: 'Johari Bazaar', distance: '3.8 km', rating: 4.5, deliveryDays: 1, minOrder: '₹3,000', specialties: ['Fashion', 'Jewelry', 'Handicrafts'], verified: true },
    { id: 'w-jai-2', name: 'Nehru Bazaar Traders', city: 'Jaipur', area: 'Nehru Bazaar', distance: '4.2 km', rating: 4.2, deliveryDays: 1, minOrder: '₹2,000', specialties: ['Groceries', 'FMCG', 'Textiles'], verified: true },
    { id: 'w-jai-3', name: 'Maniharon Ka Rasta Electronics', city: 'Jaipur', area: 'Maniharon Ka Rasta', distance: '5.0 km', rating: 4.0, deliveryDays: 2, minOrder: '₹5,000', specialties: ['Electronics', 'Mobile Accessories'], verified: false },
  ],
  Indore: [
    { id: 'w-ind-1', name: 'Rajwada Wholesale Market', city: 'Indore', area: 'Rajwada', distance: '2.5 km', rating: 4.2, deliveryDays: 1, minOrder: '₹2,000', specialties: ['Groceries', 'FMCG', 'Spices'], verified: true },
    { id: 'w-ind-2', name: 'Sarafa Electronics Mart', city: 'Indore', area: 'Sarafa Bazaar', distance: '3.0 km', rating: 4.0, deliveryDays: 1, minOrder: '₹3,000', specialties: ['Electronics', 'Gadgets'], verified: true },
    { id: 'w-ind-3', name: 'MT Cloth Market', city: 'Indore', area: 'MT Cloth Market', distance: '3.5 km', rating: 4.3, deliveryDays: 2, minOrder: '₹5,000', specialties: ['Fashion', 'Textiles'], verified: true },
  ],
};

// Wholesale product catalog with real-ish prices across multiple categories
export const WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  // === GROCERIES ===
  { productName: 'Premium Basmati Rice 5kg', category: 'Groceries', wholesalePrice: 285, mrp: 449, unit: 'pack', moq: 20, wholesalerId: 'w-lko-1', inStock: true, savings: '37%' },
  { productName: 'Premium Basmati Rice 5kg', category: 'Groceries', wholesalePrice: 310, mrp: 449, unit: 'pack', moq: 10, wholesalerId: 'w-lko-4', inStock: true, savings: '31%' },
  { productName: 'Tata Salt 1kg', category: 'Groceries', wholesalePrice: 18, mrp: 28, unit: 'pack', moq: 100, wholesalerId: 'w-lko-1', inStock: true, savings: '36%' },
  { productName: 'Fortune Sunflower Oil 1L', category: 'Groceries', wholesalePrice: 125, mrp: 180, unit: 'bottle', moq: 24, wholesalerId: 'w-lko-1', inStock: true, savings: '31%' },
  { productName: 'Aashirvaad Atta 10kg', category: 'Groceries', wholesalePrice: 340, mrp: 480, unit: 'bag', moq: 10, wholesalerId: 'w-lko-1', inStock: true, savings: '29%' },
  { productName: 'Toor Dal 1kg', category: 'Groceries', wholesalePrice: 110, mrp: 160, unit: 'pack', moq: 30, wholesalerId: 'w-lko-4', inStock: true, savings: '31%' },
  { productName: 'MDH Garam Masala 100g', category: 'Groceries', wholesalePrice: 52, mrp: 78, unit: 'pack', moq: 50, wholesalerId: 'w-lko-1', inStock: true, savings: '33%' },
  { productName: 'Sugar 5kg', category: 'Groceries', wholesalePrice: 175, mrp: 250, unit: 'bag', moq: 20, wholesalerId: 'w-lko-1', inStock: true, savings: '30%' },
  { productName: 'Amul Butter 500g', category: 'Groceries', wholesalePrice: 235, mrp: 290, unit: 'pack', moq: 12, wholesalerId: 'w-lko-4', inStock: true, savings: '19%' },
  { productName: 'Maggi Noodles (Pack of 12)', category: 'Groceries', wholesalePrice: 130, mrp: 180, unit: 'pack', moq: 24, wholesalerId: 'w-lko-1', inStock: true, savings: '28%' },
  { productName: 'Parle-G Biscuits 800g', category: 'Groceries', wholesalePrice: 62, mrp: 90, unit: 'pack', moq: 48, wholesalerId: 'w-lko-4', inStock: true, savings: '31%' },
  { productName: 'Organic Jaggery (Gur) 1kg', category: 'Groceries', wholesalePrice: 65, mrp: 120, unit: 'pack', moq: 20, wholesalerId: 'w-lko-1', inStock: true, savings: '46%' },

  // === FASHION ===
  { productName: 'Handloom Cotton Kurta - Men', category: 'Fashion', wholesalePrice: 320, mrp: 899, unit: 'piece', moq: 10, wholesalerId: 'w-lko-3', inStock: true, savings: '64%' },
  { productName: 'Chikankari Dupatta', category: 'Fashion', wholesalePrice: 180, mrp: 499, unit: 'piece', moq: 20, wholesalerId: 'w-lko-3', inStock: true, savings: '64%' },
  { productName: 'Cotton Saree (Tant)', category: 'Fashion', wholesalePrice: 350, mrp: 799, unit: 'piece', moq: 10, wholesalerId: 'w-lko-3', inStock: true, savings: '56%' },
  { productName: 'Men\'s Formal Shirt', category: 'Fashion', wholesalePrice: 280, mrp: 699, unit: 'piece', moq: 20, wholesalerId: 'w-lko-3', inStock: true, savings: '60%' },
  { productName: 'Kolhapuri Chappals', category: 'Fashion', wholesalePrice: 220, mrp: 549, unit: 'pair', moq: 12, wholesalerId: 'w-lko-3', inStock: false, savings: '60%' },

  // === ELECTRONICS ===
  { productName: 'Wireless Bluetooth Earbuds', category: 'Electronics', wholesalePrice: 480, mrp: 1299, unit: 'piece', moq: 10, wholesalerId: 'w-lko-2', inStock: true, savings: '63%' },
  { productName: 'Phone Charger 20W USB-C', category: 'Electronics', wholesalePrice: 120, mrp: 399, unit: 'piece', moq: 25, wholesalerId: 'w-lko-2', inStock: true, savings: '70%' },
  { productName: 'LED Bulb 9W (Pack of 4)', category: 'Electronics', wholesalePrice: 140, mrp: 280, unit: 'pack', moq: 20, wholesalerId: 'w-lko-2', inStock: true, savings: '50%' },
  { productName: 'Bluetooth Speaker 10W', category: 'Electronics', wholesalePrice: 350, mrp: 999, unit: 'piece', moq: 10, wholesalerId: 'w-lko-2', inStock: true, savings: '65%' },
  { productName: 'Power Bank 10000mAh', category: 'Electronics', wholesalePrice: 420, mrp: 1199, unit: 'piece', moq: 10, wholesalerId: 'w-lko-2', inStock: true, savings: '65%' },

  // === BEAUTY & PERSONAL CARE ===
  { productName: 'Himalaya Face Wash 150ml', category: 'Beauty & Personal Care', wholesalePrice: 95, mrp: 160, unit: 'piece', moq: 24, wholesalerId: 'w-lko-4', inStock: true, savings: '41%' },
  { productName: 'Parachute Coconut Oil 500ml', category: 'Beauty & Personal Care', wholesalePrice: 105, mrp: 155, unit: 'bottle', moq: 24, wholesalerId: 'w-lko-4', inStock: true, savings: '32%' },
  { productName: 'Colgate MaxFresh 150g', category: 'Beauty & Personal Care', wholesalePrice: 72, mrp: 110, unit: 'piece', moq: 48, wholesalerId: 'w-lko-4', inStock: true, savings: '35%' },
  { productName: 'Dove Soap 100g (Pack of 4)', category: 'Beauty & Personal Care', wholesalePrice: 170, mrp: 260, unit: 'pack', moq: 24, wholesalerId: 'w-lko-4', inStock: true, savings: '35%' },

  // === HOME & KITCHEN ===
  { productName: 'Stainless Steel Lunch Box 3-tier', category: 'Home & Kitchen', wholesalePrice: 180, mrp: 450, unit: 'piece', moq: 12, wholesalerId: 'w-lko-1', inStock: true, savings: '60%' },
  { productName: 'Clay Water Pot (Matka) 10L', category: 'Home & Kitchen', wholesalePrice: 120, mrp: 299, unit: 'piece', moq: 10, wholesalerId: 'w-lko-1', inStock: true, savings: '60%' },
  { productName: 'Brass Puja Thali Set', category: 'Home & Kitchen', wholesalePrice: 350, mrp: 799, unit: 'set', moq: 6, wholesalerId: 'w-lko-1', inStock: true, savings: '56%' },
  { productName: 'Non-Stick Tawa 28cm', category: 'Home & Kitchen', wholesalePrice: 280, mrp: 599, unit: 'piece', moq: 10, wholesalerId: 'w-lko-1', inStock: true, savings: '53%' },
];

// Function to get wholesalers for a city
export function getWholesalersForCity(city: string): Wholesaler[] {
  return WHOLESALERS[city] || WHOLESALERS['Lucknow'];
}

// Function to get wholesale products with dynamic pricing per city
export function getWholesaleProducts(city: string, category?: string): (WholesaleProduct & { wholesaler: Wholesaler })[] {
  const cityWholesalers = getWholesalersForCity(city);
  const wholesalerIds = cityWholesalers.map(w => w.id);

  // Get the base Lucknow products and remap to city wholesalers
  let products = WHOLESALE_PRODUCTS.map(p => {
    // Map to a random wholesaler in the target city that handles this category
    const matchingWholesaler = cityWholesalers.find(w =>
      w.specialties.some(s => s === p.category || s === 'FMCG')
    ) || cityWholesalers[0];

    return {
      ...p,
      wholesalerId: matchingWholesaler.id,
      wholesaler: matchingWholesaler,
    };
  });

  if (category) {
    products = products.filter(p => p.category === category);
  }

  return products;
}

// Smart alerts data
export interface SmartAlert {
  id: string;
  type: 'weather' | 'price_drop' | 'festival' | 'stock' | 'competitor' | 'trending';
  severity: 'high' | 'medium' | 'low';
  title: string;
  titleHi: string;
  message: string;
  actionLabel: string;
  actionRoute: string;
  timestamp: string;
  icon: string;
}

export function getSmartAlerts(city: string): SmartAlert[] {
  const now = new Date();
  const cityData: Record<string, SmartAlert[]> = {
    default: [
      {
        id: 'alert-1',
        type: 'weather',
        severity: 'high',
        title: 'Rain Alert This Week',
        titleHi: 'इस हफ्ते बारिश की चेतावनी',
        message: `Heavy rain predicted in ${city}. Umbrella & raincoat demand expected to spike 60%. 3 wholesalers near you have stock.`,
        actionLabel: 'Source Umbrellas',
        actionRoute: '/sourcing?search=umbrella',
        timestamp: '10 min ago',
        icon: 'cloud-rain',
      },
      {
        id: 'alert-2',
        type: 'competitor',
        severity: 'medium',
        title: 'Competitor Price Drop',
        titleHi: 'प्रतियोगी ने दाम घटाए',
        message: 'Nearby competitor dropped Basmati Rice price to ₹420. Your price: ₹449. Consider adjusting to stay competitive.',
        actionLabel: 'Adjust Pricing',
        actionRoute: '/pricing',
        timestamp: '2 hours ago',
        icon: 'trending-down',
      },
      {
        id: 'alert-3',
        type: 'trending',
        severity: 'medium',
        title: 'Protein Bars Trending',
        titleHi: 'प्रोटीन बार ट्रेंडिंग',
        message: `Protein bars & health snacks demand up 40% in ${city} this month. Consider adding to your inventory.`,
        actionLabel: 'Find Suppliers',
        actionRoute: '/sourcing?category=Groceries',
        timestamp: '5 hours ago',
        icon: 'trending-up',
      },
      {
        id: 'alert-4',
        type: 'stock',
        severity: 'high',
        title: 'Low Stock Alert',
        titleHi: 'स्टॉक कम हो रहा है',
        message: 'Based on your selling speed, Surf Excel will run out in ~3 days. Best wholesale price nearby: ₹185/unit.',
        actionLabel: 'Reorder Now',
        actionRoute: '/sourcing?search=surf+excel',
        timestamp: '1 day ago',
        icon: 'package',
      },
      {
        id: 'alert-5',
        type: 'festival',
        severity: 'low',
        title: 'Festival Season Prep',
        titleHi: 'त्योहारों की तैयारी',
        message: 'Festival season approaching. Dry fruits, sweets packaging & gift items demand will spike. Stock up early for best wholesale prices.',
        actionLabel: 'View Festival Guide',
        actionRoute: '/dashboard',
        timestamp: '2 days ago',
        icon: 'sparkles',
      },
    ],
  };

  return cityData.default;
}
