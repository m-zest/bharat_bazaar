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
    const errorCode = data.error?.code;
    const message = data.error?.message || 'Something went wrong';

    // Provide user-friendly messages for rate limiting
    if (response.status === 429 || errorCode === 'RATE_LIMITED') {
      throw new Error(message);
    }

    throw new Error(message);
  }

  return data.data;
}

export const api = {
  getDashboard: (city?: string) =>
    request<any>(`/dashboard${city ? `?city=${city}` : ''}`),

  getWeather: (city?: string) =>
    request<any>(`/weather${city ? `?city=${city}` : ''}`),

  getSourcing: (city?: string, category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const qs = params.toString();
    return request<any>(`/sourcing${qs ? `?${qs}` : ''}`);
  },

  placeOrder: (body: {
    productName: string;
    wholesalerId: string;
    quantity: number;
    city: string;
  }) =>
    request<any>('/sourcing/order', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

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

  chat: (body: {
    message: string;
    city: string;
    conversationHistory?: { role: string; content: string }[];
  }) =>
    request<any>('/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
