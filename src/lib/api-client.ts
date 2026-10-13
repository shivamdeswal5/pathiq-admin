import axios, { InternalAxiosRequestConfig } from 'axios';
import { supabaseBrowser } from './supabase-browser';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
  console.error('CRITICAL: NEXT_PUBLIC_API_URL environment variable is not defined.');
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Attach Supabase Bearer token via active session
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Proceed without authorization header if session resolution fails
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

export interface ApiErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

// Single responsibility error message extractor (replaces duplicate inline type casts)
export function getApiErrorMessage(
  err: unknown,
  fallback = 'An unexpected error occurred. Please try again.',
): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorResponse | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join('; ') : data.message;
    }
    if (err.message) return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}
