const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || 'Something went wrong');
  }

  return data.data;
}

export const api = {
  getDashboard: (city?: string) =>
    request<any>(`/dashboard${city ? `?city=${city}` : ''}`),

  analyzePricing: (body: {
    productName: string;
    category: string;
    costPrice: number;
    currentPrice?: number;
    city: string;
  }) =>
    request<any>('/pricing/recommend', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  generateDescription: (body: {
    productName: string;
    category: string;
    features: string[];
    specifications: Record<string, string>;
    targetLanguages: string[];
    tone?: string;
  }) =>
    request<any>('/content/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  analyzeSentiment: (body: {
    productName: string;
    reviews?: any[];
    useDemo?: boolean;
  }) =>
    request<any>('/sentiment/analyze', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
