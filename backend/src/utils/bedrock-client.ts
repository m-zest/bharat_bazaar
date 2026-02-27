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

// Custom error class for throttling so handlers can detect it
export class BedrockThrottleError extends Error {
  public readonly isDailyQuota: boolean;
  public readonly retryAfterMs: number;

  constructor(message: string, isDailyQuota: boolean) {
    super(message);
    this.name = 'BedrockThrottleError';
    this.isDailyQuota = isDailyQuota;
    // Daily quota: suggest waiting longer; burst limit: shorter wait
    this.retryAfterMs = isDailyQuota ? 3600000 : 60000;
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isThrottleError(err: any): boolean {
  return err.name === 'ThrottlingException' ||
    err.message?.includes('Too many') ||
    err.message?.includes('throttl') ||
    err.$metadata?.httpStatusCode === 429;
}

function isDailyQuotaError(err: any): boolean {
  return err.message?.includes('per day') ||
    err.message?.includes('daily') ||
    err.message?.includes('quota');
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

  // Retry with exponential backoff for burst rate limiting only
  // Daily quota errors are NOT retried (retrying wastes time and Vercel function timeout)
  const maxRetries = 3;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody.content[0].text;
    } catch (err: any) {
      if (isThrottleError(err)) {
        const dailyQuota = isDailyQuotaError(err);

        // Don't retry daily quota limits — retrying won't help and wastes Vercel timeout budget
        if (dailyQuota) {
          console.error(`Bedrock daily quota exceeded: ${err.message}`);
          throw new BedrockThrottleError(
            'AI service daily limit reached. Please try again tomorrow or contact support.',
            true
          );
        }

        // Burst rate limit — retry with backoff
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
          console.log(`Bedrock throttled (burst), retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await sleep(delay);
          continue;
        }

        // Exhausted retries on burst limit
        throw new BedrockThrottleError(
          'AI service is temporarily busy. Please try again in a minute.',
          false
        );
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
