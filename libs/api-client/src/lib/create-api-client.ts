import axios, { type AxiosInstance, type AxiosError } from 'axios';

import { ApiError } from './errors';

export type HttpClient = AxiosInstance;

export interface CreateApiClientOptions {
  baseURL?: string;
  withCredentials?: boolean;
  getAccessToken?: () => string | null | undefined;
  /** Axios request timeout in ms. */
  timeout?: number;
}

type ErrorBody = {
  message?: string;
  error?: string;
};

export function createApiClient(options: CreateApiClientOptions): HttpClient {
  const client = axios.create({
    baseURL: options.baseURL,
    withCredentials: options.withCredentials ?? true,
    timeout: options.timeout,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config) => {
    const token = options.getAccessToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorBody>) => {
      const status = error.response?.status ?? 0;
      const data = error.response?.data;
      const message = data?.message ?? data?.error ?? error.message ?? 'Request failed';
      return Promise.reject(new ApiError(message, status, data));
    }
  );

  return client;
}

/** @deprecated Use `createApiClient` for new apps. */
export const apiClient: HttpClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  withCredentials: true,
});
