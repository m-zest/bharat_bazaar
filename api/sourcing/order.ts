import type { VercelRequest, VercelResponse } from '@vercel/node';
import { orderHandler } from '../../backend/src/handlers/sourcing';
import { toEvent } from '../_utils';

export default async function(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  const result = await orderHandler(toEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
}
