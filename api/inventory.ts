import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handler, updateHandler, deleteHandler, quantityHandler } from '../backend/src/handlers/inventory';
import { toEvent } from './_utils';

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action as string | undefined;
  let result;

  switch (action) {
    case 'update':
      result = await updateHandler(toEvent(req));
      break;
    case 'delete':
      result = await deleteHandler(toEvent(req));
      break;
    case 'quantity':
      result = await quantityHandler(toEvent(req));
      break;
    default:
      result = await handler(toEvent(req));
      break;
  }

  res.status(result.statusCode);
  Object.entries(result.headers || {}).forEach(([k, v]) => res.setHeader(k, v as string));
  res.json(JSON.parse(result.body));
}
