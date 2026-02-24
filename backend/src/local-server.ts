import express from 'express';
import cors from 'cors';
import { handler as pricingHandler } from './handlers/pricing';
import { handler as descriptionsHandler } from './handlers/descriptions';
import { handler as sentimentHandler } from './handlers/sentiment';
import { handler as dashboardHandler } from './handlers/dashboard';
import { APIGatewayProxyEvent } from 'aws-lambda';

const app = express();
app.use(cors());
app.use(express.json());

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

// API Routes
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

app.get('/api/dashboard', async (req, res) => {
  const result = await dashboardHandler(createEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'BharatBazaar AI', version: '1.0.0' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║     🏪 BharatBazaar AI — API Server         ║
  ║     Running on http://localhost:${PORT}         ║
  ╠══════════════════════════════════════════════╣
  ║  POST /api/pricing/recommend                 ║
  ║  POST /api/content/generate                  ║
  ║  POST /api/sentiment/analyze                 ║
  ║  GET  /api/dashboard                         ║
  ╚══════════════════════════════════════════════╝
  `);
});
