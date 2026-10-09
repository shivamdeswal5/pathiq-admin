import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { supabaseBrowser } from './supabase-browser';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Attach Supabase Bearer token via active user session
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
  message: string | string[];
  error?: string;
}

// Response interceptor: Normalize responses and catch errors cleanly
apiClient.interceptors.response.use(
  (response) => {
    if (response.status === StatusCodes.NO_CONTENT) {
      return response;
    }
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    return Promise.reject(error);
  },
);
