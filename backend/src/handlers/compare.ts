import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { success, error, throttled } from '../utils/response';
import { invokeBedrockClaude, parseJSONResponse, BedrockThrottleError } from '../utils/bedrock-client';
import { COMPETITOR_PRICES } from '../data/sample-data';
import { REGIONAL_DATA } from '../data/regional-data';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');
    const { products, city } = body;

    if (!products || !Array.isArray(products) || products.length < 2) {
      return error(400, 'Provide at least 2 products to compare', 'INVALID_REQUEST');
    }

    const cityData = REGIONAL_DATA[city || 'Lucknow'];
    const cityName = city || 'Lucknow';

    // Build product context with competitor data
    const productDetails = products.map((p: any) => {
      const compPrices = COMPETITOR_PRICES[p.name as keyof typeof COMPETITOR_PRICES] || [];
      return {
        name: p.name,
        category: p.category,
        costPrice: p.costPrice,
        sellingPrice: p.currentPrice,
        margin: ((p.currentPrice - p.costPrice) / p.currentPrice * 100).toFixed(1) + '%',
        competitors: compPrices,
      };
    });

    const prompt = `You are BharatBazaar AI, analyzing products for a retailer in ${cityName} (Purchasing Power Index: ${cityData?.purchasingPowerIndex || 70}/100, Tier: ${cityData?.tier || 'Tier 2'}).

Compare these ${products.length} products:
${JSON.stringify(productDetails, null, 2)}

Provide a detailed comparison analysis in this JSON format:
{
  "products": [
    {
      "name": "product name",
      "category": "category",
      "costPrice": number,
      "currentPrice": number,
      "margin": "X%",
      "competitorAvg": number,
      "pricePosition": "below_market" | "at_market" | "above_market",
      "demandTrend": "+X%" or "-X%",
      "festivalImpact": "High (festival names)" or "Medium" or "Low",
      "sentiment": number (0-100),
      "avgMonthlyUnits": number,
      "strengths": ["strength1", "strength2"],
      "risks": ["risk1", "risk2"]
    }
  ],
  "recommendation": {
    "bestMargin": "product name with best margin",
    "bestDemand": "product name with best demand outlook",
    "bestOverall": "product name recommended overall",
    "reasoning": "2-3 sentence explanation of why, specific to ${cityName} market"
  },
  "insights": [
    "insight about pricing strategy across products",
    "insight about category mix optimization",
    "insight about seasonal/festival opportunity"
  ]
}

Base your analysis on the competitor prices provided, the city's purchasing power, and current market conditions. Be specific to ${cityName}.`;

    const response = await invokeBedrockClaude(prompt, {
      maxTokens: 1500,
      temperature: 0.4,
      systemPrompt: 'You are BharatBazaar AI, an expert retail market analyst for Indian markets. Respond ONLY in valid JSON format.',
    });

    const result = parseJSONResponse<any>(response);

    return success(result);
  } catch (err: any) {
    if (err instanceof BedrockThrottleError) {
      return throttled(err.message, Math.round(err.retryAfterMs / 1000));
    }
    console.error('Compare handler error:', err);
    return error(500, err.message || 'Failed to compare products');
  }
}
