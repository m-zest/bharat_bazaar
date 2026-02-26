import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'BharatBazaarData';

const rawClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
});

const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: { removeUndefinedValues: true },
});

/** Check if DynamoDB is configured (has valid credentials). */
let dynamoAvailable: boolean | null = null;

async function isDynamoAvailable(): Promise<boolean> {
  if (dynamoAvailable !== null) return dynamoAvailable;
  try {
    // Quick test — will fail fast if no credentials
    await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: 'HEALTH_CHECK', SK: 'PING' },
    }));
    dynamoAvailable = true;
  } catch (err: any) {
    if (err.name === 'ResourceNotFoundException') {
      // Table doesn't exist yet — DynamoDB is available but table needs creation
      dynamoAvailable = false;
      console.warn(`DynamoDB table "${TABLE_NAME}" not found. Running without persistence.`);
    } else if (err.name === 'CredentialsProviderError' || err.name === 'ExpiredTokenException') {
      dynamoAvailable = false;
      console.warn('DynamoDB credentials not configured. Running without persistence.');
    } else {
      // Table exists, just no item found — that's fine
      dynamoAvailable = true;
    }
  }
  return dynamoAvailable;
}

/** Save an item to DynamoDB. Silently fails if DynamoDB is not available. */
export async function putItem(item: Record<string, any>): Promise<void> {
  if (!(await isDynamoAvailable())) return;

  try {
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...item,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
    }));
  } catch (err: any) {
    console.error('DynamoDB putItem error:', err.message);
  }
}

/** Query items by PK and optional SK prefix. Returns empty array if DynamoDB unavailable. */
export async function queryItems(
  pk: string,
  skPrefix?: string,
  limit?: number
): Promise<Record<string, any>[]> {
  if (!(await isDynamoAvailable())) return [];

  try {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: skPrefix
        ? 'PK = :pk AND begins_with(SK, :sk)'
        : 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
        ...(skPrefix ? { ':sk': skPrefix } : {}),
      },
      ScanIndexForward: false, // newest first
      ...(limit ? { Limit: limit } : {}),
    };

    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
  } catch (err: any) {
    console.error('DynamoDB query error:', err.message);
    return [];
  }
}

/** Get a single item by PK + SK. Returns null if not found or DynamoDB unavailable. */
export async function getItem(pk: string, sk: string): Promise<Record<string, any> | null> {
  if (!(await isDynamoAvailable())) return null;

  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    }));
    return result.Item || null;
  } catch (err: any) {
    console.error('DynamoDB getItem error:', err.message);
    return null;
  }
}
