import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { invokeAI, parseJSONResponse } from '../utils/ai-client';
import { success, error } from '../utils/response';
import { buildHolidayRecommendationPrompt } from '../prompts/holiday-prompt';
import { getHolidayById, getUpcomingHolidays, getSuppliersForCategories, INDIAN_STATES } from '../data/holiday-data';
import { putItem } from '../utils/dynamodb-client';
import { getCache, setCache } from '../utils/redis-client';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const path = event.path || '';
    const method = event.httpMethod;

    // GET /api/holidays/{id}/recommendations
    if (method === 'GET' && path.match(/\/holidays\/[^/]+\/recommendations$/)) {
      return handleRecommendations(event);
    }

    // GET /api/holidays/{id}
    if (method === 'GET' && path.match(/\/holidays\/[^/]+$/) && !path.endsWith('/holidays')) {
      return handleDetail(event);
    }

    // GET /api/holidays
    if (method === 'GET') {
      return handleList(event);
    }

    return error(405, 'Method not allowed');
  } catch (err: any) {
    console.error('Holidays handler error:', err);
    return error(500, err.message || 'Internal server error');
  }
}

// --- List holidays ---
async function handleList(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters || {};
  const type = (params.type as 'national' | 'regional' | 'all') || 'all';
  const state = params.state || undefined;
  const month = params.month ? parseInt(params.month) : undefined;
  const months = params.months ? parseInt(params.months) : 12;

  const holidays = getUpcomingHolidays({ type, state, months, month });

  return success({
    holidays,
    filters: { type, state: state || null, month: month || null },
    states: [...INDIAN_STATES],
    totalCount: holidays.length,
  });
}

// --- Holiday detail ---
async function handleDetail(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const pathParts = (event.path || '').split('/');
  const holidayId = pathParts[pathParts.length - 1];

  const holiday = getHolidayById(holidayId);
  if (!holiday) {
    return error(404, `Holiday not found: ${holidayId}`, 'NOT_FOUND');
  }

  const suppliers = getSuppliersForCategories(holiday.categories);

  return success({
    holiday: {
      ...holiday,
      daysAway: Math.ceil((new Date(holiday.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    },
    suppliers,
  });
}

// --- AI recommendations ---
async function handleRecommendations(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const pathParts = (event.path || '').split('/');
  // path: /api/holidays/{id}/recommendations → id is at index -2
  const holidayId = pathParts[pathParts.length - 2];

  const holiday = getHolidayById(holidayId);
  if (!holiday) {
    return error(404, `Holiday not found: ${holidayId}`, 'NOT_FOUND');
  }

  const params = event.queryStringParameters || {};
  const city = params.city || undefined;
  const category = params.category || undefined;

  // Cache key includes holiday + city + category for personalized results
  const cacheKey = `HOLIDAY_REC:${holidayId}:${(city || 'all').toLowerCase()}:${(category || 'all').toLowerCase()}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return success({ ...cached, fromCache: true });
  }

  const prompt = buildHolidayRecommendationPrompt({
    holidayName: holiday.name,
    holidayDescription: holiday.description,
    traditions: holiday.traditions,
    affectedCategories: holiday.categories,
    demandMultiplier: holiday.demandMultiplier,
    city,
    retailerCategory: category,
  });

  const aiResponse = await invokeAI(prompt, {
    maxTokens: 4000,
    temperature: 0.4,
    systemPrompt: 'You are BharatBazaar AI Demand Planner. You help Indian retailers prepare for upcoming festivals and holidays by recommending specific products to stock. You understand regional preferences, seasonal trends, and wholesale pricing in India. Always respond in valid JSON.',
  });

  const result = parseJSONResponse<{ recommendations: any[] }>(aiResponse);

  const responseData = {
    holidayId,
    holidayName: holiday.name,
    city: city || 'all',
    category: category || 'all',
    recommendations: result.recommendations || [],
    generatedAt: new Date().toISOString(),
  };

  // Cache for 7 days
  await setCache(cacheKey, responseData, 604800);

  // Extract userId
  const userId = event.requestContext?.authorizer?.claims?.sub
    || event.headers?.['x-mock-user-id']
    || 'anonymous';

  // Persist to DynamoDB
  putItem({
    PK: `HOLIDAY_REC#${holidayId}`,
    SK: `USER#${userId}#${new Date().toISOString()}`,
    EntityType: 'HolidayRecommendation',
    UserId: userId,
    GSI1PK: `HOLIDAY#${holidayId}`,
    GSI1SK: `TIMESTAMP#${new Date().toISOString()}`,
    Data: responseData,
  }).catch(() => {});

  return success(responseData);
}
