import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { invokeBedrockClaude, parseJSONResponse } from '../utils/bedrock-client';
import { success, error } from '../utils/response';
import { buildPricingPrompt } from '../prompts/pricing-prompt';
import { REGIONAL_DATA, getUpcomingFestivals } from '../data/regional-data';
import { COMPETITOR_PRICES } from '../data/sample-data';

export interface PricingRequest {
  productName: string;
  category: string;
  costPrice: number;
  currentPrice?: number;
  city: string;
}

export interface PricingResponse {
  recommendations: {
    strategy: string;
    suggestedPrice: number;
    confidenceScore: number;
    expectedImpact: {
      demandChange: string;
      revenueChange: string;
      monthlyProfitImpact: string;
    };
    reasoning: string;
  }[];
  marketContext: {
    averageCompetitorPrice: number;
    priceRange: { min: number; max: number };
    regionalPurchasingPower: number;
  };
  festivalInsight: string;
  keyTakeaway: string;
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body: PricingRequest = JSON.parse(event.body || '{}');

    if (!body.productName || !body.category || !body.costPrice || !body.city) {
      return error(400, 'Missing required fields: productName, category, costPrice, city', 'INVALID_REQUEST');
    }

    const regionData = REGIONAL_DATA[body.city];
    if (!regionData) {
      return error(400, `Unsupported city: ${body.city}. Supported: ${Object.keys(REGIONAL_DATA).join(', ')}`, 'INVALID_REQUEST');
    }

    const competitors = COMPETITOR_PRICES[body.productName as keyof typeof COMPETITOR_PRICES] || [
      { seller: 'Amazon', price: Math.round(body.costPrice * 1.5), rating: 4.0 },
      { seller: 'Flipkart', price: Math.round(body.costPrice * 1.4), rating: 3.8 },
      { seller: 'Local Market', price: Math.round(body.costPrice * 1.25), rating: null },
    ];

    const festivals = getUpcomingFestivals(body.city, 3);

    const prompt = buildPricingPrompt({
      productName: body.productName,
      category: body.category,
      costPrice: body.costPrice,
      currentPrice: body.currentPrice,
      city: body.city,
      purchasingPowerIndex: regionData.purchasingPowerIndex,
      tier: regionData.tier,
      competitorPrices: competitors,
      upcomingFestivals: festivals,
      culturalPreferences: regionData.culturalPreferences,
    });

    const aiResponse = await invokeBedrockClaude(prompt, {
      maxTokens: 3000,
      temperature: 0.4,
      systemPrompt: 'You are BharatBazaar AI Pricing Engine. Analyze Indian retail markets and provide pricing strategies. Always respond in valid JSON format. All prices must be in Indian Rupees (₹).',
    });

    const result = parseJSONResponse<PricingResponse>(aiResponse);

    return success({
      ...result,
      productName: body.productName,
      city: body.city,
      region: regionData.tier,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Pricing handler error:', err);
    return error(500, err.message || 'Internal server error');
  }
}
