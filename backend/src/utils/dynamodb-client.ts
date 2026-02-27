import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'BharatBazaarData';

// Auto-create table if it doesn't exist (first run setup)
let tableReady = false;

async function ensureTable(): Promise<void> {
  if (tableReady) return;

  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    tableReady = true;
  } catch (err: any) {
    if (err.name === 'ResourceNotFoundException') {
      console.log(`Creating DynamoDB table: ${TABLE_NAME}`);
      await client.send(new CreateTableCommand({
        TableName: TABLE_NAME,
        KeySchema: [
          { AttributeName: 'PK', KeyType: 'HASH' },
          { AttributeName: 'SK', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'PK', AttributeType: 'S' },
          { AttributeName: 'SK', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST', // No capacity planning needed, costs pennies
      }));

      // Wait for table to be active
      let attempts = 0;
      while (attempts < 30) {
        const desc = await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
        if (desc.Table?.TableStatus === 'ACTIVE') break;
        await new Promise(r => setTimeout(r, 1000));
        attempts++;
      }

      tableReady = true;
      console.log(`Table ${TABLE_NAME} created and active`);
    } else {
      throw err;
    }
  }
}

// ── Inventory Operations ──

export async function getInventory(storeId: string) {
  await ensureTable();
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `STORE#${storeId}`,
      ':sk': 'INV#',
    },
  }));
  return (result.Items || []).map(item => ({
    id: item.SK.replace('INV#', ''),
    name: item.name,
    category: item.category,
    costPrice: item.costPrice,
    sellingPrice: item.sellingPrice,
    quantity: item.quantity,
    dailySellRate: item.dailySellRate,
    reorderLevel: item.reorderLevel,
    lastUpdated: item.lastUpdated,
  }));
}

export async function putInventoryItem(storeId: string, item: any) {
  await ensureTable();
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      PK: `STORE#${storeId}`,
      SK: `INV#${item.id}`,
      name: item.name,
      category: item.category,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      quantity: item.quantity,
      dailySellRate: item.dailySellRate,
      reorderLevel: item.reorderLevel,
      lastUpdated: item.lastUpdated || new Date().toISOString(),
    },
  }));
}

export async function deleteInventoryItem(storeId: string, itemId: string) {
  await ensureTable();
  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `STORE#${storeId}`,
      SK: `INV#${itemId}`,
    },
  }));
}

export async function updateInventoryQuantity(storeId: string, itemId: string, quantity: number) {
  await ensureTable();
  await docClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `STORE#${storeId}`,
      SK: `INV#${itemId}`,
    },
    UpdateExpression: 'SET quantity = :qty, lastUpdated = :ts',
    ExpressionAttributeValues: {
      ':qty': quantity,
      ':ts': new Date().toISOString(),
    },
  }));
}

// ── Order Operations ──

export async function saveOrder(order: any) {
  await ensureTable();
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      PK: `STORE#${order.storeId}`,
      SK: `ORDER#${order.orderId}`,
      productName: order.productName,
      wholesaler: order.wholesaler,
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      status: order.status || 'confirmed',
      createdAt: order.createdAt || new Date().toISOString(),
    },
  }));
}

export async function getOrders(storeId: string) {
  await ensureTable();
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `STORE#${storeId}`,
      ':sk': 'ORDER#',
    },
    ScanIndexForward: false, // newest first
  }));
  return (result.Items || []).map(item => ({
    orderId: item.SK.replace('ORDER#', ''),
    productName: item.productName,
    wholesaler: item.wholesaler,
    quantity: item.quantity,
    totalAmount: item.totalAmount,
    status: item.status,
    createdAt: item.createdAt,
  }));
}

// ── Store Settings ──

export async function saveStoreSettings(storeId: string, settings: any) {
  await ensureTable();
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      PK: `STORE#${storeId}`,
      SK: 'SETTINGS',
      ...settings,
      updatedAt: new Date().toISOString(),
    },
  }));
}

export async function getStoreSettings(storeId: string) {
  await ensureTable();
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `STORE#${storeId}`,
      SK: 'SETTINGS',
    },
  }));
  return result.Item || null;
}
