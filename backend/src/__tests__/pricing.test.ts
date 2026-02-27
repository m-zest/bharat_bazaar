// Mock Bedrock before importing handler
jest.mock('../utils/bedrock-client', () => ({
  invokeBedrockClaude: jest.fn(),
  parseJSONResponse: jest.fn(),
  BedrockThrottleError: class BedrockThrottleError extends Error {
    isDailyQuota: boolean;
    retryAfterMs: number;
    constructor(msg: string, daily: boolean) {
      super(msg);
      this.name = 'BedrockThrottleError';
      this.isDailyQuota = daily;
      this.retryAfterMs = daily ? 3600000 : 60000;
    }
  },
}));

import { handler } from '../handlers/pricing';
import { invokeBedrockClaude, parseJSONResponse, BedrockThrottleError } from '../utils/bedrock-client';
import { postEvent, parseBody } from './test-helpers';

const mockInvoke = invokeBedrockClaude as jest.MockedFunction<typeof invokeBedrockClaude>;
const mockParse = parseJSONResponse as jest.MockedFunction<typeof parseJSONResponse>;

const VALID_REQUEST = {
  productName: 'Basmati Rice 5kg',
  category: 'Groceries',
  costPrice: 320,
  city: 'Lucknow',
};

describe('Pricing handler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns AI pricing recommendations on valid input', async () => {
    const mockResult = {
      recommendations: [{ strategy: 'Premium', suggestedPrice: 449, confidenceScore: 85, reasoning: 'test' }],
      marketContext: { averageCompetitorPrice: 420, priceRange: { min: 380, max: 500 }, regionalPurchasingPower: 58 },
      festivalInsight: 'Holi coming',
      keyTakeaway: 'Price at ₹449',
    };
    mockInvoke.mockResolvedValue('{"mock": true}');
    mockParse.mockReturnValue(mockResult);

    const result = await handler(postEvent(VALID_REQUEST));
    expect(result.statusCode).toBe(200);
    const body = parseBody(result);
    expect(body.success).toBe(true);
    expect(body.data.productName).toBe('Basmati Rice 5kg');
    expect(body.data.city).toBe('Lucknow');
    expect(body.data.recommendations).toBeDefined();
    expect(mockInvoke).toHaveBeenCalledTimes(1);
  });

  it('rejects missing required fields', async () => {
    const result = await handler(postEvent({ productName: 'Rice' }));
    expect(result.statusCode).toBe(400);
    expect(parseBody(result).error.code).toBe('INVALID_REQUEST');
  });

  it('rejects unsupported city', async () => {
    const result = await handler(postEvent({ ...VALID_REQUEST, city: 'FakeCity' }));
    expect(result.statusCode).toBe(400);
    expect(parseBody(result).error.message).toContain('Unsupported city');
  });

  it('handles Bedrock throttle error with 429', async () => {
    mockInvoke.mockRejectedValue(new BedrockThrottleError('Too busy', false));

    const result = await handler(postEvent(VALID_REQUEST));
    expect(result.statusCode).toBe(429);
    expect(parseBody(result).error.code).toBe('RATE_LIMITED');
  });

  it('handles generic errors with 500', async () => {
    mockInvoke.mockRejectedValue(new Error('Network fail'));

    const result = await handler(postEvent(VALID_REQUEST));
    expect(result.statusCode).toBe(500);
  });

  it('accepts optional currentPrice', async () => {
    mockInvoke.mockResolvedValue('{}');
    mockParse.mockReturnValue({ recommendations: [] });

    const result = await handler(postEvent({ ...VALID_REQUEST, currentPrice: 449 }));
    expect(result.statusCode).toBe(200);
  });
});
