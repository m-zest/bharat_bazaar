// Mock DynamoDB before importing handlers
jest.mock('../utils/dynamodb-client', () => ({
  saveOrder: jest.fn().mockResolvedValue(undefined),
}));

import { handler, orderHandler } from '../handlers/sourcing';
import { getEvent, postEvent, parseBody } from './test-helpers';

describe('Sourcing handler', () => {
  it('returns wholesalers and products for Lucknow', async () => {
    const result = await handler(getEvent({ city: 'Lucknow' }));
    expect(result.statusCode).toBe(200);
    const body = parseBody(result);
    expect(body.success).toBe(true);
    expect(body.data.city).toBe('Lucknow');
    expect(body.data.wholesalers).toBeInstanceOf(Array);
    expect(body.data.wholesalers.length).toBeGreaterThan(0);
    expect(body.data.products).toBeInstanceOf(Array);
    expect(body.data.summary).toBeDefined();
    expect(body.data.summary.totalProducts).toBeGreaterThan(0);
  });

  it('filters by category', async () => {
    const result = await handler(getEvent({ city: 'Delhi', category: 'Groceries' }));
    const body = parseBody(result);
    body.data.products.forEach((p: any) => {
      expect(p.category).toBe('Groceries');
    });
  });

  it('filters by search keyword', async () => {
    const result = await handler(getEvent({ city: 'Mumbai', search: 'rice' }));
    const body = parseBody(result);
    body.data.products.forEach((p: any) => {
      expect(p.productName.toLowerCase()).toContain('rice');
    });
  });

  it('rejects unsupported city', async () => {
    const result = await handler(getEvent({ city: 'BadCity' }));
    expect(result.statusCode).toBe(400);
  });

  it('defaults to Lucknow when no city provided', async () => {
    const result = await handler(getEvent());
    const body = parseBody(result);
    expect(body.data.city).toBe('Lucknow');
  });
});

describe('Order handler', () => {
  it('places an order successfully', async () => {
    const result = await orderHandler(postEvent({
      productName: 'Premium Basmati Rice 5kg',
      wholesalerId: 'lko-ws-1',
      quantity: 10,
      city: 'Lucknow',
    }));
    expect(result.statusCode).toBe(200);
    const body = parseBody(result);
    expect(body.success).toBe(true);
    expect(body.data.orderId).toBeDefined();
    expect(body.data.status).toBe('confirmed');
    expect(body.data.quantity).toBe(10);
    expect(body.data.savings).toBeDefined();
  });

  it('rejects order with missing fields', async () => {
    const result = await orderHandler(postEvent({ productName: 'Rice' }));
    expect(result.statusCode).toBe(400);
  });

  it('rejects order for unknown product/wholesaler', async () => {
    const result = await orderHandler(postEvent({
      productName: 'Nonexistent Product',
      wholesalerId: 'fake-ws',
      quantity: 5,
      city: 'Lucknow',
    }));
    expect(result.statusCode).toBe(404);
  });
});
