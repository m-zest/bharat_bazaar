import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { handler as pricingHandler } from './handlers/pricing';
import { handler as descriptionsHandler } from './handlers/descriptions';
import { handler as sentimentHandler } from './handlers/sentiment';
import { handler as dashboardHandler } from './handlers/dashboard';
import { handler as authHandler } from './handlers/auth';
import { handler as notificationsHandler } from './handlers/notifications';
import { handler as holidaysHandler } from './handlers/holidays';
import { APIGatewayProxyEvent } from 'aws-lambda';

const app = express();
app.use(cors());
app.use(express.json());

const MOCK_USER_ID = 'local-dev-user-001';

function createEvent(req: express.Request): APIGatewayProxyEvent {
  return {
    body: JSON.stringify(req.body),
    headers: {
      ...req.headers as any,
      'x-mock-user-id': MOCK_USER_ID,
    },
    httpMethod: req.method,
    path: req.path,
    queryStringParameters: req.query as any,
    pathParameters: req.params as any,
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
  };
}

async function handleRoute(req: express.Request, res: express.Response, handler: Function) {
  const result = await handler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
}

// Auth Routes (public)
app.post('/api/auth/register', (req, res) => handleRoute(req, res, authHandler));
app.post('/api/auth/login', (req, res) => handleRoute(req, res, authHandler));
app.post('/api/auth/confirm', (req, res) => handleRoute(req, res, authHandler));
app.post('/api/auth/forgot-password', (req, res) => handleRoute(req, res, authHandler));
app.post('/api/auth/reset-password', (req, res) => handleRoute(req, res, authHandler));
app.get('/api/auth/profile', (req, res) => handleRoute(req, res, authHandler));
app.put('/api/auth/profile-update', (req, res) => handleRoute(req, res, authHandler));

// Notification Routes
app.get('/api/notifications/preferences', (req, res) => handleRoute(req, res, notificationsHandler));
app.put('/api/notifications/preferences', (req, res) => handleRoute(req, res, notificationsHandler));

// Holiday Routes
app.get('/api/holidays', (req, res) => handleRoute(req, res, holidaysHandler));
app.get('/api/holidays/:holidayId', (req, res) => handleRoute(req, res, holidaysHandler));
app.get('/api/holidays/:holidayId/recommendations', (req, res) => handleRoute(req, res, holidaysHandler));

// AI Routes (protected in production, mock user locally)
app.post('/api/pricing/recommend', (req, res) => handleRoute(req, res, pricingHandler));
app.post('/api/content/generate', (req, res) => handleRoute(req, res, descriptionsHandler));
app.post('/api/sentiment/analyze', (req, res) => handleRoute(req, res, sentimentHandler));
app.get('/api/dashboard', (req, res) => handleRoute(req, res, dashboardHandler));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'BharatBazaar AI', version: '1.0.0' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║     BharatBazaar AI — API Server             ║
  ║     Running on http://localhost:${PORT}         ║
  ╠══════════════════════════════════════════════╣
  ║  POST /api/auth/register                     ║
  ║  POST /api/auth/login                        ║
  ║  POST /api/auth/confirm                      ║
  ║  GET  /api/auth/profile                      ║
  ║  PUT  /api/auth/profile-update               ║
  ╠══════════════════════════════════════════════╣
  ║  GET  /api/notifications/preferences         ║
  ║  PUT  /api/notifications/preferences         ║
  ╠══════════════════════════════════════════════╣
  ║  GET  /api/holidays                          ║
  ║  GET  /api/holidays/:id                      ║
  ║  GET  /api/holidays/:id/recommendations      ║
  ╠══════════════════════════════════════════════╣
  ║  POST /api/pricing/recommend                 ║
  ║  POST /api/content/generate                  ║
  ║  POST /api/sentiment/analyze                 ║
  ║  GET  /api/dashboard                         ║
  ╚══════════════════════════════════════════════╝
  `);
});
