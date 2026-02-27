import { handler } from '../handlers/dashboard';
import { getEvent, parseBody } from './test-helpers';

describe('Dashboard handler', () => {
  it('returns dashboard data for default city (Lucknow)', async () => {
    const result = await handler(getEvent());
    expect(result.statusCode).toBe(200);
    const body = parseBody(result);
    expect(body.success).toBe(true);
    expect(body.data.business.city).toBe('Lucknow');
    expect(body.data.summary).toBeDefined();
    expect(body.data.charts).toBeDefined();
    expect(body.data.products).toBeDefined();
    expect(body.data.supportedCities).toBeInstanceOf(Array);
  });

  it('returns dashboard for a specific city', async () => {
    const result = await handler(getEvent({ city: 'Mumbai' }));
    expect(result.statusCode).toBe(200);
    const body = parseBody(result);
    expect(body.data.business.city).toBe('Mumbai');
    expect(body.data.regionalInfo.tier).toBeDefined();
  });

  it('rejects unsupported city', async () => {
    const result = await handler(getEvent({ city: 'InvalidCity' }));
    expect(result.statusCode).toBe(400);
    const body = parseBody(result);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Unsupported city');
  });

  it('includes charts with correct structure', async () => {
    const result = await handler(getEvent());
    const body = parseBody(result);
    const charts = body.data.charts;
    expect(charts.sentimentTrend.labels).toBeInstanceOf(Array);
    expect(charts.sentimentTrend.data).toBeInstanceOf(Array);
    expect(charts.pricingAccuracy.labels).toBeInstanceOf(Array);
    expect(charts.demandForecast.labels).toBeInstanceOf(Array);
    expect(charts.categoryDistribution).toBeInstanceOf(Array);
  });

  it('includes alerts and wholesaler count', async () => {
    const result = await handler(getEvent({ city: 'Delhi' }));
    const body = parseBody(result);
    expect(body.data.alerts).toBeInstanceOf(Array);
    expect(typeof body.data.nearbyWholesalers).toBe('number');
  });
});
