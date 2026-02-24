# BharatBazaar AI — Market Intelligence for Bharat

> **AI for Bharat Hackathon 2026** | Track: Retail, Commerce & Market Intelligence | Team: ParityAI

12 million small retailers in India make pricing and stocking decisions based on gut feeling. They lose ₹50,000+ every year to bad pricing alone. **BharatBazaar AI changes that.**

## The Problem

India has 12M+ kirana stores and a $1.3T retail market. Yet:
- **No market intelligence** — Amazon has data teams; small retailers have gut feeling
- **Pricing guesswork** — Lost revenue from underpricing, lost customers from overpricing
- **Language barriers** — 90% of tools are English-only; 70% of SMBs prefer regional languages
- **Cost barriers** — Enterprise tools cost ₹50,000+/month; SMBs earn ₹20,000-50,000/month

## The Solution

BharatBazaar AI gives every kirana store the same intelligence as Amazon's data team — **in their own language, at ₹999/month**.

### Three Core AI Features

| Feature | What It Does | Why It's Special |
|---------|-------------|-----------------|
| **Smart Pricing Engine** | 3 AI pricing strategies with profit impact | Region-aware (Mumbai vs Lucknow prices), festival-adjusted |
| **Multilingual Content Generator** | Product descriptions in 6 Indian languages | Culturally adapted — not just translated |
| **Sentiment Analyzer** | Insight extraction from customer reviews | Understands Hinglish: "Product accha hai but delivery slow thi" |

## Tech Stack

```
┌─────────────────────────────────────────────┐
│  Frontend: React 18 + TypeScript + Tailwind │
├─────────────────────────────────────────────┤
│  API: Express (dev) / API Gateway (prod)    │
├─────────────────────────────────────────────┤
│  AI: Amazon Bedrock (Claude 3 Sonnet)       │
├─────────────────────────────────────────────┤
│  Data: DynamoDB + S3                        │
├─────────────────────────────────────────────┤
│  Auth: Amazon Cognito                       │
├─────────────────────────────────────────────┤
│  Infra: AWS Lambda + CloudFront (Serverless)│
└─────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 20+
- AWS account with Bedrock access (Claude model enabled)
- AWS CLI configured

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd bharat_bazaar

# Backend
cd backend
cp .env.example .env    # Add your AWS credentials
npm install
npm run dev             # Starts API on http://localhost:4000

# Frontend (new terminal)
cd frontend
npm install
npm run dev             # Starts UI on http://localhost:3000
```

### Environment Variables

```env
# Required for Bedrock AI features
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

## Project Structure

```
bharat_bazaar/
├── backend/
│   └── src/
│       ├── handlers/          # Lambda function handlers
│       │   ├── pricing.ts     # Smart Pricing Engine
│       │   ├── descriptions.ts # Multilingual Content Generator
│       │   ├── sentiment.ts   # Sentiment Analyzer
│       │   └── dashboard.ts   # Dashboard Aggregator
│       ├── prompts/           # Bedrock prompt engineering
│       │   ├── pricing-prompt.ts
│       │   ├── description-prompt.ts
│       │   └── sentiment-prompt.ts
│       ├── data/              # Regional data & demo data
│       │   ├── regional-data.ts  # 10 Indian cities, festivals, purchasing power
│       │   └── sample-data.ts    # Demo products, Hinglish reviews
│       ├── utils/             # Bedrock client, response helpers
│       └── local-server.ts    # Express dev server
├── frontend/
│   └── src/
│       ├── pages/             # All app pages
│       │   ├── Landing.tsx    # Hero landing page
│       │   ├── Dashboard.tsx  # Command Center
│       │   ├── PricingPage.tsx
│       │   ├── ContentPage.tsx
│       │   └── SentimentPage.tsx
│       ├── components/        # Shared components
│       └── utils/             # API client
├── design.md                  # Full technical design document
└── requirements.md            # Product requirements
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Dashboard with charts, festivals, metrics |
| `POST` | `/api/pricing/recommend` | AI pricing strategies |
| `POST` | `/api/content/generate` | Multilingual descriptions |
| `POST` | `/api/sentiment/analyze` | Review sentiment analysis |

## What Makes This Special

1. **India-first design** — Not a generic SaaS with Indian colors. Deep regional awareness (10 cities, festivals, purchasing power indices, cultural preferences).

2. **Hinglish intelligence** — Our sentiment analyzer understands code-mixed reviews like "Packaging tuti hui thi, not happy" — real Indian language, not textbook Hindi.

3. **No login wall** — Judges click the URL and see a working demo instantly with pre-loaded kirana store data.

4. **Region-aware pricing** — Same product gets different price recommendations for Mumbai (₹92/100 purchasing power) vs Lucknow (₹58/100).

5. **Cultural content, not translation** — Hindi descriptions use local idioms; they don't read like Google Translate output.

## Supported Languages

Hindi (हिंदी) | Tamil (தமிழ்) | Bengali (বাংলা) | Gujarati (ગુજરાતી) | Marathi (मराठी) | English

## Supported Regions

Mumbai | Delhi | Bangalore | Chennai | Kolkata | Ahmedabad | Pune | Jaipur | Lucknow | Indore

## License

Built for AI for Bharat Hackathon 2026 by Team ParityAI.
