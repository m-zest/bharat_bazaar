<p align="center">
  <h1 align="center">BharatBazaar AI</h1>
  <p align="center"><strong>Market Intelligence for Bharat's 15M Kirana Stores</strong></p>
  <p align="center">
    AI-powered market intelligence platform for Indian small retailers — in their own language, accessible via WhatsApp.
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

- [Demo Guide for Judges](#-demo-guide-for-judges)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Complete Data Flow](#-complete-data-flow--how-the-app-knows-everything)
- [Key Highlights](#key-highlights)
- [Architecture](#architecture)
- [AWS Services Integration](#aws-services-integration)
- [4-Tier AI Fallback Chain](#4-tier-ai-fallback-chain)
- [Features](#features)
- [WhatsApp-First Strategy](#whatsapp-first-strategy)
- [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [What Makes This Special](#what-makes-this-special)
- [Supported Languages & Regions](#supported-languages--regions)
- [License](#license)

---

## 🎯 Demo Guide for Judges

> **Quick start:** The app works fully in demo mode — no AWS credentials needed. All AI features fall back to smart, realistic cached responses. Pre-loaded with demo sales, inventory, and customer data.

### Demo Login

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin` | Store Owner (Rajesh Sharma, Lucknow) |
| `manager` | `manager` | Store Manager (Priya Gupta, Lucknow) |

### Quick Registration

Visit `/register` → click **"Quick Demo Fill"** → auto-populates with one of three profiles (Retailer/Supplier/Customer). Auto-login after registration.

### 🔥 Recommended Demo Flow (5 minutes)

Follow this path to see the **complete data pipeline** in action:

#### Step 1: Onboarding → Store Catalog
1. Clear localStorage (`localStorage.clear()` in console) → refresh
2. Login → complete onboarding: select "Groceries" → pick products (Basmati Rice, Toor Dal, etc.)
3. **Result:** Dashboard shows "My Store Catalog" with your selected products

#### Step 2: Dashboard → See Everything
- **Sales Overview:** Today's Revenue (₹12,850), Items Sold (121), Weekly Revenue, Top Sellers
- **Live Data Flow:** Real-time activity feed showing bills scanned, invoices generated, WhatsApp orders
- **Guided Demo:** "Try the Data Flow" panel with 4-step walkthrough
- **AI Insights, Weather, Festivals, Charts** — all city-aware

#### Step 3: Bill Scanner → Inventory
1. Go to `/scanner` → upload any image
2. AI extracts items → click "Add All to Inventory"
3. See **"Data Flow Complete!"** banner: Bill Scanned → Inventory Updated → Prices Set → Analytics Fed
4. Go to `/inventory` → see new items with **"Bill Scan"** source badge

#### Step 4: Invoice → Sales Tracking
1. Go to `/invoices` → click "Download PDF"
2. See **"Sale Recorded!"** banner showing data pipeline
3. Go back to Dashboard → revenue updated, sale appears in Live Data Flow
4. Go to Inventory → **"Sold Today"** column shows updated numbers

#### Step 5: Explore AI Features
- **Smart Pricing** (`/pricing`) — Enter any product + cost → get 3 AI pricing strategies
- **Munim-ji AI** (`/chat`) — Business advisor in 8 languages with voice I/O
- **Content Studio** (`/content`) — Generate listings for Instagram, Amazon, Flipkart, WhatsApp, JioMart
- **Sentiment Analyzer** (`/sentiment`) — Paste Hinglish reviews → get actionable insights
- **Competitor Analysis** (`/competitors`) — Market intelligence on local rivals

### All 23 Features

| # | Feature | Route | Highlights |
|---|---------|-------|-----------|
| 1 | Dashboard | `/dashboard` | Sales stats, live data flow, AI insights, weather, festivals, guided demo |
| 2 | Smart Pricing | `/pricing` | 3 AI strategies (competitive/balanced/premium), region-aware |
| 3 | Munim-ji AI Chat | `/chat` | 8 languages, voice I/O, business advisor |
| 4 | Content Studio | `/content` | 6 platforms (Instagram, Amazon, Flipkart, WhatsApp, JioMart, Website) |
| 5 | Sentiment Analyzer | `/sentiment` | Hinglish support, code-mixed review analysis |
| 6 | Wholesale Sourcing | `/sourcing` | 10-city marketplace, verified suppliers |
| 7 | Inventory Tracker | `/inventory` | DynamoDB-backed, source badges, sold today/week columns |
| 8 | Bill Scanner | `/scanner` | AI Vision OCR, auto-populates inventory |
| 9 | GST Invoices | `/invoices` | PDF generation, WhatsApp/Email share, sale recording |
| 10 | Product Comparison | `/compare` | Side-by-side AI analysis |
| 11 | Competitor Analysis | `/competitors` | Local market intelligence |
| 12 | Khata Book | `/khata` | Digital credit ledger |
| 13 | Shopping Cart | `/cart` | Wholesale vs MRP pricing |
| 14 | Checkout | `/checkout` | COD/UPI, address entry |
| 15 | Order History | `/orders` | Past orders with reorder |
| 16 | Delivery Tracking | `/tracking` | 6-step real-time tracking |
| 17 | Business Reports | `/reports` | Trend analytics |
| 18 | Profile & Settings | `/profile` | Store settings, languages |
| 19 | Notifications | `/notifications` | Smart alerts |
| 20 | Registration | `/register` | Role-based (Retailer/Supplier/Customer) |
| 21 | Sales Tracking | Dashboard | Real-time revenue, items sold, top sellers |
| 22 | Store Catalog | Dashboard | Onboarding-driven product personalization |
| 23 | WhatsApp Integration | Landing | Twilio sandbox for store messaging |

### Tech Highlights for Code Review

| What to look at | File | Why it's interesting |
|-----------------|------|---------------------|
| 4-tier AI fallback | `backend/src/utils/bedrock-client.ts` | Bedrock → Nova Lite → Gemini → Smart Demo |
| DynamoDB single-table | `backend/src/utils/dynamodb-client.ts` | Composite PK/SK keys, auto-creates table |
| Sales tracking | `frontend/src/utils/SalesContext.tsx` | Records every invoice, computes top sellers |
| Product catalog | `frontend/src/utils/productCatalog.ts` | 30+ products, onboarding → inventory seeding |
| Data flow pipeline | `frontend/src/pages/Dashboard.tsx` | Live activity feed, sales overview |
| Bill scanner → inventory | `frontend/src/pages/ScannerPage.tsx` | AI Vision → auto-add with source tagging |
| 11 backend handlers | `backend/src/handlers/` | All Lambda-ready with `@types/aws-lambda` |

---

## The Problem

India has **12 million+ kirana stores** powering a **$1.3 trillion retail market** — the fourth largest in the world. Yet the small retailers who form its backbone operate with virtually no data intelligence.

| Challenge | Reality |
|-----------|---------|
| **No market intelligence** | Amazon has data science teams; kirana stores have gut feeling |
| **Pricing guesswork** | Underpricing bleeds revenue; overpricing drives customers away |
| **No inventory visibility** | "What's in stock? What's selling? What to reorder?" — all manual |
| **No sales tracking** | Revenue, top sellers, demand trends — zero data capture |
| **Language barriers** | 90% of business tools are English-only; 70% of Indian SMBs prefer regional languages |
| **Cost barriers** | Enterprise analytics tools cost ₹50,000+/month; SMBs earn ₹20,000–50,000/month |

Small retailers lose an estimated **₹50,000+ per year** to suboptimal pricing alone.

## The Solution

**BharatBazaar AI** gives every kirana store the same market intelligence as Amazon's data team — **in their own language, at zero extra effort, accessible via WhatsApp**.

The platform answers three fundamental questions every store owner needs answered:

| Question | How BharatBazaar Answers It |
|----------|----------------------------|
| **"What's in my store?"** | Onboarding seeds catalog → Bill Scanner adds stock → Inventory tracks everything |
| **"What's selling?"** | Every invoice records the sale → Dashboard shows revenue, top sellers, trends |
| **"What should I stock & price?"** | AI analyzes demand + competitors → Smart Pricing recommends optimal strategies |

> **Key insight:** The store owner's daily actions (scanning bills, generating invoices, chatting on WhatsApp) **ARE** the data input. No spreadsheets. No data entry. Every interaction becomes business intelligence.

---

## 🔄 Complete Data Flow — How the App Knows Everything

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA COMING IN                          │
├─────────────────┬───────────────────┬───────────────────────────┤
│  📋 Onboarding  │  📸 Bill Scanner  │  📦 Wholesale Orders     │
│  "What do you   │  Photo → AI       │  Sourcing page →         │
│   sell?"        │  extracts items,  │  incoming stock           │
│  Seeds catalog  │  prices, qty →    │  auto-tracked            │
│  with real      │  inventory        │                          │
│  products       │  auto-populated   │                          │
├─────────────────┴───────────────────┴───────────────────────────┤
│                      INVENTORY (DynamoDB)                       │
│  Every item has: name, cost, selling price, quantity,           │
│  daily sell rate, reorder level, SOURCE BADGE                   │
│  (Bill Scan | Wholesale | WhatsApp | Manual)                    │
├─────────────────────────────────────────────────────────────────┤
│                         DATA GOING OUT                          │
├─────────────────┬───────────────────┬───────────────────────────┤
│  🧾 Invoices    │  📱 WhatsApp      │  📊 Dashboard             │
│  Every PDF =    │  "Bill for        │  Today's Revenue          │
│  sale recorded  │   Ramesh - 5kg    │  Items Sold Today         │
│  Revenue, items │   rice" → order   │  Top Selling Items        │
│  tracked live   │  processed        │  Sold Today/Week per item │
├─────────────────┴───────────────────┴───────────────────────────┤
│                      AI INTELLIGENCE LAYER                      │
│  Bedrock AI analyzes all data → pricing strategies,             │
│  demand forecasts, competitor analysis, reorder alerts           │
└─────────────────────────────────────────────────────────────────┘
```

### How Each Data Source Works

| Data Source | Trigger | What's Captured | Where It Goes |
|-------------|---------|-----------------|---------------|
| **Onboarding** | First login | Product catalog, category, city | Inventory seeded, dashboard personalized |
| **Bill Scanner** | Photo upload | Items, quantities, cost prices | Inventory (source: `bill_scan`) |
| **Invoice Generation** | PDF download | Sale amount, items sold, customer | SalesContext → Dashboard analytics |
| **Wholesale Orders** | Sourcing page | Incoming stock, supplier info | Inventory (source: `wholesale`) |
| **WhatsApp** | Chat message | Orders, price checks, queries | Structured data → AI processing |
| **Manual Entry** | Inventory form | Any product details | Inventory (source: `manual`) |

---

## Key Highlights

| Screen | Description |
|--------|-------------|
| **Landing Page** | Animated hero with particle effects, 4-card data flow section, WhatsApp demo, AWS architecture, marketplace ecosystem |
| **Dashboard** | Sales overview (revenue/items/top sellers), live data flow feed, store catalog, guided demo, AI insights, weather, festivals, 12-feature grid |
| **Smart Pricing** | Enter product + cost → 3 AI strategies (competitive/balanced/premium) with region-aware profit analysis |
| **Munim-ji AI Chat** | Business advisor in 8 languages, voice I/O, contextual business advice |
| **Content Studio** | Generate product listings for 6 platforms: Instagram, Amazon, Flipkart, WhatsApp Catalog, JioMart, Website/SEO |
| **Sentiment Analyzer** | Hinglish/Hindi/English review analysis — understands code-mixed text |
| **Inventory Tracker** | DynamoDB-backed CRUD, source badges (Bill Scan/Wholesale/WhatsApp/Manual), sold today/week columns, reorder alerts |
| **Bill Scanner** | AI Vision OCR → extract items → add to inventory with source tracking + data flow success banner |
| **GST Invoices** | PDF generation with jsPDF, WhatsApp/Email share, sale recording with data pipeline banner |
| **Wholesale Sourcing** | 10-city marketplace with supplier modals, verified filter, WhatsApp/Call actions |

---

## Architecture

```
                                     BharatBazaar AI — System Architecture

    +-----------------------------------------------------------------------+
    |                              FRONTEND                                  |
    |   React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion         |
    |   23 Pages | SalesContext | CartContext | ProductCatalog               |
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

All AWS service integrations are implemented in production code with specific SDK versions.

| AWS Service | SDK / Integration | Purpose | Code |
|-------------|-------------------|---------|------|
| **Amazon Bedrock** | `@aws-sdk/client-bedrock-runtime` ^3.500.0 | Claude 3 Haiku + Nova Lite inference. Cross-region failover (ap-south-1 → us-east-1). | `bedrock-client.ts` |
| **Amazon DynamoDB** | `@aws-sdk/client-dynamodb` + `@aws-sdk/lib-dynamodb` ^3.500.0 | Single-table NoSQL with composite keys. Auto-creates table. PAY_PER_REQUEST billing. | `dynamodb-client.ts` |
| **AWS App Runner** | Multi-stage Dockerfile | Container hosting with auto-scaling, managed TLS, health checks on port 8080. | `Dockerfile` |
| **Amazon ECR** | Private Registry | Docker image storage for containerized backend. | Deployment config |
| **AWS IAM** | Fine-grained policies | `bedrock:InvokeModel`, `dynamodb:*`, `ecr:*` — least-privilege access. | IAM config |
| **Amazon CloudWatch** | App Runner integration | Container logs, request metrics, health monitoring. | Automatic |

---

## 4-Tier AI Fallback Chain

The system implements a resilient multi-tier AI strategy that **guarantees the system never returns an error**. Implemented in `backend/src/utils/bedrock-client.ts`.

```
Request
  |
  v
[Tier 1] Amazon Bedrock — Claude 3 Haiku (ap-south-1)
  |  Exponential backoff on throttle (2s, 4s)
  |  Skip on AccessDeniedException or quota exceeded
  v
[Tier 2] Amazon Bedrock — Amazon Nova Lite (us-east-1, cross-region)
  |  Adapts request format for Nova's inference API
  v
[Tier 3] Google Gemini 1.5 Flash (external failover)
  |  Activated when GEMINI_API_KEY is configured
  v
[Tier 4] Smart Demo Mode — Always available
  |  Pre-computed, realistic, region-aware cached responses
  v
Response (guaranteed)
```

---

## Features

| # | Feature | AI | Backend Handler | Key Innovation |
|---|---------|:--:|-----------------|----------------|
| 1 | **Dashboard** | — | `dashboard.ts` | Sales stats, live data flow, store catalog, guided demo |
| 2 | **Smart Pricing** | ✓ | `pricing.ts` | 3 strategies, region-aware, 10-city purchasing power data |
| 3 | **Content Generator** | ✓ | `descriptions.ts` | 6 Indian languages, 6 platforms, culturally adapted |
| 4 | **Sentiment Analyzer** | ✓ | `sentiment.ts` | Hinglish code-mixed text understanding |
| 5 | **AI Chat (Munim-ji)** | ✓ | `chat.ts` | 8 languages, voice I/O, business advisor |
| 6 | **Wholesale Sourcing** | — | `sourcing.ts` | 10-city marketplace, verified suppliers |
| 7 | **Product Comparison** | ✓ | `compare.ts` | Side-by-side AI analysis |
| 8 | **Competitor Analysis** | ✓ | `competitors.ts` | Local market intelligence |
| 9 | **Inventory Management** | — | `inventory.ts` | DynamoDB CRUD, source badges, sold tracking |
| 10 | **Bill Scanner** | ✓ | `vision.ts` | Camera OCR → inventory with source tagging |
| 11 | **Sales Tracking** | — | Frontend | SalesContext, revenue/top sellers/per-item sold |
| 12 | **Store Catalog** | — | Frontend | Onboarding → personalized product catalog |
| 13 | **GST Invoices** | — | Frontend | PDF + WhatsApp/Email share + sale recording |
| 14 | **Khata Book** | — | Frontend | Digital customer credit ledger |
| 15 | **Shopping Cart** | — | Frontend | Wholesale vs MRP comparison |
| 16 | **Checkout** | — | Frontend | COD/UPI, address, GST invoice |
| 17 | **Order History** | — | `orders.ts` | Past orders with reorder |
| 18 | **Delivery Tracking** | — | Frontend | 6-step real-time tracking |
| 19 | **Business Reports** | — | Frontend | Trend analytics dashboard |
| 20 | **Registration** | — | Frontend | Role-based with supplier verification |
| 21 | **Profile & Notifications** | — | Frontend | Store settings, smart alerts |
| 22 | **WhatsApp Integration** | — | Twilio | WhatsApp-first access layer |
| 23 | **PDF Invoice Sharing** | — | Frontend | jsPDF + WhatsApp/Email share |

---

## WhatsApp-First Strategy

> *"15 million kirana stores won't download an app. But they'll reply to a WhatsApp message."*

| Feature via WhatsApp | Command |
|---------------------|---------|
| Check stock levels | "What's my stock?" |
| Get price suggestion | "Price for Tata Salt 1kg" |
| Place wholesale order | "Order 50 units of Surf Excel" |
| Scan a bill | Send photo of invoice |
| Get daily report | "Today's sales report" |
| Generate invoice | "Bill for Ramesh - 5kg rice" |
| Check credit (Khata) | "Khata balance for Sharma ji" |
| Switch language | "Hindi mein batao" |

---

## API Documentation

### Base URL

```
Development:  http://localhost:4000/api
Production:   https://<app-runner-url>/api
```

### Endpoints

| Method | Endpoint | Description | Handler |
|--------|----------|-------------|---------|
| `GET` | `/api/health` | Health check for App Runner | `local-server.ts` |
| `GET` | `/api/dashboard` | Aggregated dashboard data | `dashboard.ts` |
| `POST` | `/api/pricing/recommend` | AI pricing strategies | `pricing.ts` |
| `POST` | `/api/content/generate` | Multilingual descriptions | `descriptions.ts` |
| `POST` | `/api/sentiment/analyze` | Sentiment analysis | `sentiment.ts` |
| `POST` | `/api/chat` | AI business advisor | `chat.ts` |
| `GET` | `/api/sourcing/products` | Browse wholesale products | `sourcing.ts` |
| `POST` | `/api/sourcing/order` | Place wholesale order | `sourcing.ts` |
| `POST` | `/api/compare` | AI product comparison | `compare.ts` |
| `POST` | `/api/competitors` | Competitor analysis | `competitors.ts` |
| `GET` | `/api/inventory` | List store inventory | `inventory.ts` |
| `POST` | `/api/inventory` | Add/update inventory item | `inventory.ts` |
| `DELETE` | `/api/inventory` | Remove inventory item | `inventory.ts` |
| `GET` | `/api/orders` | Order history | `orders.ts` |
| `POST` | `/api/vision/analyze` | Bill scanning (AI Vision) | `vision.ts` |

### Example Request

```bash
curl -X POST http://localhost:4000/api/pricing/recommend \
  -H "Content-Type: application/json" \
  -d '{"product": "Tata Salt 1kg", "costPrice": 18, "category": "grocery", "region": "mumbai"}'
```

### Example Response

```json
{
  "success": true,
  "strategies": [
    { "name": "Competitive", "price": 22, "margin": "22%", "rationale": "Matches local kirana pricing" },
    { "name": "Balanced", "price": 25, "margin": "39%", "rationale": "Optimal price-volume balance" },
    { "name": "Premium", "price": 28, "margin": "56%", "rationale": "Convenience store premium pricing" }
  ]
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
| Recharts | 2.12.0 | Data visualization |
| React Router | 6.22.0 | Client-side routing |
| Radix UI | Latest | Accessible UI primitives |
| jsPDF | 4.2.0 | Client-side PDF generation |
| Lucide React | 0.312.0 | Icon system |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18 (Alpine) | Runtime |
| Express | 4.18.2 | HTTP framework |
| `@aws-sdk/client-bedrock-runtime` | 3.500.0 | Bedrock AI inference |
| `@aws-sdk/client-dynamodb` | 3.500.0 | DynamoDB client |
| `@aws-sdk/lib-dynamodb` | 3.500.0 | DynamoDB DocumentClient |
| `@types/aws-lambda` | 8.10.131 | Lambda-ready handler types |
| Jest + ts-jest | 29.7.0 | Testing |

---

## Project Structure

```
bharat_bazaar/
├── backend/
│   └── src/
│       ├── local-server.ts              # Express dev server (port 4000)
│       ├── handlers/                    # 11 API handlers (all Lambda-ready)
│       │   ├── pricing.ts               # Smart Pricing — 3 strategies, region-aware
│       │   ├── descriptions.ts          # Content Generator — 6 languages, 6 platforms
│       │   ├── sentiment.ts             # Sentiment Analyzer — Hinglish support
│       │   ├── chat.ts                  # Munim-ji AI — voice I/O, 8 languages
│       │   ├── compare.ts              # Product Comparison
│       │   ├── competitors.ts          # Competitor Analysis
│       │   ├── inventory.ts            # Inventory CRUD (DynamoDB)
│       │   ├── orders.ts              # Order Management
│       │   ├── sourcing.ts            # Wholesale Sourcing (10 cities)
│       │   ├── vision.ts             # Bill Scanner (AI Vision)
│       │   └── dashboard.ts          # Dashboard Aggregator
│       ├── utils/
│       │   ├── bedrock-client.ts      # 4-tier AI fallback chain
│       │   ├── dynamodb-client.ts     # Single-table design
│       │   └── gemini-client.ts       # Tier 3 fallback
│       ├── prompts/                   # Bedrock prompt templates
│       └── data/                      # Regional intelligence + demo data
│
├── frontend/
│   └── src/
│       ├── App.tsx                    # Root: Auth → Cart → Sales → Language → Routes
│       ├── pages/                     # 23 page components
│       │   ├── Landing.tsx            # Hero + data flow + marketplace + AWS architecture
│       │   ├── Dashboard.tsx          # Sales stats, live data flow, guided demo, catalog
│       │   ├── InventoryPage.tsx      # Source badges, sold today/week, onboarding seeding
│       │   ├── ScannerPage.tsx        # AI Vision → inventory with data flow banner
│       │   ├── InvoicePage.tsx        # PDF + sale recording + data pipeline banner
│       │   └── ...                    # 18 more pages
│       ├── utils/
│       │   ├── SalesContext.tsx        # Sales tracking: revenue, top sellers, per-item counts
│       │   ├── productCatalog.ts      # 30+ products, onboarding → inventory mapping
│       │   ├── CartContext.tsx         # Shopping cart state
│       │   ├── AuthContext.tsx         # Authentication
│       │   ├── LanguageContext.tsx     # i18n (6 languages)
│       │   └── ThemeContext.tsx        # Dark/light theme
│       └── components/                # Shared UI components
│
├── Dockerfile                         # Multi-stage production build (3 stages)
└── README.md                          # This file
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **AWS Account** with Bedrock access (optional — works in demo mode without it)
- **Docker** (optional, for containerized deployment)

### 1. Clone & Install

```bash
git clone <repo-url>
cd bharat_bazaar
```

### 2. Start Backend

```bash
cd backend
cp .env.example .env          # Configure AWS credentials (or skip for demo mode)
npm install
npm run dev                    # http://localhost:4000
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev                    # http://localhost:3000
```

### 4. Open the App

Navigate to `http://localhost:3000`. Landing page loads instantly. Login with `admin`/`admin` to see the full dashboard with pre-loaded demo data.

### Running Tests

```bash
cd backend && npm test
```

### Building for Production

```bash
docker build -t bharat-bazaar .
docker run -p 8080:8080 --env-file backend/.env bharat-bazaar
```

---

## Environment Variables

Create `.env` in `backend/`:

```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
DYNAMODB_TABLE_NAME=BharatBazaarData
GEMINI_API_KEY=your-gemini-key                    # Optional: enables Tier 3 fallback
```

> **Note:** If no AWS credentials are provided, the system gracefully degrades to Tier 4 (smart demo mode) and remains fully functional.

---

## Deployment

### Docker (App Runner)

3-stage multi-stage build optimized for production:

```
Stage 1: frontend-build    → React + TypeScript + Vite
Stage 2: backend-build     → Express + TypeScript
Stage 3: production        → Node 18 Alpine (minimal image)
```

```bash
docker build -t bharat-bazaar .
docker run -p 8080:8080 -e AWS_REGION=ap-south-1 -e AWS_ACCESS_KEY_ID=<key> -e AWS_SECRET_ACCESS_KEY=<secret> bharat-bazaar
```

### Health Check

```
GET /api/health → { "status": "healthy", "timestamp": "..." }
```

---

## What Makes This Special

### 1. Complete Data Pipeline
Not just a dashboard — a **closed-loop system** where the store owner's daily actions (scanning bills, generating invoices, chatting on WhatsApp) automatically build the intelligence layer. Zero manual data entry.

### 2. India-First Design
Deep regional intelligence across 10 cities with purchasing power indices, festival calendars, and local market preferences. Mumbai (PPP: 92/100) gets fundamentally different recommendations than Lucknow (58/100).

### 3. Hinglish Intelligence
The sentiment analyzer understands code-mixed reviews:
> "Packaging tuti hui thi, not happy. But product accha hai."

Parsed correctly as mixed negative (packaging) and positive (product) sentiment.

### 4. 4-Tier AI — Never Fails
Bedrock → Nova Lite → Gemini → Smart Demo. The system always returns intelligent responses. Zero downtime, zero error screens.

### 5. Sales Intelligence
Every invoice records the sale. Dashboard shows real-time revenue, items sold, top sellers. Inventory shows "Sold Today" and "Sold/Week" per product. Store owners finally know what's going out.

### 6. Personalized Store Catalog
Onboarding captures what the store sells → inventory seeded with real products at real prices → all AI features personalized to this store's catalog.

### 7. Source Tracking
Every inventory item shows where it came from: **Bill Scan** (violet), **Wholesale Order** (blue), **WhatsApp** (green), **Manual** (gray). Judges can see the multi-channel data flow visually.

### 8. Voice I/O
Munim-ji AI supports voice input/output. Speak in Hindi, get responses read back. For retailers who prefer speaking over typing.

### 9. DynamoDB Single-Table Design
Composite keys (`PK: STORE#<id>`, `SK: INV#<id>`). Single table serves inventory, orders, and settings. `PAY_PER_REQUEST` — costs pennies at small scale.

### 10. Lambda-Ready Handlers
All backend handlers typed with `@types/aws-lambda`. Seamless migration to Lambda + API Gateway if serverless deployment is preferred.

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

Munim-ji AI additionally supports Kannada, Telugu, and Malayalam.

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

Each city has curated data for festivals, seasonal demand, local preferences, and wholesale supplier networks.

---

## License

Built for the **AI4Bharat Hackathon 2026** by **Team ParityAI**.

Track: **Retail, Commerce & Market Intelligence**

---

<p align="center">
  <strong>BharatBazaar AI</strong> — Market Intelligence for Bharat
  <br />
  <em>"Amazon has data science teams. Kirana stores have BharatBazaar AI."</em>
</p>
