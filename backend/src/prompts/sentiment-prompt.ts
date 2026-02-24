export function buildSentimentPrompt(params: {
  productName: string;
  reviews: { reviewId: string; text: string; language?: string; rating?: number; date: string }[];
}): string {
  return `You are an expert sentiment analyst specializing in Indian consumer reviews. You understand Hindi, English, Hinglish (mixed Hindi-English), and can detect nuanced sentiment in code-mixed Indian language reviews.

PRODUCT: ${params.productName}

REVIEWS TO ANALYZE:
${params.reviews.map((r, i) => `[Review ${i + 1}] ${r.rating ? `(${r.rating}★)` : ''} "${r.text}" — ${r.date}`).join('\n')}

CRITICAL: Many reviews use Hinglish (code-mixed Hindi-English). Examples:
- "Product accha hai but delivery slow thi" = Mixed sentiment (positive product, negative delivery)
- "Paisa vasool" = Very positive (worth the money)
- "Bakwas hai" = Very negative (terrible)
- "Theek thaak" = Neutral (just okay)

Analyze ALL reviews deeply. Look for:
1. Mixed-language sentiment cues
2. Indian expressions and their emotional weight
3. Specific product attributes mentioned
4. Actionable patterns (if 3+ reviews mention the same issue, it's a pattern)

Respond in this exact JSON format:
{
  "overallSentiment": {
    "score": <-100 to +100>,
    "label": "<positive|neutral|negative>",
    "distribution": {
      "positive": <percentage>,
      "neutral": <percentage>,
      "negative": <percentage>
    }
  },
  "keyThemes": [
    {
      "theme": "<theme name>",
      "frequency": <number of reviews mentioning this>,
      "sentiment": <-100 to +100>,
      "exampleReviews": ["<1-2 exact quotes from reviews>"]
    }
  ],
  "productAttributes": [
    {
      "attribute": "<e.g., quality, price, delivery, packaging, taste/aroma>",
      "sentiment": <-100 to +100>,
      "mentionCount": <number>,
      "keyPhrases": ["<exact phrases used by reviewers>"]
    }
  ],
  "actionableInsights": [
    {
      "category": "<improvement|strength|concern>",
      "priority": "<high|medium|low>",
      "description": "<clear, actionable insight>",
      "affectedReviewCount": <number>,
      "suggestedAction": "<specific action the seller should take>"
    }
  ],
  "languageBreakdown": [
    {
      "language": "<detected language>",
      "reviewCount": <number>,
      "avgSentiment": <-100 to +100>
    }
  ],
  "hinglishInsights": "<a note about what the Hinglish/code-mixed reviews reveal that pure English analysis would miss>"
}`;
}
