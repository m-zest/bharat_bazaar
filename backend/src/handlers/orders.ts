import { APIGatewayProxyEvent } from 'aws-lambda';
import { getOrders } from '../utils/dynamodb-client';
import { success, error } from '../utils/response';

// Demo orders for when DynamoDB is not available
const DEMO_ORDERS = [
  {
    orderId: 'BB-ORD-2024-001',
    productName: 'Tata Salt (1kg x 24 pack)',
    wholesaler: 'Gupta Wholesale, Aminabad',
    quantity: 5,
    totalAmount: 4200,
    status: 'delivered',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-002',
    productName: 'Fortune Sunflower Oil 5L',
    wholesaler: 'Sharma Traders, Charbagh',
    quantity: 10,
    totalAmount: 7500,
    status: 'shipped',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-003',
    productName: 'Aashirvaad Atta 10kg',
    wholesaler: 'Om Trading Co., Hazratganj',
    quantity: 8,
    totalAmount: 3520,
    status: 'processing',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-004',
    productName: 'Parle-G Biscuit (800g x 12)',
    wholesaler: 'Gupta Wholesale, Aminabad',
    quantity: 3,
    totalAmount: 1680,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-005',
    productName: 'Cotton Kurta Set (M, L, XL)',
    wholesaler: 'Kapoor Garments, Chowk',
    quantity: 15,
    totalAmount: 12750,
    status: 'delivered',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    orderId: 'BB-ORD-2024-006',
    productName: 'Wireless Earbuds (Bulk)',
    wholesaler: 'TechZone, Naka Hindola',
    quantity: 20,
    totalAmount: 15000,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const storeId = event.queryStringParameters?.storeId || 'demo-store';
    let orders: any[] = [];

    try {
      orders = await getOrders(storeId);
    } catch {
      // DynamoDB not available — use demo data
    }

    // Merge with demo orders if needed
    if (orders.length === 0) {
      orders = DEMO_ORDERS;
    }

    return success(orders);
  } catch (err: any) {
    console.error('Orders handler error:', err.message);
    return error(500, 'Failed to fetch orders', 'ORDERS_ERROR');
  }
};
