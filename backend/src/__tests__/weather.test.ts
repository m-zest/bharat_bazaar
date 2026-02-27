import { handler } from '../handlers/weather';
import { getEvent, parseBody } from './test-helpers';

describe('Weather handler', () => {
  it('returns simulated weather for default city', async () => {
    const result = await handler(getEvent());
    expect(result.statusCode).toBe(200);
    const body = parseBody(result);
    expect(body.success).toBe(true);
    expect(body.data.city).toBe('Lucknow');
    expect(typeof body.data.temperature).toBe('number');
    expect(typeof body.data.humidity).toBe('number');
    expect(body.data.condition).toBeDefined();
    expect(body.data.forecast).toBeInstanceOf(Array);
    expect(body.data.forecast.length).toBe(5);
  });

  it('returns weather for Mumbai', async () => {
    const result = await handler(getEvent({ city: 'Mumbai' }));
    const body = parseBody(result);
    expect(body.data.city).toBe('Mumbai');
    expect(body.data.temperature).toBeGreaterThanOrEqual(15);
    expect(body.data.temperature).toBeLessThanOrEqual(45);
  });

  it('includes business impact analysis', async () => {
    const result = await handler(getEvent({ city: 'Delhi' }));
    const body = parseBody(result);
    const impact = body.data.businessImpact;
    expect(impact.summary).toBeDefined();
    expect(impact.demandChanges).toBeInstanceOf(Array);
    expect(impact.demandChanges.length).toBeGreaterThan(0);
    expect(impact.recommendation).toBeDefined();
  });

  it('rejects unsupported city', async () => {
    const result = await handler(getEvent({ city: 'FakeCity' }));
    expect(result.statusCode).toBe(400);
  });

  it('returns deterministic results for the same day', async () => {
    const result1 = await handler(getEvent({ city: 'Jaipur' }));
    const result2 = await handler(getEvent({ city: 'Jaipur' }));
    const body1 = parseBody(result1);
    const body2 = parseBody(result2);
    expect(body1.data.temperature).toBe(body2.data.temperature);
    expect(body1.data.condition).toBe(body2.data.condition);
  });

  it('forecast includes day, temps, condition, and rain chance', async () => {
    const result = await handler(getEvent({ city: 'Chennai' }));
    const body = parseBody(result);
    const day = body.data.forecast[0];
    expect(day.day).toBeDefined();
    expect(typeof day.tempHigh).toBe('number');
    expect(typeof day.tempLow).toBe('number');
    expect(day.condition).toBeDefined();
    expect(typeof day.rainChance).toBe('number');
  });
});
