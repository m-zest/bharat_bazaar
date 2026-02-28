import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handler } from '../backend/src/handlers/whatsapp';
import type { APIGatewayProxyEvent } from 'aws-lambda';

export default async function(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Twilio sends form-urlencoded data — Vercel parses it into req.body object
  // Reconstruct form-encoded string so the handler's URLSearchParams can parse it
  const contentType = req.headers['content-type'] || '';
  let body: string;

  if (contentType.includes('application/x-www-form-urlencoded') && typeof req.body === 'object') {
    body = new URLSearchParams(req.body as Record<string, string>).toString();
  } else {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  const event: APIGatewayProxyEvent = {
    body,
    headers: req.headers as any,
    httpMethod: req.method || 'POST',
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

  const result = await handler(event);

  // WhatsApp returns TwiML (XML), not JSON
  res.setHeader('Content-Type', result.headers?.['Content-Type'] || 'text/xml');
  res.status(result.statusCode).send(result.body);
}
