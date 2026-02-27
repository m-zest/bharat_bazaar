import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { success, error } from '../utils/response';
import { getWholesalersForCity, getWholesaleProducts, WHOLESALE_PRODUCTS } from '../data/wholesale-data';
import { REGIONAL_DATA } from '../data/regional-data';
import { saveOrder } from '../utils/dynamodb-client';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const params = event.queryStringParameters || {};
    const city = params.city || 'Lucknow';
    const category = params.category || undefined;
    const search = params.search || undefined;

    if (!REGIONAL_DATA[city]) {
      return error(400, `Unsupported city: ${city}`, 'INVALID_REQUEST');
    }

    const wholesalers = getWholesalersForCity(city);
    let products = getWholesaleProducts(city, category);

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.productName.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Group products by category for display
    const categories = [...new Set(products.map(p => p.category))];
    const productsByCategory = categories.map(cat => ({
      category: cat,
      productCount: products.filter(p => p.category === cat).length,
      products: products.filter(p => p.category === cat),
    }));

    // Calculate savings summary
    const totalProducts = products.length;
    const avgSavings = products.reduce((sum, p) => sum + parseInt(p.savings), 0) / (totalProducts || 1);

    return success({
      city,
      wholesalers,
      products: products.map(p => ({
        productName: p.productName,
        category: p.category,
        wholesalePrice: p.wholesalePrice,
        mrp: p.mrp,
        unit: p.unit,
        moq: p.moq,
        inStock: p.inStock,
        savings: p.savings,
        wholesaler: p.wholesaler,
      })),
      productsByCategory,
      summary: {
        totalProducts,
        totalWholesalers: wholesalers.length,
        avgSavings: `${Math.round(avgSavings)}%`,
        verifiedWholesalers: wholesalers.filter(w => w.verified).length,
      },
      supportedCities: Object.keys(REGIONAL_DATA),
    });
  } catch (err: any) {
    console.error('Sourcing handler error:', err);
    return error(500, err.message || 'Internal server error');
  }
}

// Handler for placing orders (simulated)
export async function orderHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');
    const { productName, wholesalerId, quantity, city } = body;

    if (!productName || !wholesalerId || !quantity) {
      return error(400, 'Missing required fields: productName, wholesalerId, quantity', 'INVALID_REQUEST');
    }

    const wholesalers = getWholesalersForCity(city || 'Lucknow');
    const wholesaler = wholesalers.find(w => w.id === wholesalerId);
    const product = WHOLESALE_PRODUCTS.find(p => p.productName === productName);

    if (!wholesaler || !product) {
      return error(404, 'Product or wholesaler not found', 'NOT_FOUND');
    }

    const totalAmount = product.wholesalePrice * quantity;
    const orderId = `BB-${Date.now().toString(36).toUpperCase()}`;

    // Persist order to DynamoDB
    try {
      await saveOrder({
        storeId: body.storeId || 'demo-store',
        orderId,
        productName,
        wholesaler: wholesaler.name,
        quantity,
        totalAmount,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('DynamoDB order save failed (non-blocking):', dbErr);
    }

    return success({
      orderId,
      status: 'confirmed',
      productName,
      quantity,
      unitPrice: product.wholesalePrice,
      totalAmount,
      wholesaler: {
        name: wholesaler.name,
        area: wholesaler.area,
        deliveryDays: wholesaler.deliveryDays,
      },
      estimatedDelivery: `${wholesaler.deliveryDays} day${wholesaler.deliveryDays > 1 ? 's' : ''}`,
      message: `Order placed with ${wholesaler.name}. Expected delivery: ${wholesaler.deliveryDays} day(s) via their delivery network.`,
      savings: {
        perUnit: product.mrp - product.wholesalePrice,
        total: (product.mrp - product.wholesalePrice) * quantity,
        percentage: product.savings,
      },
    });
  } catch (err: any) {
    console.error('Order handler error:', err);
    return error(500, err.message || 'Internal server error');
  }
}
