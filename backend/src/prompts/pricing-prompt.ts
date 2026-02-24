export function buildPricingPrompt(params: {
  productName: string;
  category: string;
  costPrice: number;
  currentPrice?: number;
  city: string;
  purchasingPowerIndex: number;
  tier: string;
  competitorPrices: { seller: string; price: number; rating: number | null }[];
  upcomingFestivals: { name: string; daysAway: number; impact: string }[];
  culturalPreferences: string[];
}): string {
  return `You are an expert pricing strategist for Indian retail markets with deep knowledge of regional economics.

CONTEXT:
- Product: ${params.productName}
- Category: ${params.category}
- Cost Price: ₹${params.costPrice}
- Current Selling Price: ${params.currentPrice ? `₹${params.currentPrice}` : 'Not set yet'}
- Location: ${params.city} (${params.tier})
- Regional Purchasing Power Index: ${params.purchasingPowerIndex}/100
- Cultural Preferences: ${params.culturalPreferences.join('; ')}

COMPETITOR PRICES:
${params.competitorPrices.map(c => `- ${c.seller}: ₹${c.price}${c.rating ? ` (Rating: ${c.rating}/5)` : ''}`).join('\n')}

UPCOMING FESTIVALS:
${params.upcomingFestivals.length > 0
    ? params.upcomingFestivals.map(f => `- ${f.name} in ${f.daysAway} days (Impact: ${f.impact})`).join('\n')
    : '- No major festivals in the next 3 months'}

INSTRUCTIONS:
Provide exactly 3 pricing strategies. For each strategy:
1. Calculate a specific price in ₹ (Indian Rupees)
2. Adjust for the regional purchasing power (${params.tier} city with index ${params.purchasingPowerIndex}/100)
3. Consider the competitive landscape
4. Factor upcoming festivals impact on demand

Respond in this exact JSON format:
{
  "recommendations": [
    {
      "strategy": "competitive",
      "suggestedPrice": <number>,
      "confidenceScore": <0-100>,
      "expectedImpact": {
        "demandChange": "<+/- percentage>",
        "revenueChange": "<+/- percentage>",
        "monthlyProfitImpact": "₹<amount> per month (estimated 100 units)"
      },
      "reasoning": "<2-3 sentences explaining this strategy, mentioning regional factors>"
    },
    {
      "strategy": "premium",
      "suggestedPrice": <number>,
      "confidenceScore": <0-100>,
      "expectedImpact": { ... },
      "reasoning": "<2-3 sentences>"
    },
    {
      "strategy": "value",
      "suggestedPrice": <number>,
      "confidenceScore": <0-100>,
      "expectedImpact": { ... },
      "reasoning": "<2-3 sentences>"
    }
  ],
  "marketContext": {
    "averageCompetitorPrice": <number>,
    "priceRange": { "min": <number>, "max": <number> },
    "regionalPurchasingPower": ${params.purchasingPowerIndex}
  },
  "festivalInsight": "<one line about how upcoming festivals should influence pricing decisions>",
  "keyTakeaway": "<one powerful insight for the seller>"
}`;
}
