jest.mock('../utils/bedrock-client', () => ({
  invokeBedrockClaude: jest.fn(),
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

import { handler } from '../handlers/chat';
import { invokeBedrockClaude, BedrockThrottleError } from '../utils/bedrock-client';
import { postEvent, parseBody } from './test-helpers';

const mockInvoke = invokeBedrockClaude as jest.MockedFunction<typeof invokeBedrockClaude>;

describe('Chat handler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns AI response for a valid message', async () => {
    mockInvoke.mockResolvedValue('Basmati Rice ko ₹449 pe rakho, acchi price hai Lucknow mein.');

    const result = await handler(postEvent({ message: 'Best price for rice?', city: 'Lucknow' }));
    expect(result.statusCode).toBe(200);
    const body = parseBody(result);
    expect(body.success).toBe(true);
    expect(body.data.response).toContain('Basmati');
    expect(body.data.city).toBe('Lucknow');
  });

  it('rejects missing message', async () => {
    const result = await handler(postEvent({ city: 'Delhi' }));
    expect(result.statusCode).toBe(400);
    expect(parseBody(result).error.code).toBe('INVALID_REQUEST');
  });

  it('defaults to Lucknow if no city', async () => {
    mockInvoke.mockResolvedValue('Hello!');
    const result = await handler(postEvent({ message: 'hi' }));
    const body = parseBody(result);
    expect(body.data.city).toBe('Lucknow');
  });

  it('passes conversation history to AI', async () => {
    mockInvoke.mockResolvedValue('Follow-up response');
    await handler(postEvent({
      message: 'What about kurtas?',
      city: 'Delhi',
      conversationHistory: [
        { role: 'user', content: 'Tell me about products' },
        { role: 'assistant', content: 'Sure, which ones?' },
      ],
    }));
    expect(mockInvoke).toHaveBeenCalledTimes(1);
    const prompt = mockInvoke.mock.calls[0][0];
    expect(prompt).toContain('Tell me about products');
  });

  it('handles throttle error', async () => {
    mockInvoke.mockRejectedValue(new BedrockThrottleError('Rate limited', false));
    const result = await handler(postEvent({ message: 'test' }));
    expect(result.statusCode).toBe(429);
  });
});
