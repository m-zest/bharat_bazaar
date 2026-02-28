import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const VISION_PROMPT = `You are an expert at reading Indian wholesale bills and invoices. Look at this image of a bill/invoice/receipt.

Extract ALL items with their quantities and prices.

Return ONLY a valid JSON array, no other text:
[
  {
    "name": "Product name in English",
    "nameHi": "Product name in Hindi if visible",
    "quantity": 10,
    "unit": "kg",
    "pricePerUnit": 80,
    "totalPrice": 800,
    "category": "Groceries"
  }
]

If the image is unclear or not a bill, return: { "error": "Could not read this image. Please try a clearer photo." }

Important:
- Read both Hindi and English text
- Convert Hindi numerals to regular numbers
- Identify common Indian products (Dal, Rice, Atta, Surf, etc.)
- If unit is ambiguous, guess the most likely unit for that product
- Categories: Groceries, FMCG, Personal Care, Beverages, Snacks, Electronics`;

function getDemoVisionResponse() {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify({
      success: true,
      data: {
        items: [
          { name: 'Toor Dal', nameHi: 'तूर दाल', quantity: 25, unit: 'kg', pricePerUnit: 120, totalPrice: 3000, category: 'Groceries' },
          { name: 'Basmati Rice', nameHi: 'बासमती चावल', quantity: 10, unit: 'kg', pricePerUnit: 85, totalPrice: 850, category: 'Groceries' },
          { name: 'Surf Excel 1kg', nameHi: 'सर्फ एक्सेल', quantity: 20, unit: 'packets', pricePerUnit: 195, totalPrice: 3900, category: 'FMCG' },
          { name: 'Amul Butter 500g', nameHi: 'अमूल बटर', quantity: 15, unit: 'pcs', pricePerUnit: 270, totalPrice: 4050, category: 'Groceries' },
          { name: 'Parle-G 800g', nameHi: 'पारले-जी', quantity: 30, unit: 'packets', pricePerUnit: 55, totalPrice: 1650, category: 'Snacks' },
          { name: 'Colgate MaxFresh', nameHi: 'कोलगेट', quantity: 24, unit: 'pcs', pricePerUnit: 85, totalPrice: 2040, category: 'Personal Care' },
        ],
        totalAmount: 15490,
        supplier: 'Gupta Wholesale, Aminabad, Lucknow',
        date: new Date().toISOString().split('T')[0],
        demoMode: true,
      },
    }),
  };
}

async function tryBedrockVision(imageBase64: string, mimeType: string): Promise<any[]> {
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'ap-south-1' });

  const response = await client.send(new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: imageBase64,
            },
          },
          { type: 'text', text: VISION_PROMPT },
        ],
      }],
    }),
  }));

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const text = responseBody.content?.[0]?.text || '';

  // Extract JSON from the text
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  const errorMatch = text.match(/\{[\s\S]*"error"[\s\S]*\}/);
  if (errorMatch) {
    throw new Error(JSON.parse(errorMatch[0]).error);
  }

  throw new Error('Could not parse AI response');
}

async function tryGeminiVision(imageBase64: string, mimeType: string): Promise<any[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('No Gemini API key configured');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64,
              },
            },
            { text: VISION_PROMPT },
          ],
        }],
      }),
    }
  );

  const data: any = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Could not parse Gemini response');
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { image, mimeType } = body;

  if (!image) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        error: { message: 'Missing required field: image (base64)', code: 'INVALID_REQUEST' },
      }),
    };
  }

  const mime = mimeType || 'image/jpeg';

  try {
    // Try Bedrock Vision first
    const items = await tryBedrockVision(image, mime);
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        data: {
          items,
          totalAmount,
          date: new Date().toISOString().split('T')[0],
          demoMode: false,
        },
      }),
    };
  } catch (bedrockErr) {
    console.error('Bedrock vision failed, trying Gemini:', (bedrockErr as Error).message);

    try {
      const items = await tryGeminiVision(image, mime);
      const totalAmount = items.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: JSON.stringify({
          success: true,
          data: {
            items,
            totalAmount,
            date: new Date().toISOString().split('T')[0],
            demoMode: false,
          },
        }),
      };
    } catch (geminiErr) {
      console.error('Gemini vision failed, using demo fallback:', (geminiErr as Error).message);
      return getDemoVisionResponse();
    }
  }
}
