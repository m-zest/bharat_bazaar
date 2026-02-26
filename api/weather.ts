import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handler } from '../backend/src/handlers/weather';
import { toEvent } from './_utils';

export default async function(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  const result = await handler(toEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
}
