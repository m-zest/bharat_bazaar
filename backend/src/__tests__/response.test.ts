import { success, error, throttled, apiResponse } from '../utils/response';

describe('response utilities', () => {
  describe('success()', () => {
    it('returns 200 with success:true wrapper', () => {
      const result = success({ items: [1, 2, 3] });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toEqual([1, 2, 3]);
    });

    it('sets CORS headers', () => {
      const result = success({});
      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(result.headers['Access-Control-Allow-Methods']).toContain('POST');
    });
  });

  describe('error()', () => {
    it('returns specified status code with error body', () => {
      const result = error(400, 'Bad request', 'INVALID_REQUEST');
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.error.message).toBe('Bad request');
      expect(body.error.code).toBe('INVALID_REQUEST');
    });

    it('defaults error code to INTERNAL_ERROR', () => {
      const result = error(500, 'Something broke');
      const body = JSON.parse(result.body);
      expect(body.error.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('throttled()', () => {
    it('returns 429 with RATE_LIMITED code', () => {
      const result = throttled('Too busy', 60);
      expect(result.statusCode).toBe(429);
      const body = JSON.parse(result.body);
      expect(body.error.code).toBe('RATE_LIMITED');
      expect(result.headers['Retry-After']).toBe('60');
    });

    it('works without retryAfterSeconds', () => {
      const result = throttled('Slow down');
      expect(result.statusCode).toBe(429);
      expect(result.headers['Retry-After']).toBeUndefined();
    });
  });

  describe('apiResponse()', () => {
    it('wraps arbitrary body at any status code', () => {
      const result = apiResponse(201, { created: true });
      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({ created: true });
    });
  });
});
