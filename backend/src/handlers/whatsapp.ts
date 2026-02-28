import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { invokeBedrockClaude } from '../utils/bedrock-client';
import { getDemoChatResponse } from './demo-fallback';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function getChatReply(message: string, city: string): Promise<string> {
  try {
    const systemPrompt = `You are Munim-ji, a WhatsApp AI business advisor for Indian kirana store owners.
Keep responses SHORT (under 300 chars) since this is WhatsApp.
Use WhatsApp formatting: *bold*, _italic_.
Respond in Hinglish (Hindi + English mix).
Be practical and give specific prices/numbers.
End with an actionable tip.`;

    const response = await invokeBedrockClaude(message, {
      maxTokens: 300,
      temperature: 0.7,
      systemPrompt,
    });
    return response;
  } catch {
    // Use demo fallback
    const demoResult = getDemoChatResponse(message, city);
    const parsed = JSON.parse(demoResult.body);
    return parsed.data?.response || 'Namaste! Main Munim-ji hoon. Kaise madad karun?';
  }
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  // Twilio sends form-encoded data
  let incomingMessage = '';
  let from = '';

  const body = event.body || '';
  if (event.headers?.['content-type']?.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(body);
    incomingMessage = params.get('Body') || '';
    from = params.get('From') || '';
  } else {
    // JSON fallback
    const json = JSON.parse(body);
    incomingMessage = json.Body || json.message || '';
    from = json.From || '';
  }

  const city = 'Lucknow';
  const lower = incomingMessage.toLowerCase().trim();

  let replyText: string;

  if (lower === 'help' || lower === 'menu') {
    replyText = `🧮 *Munim-ji AI — Commands*

📦 *stock* — Check inventory status
💰 *price [product]* — Get pricing advice
🌧️ *weather [city]* — Business weather impact
🎪 *festival* — Upcoming festival prep
💬 Or ask anything in Hindi/English!

_Powered by BharatBazaar AI_`;
  } else if (lower === 'stock' || lower === 'inventory' || lower.includes('kitna maal')) {
    replyText = `📦 *Your Inventory Status*

• Toor Dal: 25kg ✅
• Basmati Rice: 10kg ✅
• Surf Excel: 8 pkt ⚠️ _LOW_
• Parle-G: 5 pkt ⚠️ _LOW_
• Amul Butter: 0 pkt ❌ _OUT_

3 OK, 2 low, 1 out of stock
Reply *order* to restock low items`;
  } else {
    replyText = await getChatReply(incomingMessage, city);
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>🧮 *Munim-ji AI*

${escapeXml(replyText)}

_Powered by BharatBazaar AI_</Message>
</Response>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/xml' },
    body: twiml,
  };
}
