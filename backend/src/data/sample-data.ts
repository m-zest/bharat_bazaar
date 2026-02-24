// Pre-loaded demo data for the "Try Demo" experience
export const DEMO_BUSINESS = {
  businessName: 'Sharma Kirana Store',
  businessType: 'retailer' as const,
  city: 'Lucknow',
  region: 'North',
  primaryCategory: 'Groceries',
  languages: ['hi', 'en'],
  owner: 'Ramesh Sharma',
};

export const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    name: 'Premium Basmati Rice 5kg',
    category: 'Groceries',
    costPrice: 320,
    currentPrice: 449,
    features: ['Aged 2 years', 'Extra-long grain', 'Aromatic', 'Pesticide-free', 'From Dehradun valley'],
    specifications: { weight: '5kg', grain_length: '8.4mm', aging: '2 years', origin: 'Dehradun, Uttarakhand' },
  },
  {
    id: 'demo-2',
    name: 'Handloom Cotton Kurta - Men',
    category: 'Fashion',
    costPrice: 450,
    currentPrice: 899,
    features: ['Pure cotton handloom', 'Chikankari embroidery', 'Comfortable fit', 'Machine washable', 'Available in 5 colors'],
    specifications: { fabric: '100% Cotton', type: 'Chikankari', sizes: 'S, M, L, XL, XXL', origin: 'Lucknow' },
  },
  {
    id: 'demo-3',
    name: 'Wireless Bluetooth Earbuds',
    category: 'Electronics',
    costPrice: 600,
    currentPrice: 1299,
    features: ['Active noise cancellation', '30hr battery', 'IPX5 water resistant', 'Touch controls', 'Voice assistant'],
    specifications: { battery: '30 hours', connectivity: 'Bluetooth 5.3', driver: '13mm', charging: 'USB-C' },
  },
];

export const DEMO_REVIEWS = [
  // Hinglish mix reviews - this is what makes it impressive
  { reviewId: 'r1', text: 'Product accha hai but delivery bahut slow thi. 5 din lag gaye aane mein.', language: 'hi', rating: 3, date: '2026-02-10' },
  { reviewId: 'r2', text: 'पैकेजिंग टूटी हुई थी, rice spill ho gaya bag mein. Not happy with this.', language: 'hi', rating: 2, date: '2026-02-12' },
  { reviewId: 'r3', text: 'Bahut badhiya quality! Biryani mein use kiya, aroma zabardast tha. Family ne bahut tareef ki.', language: 'hi', rating: 5, date: '2026-02-15' },
  { reviewId: 'r4', text: 'Price thoda zyada hai compared to local market, but quality is genuinely better. Worth it if you can afford.', language: 'hi', rating: 4, date: '2026-02-08' },
  { reviewId: 'r5', text: 'Excellent basmati rice. The grains are long and separate after cooking. Best rice I have bought online.', language: 'en', rating: 5, date: '2026-02-01' },
  { reviewId: 'r6', text: 'Average quality. Mere yahan ki local dukaan pe same price mein better milta hai. Online wala flavour utna accha nahi.', language: 'hi', rating: 3, date: '2026-02-18' },
  { reviewId: 'r7', text: 'Maine 3 baar order kiya hai, har baar consistent quality. Packaging bhi last time se behtar thi.', language: 'hi', rating: 5, date: '2026-02-20' },
  { reviewId: 'r8', text: 'Rice is ok ok, nothing special. Regular chawal jaisa hi hai, premium ka naam lekar overcharge kar rahe hain.', language: 'hi', rating: 2, date: '2026-02-05' },
  { reviewId: 'r9', text: 'Good quality rice but quantity kam laga. 5kg likha tha, weigh kiya toh 4.7kg nikla. Pls fix this.', language: 'hi', rating: 3, date: '2026-02-14' },
  { reviewId: 'r10', text: 'Festival season mein gift kiya tha relatives ko. Sabne pucha kahan se liya! Best purchase for Diwali gifting.', language: 'hi', rating: 5, date: '2026-01-25' },
  { reviewId: 'r11', text: 'Not worth the price. Mujhe lagta hai ye 2 saal aged nahi hai, fresh rice hai. Misleading product description.', language: 'hi', rating: 1, date: '2026-02-22' },
  { reviewId: 'r12', text: 'Love it! The fragrance when cooking is amazing. My mother-in-law was very impressed 😊', language: 'en', rating: 5, date: '2026-02-17' },
];

export const COMPETITOR_PRICES = {
  'Premium Basmati Rice 5kg': [
    { seller: 'Amazon', price: 469, rating: 4.2 },
    { seller: 'Flipkart', price: 445, rating: 4.0 },
    { seller: 'BigBasket', price: 459, rating: 4.3 },
    { seller: 'JioMart', price: 435, rating: 3.9 },
    { seller: 'Local Market Avg', price: 399, rating: null },
  ],
  'Handloom Cotton Kurta - Men': [
    { seller: 'Myntra', price: 1199, rating: 4.1 },
    { seller: 'Amazon', price: 999, rating: 3.8 },
    { seller: 'Flipkart', price: 849, rating: 3.6 },
    { seller: 'Ajio', price: 1099, rating: 4.0 },
    { seller: 'Local Market Avg', price: 750, rating: null },
  ],
  'Wireless Bluetooth Earbuds': [
    { seller: 'Amazon', price: 1499, rating: 4.0 },
    { seller: 'Flipkart', price: 1399, rating: 3.9 },
    { seller: 'Croma', price: 1599, rating: 4.2 },
    { seller: 'Reliance Digital', price: 1449, rating: 4.1 },
    { seller: 'Local Market Avg', price: 1199, rating: null },
  ],
};
