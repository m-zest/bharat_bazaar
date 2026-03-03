import express from 'express';
import cors from 'cors';
import path from 'path';
import { handler as pricingHandler } from './handlers/pricing';
import { handler as descriptionsHandler } from './handlers/descriptions';
import { handler as sentimentHandler } from './handlers/sentiment';
import { handler as dashboardHandler } from './handlers/dashboard';
import { handler as sourcingHandler, orderHandler } from './handlers/sourcing';
import { handler as chatHandler } from './handlers/chat';
import { handler as weatherHandler } from './handlers/weather';
import { handler as inventoryHandler, updateHandler as inventoryUpdateHandler, deleteHandler as inventoryDeleteHandler, quantityHandler as inventoryQuantityHandler } from './handlers/inventory';
import { handler as compareHandler } from './handlers/compare';
import { handler as competitorsHandler } from './handlers/competitors';
import { handler as visionHandler } from './handlers/vision';
import { handler as whatsappHandler } from './handlers/whatsapp';
import { handler as ordersHandler } from './handlers/orders';
import { APIGatewayProxyEvent } from 'aws-lambda';

const app = express();

// CORS — allow all origins (hackathon demo)
app.use(cors());

// Body parsing — no Vercel serverless size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request timeout — no 30s Vercel limit; allow up to 5 minutes for AI calls
app.use((_req, res, next) => {
  res.setTimeout(300000); // 5 min
  next();
});

function createEvent(req: express.Request): APIGatewayProxyEvent {
  return {
    body: JSON.stringify(req.body),
    headers: req.headers as any,
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

// Helper — wraps Lambda-style handlers into Express handlers
function wrapHandler(handler: (event: APIGatewayProxyEvent) => Promise<any>) {
  return async (req: express.Request, res: express.Response) => {
    try {
      const result = await handler(createEvent(req));
      const contentType = result.headers?.['Content-Type'] || 'application/json';
      res.setHeader('Content-Type', contentType as string);
      if (contentType === 'application/json' || (contentType as string).includes('json')) {
        res.status(result.statusCode).json(JSON.parse(result.body));
      } else {
        res.status(result.statusCode).send(result.body);
      }
    } catch (err: any) {
      console.error(`Handler error on ${req.path}:`, err.message);
      res.status(500).json({ success: false, error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
    }
  };
}

// ══════════════════════════════════════════════
// API Routes — full Express routing, no Vercel rewrites needed
// ══════════════════════════════════════════════

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'BharatBazaar AI',
    version: '3.0.0',
    runtime: 'AWS (Express)',
    limits: {
      timeout: '5 minutes',
      bodySize: '50MB',
      memory: 'unlimited (server)',
    },
  });
});

// AI Features (Bedrock / Gemini)
app.post('/api/pricing/recommend', wrapHandler(pricingHandler));
app.post('/api/content/generate', wrapHandler(descriptionsHandler));
app.post('/api/sentiment/analyze', wrapHandler(sentimentHandler));
app.post('/api/chat', wrapHandler(chatHandler));
app.post('/api/compare', wrapHandler(compareHandler));
app.post('/api/competitors', wrapHandler(competitorsHandler));
app.post('/api/vision', wrapHandler(visionHandler));

// Data Features
app.get('/api/dashboard', wrapHandler(dashboardHandler));
app.get('/api/sourcing', wrapHandler(sourcingHandler));
app.post('/api/sourcing/order', wrapHandler(orderHandler));
app.get('/api/weather', wrapHandler(weatherHandler));

// Orders (DynamoDB)
app.get('/api/orders', wrapHandler(ordersHandler));

// Inventory (DynamoDB)
app.get('/api/inventory', wrapHandler(inventoryHandler));
app.post('/api/inventory/update', wrapHandler(inventoryUpdateHandler));
app.post('/api/inventory/delete', wrapHandler(inventoryDeleteHandler));
app.post('/api/inventory/quantity', wrapHandler(inventoryQuantityHandler));

// WhatsApp Webhook (Twilio) — special handling for form-urlencoded
app.post('/api/whatsapp', async (req, res) => {
  const contentType = req.headers['content-type'] || '';
  let rawBody: string;
  if (contentType.includes('application/x-www-form-urlencoded')) {
    rawBody = new URLSearchParams(req.body as Record<string, string>).toString();
  } else {
    rawBody = JSON.stringify(req.body);
  }
  const event = { ...createEvent(req), body: rawBody };
  try {
    const result = await whatsappHandler(event);
    res.setHeader('Content-Type', (result.headers?.['Content-Type'] as string) || 'text/xml');
    res.status(result.statusCode).send(result.body);
  } catch (err: any) {
    console.error('WhatsApp handler error:', err.message);
    res.status(500).send('<Response></Response>');
  }
});

// ══════════════════════════════════════════════
// Serve Frontend (React static build)
// ══════════════════════════════════════════════
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// SPA fallback — all non-API routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ══════════════════════════════════════════════
// Start Server
// ══════════════════════════════════════════════
const PORT = parseInt(process.env.PORT || '8080', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║     BharatBazaar AI — AWS Production Server v3.0     ║
  ║     Running on http://0.0.0.0:${PORT}                    ║
  ╠══════════════════════════════════════════════════════╣
  ║  Runtime: Express (always-on, no cold starts)        ║
  ║  Timeout: 5 minutes (vs Vercel 30s)                  ║
  ║  Body:    50MB (vs Vercel ~4.5MB)                    ║
  ║  Memory:  Unlimited (server-based)                   ║
  ╠══════════════════════════════════════════════════════╣
  ║  POST /api/pricing/recommend     (Bedrock AI)        ║
  ║  POST /api/content/generate      (Bedrock AI)        ║
  ║  POST /api/sentiment/analyze     (Bedrock AI)        ║
  ║  POST /api/chat                  (Bedrock AI)        ║
  ║  POST /api/compare               (Bedrock AI)        ║
  ║  POST /api/competitors           (Bedrock AI)        ║
  ║  GET  /api/dashboard                                 ║
  ║  GET  /api/sourcing?city=Lucknow                     ║
  ║  POST /api/sourcing/order        (DynamoDB)          ║
  ║  GET  /api/orders                (DynamoDB)          ║
  ║  GET  /api/inventory             (DynamoDB)          ║
  ║  POST /api/inventory/update      (DynamoDB)          ║
  ║  POST /api/inventory/delete      (DynamoDB)          ║
  ║  POST /api/inventory/quantity    (DynamoDB)          ║
  ║  GET  /api/weather               (OpenWeather)       ║
  ║  POST /api/vision               (Bedrock Vision)     ║
  ║  POST /api/whatsapp             (Twilio)             ║
  ║  GET  /*                        (React Frontend)     ║
  ╚══════════════════════════════════════════════════════╝
  `);
});
