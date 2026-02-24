import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { success, error } from '../utils/response';
import { REGIONAL_DATA, getUpcomingFestivals, PRODUCT_CATEGORIES } from '../data/regional-data';
import { DEMO_BUSINESS, DEMO_PRODUCTS } from '../data/sample-data';

export interface DashboardRequest {
  city?: string;
  category?: string;
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const params = event.queryStringParameters || {};
    const city = params.city || DEMO_BUSINESS.city;
    const category = params.category || DEMO_BUSINESS.primaryCategory;

    const regionData = REGIONAL_DATA[city];
    if (!regionData) {
      return error(400, `Unsupported city: ${city}`, 'INVALID_REQUEST');
    }

    const festivals = getUpcomingFestivals(city, 6);
    const nextFestival = festivals[0];

    const dashboard = {
      business: {
        name: DEMO_BUSINESS.businessName,
        city,
        category,
        owner: DEMO_BUSINESS.owner,
      },
      quickInsight: nextFestival
        ? `${nextFestival.name} is ${nextFestival.daysAway} days away — demand for ${nextFestival.categories.slice(0, 2).join(' & ')} expected to rise ${nextFestival.impact === 'very_high' ? '40-60%' : nextFestival.impact === 'high' ? '20-35%' : '10-15%'} in ${city}`
        : `Market conditions are stable in ${city}. Good time to optimize your pricing strategy.`,
      summary: {
        trendingProductsCount: 24,
        avgPricingConfidence: 82,
        upcomingHighDemandPeriods: festivals.filter(f => f.impact === 'very_high' || f.impact === 'high').map(f => f.name),
        overallSentimentScore: 62,
        monthlySalesGrowth: '+12%',
        activeProducts: DEMO_PRODUCTS.length,
      },
      regionalInfo: {
        purchasingPowerIndex: regionData.purchasingPowerIndex,
        tier: regionData.tier,
        languages: regionData.languages,
        festivals: festivals.slice(0, 3),
      },
      recentActivity: [
        { type: 'pricing', description: `Pricing analysis for ${DEMO_PRODUCTS[0].name}`, time: '2 hours ago' },
        { type: 'content', description: `Hindi description generated for ${DEMO_PRODUCTS[1].name}`, time: '5 hours ago' },
        { type: 'sentiment', description: '12 new reviews analyzed', time: '1 day ago' },
        { type: 'trend', description: `Electronics trending up in ${city}`, time: '2 days ago' },
      ],
      charts: {
        sentimentTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [58, 62, 55, 70, 68, 72],
        },
        pricingAccuracy: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [75, 80, 78, 85],
        },
        demandForecast: {
          labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          data: [100, 110, 95, 130, 145, 120],
          upper: [120, 130, 115, 155, 170, 145],
          lower: [80, 90, 75, 105, 120, 95],
        },
        categoryDistribution: [
          { name: 'Groceries', value: 40 },
          { name: 'Electronics', value: 25 },
          { name: 'Fashion', value: 20 },
          { name: 'Home & Kitchen', value: 15 },
        ],
      },
      products: DEMO_PRODUCTS,
      categories: [...PRODUCT_CATEGORIES],
      supportedCities: Object.keys(REGIONAL_DATA),
    };

    return success(dashboard);
  } catch (err: any) {
    console.error('Dashboard handler error:', err);
    return error(500, err.message || 'Internal server error');
  }
}
