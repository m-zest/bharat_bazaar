import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { success, error } from '../utils/response';
import {
  getInventory,
  putInventoryItem,
  deleteInventoryItem,
  updateInventoryQuantity,
} from '../utils/dynamodb-client';

const DEFAULT_STORE = 'demo-store';

// GET /api/inventory?storeId=xxx
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const params = event.queryStringParameters || {};
    const storeId = params.storeId || DEFAULT_STORE;

    const items = await getInventory(storeId);

    // If no items exist yet, seed with demo data
    if (items.length === 0) {
      const demoItems = [
        { id: 'inv-1', name: 'Premium Basmati Rice 5kg', category: 'Groceries', costPrice: 320, sellingPrice: 449, quantity: 22, dailySellRate: 5, reorderLevel: 15 },
        { id: 'inv-2', name: 'Surf Excel 1kg', category: 'Groceries', costPrice: 155, sellingPrice: 210, quantity: 8, dailySellRate: 3, reorderLevel: 10 },
        { id: 'inv-3', name: 'Handloom Cotton Kurta', category: 'Fashion', costPrice: 450, sellingPrice: 899, quantity: 35, dailySellRate: 2, reorderLevel: 10 },
        { id: 'inv-4', name: 'Wireless Bluetooth Earbuds', category: 'Electronics', costPrice: 600, sellingPrice: 1299, quantity: 12, dailySellRate: 1, reorderLevel: 5 },
        { id: 'inv-5', name: 'Colgate MaxFresh 150g', category: 'Groceries', costPrice: 75, sellingPrice: 105, quantity: 45, dailySellRate: 4, reorderLevel: 20 },
        { id: 'inv-6', name: 'Tata Salt 1kg', category: 'Groceries', costPrice: 22, sellingPrice: 28, quantity: 60, dailySellRate: 6, reorderLevel: 25 },
      ];

      for (const item of demoItems) {
        await putInventoryItem(storeId, { ...item, lastUpdated: new Date().toISOString() });
      }

      return success(demoItems.map(i => ({ ...i, lastUpdated: new Date().toISOString() })));
    }

    return success(items);
  } catch (err: any) {
    console.error('Inventory GET error:', err);
    return error(500, err.message || 'Failed to fetch inventory');
  }
}

// POST /api/inventory/update — Add or update item
export async function updateHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');
    const storeId = body.storeId || DEFAULT_STORE;

    if (!body.item) {
      return error(400, 'Missing item data', 'INVALID_REQUEST');
    }

    const item = {
      id: body.item.id || `inv-${Date.now()}`,
      name: body.item.name,
      category: body.item.category,
      costPrice: body.item.costPrice,
      sellingPrice: body.item.sellingPrice,
      quantity: body.item.quantity,
      dailySellRate: body.item.dailySellRate || 2,
      reorderLevel: body.item.reorderLevel || 10,
      lastUpdated: new Date().toISOString(),
    };

    await putInventoryItem(storeId, item);

    return success(item);
  } catch (err: any) {
    console.error('Inventory UPDATE error:', err);
    return error(500, err.message || 'Failed to update inventory');
  }
}

// POST /api/inventory/delete — Remove item
export async function deleteHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');
    const storeId = body.storeId || DEFAULT_STORE;
    const itemId = body.itemId;

    if (!itemId) {
      return error(400, 'Missing itemId', 'INVALID_REQUEST');
    }

    await deleteInventoryItem(storeId, itemId);

    return success({ deleted: itemId });
  } catch (err: any) {
    console.error('Inventory DELETE error:', err);
    return error(500, err.message || 'Failed to delete item');
  }
}

// POST /api/inventory/quantity — Quick quantity update
export async function quantityHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');
    const storeId = body.storeId || DEFAULT_STORE;

    if (!body.itemId || body.quantity === undefined) {
      return error(400, 'Missing itemId or quantity', 'INVALID_REQUEST');
    }

    await updateInventoryQuantity(storeId, body.itemId, body.quantity);

    return success({ itemId: body.itemId, quantity: body.quantity });
  } catch (err: any) {
    console.error('Inventory QUANTITY error:', err);
    return error(500, err.message || 'Failed to update quantity');
  }
}
