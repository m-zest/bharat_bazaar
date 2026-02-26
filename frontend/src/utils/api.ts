import { getToken, isConfigured } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  // Add auth token if Cognito is configured
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isConfigured()) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers as Record<string, string> },
  });

  // Redirect to login on 401
  if (response.status === 401 && isConfigured()) {
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

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
