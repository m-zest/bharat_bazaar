import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: 'healthy', service: 'BharatBazaar AI', version: '2.0.0' });
}
