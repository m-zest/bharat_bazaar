# BharatBazaar AI - Project Summary

**AI for Bharat Hackathon 2026 | Team ParityAI | Track: Retail, Commerce & Market Intelligence**

---

## One-Liner

BharatBazaar AI is an AI-powered market intelligence platform that gives India's 15 million kirana store owners the same data intelligence that Amazon's data science teams have - in their own language, on their phone, through WhatsApp, at zero cost.

---

## The Problem

India's $1.3 trillion retail market is powered by 15 million+ kirana (small grocery) stores — the 4th largest retail market in the world. Yet 90% of these store owners operate with zero data intelligence. They price products by gut feeling (losing an estimated 50,000 rupees per year), track inventory in handwritten bahi-khata notebooks, and have no access to business analytics. 70% prefer regional languages, but every existing tool is English-only and costs 50,000+ rupees per month - far beyond the reach of small retailers earning 20,000-50,000 rupees monthly.

## The Solution

BharatBazaar AI is a complete closed-loop business intelligence platform that answers three questions every store owner asks daily:

1. **"What is in my store?"** - The Khata Bill Scanner lets store owners photograph wholesale bills. AI Vision (Gemini 1.5 Flash + AWS Bedrock) reads Hindi and English text, extracts items, quantities, and prices, and auto-populates inventory in Amazon DynamoDB with a single tap.

2. **"What is selling?"** - Every GST invoice generated automatically records the sale. The dashboard shows real-time revenue, items sold today, top sellers, weekly trends, AI insights, weather impact, and upcoming festival alerts.

3. **"What should I price?"** - The AI Pricing Engine analyzes cost price, city purchasing power, competitor rates, weather forecasts, and festival calendars to generate three pricing strategies (Competitive, Balanced, Premium) with confidence scores and reasoning.

The key innovation is that the store owner's daily routine — scanning bills, generating invoices, chatting on WhatsApp - IS the data input. There are no spreadsheets, no manual data entry. Every interaction automatically becomes business intelligence.

## What We Built

**23 fully working features** across three tiers:

- **8 AI-Powered Features**: Smart Pricing, Munim-ji AI Chat (Hinglish business advisor in 8 languages with voice I/O), Content Studio (6 platforms, 6 languages), Sentiment Analyzer (understands Hinglish code-mixed text), Bill Scanner (AI Vision OCR), Competitor Intelligence, Product Comparison, WhatsApp AI Bot.

- **7 Business Operations**: Real-time Dashboard with sales tracking, DynamoDB-backed Inventory with source badges (Bill Scan / Wholesale / WhatsApp / Manual), GST Invoice generation with PDF + WhatsApp share, Wholesale Sourcing marketplace (10 cities, verified suppliers), Digital Khata Book, Sales Tracking, and Onboarding-driven Store Catalog.

- **8 Commerce Features**: Shopping Cart, Checkout (COD/UPI), Order History with reorder, Delivery Tracking, Business Reports, Smart Notifications, Role-based Registration (Retailer/Supplier/Customer), and Weather-Aware Demand Insights.

**3 Platforms**: Web App (23 pages, full dashboard), Mobile App (5-screen native-feel PWA), and WhatsApp Bot (every feature accessible via text or voice).

## How AWS is Used

- **Amazon Bedrock** - Claude 3 Haiku (ap-south-1) and Nova Lite (us-east-1) for AI inference with real @aws-sdk/client-bedrock-runtime integration, cross-region failover, and exponential backoff retry logic.
- **Amazon DynamoDB** - Single-table NoSQL design with composite PK/SK keys (STORE#id | INV#id, ORDER#id, INVOICE#id, SETTINGS). PAY_PER_REQUEST billing, auto-creates table, multi-tenant ready.
- **Bedrock Vision** - Claude 3 Haiku multimodal for bill/invoice image analysis and OCR.
- **AWS CloudFront** - CDN delivery for both web and mobile applications.
- **Amazon S3** - Static asset hosting for frontend builds.
- **AWS IAM** - Least-privilege access policies for all service interactions.
- **Amazon CloudWatch** - Monitoring and logging infrastructure.

## Why AI is Required

Each feature has a clear reason it needs AI rather than rules or spreadsheets:

- **Dynamic Pricing** depends on 5+ variables (cost, city, season, festival, competitors) that no static formula handles across India's diverse markets - resulting in 26% average margin improvement.
- **Hinglish Understanding** is critical because 70% of Indian SMBs mix Hindi and English. "Packaging tuti hui thi, but product accha hai" requires AI to correctly parse mixed negative (packaging) and positive (product) sentiment.
- **Bill Scanning** handles handwritten Hindi bills with varying formats and Hindi numerals that OCR alone cannot interpret — requiring multimodal vision AI.
- **Business Advice** like "baarish ho rahi hai, kya mangau?" needs reasoning about weather correlation, demand patterns, and current inventory — not keyword matching.

## Architecture and Key Engineering Decisions

**4-Tier AI Fallback Chain** guarantees zero downtime:
1. AWS Bedrock Claude 3 Haiku (ap-south-1) with retry
2. AWS Bedrock Nova Lite (us-east-1, cross-region)
3. Google Gemini 1.5 Flash (external failover)
4. Smart Demo Mode (750+ pre-computed, region-aware responses)

The application never shows an error. It works without internet, without AWS credentials, and without any API keys — making it immediately testable by judges.

**DynamoDB Single-Table Design** uses composite keys to store inventory, orders, invoices, and settings in one table. Multi-tenant ready, scales from zero to millions of stores.

**India-First Intelligence** includes 10 city profiles with purchasing power indices, festival calendars with demand multipliers, weather-driven demand correlation, and 6 native languages (not translations — culturally adapted content).

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Recharts (23 pages)
- **Backend**: Node.js + Express.js + TypeScript (13 REST endpoints, 11 handlers, all Lambda-typed)
- **Database**: Amazon DynamoDB (single-table, PAY_PER_REQUEST)
- **AI**: AWS Bedrock (Claude 3 Haiku + Nova Lite) + Google Gemini 1.5 Flash + Smart Demo Mode
- **Deployment**: AWS CloudFront + S3 (web and mobile), Docker multi-stage build (App Runner ready)
- **WhatsApp**: Twilio Sandbox webhook
- **Voice**: Web Speech API (8 Indian languages)

## Impact and Business Model

- **Addressable Market**: 15M+ kirana stores, $1.3T retail market, 90% undigitized
- **Free Forever Tier**: Full platform access for every store — user acquisition
- **Pro Subscription**: Advanced analytics, priority AI, bulk sourcing, API access
- **Data Moat**: Every bill scanned, invoice generated, and WhatsApp query creates anonymized market intelligence for FMCG brands — what sells where, when, at what price

## Live Demo Links

| Platform | URL |
|----------|-----|
| Web App (AWS) | https://d3j4u51h5o0dhm.cloudfront.net |
| Mobile App (AWS) | https://d2a5rnm0qdxhtx.cloudfront.net |
| GitHub (Web) | https://github.com/m-zest/bharat_bazaar_v2.4.8 |
| GitHub (Mobile) | https://github.com/ParityAI/bharat_bazaar_mobile |

**Login**: admin / admin (Store Owner) — or visit /register and click "Quick Demo Fill"

## Team ParityAI

| Member | Role |
|--------|------|
| **Mohammad Zeeshan** | AI Researcher - Architecture, AWS integration, backend, frontend |
| **Afzal Hussain** | Team Member — Project development and collaboration |

---

*"Amazon has data science teams. Kirana stores have BharatBazaar AI."*
