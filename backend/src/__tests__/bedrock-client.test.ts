import { parseJSONResponse, BedrockThrottleError } from '../utils/bedrock-client';

// We test parseJSONResponse and BedrockThrottleError directly.
// invokeBedrockClaude requires AWS SDK mocking and is tested indirectly via handler tests.

describe('bedrock-client utilities', () => {
  describe('parseJSONResponse()', () => {
    it('parses plain JSON', () => {
      const result = parseJSONResponse<{ x: number }>('{"x": 42}');
      expect(result).toEqual({ x: 42 });
    });

    it('extracts JSON from markdown code blocks', () => {
      const text = 'Here is the result:\n```json\n{"price": 100}\n```\nEnd.';
      const result = parseJSONResponse<{ price: number }>(text);
      expect(result.price).toBe(100);
    });

    it('extracts JSON from unlabeled code blocks', () => {
      const text = '```\n{"a": 1}\n```';
      const result = parseJSONResponse<{ a: number }>(text);
      expect(result.a).toBe(1);
    });

    it('extracts JSON object from mixed text', () => {
      const text = 'Sure, here is the analysis: {"score": 85} Hope that helps!';
      const result = parseJSONResponse<{ score: number }>(text);
      expect(result.score).toBe(85);
    });

    it('throws on invalid JSON', () => {
      expect(() => parseJSONResponse('not json at all')).toThrow();
    });
  });

  describe('BedrockThrottleError', () => {
    it('sets isDailyQuota=true with long retry for quota errors', () => {
      const err = new BedrockThrottleError('daily limit', true);
      expect(err.isDailyQuota).toBe(true);
      expect(err.retryAfterMs).toBe(3600000); // 1 hour
      expect(err.name).toBe('BedrockThrottleError');
      expect(err).toBeInstanceOf(Error);
    });

    it('sets isDailyQuota=false with short retry for burst errors', () => {
      const err = new BedrockThrottleError('too fast', false);
      expect(err.isDailyQuota).toBe(false);
      expect(err.retryAfterMs).toBe(60000); // 1 minute
    });
  });
});
