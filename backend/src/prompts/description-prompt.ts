export function buildDescriptionPrompt(params: {
  productName: string;
  category: string;
  features: string[];
  specifications: Record<string, string>;
  targetLanguages: string[];
  tone: string;
  targetAudience?: string;
}): string {
  const languageNames: Record<string, string> = {
    en: 'English',
    hi: 'Hindi (हिंदी)',
    ta: 'Tamil (தமிழ்)',
    bn: 'Bengali (বাংলা)',
    gu: 'Gujarati (ગુજરાતી)',
    mr: 'Marathi (मराठी)',
  };

  return `You are an expert multilingual product copywriter for Indian e-commerce. You don't just translate — you create culturally adapted marketing copy that resonates with each language's audience.

PRODUCT DETAILS:
- Name: ${params.productName}
- Category: ${params.category}
- Key Features: ${params.features.join(', ')}
- Specifications: ${Object.entries(params.specifications).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Target Audience: ${params.targetAudience || 'Indian consumers'}
- Tone: ${params.tone}

TARGET LANGUAGES: ${params.targetLanguages.map(l => languageNames[l] || l).join(', ')}

IMPORTANT INSTRUCTIONS:
1. Do NOT just translate the English description. Create culturally ADAPTED copy for each language.
2. For Hindi: Use everyday Hinglish where appropriate (mixing English brand/tech terms naturally). Use local idioms. Appeal to value and family.
3. For Tamil: Reference South Indian cultural context. Use formal but warm tone. Include region-relevant references.
4. For Bengali: Use poetic, emotional language. Reference cultural pride and quality appreciation.
5. For Gujarati: Emphasize value, quality, and family usage. Reference Gujarati cultural context.
6. For Marathi: Balance modern and traditional appeal. Reference Maharashtra-specific context.
7. Include SEO keywords that real Indian consumers would search for in each language.

Respond in this exact JSON format:
{
  "descriptions": [
    ${params.targetLanguages.map(lang => `{
      "language": "${lang}",
      "languageName": "${languageNames[lang] || lang}",
      "title": "<compelling product title in ${languageNames[lang] || lang}>",
      "description": "<2-3 paragraph marketing description — culturally adapted, not translated>",
      "bulletPoints": ["<5 key selling points in ${languageNames[lang] || lang}>"],
      "culturalNotes": "<what cultural adaptations were made and why>",
      "localSearchTerms": ["<5-8 SEO keywords Indian consumers would search in ${languageNames[lang] || lang}>"]
    }`).join(',\n    ')}
  ],
  "seoKeywords": [
    ${params.targetLanguages.map(lang => `{
      "language": "${lang}",
      "keywords": ["<8-10 high-volume search keywords>"]
    }`).join(',\n    ')}
  ]
}`;
}
