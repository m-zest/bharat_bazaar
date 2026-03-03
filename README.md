<p align="center">
  <h1 align="center">BharatBazaar AI</h1>
  <p align="center"><strong>Market Intelligence for Bharat</strong></p>
  <p align="center">
    AI-powered market intelligence platform for 12M+ Indian small retailers — in their own language.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AWS-Bedrock-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS Bedrock" />
  <img src="https://img.shields.io/badge/Amazon-DynamoDB-4053D6?style=for-the-badge&logo=amazon-dynamodb&logoColor=white" alt="DynamoDB" />
  <img src="https://img.shields.io/badge/AWS-App_Runner-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="App Runner" />
  <img src="https://img.shields.io/badge/Amazon-ECR-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="ECR" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="center">
  <strong>AI for Bharat Hackathon 2026</strong> | Track: Retail, Commerce & Market Intelligence | Team: <strong>ParityAI</strong>
</p>

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [AWS Services Integration](#aws-services-integration)
- [4-Tier AI Fallback Chain](#4-tier-ai-fallback-chain)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [What Makes This Special](#what-makes-this-special)
- [Supported Languages & Regions](#supported-languages--regions)
- [Contributing](#contributing)
- [License](#license)

---

## The Problem

India has **12 million+ kirana stores** powering a **$1.3 trillion retail market** — the fourth largest in the world. Yet the small retailers who form its backbone operate with virtually no data intelligence.

| Challenge | Reality |
|-----------|---------|
| **No market intelligence** | Amazon has data science teams; kirana stores have gut feeling |
| **Pricing guesswork** | Underpricing bleeds revenue; overpricing drives customers away |
| **Language barriers** | 90% of business tools are English-only; 70% of Indian SMBs prefer regional languages |
| **Cost barriers** | Enterprise analytics tools cost Rs.50,000+/month; SMBs earn Rs.20,000--50,000/month |

Small retailers lose an estimated **Rs.50,000+ per year** to suboptimal pricing alone. There is no affordable, language-accessible intelligence layer designed for Bharat's retail ecosystem.

## The Solution

**BharatBazaar AI** gives every kirana store the same market intelligence as Amazon's data team — **in their own language, at a price they can afford**.

The platform provides AI-powered pricing recommendations, multilingual content generation, sentiment analysis of customer reviews (including Hinglish), a conversational business advisor, competitor analysis, inventory management backed by DynamoDB, wholesale product sourcing, and a complete order lifecycle — all built on AWS infrastructure with a 4-tier AI fallback chain that ensures the system never fails.

Think of it as: **"Amazon's data team for every kirana store."**

---

## Screenshots

> The following sections describe key screens of the application. Replace placeholder paths with actual screenshots.

### Dashboard — Command Center
`screenshots/dashboard.png`
The central dashboard aggregates store metrics, revenue charts, weather data, and upcoming festival alerts into a single command center view. Supports light and dark themes.

### Smart Pricing Engine
`screenshots/pricing.png`
Enter a product, cost price, and region to receive three AI-generated pricing strategies (competitive, balanced, premium) with profit impact analysis tailored to regional purchasing power.

### AI Business Advisor (Munim-ji)
`screenshots/chat.png`
A conversational AI assistant that speaks 8 Indian languages, supports voice input/output, and provides business advice ranging from inventory optimization to festival preparation.

### Multilingual Content Generator
`screenshots/content.png`
Generate culturally adapted product descriptions in Hindi, Tamil, Bengali, Gujarati, Marathi, or English — not machine-translated, but genuinely localized.

### Sentiment Analyzer
`screenshots/sentiment.png`
Analyze customer reviews written in Hinglish, Hindi, or English. Understands code-mixed text like "Packaging tuti hui thi, not happy" and extracts actionable insights.

### Inventory Management
`screenshots/inventory.png`
Full CRUD inventory management backed by Amazon DynamoDB with real-time quantity tracking, reorder alerts, and daily sell-rate monitoring.

---

## Architecture

```
                                     BharatBazaar AI — System Architecture

    +-----------------------------------------------------------------------+
    |                              FRONTEND                                  |
    |   React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion         |
    |   21 Pages | Radix UI | Recharts | React Router v6                    |
    |   Light/Dark Theme | Voice I/O | 6 Languages                          |
    +----------------------------------+------------------------------------+
                                       |
                                  REST API Calls
                                       |
    +----------------------------------v------------------------------------+
    |                          AWS APP RUNNER                                |
    |              Multi-stage Docker Container (Node 18 Alpine)             |
    |              Auto-scaling | Health Checks (/api/health)               |
    |              Port 8080 | ECR Private Registry                         |
    +--------+----------------+----------------+------------------+---------+
             |                |                |                  |
             v                v                v                  v
    +----------------+ +-------------+ +---------------+ +---------------+
    |  EXPRESS API   | |  BEDROCK    | |  DYNAMODB     | | CLOUDWATCH    |
    |  LAYER         | |  CLIENT     | |  CLIENT       | | LOGS          |
    |                | |             | |               | |               |
    | 13 Endpoints   | | Claude 3    | | Single-Table  | | Container     |
    | 11 Handlers    | | Haiku       | | Design        | | Monitoring    |
    | Lambda-ready   | | Nova Lite   | | PK/SK Keys    | |               |
    | (@types/       | | Gemini      | | PAY_PER_REQ   | |               |
    |  aws-lambda)   | | Fallback    | | Auto-Create   | |               |
    +----------------+ +------+------+ +-------+-------+ +---------------+
                              |                |
             +----------------+                |
             |                                 |
             v                                 v
    +-------------------+          +------------------------+
    | 4-TIER AI ENGINE  |          | DYNAMODB TABLE         |
    |                   |          | BharatBazaarData       |
    | 1. Bedrock Haiku  |          |                        |
    |    (ap-south-1)   |          | STORE#<id> | INV#<id>  |
    | 2. Nova Lite      |          | STORE#<id> | ORDER#<id>|
    |    (us-east-1)    |          | STORE#<id> | SETTINGS  |
    | 3. Gemini 1.5     |          |                        |
    |    Flash          |          | Inventory, Orders,     |
    | 4. Smart Demo     |          | Store Settings         |
    |    Mode           |          +------------------------+
    +-------------------+
```

---

## AWS Services Integration

All AWS service integrations are implemented in production code with specific SDK versions. No mock services.

| AWS Service | SDK / Integration | Version | Purpose | Code Evidence |
|-------------|-------------------|---------|---------|---------------|
| **Amazon Bedrock** | `@aws-sdk/client-bedrock-runtime` | ^3.500.0 | Foundation model inference via `InvokeModelCommand`. Claude 3 Haiku (primary) and Amazon Nova Lite (fallback). Cross-region failover from `ap-south-1` to `us-east-1`. | `backend/src/utils/bedrock-client.ts` — used in 7 handlers: pricing, content, sentiment, chat, compare, competitors, vision |
| **Amazon DynamoDB** | `@aws-sdk/client-dynamodb` + `@aws-sdk/lib-dynamodb` | ^3.500.0 | Single-table NoSQL design with composite keys (PK/SK). `DynamoDBDocumentClient` for marshalling. Auto-creates table on first run. `PAY_PER_REQUEST` billing mode. | `backend/src/utils/dynamodb-client.ts` — full CRUD: `PutCommand`, `GetCommand`, `QueryCommand`, `DeleteCommand`, `UpdateCommand`, `ScanCommand` |
| **AWS App Runner** | Multi-stage Dockerfile | N/A | Container hosting with auto-scaling, managed TLS, and built-in health checks. Exposes port 8080. | `Dockerfile` — 3-stage build (frontend-build, backend-build, production) with `HEALTHCHECK` directive |
| **Amazon ECR** | Private Registry | N/A | Docker image storage for the containerized backend. Images pushed via CI/CD pipeline. | `Dockerfile` + deployment configuration |
| **AWS IAM** | Fine-grained policies | N/A | Least-privilege access: `bedrock:InvokeModel` for AI inference, `dynamodb:*` for data operations, `ecr:*` for container registry. | IAM policy configuration |
| **Amazon CloudWatch** | App Runner integration | N/A | Container logs, request metrics, and health monitoring via native App Runner integration. | Automatic with App Runner deployment |

### SDK Version Pinning

```json
{
  "@aws-sdk/client-bedrock-runtime": "^3.500.0",
  "@aws-sdk/client-dynamodb": "^3.500.0",
  "@aws-sdk/lib-dynamodb": "^3.500.0"
}
```

All three AWS SDK packages are pinned to the same minor version (`3.500.x`) to ensure compatibility across the modular AWS SDK v3 architecture.

---

## 4-Tier AI Fallback Chain

The system implements a resilient multi-tier AI invocation strategy that guarantees intelligent responses under all conditions. Implemented in `backend/src/utils/bedrock-client.ts`.

```
Request
  |
  v
[Tier 1] Amazon Bedrock — Claude 3 Haiku (ap-south-1)
  |  Retry with exponential backoff on throttle
  |  Skip on AccessDeniedException or daily quota exceeded
  v
[Tier 2] Amazon Bedrock — Amazon Nova Lite (us-east-1, cross-region)
  |  Adapts request format for Nova's inference API
  |  Same retry + skip logic
  v
[Tier 3] Google Gemini 1.5 Flash (external failover)
  |  Activated when GEMINI_API_KEY is configured
  |  Independent API with separate rate limits
  v
[Tier 4] Smart Demo Mode
  |  Pre-computed, realistic cached responses
  |  Region-aware, product-aware demo data
  |  Always available — the system never returns an error
  v
Response (guaranteed)
```

**Key implementation details:**
- Exponential backoff: `2^(attempt+1) * 1000ms` between retries (2s, 4s)
- Maximum 2 retries per model before moving to next tier
- Distinguishes between throttle errors (retryable) and access errors (skip immediately)
- Daily quota detection triggers immediate failover without wasting retry budget
- Nova Lite uses a different request schema (`inferenceConfig` + `messages` format) — automatically adapted
- JSON response cleaning handles markdown code block wrappers from different models

---

## Features

BharatBazaar AI includes 18 fully implemented features across the platform.

| # | Feature | Description | AI-Powered | Backend Handler |
|---|---------|-------------|:----------:|-----------------|
| 1 | **Dashboard** | Command center with revenue charts, weather data, festival alerts, and key metrics | -- | `dashboard.ts` |
| 2 | **Smart Pricing Engine** | 3 AI pricing strategies (competitive, balanced, premium) with region-aware profit analysis | Yes | `pricing.ts` |
| 3 | **Multilingual Content Generator** | Culturally adapted product descriptions in 6 Indian languages | Yes | `descriptions.ts` |
| 4 | **Sentiment Analyzer** | Hinglish/Hindi/English review analysis with actionable insights | Yes | `sentiment.ts` |
| 5 | **AI Chat (Munim-ji)** | Business advisor chatbot in 8 languages with voice input/output | Yes | `chat.ts` |
| 6 | **Product Sourcing** | Wholesale marketplace with suppliers across 10 cities | -- | `sourcing.ts` |
| 7 | **Product Comparison** | Side-by-side AI-powered product analysis | Yes | `compare.ts` |
| 8 | **Competitor Analysis** | Market intelligence on local competitors | Yes | `competitors.ts` |
| 9 | **Inventory Management** | Full CRUD with DynamoDB persistence, reorder alerts | -- | `inventory.ts` |
| 10 | **Barcode Scanner** | Camera-based product scanning and identification | Yes | `vision.ts` |
| 11 | **Shopping Cart** | Wholesale vs MRP price comparison | -- | Frontend |
| 12 | **Checkout** | Address entry, COD/UPI payment, GST invoice generation | -- | Frontend |
| 13 | **Order History** | Past orders with reorder functionality | -- | `orders.ts` |
| 14 | **Delivery Tracking** | 6-step real-time order tracking | -- | Frontend |
| 15 | **GST Invoices** | Auto-generated tax-compliant invoices | -- | Frontend |
| 16 | **Customer Khata** | Digital customer credit ledger | -- | Frontend |
| 17 | **Business Reports** | Analytics dashboard with trend visualization | -- | Frontend |
| 18 | **User Profile & Notifications** | Profile management, store settings, alerts | -- | Frontend |

---

## API Documentation

### Base URL

```
Development:  http://localhost:4000/api
Production:   https://<app-runner-url>/api
```

### Endpoints

| Method | Endpoint | Description | Request Body | Handler |
|--------|----------|-------------|--------------|---------|
| `GET` | `/api/health` | Health check for App Runner | -- | `local-server.ts` |
| `GET` | `/api/dashboard` | Aggregated dashboard data: metrics, charts, festivals, weather | -- | `dashboard.ts` |
| `POST` | `/api/pricing/recommend` | AI pricing strategies for a product | `{ product, costPrice, category, region }` | `pricing.ts` |
| `POST` | `/api/content/generate` | Multilingual product descriptions | `{ product, category, features, language }` | `descriptions.ts` |
| `POST` | `/api/sentiment/analyze` | Sentiment analysis on reviews | `{ reviews[], language }` | `sentiment.ts` |
| `POST` | `/api/chat` | AI business advisor conversation | `{ message, language, history[] }` | `chat.ts` |
| `GET` | `/api/sourcing/products` | Browse wholesale products | Query: `?city=&category=` | `sourcing.ts` |
| `POST` | `/api/sourcing/order` | Place a wholesale order | `{ productId, quantity, storeId }` | `sourcing.ts` |
| `POST` | `/api/compare` | AI product comparison | `{ product1, product2, category }` | `compare.ts` |
| `POST` | `/api/competitors` | Competitor market analysis | `{ product, region, category }` | `competitors.ts` |
| `GET` | `/api/inventory` | List store inventory | Query: `?storeId=` | `inventory.ts` |
| `POST` | `/api/inventory` | Add/update inventory item | `{ storeId, item }` | `inventory.ts` |
| `DELETE` | `/api/inventory` | Remove inventory item | `{ storeId, itemId }` | `inventory.ts` |
| `GET` | `/api/orders` | Order history | Query: `?storeId=` | `orders.ts` |
| `POST` | `/api/vision/analyze` | Image/barcode product analysis | `{ image (base64), type }` | `vision.ts` |

### Example Request

```bash
# Get AI pricing recommendations for a product in Mumbai
curl -X POST http://localhost:4000/api/pricing/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Tata Salt 1kg",
    "costPrice": 18,
    "category": "grocery",
    "region": "mumbai"
  }'
```

### Example Response

```json
{
  "success": true,
  "strategies": [
    {
      "name": "Competitive",
      "price": 22,
      "margin": "22%",
      "rationale": "Matches local kirana pricing in Mumbai's high-density areas"
    },
    {
      "name": "Balanced",
      "price": 25,
      "margin": "39%",
      "rationale": "Optimal price-volume balance for Mumbai's purchasing power index"
    },
    {
      "name": "Premium",
      "price": 28,
      "margin": "56%",
      "rationale": "Justified for convenience stores in premium Mumbai neighborhoods"
    }
  ],
  "regionData": {
    "city": "Mumbai",
    "purchasingPowerIndex": 92
  }
}
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | Component framework |
| TypeScript | 5.3.3 | Type safety |
| Vite | 5.1.0 | Build tool and dev server |
| Tailwind CSS | 3.4.1 | Utility-first styling |
| Framer Motion | 11.0.0 | Animations and transitions |
| Recharts | 2.12.0 | Data visualization / charts |
| React Router | 6.22.0 | Client-side routing |
| Radix UI | Latest | Accessible UI primitives (Dialog, Tabs, Tooltip, Label, Slot) |
| Lucide React | 0.312.0 | Icon system |
| Heroicons | 2.2.0 | Additional iconography |
| jsPDF | 4.2.0 | Client-side PDF / invoice generation |
| React Hot Toast | 2.6.0 | Notification system |
| class-variance-authority | 0.7.1 | Variant-based component styling |
| tailwind-merge | 3.5.0 | Tailwind class conflict resolution |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18 (Alpine) | Runtime |
| Express | 4.18.2 | HTTP framework |
| TypeScript | 5.3.3 | Type safety |
| `@aws-sdk/client-bedrock-runtime` | 3.500.0 | Amazon Bedrock AI inference |
| `@aws-sdk/client-dynamodb` | 3.500.0 | DynamoDB low-level client |
| `@aws-sdk/lib-dynamodb` | 3.500.0 | DynamoDB DocumentClient |
| `@types/aws-lambda` | 8.10.131 | Lambda type definitions (Lambda-ready handlers) |
| uuid | 9.0.0 | Unique ID generation |
| Jest | 29.7.0 | Testing framework |
| ts-jest | 29.1.1 | TypeScript test runner |

### Infrastructure

| Technology | Purpose |
|-----------|---------|
| Docker | Multi-stage build (3 stages: frontend-build, backend-build, production) |
| AWS App Runner | Container hosting with auto-scaling and TLS |
| Amazon ECR | Private Docker image registry |
| Amazon CloudWatch | Logging and monitoring |

---

## Project Structure

```
bharat_bazaar/
├── backend/
│   ├── package.json                    # Dependencies: AWS SDK v3, Express, uuid
│   ├── tsconfig.json                   # TypeScript configuration
│   └── src/
│       ├── local-server.ts             # Express dev server (port 4000)
│       ├── handlers/                   # API route handlers (Lambda-ready)
│       │   ├── pricing.ts              # Smart Pricing Engine — 3 strategies, region-aware
│       │   ├── descriptions.ts         # Multilingual Content Generator — 6 languages
│       │   ├── sentiment.ts            # Sentiment Analyzer — Hinglish support
│       │   ├── chat.ts                 # AI Business Advisor (Munim-ji) — voice I/O
│       │   ├── compare.ts              # Product Comparison — side-by-side analysis
│       │   ├── competitors.ts          # Competitor Analysis — market intelligence
│       │   ├── inventory.ts            # Inventory CRUD — DynamoDB-backed
│       │   ├── orders.ts               # Order Management — lifecycle tracking
│       │   ├── sourcing.ts             # Wholesale Sourcing — 10-city marketplace
│       │   ├── vision.ts               # Barcode/Image Analysis — camera input
│       │   └── dashboard.ts            # Dashboard Aggregator — metrics + charts
│       ├── prompts/                    # Bedrock prompt engineering templates
│       │   ├── pricing-prompt.ts       # Region-aware pricing prompts
│       │   ├── description-prompt.ts   # Multilingual description prompts
│       │   └── sentiment-prompt.ts     # Hinglish sentiment prompts
│       ├── data/                       # Regional intelligence data
│       │   ├── regional-data.ts        # 10 cities: festivals, purchasing power, demographics
│       │   └── sample-data.ts          # Demo products, Hinglish reviews, cached responses
│       └── utils/
│           ├── bedrock-client.ts       # AWS Bedrock SDK — 4-tier fallback chain
│           ├── dynamodb-client.ts      # DynamoDB DocumentClient — single-table design
│           └── gemini-client.ts        # Gemini 1.5 Flash — external fallback
├── frontend/
│   ├── package.json                    # Dependencies: React 18, Tailwind, Framer Motion
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── vite.config.ts                  # Vite build configuration
│   ├── tailwind.config.js              # Tailwind theme customization
│   ├── postcss.config.js              # PostCSS pipeline
│   └── src/
│       ├── App.tsx                     # Root component with routing
│       ├── main.tsx                    # Entry point
│       ├── pages/                      # 21 page components
│       │   ├── Landing.tsx             # Hero landing page
│       │   ├── Dashboard.tsx           # Command center
│       │   ├── PricingPage.tsx         # Smart Pricing Engine
│       │   ├── ContentPage.tsx         # Content Generator
│       │   ├── SentimentPage.tsx       # Sentiment Analyzer
│       │   ├── ChatPage.tsx            # AI Business Advisor
│       │   ├── SourcingPage.tsx        # Wholesale Marketplace
│       │   ├── ComparisonPage.tsx      # Product Comparison
│       │   ├── CompetitorPage.tsx      # Competitor Analysis
│       │   ├── InventoryPage.tsx       # Inventory Management
│       │   ├── BarcodeScannerPage.tsx  # Barcode Scanner
│       │   ├── CartPage.tsx            # Shopping Cart
│       │   ├── CheckoutPage.tsx        # Checkout Flow
│       │   ├── OrderHistoryPage.tsx    # Order History
│       │   ├── DeliveryTrackingPage.tsx# Delivery Tracking
│       │   ├── InvoicePage.tsx         # GST Invoices
│       │   ├── KhataPage.tsx           # Customer Ledger
│       │   ├── ReportsPage.tsx         # Business Reports
│       │   ├── ProfilePage.tsx         # User Profile
│       │   └── NotificationsPage.tsx   # Notifications
│       ├── components/                 # Shared UI components
│       │   └── ui/                     # Radix UI primitives
│       ├── utils/                      # Auth, Cart, Language, Theme contexts
│       └── styles/                     # Global styles + theme system
├── Dockerfile                          # Multi-stage production build (3 stages)
├── design.md                           # Technical design document
├── requirements.md                     # Product requirements
└── README.md                           # This file
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **AWS Account** with Bedrock model access enabled (Claude 3 Haiku)
- **AWS CLI** configured with credentials (`aws configure`)
- **Docker** (optional, for containerized deployment)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd bharat_bazaar
```

### 2. Start the Backend

```bash
cd backend
cp .env.example .env          # Configure your AWS credentials (see Environment Variables)
npm install
npm run dev                    # Starts Express server on http://localhost:4000
```

### 3. Start the Frontend

```bash
# In a new terminal
cd frontend
npm install
npm run dev                    # Starts Vite dev server on http://localhost:3000
```

### 4. Open the Application

Navigate to `http://localhost:3000` in your browser. The landing page loads instantly with pre-loaded kirana store data — no login wall.

### Running Tests

```bash
cd backend
npm test                       # Runs Jest with coverage
```

### Building for Production

```bash
# Backend
cd backend && npm run build    # Compiles TypeScript to dist/

# Frontend
cd frontend && npm run build   # Produces optimized bundle in dist/

# Docker (full stack)
docker build -t bharat-bazaar .
docker run -p 8080:8080 --env-file backend/.env bharat-bazaar
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
# AWS Configuration (Required)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Amazon Bedrock (Required)
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# Amazon DynamoDB (Required)
DYNAMODB_TABLE_NAME=BharatBazaarData

# Google Gemini — Optional external fallback (Tier 3)
GEMINI_API_KEY=your-gemini-key
```

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `AWS_REGION` | Yes | `ap-south-1` | Primary AWS region (Mumbai) |
| `AWS_ACCESS_KEY_ID` | Yes | -- | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | -- | IAM user secret key |
| `BEDROCK_MODEL_ID` | Yes | `anthropic.claude-3-haiku-20240307-v1:0` | Primary Bedrock model ID |
| `DYNAMODB_TABLE_NAME` | Yes | `BharatBazaarData` | DynamoDB table name (auto-created if missing) |
| `GEMINI_API_KEY` | No | -- | Enables Tier 3 fallback via Gemini 1.5 Flash |

**Note:** If no AWS credentials are provided, the system gracefully degrades to Tier 4 (smart demo mode) and remains fully functional with realistic cached data.

---

## Deployment

### Docker Deployment (App Runner)

The application uses a **3-stage multi-stage Docker build** optimized for production:

```
Stage 1: frontend-build    — Compiles React + TypeScript + Vite
Stage 2: backend-build     — Compiles Express + TypeScript
Stage 3: production        — Node 18 Alpine with only production dependencies
```

```bash
# Build the container
docker build -t bharat-bazaar .

# Run locally
docker run -p 8080:8080 \
  -e AWS_REGION=ap-south-1 \
  -e AWS_ACCESS_KEY_ID=<key> \
  -e AWS_SECRET_ACCESS_KEY=<secret> \
  -e BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0 \
  -e DYNAMODB_TABLE_NAME=BharatBazaarData \
  bharat-bazaar
```

### Production Infrastructure

```
ECR (Image Registry) --> App Runner (Container Hosting)
                              |
                    +---------+---------+
                    |         |         |
                 Bedrock   DynamoDB  CloudWatch
```

1. **Push to ECR**: `docker tag` and `docker push` to your private ECR repository
2. **App Runner**: Create service pointing to the ECR image. Configure health check path as `/api/health`, port `8080`
3. **IAM Role**: Attach a role with `bedrock:InvokeModel`, `dynamodb:*`, and `ecr:GetAuthorizationToken` permissions
4. **DynamoDB**: Table auto-creates on first request. No manual setup required.

### Health Check

```
GET /api/health
Response: { "status": "healthy", "timestamp": "..." }
```

App Runner performs health checks every 30 seconds with a 5-second timeout and 3 retries (configured via `HEALTHCHECK` in Dockerfile).

---

## What Makes This Special

### 1. India-First Design
Not a generic SaaS with Indian colors. Deep regional intelligence across 10 cities with purchasing power indices, festival calendars, local market preferences, and demographic data. Mumbai (purchasing power index 92/100) gets fundamentally different pricing recommendations than Lucknow (58/100).

### 2. Hinglish Intelligence
The sentiment analyzer understands code-mixed reviews that are the norm in Indian e-commerce:
> "Packaging tuti hui thi, not happy. But product accha hai, delivery slow thi."

This is parsed correctly as mixed negative (packaging, delivery) and positive (product quality) sentiment — something English-only NLP models fail at.

### 3. 4-Tier AI Fallback — Never Fails
The system always returns intelligent responses. If Bedrock is throttled, it tries Nova Lite. If that fails, Gemini takes over. If all AI services are down, smart demo mode serves pre-computed, region-aware, product-aware responses. Zero downtime, zero error screens.

### 4. Voice I/O
The AI Business Advisor (Munim-ji) supports voice input and output. Speak in Hindi, get responses read back. Designed for retailers who are more comfortable speaking than typing.

### 5. Region-Aware Pricing
Pricing recommendations account for city-level purchasing power, local competition density, festival timing, and seasonal demand. The same product gets meaningfully different strategies for different cities.

### 6. DynamoDB Single-Table Design
Efficient NoSQL architecture using composite keys (`PK: STORE#<id>`, `SK: INV#<id> | ORDER#<id> | SETTINGS`). A single table serves inventory, orders, and store settings with `PAY_PER_REQUEST` billing — costs pennies at small scale, scales seamlessly to thousands of stores.

### 7. Production-Ready Container
Multi-stage Docker build produces a minimal Node 18 Alpine image with health checks, proper signal handling, and production dependency optimization. Ready for App Runner deployment with zero configuration.

### 8. Lambda-Ready Handlers
All backend handlers are typed with `@types/aws-lambda` and structured for seamless migration to AWS Lambda + API Gateway if serverless deployment is preferred.

---

## Supported Languages & Regions

### Languages

| Language | Script | Code |
|----------|--------|------|
| Hindi | हिंदी | `hi` |
| Tamil | தமிழ் | `ta` |
| Bengali | বাংলা | `bn` |
| Gujarati | ગુજરાતી | `gu` |
| Marathi | मराठी | `mr` |
| English | English | `en` |

The AI Chat (Munim-ji) additionally supports Kannada, Telugu, and Malayalam for conversational interactions.

### Supported Regions

| City | State | Purchasing Power |
|------|-------|:----------------:|
| Mumbai | Maharashtra | High |
| Delhi | Delhi NCR | High |
| Bangalore | Karnataka | High |
| Chennai | Tamil Nadu | Medium-High |
| Kolkata | West Bengal | Medium |
| Ahmedabad | Gujarat | Medium-High |
| Pune | Maharashtra | Medium-High |
| Jaipur | Rajasthan | Medium |
| Lucknow | Uttar Pradesh | Medium |
| Indore | Madhya Pradesh | Medium |

Each city has curated data for festivals, seasonal demand patterns, local product preferences, and wholesale supplier networks.

---

## Contributing

We welcome contributions to BharatBazaar AI. Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes with descriptive messages
4. **Test** thoroughly: `cd backend && npm test`
5. **Push** to your fork: `git push origin feature/your-feature`
6. **Open** a Pull Request with a clear description

### Code Standards

- TypeScript strict mode across both frontend and backend
- ESLint for code quality (`npm run lint`)
- Jest for backend unit tests with coverage reporting
- Tailwind CSS utility classes — avoid custom CSS where possible
- All new API endpoints must include demo fallback data

---

## License

Built for the **AI for Bharat Hackathon 2026** by **Team ParityAI**.

All rights reserved. This project was developed as a hackathon submission for the Retail, Commerce & Market Intelligence track.

---

<p align="center">
  <strong>BharatBazaar AI</strong> — Market Intelligence for Bharat
  <br />
  Empowering 12 million small retailers with AI, in their own language.
</p>
