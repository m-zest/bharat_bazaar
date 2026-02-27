import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { invokeBedrockClaude, BedrockThrottleError } from '../utils/bedrock-client';
import { success, error, throttled } from '../utils/response';
import { REGIONAL_DATA, getUpcomingFestivals } from '../data/regional-data';
import { WHOLESALE_PRODUCTS, getWholesalersForCity } from '../data/wholesale-data';
import { DEMO_PRODUCTS, COMPETITOR_PRICES } from '../data/sample-data';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');
    const { message, city, conversationHistory } = body;

    if (!message) {
      return error(400, 'Missing required field: message', 'INVALID_REQUEST');
    }

    const currentCity = city || 'Lucknow';
    const regionData = REGIONAL_DATA[currentCity];
    const festivals = getUpcomingFestivals(currentCity, 3);
    const wholesalers = getWholesalersForCity(currentCity);
    const products = WHOLESALE_PRODUCTS.slice(0, 10);

    // Build rich context for the AI advisor
    const context = `
CONTEXT ABOUT THE BUSINESS:
- Business: Sharma Kirana Store, ${currentCity}
- Owner: Ramesh Sharma
- Category: Groceries (primary), also sells Electronics and Fashion
- City Tier: ${regionData?.tier || 'Tier 2'}
- Purchasing Power Index: ${regionData?.purchasingPowerIndex || 58}/100
- Languages spoken: ${regionData?.languages?.join(', ') || 'hi, en'}

CURRENT INVENTORY (Sample):
${DEMO_PRODUCTS.map(p => `- ${p.name}: Cost ₹${p.costPrice}, Selling at ₹${p.currentPrice}`).join('\n')}

NEARBY WHOLESALERS:
${wholesalers.slice(0, 3).map(w => `- ${w.name} (${w.area}, ${w.distance}) — ${w.specialties.join(', ')}`).join('\n')}

WHOLESALE PRICES AVAILABLE:
${products.slice(0, 8).map(p => `- ${p.productName}: Wholesale ₹${p.wholesalePrice}, MRP ₹${p.mrp} (Save ${p.savings})`).join('\n')}

COMPETITOR PRICES:
${Object.entries(COMPETITOR_PRICES).slice(0, 2).map(([product, prices]) =>
  `${product}: ${prices.map(p => `${p.seller} ₹${p.price}`).join(', ')}`
).join('\n')}

UPCOMING FESTIVALS IN ${currentCity.toUpperCase()}:
${festivals.length > 0 ? festivals.map(f => `- ${f.name} in ${f.daysAway} days (${f.impact} impact)`).join('\n') : 'No major festivals soon'}

CULTURAL PREFERENCES: ${regionData?.culturalPreferences?.join(', ') || 'N/A'}
`;

    // Build conversation messages for multi-turn
    const messages: { role: string; content: string }[] = [];

    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-6)) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: 'user', content: message });

    const systemPrompt = `You are BharatBazaar AI Business Advisor — a friendly, knowledgeable AI assistant for Indian small business owners (kirana store owners, D2C sellers, local retailers).

PERSONALITY:
- Speak naturally in Hinglish (mix of Hindi and English) when the user writes in Hindi/Hinglish
- Be warm, practical, and actionable — like a smart friend who understands business
- Give specific prices, numbers, and recommendations (not vague advice)
- Reference nearby wholesalers, festivals, and market conditions from the context
- Keep responses concise (2-4 paragraphs max) but packed with value
- Use ₹ for all prices
- When suggesting products to stock, mention the wholesale price and potential profit margin

${context}

IMPORTANT RULES:
1. Always ground your advice in the REAL DATA provided above (prices, wholesalers, festivals)
2. When suggesting to buy products, reference specific wholesalers and their prices
3. When discussing pricing, reference competitor prices
4. When discussing seasonal trends, reference upcoming festivals
5. Be honest about what you know vs don't know
6. If asked about delivery/logistics, explain that BharatBazaar connects to local wholesaler delivery networks
7. Always end with a specific actionable next step`;

    const aiResponse = await invokeBedrockClaude(
      messages.map(m => m.content).join('\n\n---\n\n'),
      {
        maxTokens: 800,
        temperature: 0.7,
        systemPrompt,
      }
    );

    return success({
      response: aiResponse,
      city: currentCity,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Chat handler error:', err);
    if (err instanceof BedrockThrottleError) {
      return throttled(err.message, Math.round(err.retryAfterMs / 1000));
    }
    return error(500, err.message || 'Internal server error');
  }
}
