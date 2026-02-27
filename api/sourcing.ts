import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handler, orderHandler } from '../backend/src/handlers/sourcing';
import { toEvent } from './_utils';

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action as string | undefined;
  let result;

  if (action === 'order') {
    result = await orderHandler(toEvent(req));
  } else {
    result = await handler(toEvent(req));
  }

  res.status(result.statusCode).json(JSON.parse(result.body));
}
