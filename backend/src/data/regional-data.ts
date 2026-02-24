// Regional purchasing power and festival data for India
export const REGIONAL_DATA: Record<string, {
  purchasingPowerIndex: number;
  avgMonthlyIncome: number;
  tier: string;
  languages: string[];
  festivals: { name: string; month: number; impact: string; categories: string[] }[];
  culturalPreferences: string[];
}> = {
  'Mumbai': {
    purchasingPowerIndex: 92,
    avgMonthlyIncome: 55000,
    tier: 'Tier 1',
    languages: ['hi', 'mr', 'en'],
    festivals: [
      { name: 'Ganesh Chaturthi', month: 9, impact: 'very_high', categories: ['Groceries', 'Home & Kitchen', 'Fashion'] },
      { name: 'Diwali', month: 11, impact: 'very_high', categories: ['Electronics', 'Fashion', 'Home & Kitchen'] },
      { name: 'Navratri', month: 10, impact: 'high', categories: ['Fashion', 'Groceries'] },
    ],
    culturalPreferences: ['Premium brands popular', 'Health-conscious consumers', 'Quick delivery expected'],
  },
  'Delhi': {
    purchasingPowerIndex: 88,
    avgMonthlyIncome: 48000,
    tier: 'Tier 1',
    languages: ['hi', 'en'],
    festivals: [
      { name: 'Diwali', month: 11, impact: 'very_high', categories: ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Personal Care'] },
      { name: 'Karva Chauth', month: 10, impact: 'high', categories: ['Fashion', 'Beauty & Personal Care'] },
      { name: 'Holi', month: 3, impact: 'high', categories: ['Groceries', 'Beauty & Personal Care'] },
    ],
    culturalPreferences: ['Brand-conscious market', 'Price comparison is common', 'Seasonal fashion trends'],
  },
  'Bangalore': {
    purchasingPowerIndex: 90,
    avgMonthlyIncome: 52000,
    tier: 'Tier 1',
    languages: ['en', 'hi', 'ta'],
    festivals: [
      { name: 'Diwali', month: 11, impact: 'high', categories: ['Electronics', 'Fashion'] },
      { name: 'Ugadi', month: 4, impact: 'medium', categories: ['Groceries', 'Home & Kitchen'] },
      { name: 'Dasara', month: 10, impact: 'high', categories: ['Fashion', 'Electronics'] },
    ],
    culturalPreferences: ['Tech-savvy consumers', 'Online shopping preferred', 'International brand preference'],
  },
  'Lucknow': {
    purchasingPowerIndex: 58,
    avgMonthlyIncome: 28000,
    tier: 'Tier 2',
    languages: ['hi', 'en'],
    festivals: [
      { name: 'Diwali', month: 11, impact: 'very_high', categories: ['Electronics', 'Fashion', 'Groceries'] },
      { name: 'Eid', month: 4, impact: 'very_high', categories: ['Fashion', 'Groceries', 'Beauty & Personal Care'] },
      { name: 'Holi', month: 3, impact: 'high', categories: ['Groceries', 'Beauty & Personal Care'] },
    ],
    culturalPreferences: ['Value-for-money preferred', 'Chikankari & traditional wear popular', 'Festival buying peaks are sharp'],
  },
  'Jaipur': {
    purchasingPowerIndex: 55,
    avgMonthlyIncome: 26000,
    tier: 'Tier 2',
    languages: ['hi', 'en'],
    festivals: [
      { name: 'Diwali', month: 11, impact: 'very_high', categories: ['Electronics', 'Fashion', 'Home & Kitchen'] },
      { name: 'Teej', month: 8, impact: 'high', categories: ['Fashion', 'Beauty & Personal Care'] },
      { name: 'Makar Sankranti', month: 1, impact: 'medium', categories: ['Groceries'] },
    ],
    culturalPreferences: ['Traditional products preferred', 'Tourist demand for handicrafts', 'Wedding season drives sales'],
  },
  'Chennai': {
    purchasingPowerIndex: 78,
    avgMonthlyIncome: 42000,
    tier: 'Tier 1',
    languages: ['ta', 'en'],
    festivals: [
      { name: 'Pongal', month: 1, impact: 'very_high', categories: ['Groceries', 'Home & Kitchen', 'Electronics'] },
      { name: 'Diwali', month: 11, impact: 'high', categories: ['Electronics', 'Fashion'] },
      { name: 'Navaratri', month: 10, impact: 'high', categories: ['Fashion', 'Home & Kitchen'] },
    ],
    culturalPreferences: ['Gold & jewelry important', 'South Indian cuisine ingredients', 'Silk sarees for festivals'],
  },
  'Kolkata': {
    purchasingPowerIndex: 62,
    avgMonthlyIncome: 30000,
    tier: 'Tier 1',
    languages: ['bn', 'hi', 'en'],
    festivals: [
      { name: 'Durga Puja', month: 10, impact: 'very_high', categories: ['Fashion', 'Electronics', 'Home & Kitchen', 'Groceries'] },
      { name: 'Diwali', month: 11, impact: 'high', categories: ['Electronics', 'Fashion'] },
      { name: 'Poila Boishakh', month: 4, impact: 'medium', categories: ['Fashion', 'Groceries'] },
    ],
    culturalPreferences: ['Bengali sweets hugely popular', 'Traditional clothing strong', 'Artistic/cultural products valued'],
  },
  'Ahmedabad': {
    purchasingPowerIndex: 70,
    avgMonthlyIncome: 35000,
    tier: 'Tier 2',
    languages: ['gu', 'hi', 'en'],
    festivals: [
      { name: 'Navratri', month: 10, impact: 'very_high', categories: ['Fashion', 'Beauty & Personal Care', 'Electronics'] },
      { name: 'Diwali', month: 11, impact: 'very_high', categories: ['Electronics', 'Home & Kitchen'] },
      { name: 'Uttarayan', month: 1, impact: 'high', categories: ['Groceries', 'Sports & Fitness'] },
    ],
    culturalPreferences: ['Vegetarian products dominant', 'Traditional Gujarati fashion', 'Gold/silver investment popular'],
  },
  'Pune': {
    purchasingPowerIndex: 75,
    avgMonthlyIncome: 40000,
    tier: 'Tier 2',
    languages: ['mr', 'hi', 'en'],
    festivals: [
      { name: 'Ganesh Chaturthi', month: 9, impact: 'very_high', categories: ['Groceries', 'Home & Kitchen', 'Fashion'] },
      { name: 'Diwali', month: 11, impact: 'very_high', categories: ['Electronics', 'Fashion'] },
      { name: 'Gudi Padwa', month: 4, impact: 'medium', categories: ['Fashion', 'Home & Kitchen'] },
    ],
    culturalPreferences: ['Young professional market growing', 'Mix of traditional and modern', 'IT workforce drives electronics'],
  },
  'Indore': {
    purchasingPowerIndex: 50,
    avgMonthlyIncome: 24000,
    tier: 'Tier 2',
    languages: ['hi', 'en'],
    festivals: [
      { name: 'Diwali', month: 11, impact: 'very_high', categories: ['Electronics', 'Fashion', 'Groceries'] },
      { name: 'Holi', month: 3, impact: 'high', categories: ['Groceries', 'Beauty & Personal Care'] },
      { name: 'Raksha Bandhan', month: 8, impact: 'medium', categories: ['Fashion', 'Beauty & Personal Care'] },
    ],
    culturalPreferences: ['Street food culture strong', 'Value pricing dominates', 'Traditional/family buying patterns'],
  },
};

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Groceries',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Books & Stationery',
  'Sports & Fitness',
  'Toys & Baby Products',
] as const;

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  bn: 'Bengali',
  gu: 'Gujarati',
  mr: 'Marathi',
} as const;

export function getUpcomingFestivals(city: string, months: number = 3): { name: string; daysAway: number; impact: string; categories: string[] }[] {
  const region = REGIONAL_DATA[city];
  if (!region) return [];

  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  return region.festivals
    .map(f => {
      let monthsAway = f.month - currentMonth;
      if (monthsAway < 0) monthsAway += 12;
      return {
        name: f.name,
        daysAway: monthsAway * 30,
        impact: f.impact,
        categories: f.categories,
      };
    })
    .filter(f => f.daysAway <= months * 30)
    .sort((a, b) => a.daysAway - b.daysAway);
}
