import type { VercelRequest } from '@vercel/node';
import type { APIGatewayProxyEvent } from 'aws-lambda';

export function toEvent(req: VercelRequest): APIGatewayProxyEvent {
  return {
    body: req.body ? JSON.stringify(req.body) : null,
    headers: req.headers as any,
    httpMethod: req.method || 'GET',
    path: req.url || '/',
    queryStringParameters: (req.query as Record<string, string>) || null,
    pathParameters: null,
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
  };
}
