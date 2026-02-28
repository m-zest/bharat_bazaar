import express from 'express';
import cors from 'cors';
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
import { APIGatewayProxyEvent } from 'aws-lambda';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// AI Features
app.post('/api/pricing/recommend', async (req, res) => {
  const result = await pricingHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/api/content/generate', async (req, res) => {
  const result = await descriptionsHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/api/sentiment/analyze', async (req, res) => {
  const result = await sentimentHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/api/chat', async (req, res) => {
  const result = await chatHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

// Data Features
app.get('/api/dashboard', async (req, res) => {
  const result = await dashboardHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.get('/api/sourcing', async (req, res) => {
  const result = await sourcingHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/api/sourcing/order', async (req, res) => {
  const result = await orderHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.get('/api/weather', async (req, res) => {
  const result = await weatherHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

// Inventory (DynamoDB)
app.get('/api/inventory', async (req, res) => {
  const result = await inventoryHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/api/inventory/update', async (req, res) => {
  const result = await inventoryUpdateHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/api/inventory/delete', async (req, res) => {
  const result = await inventoryDeleteHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/api/inventory/quantity', async (req, res) => {
  const result = await inventoryQuantityHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

// AI Compare & Competitors (Bedrock)
app.post('/api/compare', async (req, res) => {
  const result = await compareHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/api/competitors', async (req, res) => {
  const result = await competitorsHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

// Vision (Bill Scanner — Bedrock/Gemini)
app.post('/api/vision', async (req, res) => {
  const result = await visionHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

// WhatsApp Webhook (Twilio)
app.post('/api/whatsapp', async (req, res) => {
  // Twilio sends form-urlencoded — reconstruct raw body for handler
  const contentType = req.headers['content-type'] || '';
  let rawBody: string;
  if (contentType.includes('application/x-www-form-urlencoded')) {
    rawBody = new URLSearchParams(req.body as Record<string, string>).toString();
  } else {
    rawBody = JSON.stringify(req.body);
  }
  const event = {
    ...createEvent(req),
    body: rawBody,
  };
  const result = await whatsappHandler(event);
  res.setHeader('Content-Type', (result.headers?.['Content-Type'] as string) || 'text/xml');
  res.status(result.statusCode).send(result.body);
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'BharatBazaar AI', version: '2.0.0' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║     BharatBazaar AI — API Server v3.0            ║
  ║     Running on http://localhost:${PORT}               ║
  ╠══════════════════════════════════════════════════╣
  ║  POST /api/pricing/recommend     (Bedrock AI)    ║
  ║  POST /api/content/generate      (Bedrock AI)    ║
  ║  POST /api/sentiment/analyze     (Bedrock AI)    ║
  ║  POST /api/chat                  (Bedrock AI)    ║
  ║  POST /api/compare               (Bedrock AI)    ║
  ║  POST /api/competitors           (Bedrock AI)    ║
  ║  GET  /api/dashboard                             ║
  ║  GET  /api/sourcing?city=Lucknow                 ║
  ║  POST /api/sourcing/order        (DynamoDB)      ║
  ║  GET  /api/inventory             (DynamoDB)      ║
  ║  POST /api/inventory/update      (DynamoDB)      ║
  ║  POST /api/inventory/delete      (DynamoDB)      ║
  ║  POST /api/inventory/quantity    (DynamoDB)      ║
  ║  GET  /api/weather               (OpenWeather)   ║
  ║  POST /api/vision               (Bedrock Vision) ║
  ║  POST /api/whatsapp             (Twilio)         ║
  ╚══════════════════════════════════════════════════╝
  `);
});
