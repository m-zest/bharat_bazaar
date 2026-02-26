import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'ap-south-1',
});

// Haiku has much higher default rate limits and is faster
// Switch to Sonnet via env var if you have quota: BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';

export interface BedrockOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function invokeBedrockClaude(
  prompt: string,
  options: BedrockOptions = {}
): Promise<string> {
  const { maxTokens = 2000, temperature = 0.3, systemPrompt } = options;

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt || 'You are BharatBazaar AI, an expert market intelligence assistant for Indian retail. Always respond in valid JSON format.',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  // Retry with exponential backoff for rate limiting
  const maxRetries = 3;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody.content[0].text;
    } catch (err: any) {
      const isThrottled = err.name === 'ThrottlingException' ||
        err.message?.includes('Too many') ||
        err.message?.includes('throttl') ||
        err.$metadata?.httpStatusCode === 429;

      if (isThrottled && attempt < maxRetries) {
        const delay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
        console.log(`Bedrock throttled, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }

  throw new Error('Max retries exceeded');
}

export function parseJSONResponse<T>(text: string): T {
  // Try to extract JSON from the response (handle markdown code blocks)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1].trim());
  }
  return JSON.parse(text);
}
