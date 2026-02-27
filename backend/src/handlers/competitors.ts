import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { success, error, throttled } from '../utils/response';
import { invokeBedrockClaude, parseJSONResponse, BedrockThrottleError } from '../utils/bedrock-client';
import { COMPETITOR_PRICES } from '../data/sample-data';
import { REGIONAL_DATA, getUpcomingFestivals } from '../data/regional-data';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');
    const { products, city } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return error(400, 'Provide at least 1 product to analyze', 'INVALID_REQUEST');
    }

    const cityName = city || 'Lucknow';
    const cityData = REGIONAL_DATA[cityName];
    const festivals = getUpcomingFestivals(cityName, 3);

    // Build product + competitor data
    const productsWithCompetitors = products.map((p: any) => {
      const compPrices = COMPETITOR_PRICES[p.name as keyof typeof COMPETITOR_PRICES] || [];
      return {
        name: p.name,
        category: p.category,
        yourPrice: p.yourPrice,
        costPrice: p.costPrice,
        competitors: compPrices.map(c => ({
          seller: c.seller,
          currentPrice: c.price,
          rating: c.rating,
        })),
      };
    });

    const prompt = `You are BharatBazaar AI, a competitive intelligence analyst for Indian retail in ${cityName} (${cityData?.tier || 'Tier 2'} city, Purchasing Power Index: ${cityData?.purchasingPowerIndex || 70}/100).

Upcoming festivals: ${festivals.map(f => `${f.name} (${f.daysAway} days away, ${f.impact} impact)`).join(', ') || 'None in next 3 months'}

Analyze competitor pricing for these products:
${JSON.stringify(productsWithCompetitors, null, 2)}

For each product, simulate realistic competitor price movements (some prices going up, some down, some stable) and generate a strategic analysis.

Return JSON:
{
  "products": [
    {
      "name": "product name",
      "category": "category",
      "yourPrice": number,
      "costPrice": number,
      "competitors": [
        {
          "seller": "seller name",
          "price": number,
          "prevPrice": number (slightly different to show movement),
          "rating": number or null,
          "lastUpdated": "Xh ago",
          "inStock": boolean
        }
      ],
      "priceHistory": [
        { "date": "Feb 21", "yourPrice": number, "avgCompetitor": number },
        { "date": "Feb 22", "yourPrice": number, "avgCompetitor": number },
        { "date": "Feb 23", "yourPrice": number, "avgCompetitor": number },
        { "date": "Feb 24", "yourPrice": number, "avgCompetitor": number },
        { "date": "Feb 25", "yourPrice": number, "avgCompetitor": number },
        { "date": "Feb 26", "yourPrice": number, "avgCompetitor": number },
        { "date": "Feb 27", "yourPrice": number, "avgCompetitor": number }
      ]
    }
  ],
  "alerts": [
    {
      "product": "product name",
      "message": "specific alert message about price change or competitive threat",
      "severity": "high" | "medium" | "low",
      "actionItem": "specific action the retailer should take"
    }
  ],
  "strategicInsights": {
    "overallPosition": "summary of competitive positioning across all products",
    "recommendations": [
      "specific pricing recommendation 1",
      "specific pricing recommendation 2"
    ],
    "festivalStrategy": "how to prepare pricing for upcoming festivals"
  }
}

Make the price movements realistic — competitors don't all move the same direction. Some sellers go out of stock. Show actual competitive dynamics.`;

    const response = await invokeBedrockClaude(prompt, {
      maxTokens: 2000,
      temperature: 0.5,
      systemPrompt: 'You are BharatBazaar AI, a competitive intelligence analyst. Respond ONLY in valid JSON format.',
    });

    const result = parseJSONResponse<any>(response);

    return success(result);
  } catch (err: any) {
    if (err instanceof BedrockThrottleError) {
      return throttled(err.message, Math.round(err.retryAfterMs / 1000));
    }
    console.error('Competitors handler error:', err);
    return error(500, err.message || 'Failed to analyze competitors');
  }
}
