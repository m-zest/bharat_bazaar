import { APIGatewayProxyEvent } from 'aws-lambda';

/** Create a mock API Gateway event for handler testing */
export function mockEvent(overrides: Partial<APIGatewayProxyEvent> = {}): APIGatewayProxyEvent {
  return {
    body: null,
    headers: { 'Content-Type': 'application/json' },
    httpMethod: 'GET',
    path: '/',
    queryStringParameters: null,
    pathParameters: null,
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
    ...overrides,
  };
}

/** Create a POST event with JSON body */
export function postEvent(body: any, query?: Record<string, string>): APIGatewayProxyEvent {
  return mockEvent({
    httpMethod: 'POST',
    body: JSON.stringify(body),
    queryStringParameters: query || null,
  });
}

/** Create a GET event with query params */
export function getEvent(query?: Record<string, string>): APIGatewayProxyEvent {
  return mockEvent({
    httpMethod: 'GET',
    queryStringParameters: query || null,
  });
}

/** Parse handler response body */
export function parseBody(result: { statusCode: number; body: string }) {
  return JSON.parse(result.body);
}
