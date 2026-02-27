import type { VercelRequest, VercelResponse } from '@vercel/node';
import { quantityHandler } from '../../backend/src/handlers/inventory';
import { toEvent } from '../_utils';

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  const result = await quantityHandler(toEvent(req));
  res.status(result.statusCode);
  Object.entries(result.headers || {}).forEach(([k, v]) => res.setHeader(k, v as string));
  res.json(JSON.parse(result.body));
}
