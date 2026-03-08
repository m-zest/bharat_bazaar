<p align="center">
  <h1 align="center">BharatBazaar AI</h1>
  <p align="center"><strong>AI-Powered Market Intelligence for Bharat's 15 Million Kirana Stores</strong></p>
  <p align="center">
    Empowering India's small retailers with enterprise-grade market intelligence — in their own language, at zero extra effort, accessible via WhatsApp.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AWS-Bedrock-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS Bedrock" />
  <img src="https://img.shields.io/badge/Amazon-DynamoDB-4053D6?style=for-the-badge&logo=amazon-dynamodb&logoColor=white" alt="DynamoDB" />
  <img src="https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
</p>

<p align="center">
  <strong>AI for Bharat Hackathon 2026</strong> | Track: Retail, Commerce & Market Intelligence
</p>

<p align="center">
  <strong>Team ParityAI</strong>: <a href="https://github.com/m-zest">Mohammad Zeeshan</a> · <strong>Afzal Hussain</strong>
</p>

---

## Demo Guide for Judges

> **The app works fully out of the box — no AWS credentials required.** All AI features gracefully degrade to intelligent, realistic cached responses when cloud services are unavailable.

### Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin` | Store Owner |
| `manager` | `manager` | Store Manager |

### Quick Registration

Visit `/register` -> click **"Quick Demo Fill"** -> auto-populates with one of three profiles (Retailer / Supplier / Customer). Auto-login after registration.

### Recommended Demo Flow (5 minutes)

**Step 1: Onboarding**
1. Clear localStorage (`localStorage.clear()` in console) -> refresh
2. Login -> complete onboarding: select your category -> pick products
3. Dashboard shows your store name and selected products

**Step 2: Dashboard**
- Sales Overview: Today's Revenue, Items Sold, Weekly Revenue, Top Sellers
- Live Data Flow: Real-time activity feed showing bills scanned, invoices generated
- AI Insights, Weather, Festivals — all city-aware

**Step 3: Bill Scanner -> Inventory**
1. Go to `/scanner` -> upload any image
2. AI extracts items -> click "Add All to Inventory"
3. Go to `/inventory` -> see new items with source badges

**Step 4: Invoice -> Sales Tracking**
1. Go to `/invoices` -> click "Download PDF"
2. Dashboard revenue updates, sale appears in Live Data Flow
3. Inventory "Sold Today" column shows updated numbers

**Step 5: Explore AI Features**
- **Smart Pricing** (`/pricing`) — Enter any product + cost -> get 3 AI pricing strategies
- **Munim-ji AI** (`/chat`) — Business advisor in 8 languages with voice I/O
- **Content Studio** (`/content`) — Generate listings for Instagram, Amazon, Flipkart, WhatsApp, JioMart
- **Sentiment Analyzer** (`/sentiment`) — Paste Hinglish reviews -> get actionable insights
- **Competitor Analysis** (`/competitors`) — Market intelligence on local rivals

---

## The Problem

India has **12 million+ kirana stores** powering a **$1.3 trillion retail market**. Yet small retailers operate with virtually no data intelligence — no market visibility, pricing guesswork, no sales tracking, and language barriers with English-only tools.

Small retailers lose an estimated **Rs.50,000+ per year** to suboptimal pricing alone.

## The Solution

**BharatBazaar AI** gives every kirana store the same market intelligence as Amazon's data team — **in their own language, at zero extra effort, accessible via WhatsApp**.

> **Key insight:** The store owner's daily actions (scanning bills, generating invoices, chatting on WhatsApp) **ARE** the data input. No spreadsheets. No data entry. Every interaction becomes business intelligence.

---

## Complete Data Flow
![Architecture](./DataFlow-Diagram.png)
---

## Architecture
![Architecture](./architecture.png)


---

## AWS Services Integration

| AWS Service | Purpose | Implementation |
|-------------|---------|----------------|
| **Amazon Bedrock** | Claude 3 Haiku + Nova Lite AI inference with cross-region failover | `backend/src/utils/bedrock-client.ts` |
| **Amazon DynamoDB** | Single-table NoSQL with composite keys, auto-creates table | `backend/src/utils/dynamodb-client.ts` |
| **Bedrock Vision** | Claude 3 Haiku multimodal for bill/invoice scanning | `backend/src/handlers/vision.ts` |

---

## Multi-Tier AI Fallback Chain

The system **guarantees the application never returns an error**, regardless of cloud service availability.

```
Request -> [Tier 1] Bedrock Claude 3 Haiku (ap-south-1)
        -> [Tier 2] Bedrock Nova Lite (us-east-1, cross-region)
        -> [Tier 3] Google Gemini 1.5 Flash (if GEMINI_API_KEY set)
        -> [Tier 4] Smart Demo Mode (always available, region-aware cached responses)
        -> Response (guaranteed)
```

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
| Switch language | "Hindi mein batao" |

---

## API Documentation

### Base URL

```
Development:  http://localhost:4000/api
Production:   https://<deployment-url>/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/dashboard` | Aggregated dashboard data |
| `POST` | `/api/pricing/recommend` | AI pricing strategies |
| `POST` | `/api/content/generate` | Multilingual descriptions |
| `POST` | `/api/sentiment/analyze` | Sentiment analysis |
| `POST` | `/api/chat` | AI business advisor |
| `GET` | `/api/sourcing/products` | Browse wholesale products |
| `POST` | `/api/sourcing/order` | Place wholesale order |
| `POST` | `/api/compare` | AI product comparison |
| `POST` | `/api/competitors` | Competitor analysis |
| `GET` | `/api/inventory` | List store inventory |
| `POST` | `/api/inventory` | Add/update inventory item |
| `DELETE` | `/api/inventory` | Remove inventory item |
| `GET` | `/api/orders` | Order history |
| `POST` | `/api/vision/analyze` | Bill scanning (AI Vision) |

---

## Quick Start

### Prerequisites

- **Node.js** 18+
- **AWS Account** with Bedrock access (optional — works in demo mode without it)

### 1. Clone and Install

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

Navigate to `http://localhost:3000`. Login with `admin`/`admin`.

### Running Tests

```bash
cd backend && npm test
```

---

## Environment Variables

Create `.env` in `backend/`:

```env
# AWS Configuration (optional — app works without these)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# AI Models
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
GEMINI_API_KEY=your-gemini-key                    # Optional: enables Tier 3 fallback

# Database
DYNAMODB_TABLE_NAME=BharatBazaarData

# External APIs
OPENWEATHER_API_KEY=your-key                      # Optional: real weather data

# Server
PORT=4000
```

> If no AWS credentials are provided, the system gracefully degrades to smart demo mode.

---

## Supported Languages and Regions

### Languages

Hindi, Tamil, Bengali, Gujarati, Marathi, English. Munim-ji AI additionally supports Kannada, Telugu, and Malayalam.

### Regions

Mumbai, Delhi, Bangalore, Chennai, Kolkata, Ahmedabad, Pune, Jaipur, Lucknow, Indore — each with curated festival calendars, purchasing power data, and local market preferences.

---

## Team

**Team ParityAI** — AI for Bharat Hackathon 2026

| Member | Role |
|--------|------|
| **Mohammad Zeeshan** | AI Researcher |
| **Afzal Hussain** | Team Member |

---

<p align="center">
  <strong>BharatBazaar AI</strong> — Market Intelligence for Bharat
  <br />
  <em>"Amazon has data science teams. Kirana stores have BharatBazaar AI."</em>
  <br /><br />
  <strong>AI for Bharat Hackathon 2026 | Team ParityAI</strong>
</p>
