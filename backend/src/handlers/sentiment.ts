import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { invokeBedrockClaude, parseJSONResponse } from '../utils/bedrock-client';
import { success, error } from '../utils/response';
import { buildSentimentPrompt } from '../prompts/sentiment-prompt';
import { DEMO_REVIEWS } from '../data/sample-data';

export interface SentimentRequest {
  productName: string;
  reviews?: {
    reviewId: string;
    text: string;
    language?: string;
    rating?: number;
    date: string;
  }[];
  useDemo?: boolean;
}

export interface SentimentResponse {
  overallSentiment: {
    score: number;
    label: string;
    distribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  keyThemes: {
    theme: string;
    frequency: number;
    sentiment: number;
    exampleReviews: string[];
  }[];
  productAttributes: {
    attribute: string;
    sentiment: number;
    mentionCount: number;
    keyPhrases: string[];
  }[];
  actionableInsights: {
    category: string;
    priority: string;
    description: string;
    affectedReviewCount: number;
    suggestedAction: string;
  }[];
  languageBreakdown: {
    language: string;
    reviewCount: number;
    avgSentiment: number;
  }[];
  hinglishInsights: string;
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body: SentimentRequest = JSON.parse(event.body || '{}');

    if (!body.productName) {
      return error(400, 'Missing required field: productName', 'INVALID_REQUEST');
    }

    // Use demo reviews if requested or no reviews provided
    const reviews = (body.useDemo || !body.reviews?.length) ? DEMO_REVIEWS : body.reviews;

    if (!reviews.length) {
      return error(400, 'No reviews to analyze', 'INVALID_REQUEST');
    }

    const prompt = buildSentimentPrompt({
      productName: body.productName,
      reviews,
    });

    const aiResponse = await invokeBedrockClaude(prompt, {
      maxTokens: 4000,
      temperature: 0.2,
      systemPrompt: 'You are BharatBazaar AI Sentiment Analyzer. You are an expert at understanding Indian consumer reviews in Hindi, English, Hinglish (code-mixed), and other Indian languages. You detect nuanced sentiment including sarcasm, regional expressions, and cultural context. Always respond in valid JSON.',
    });

    const result = parseJSONResponse<SentimentResponse>(aiResponse);

    return success({
      ...result,
      productName: body.productName,
      reviewCount: reviews.length,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Sentiment handler error:', err);
    return error(500, err.message || 'Internal server error');
  }
}
