import { createApiClient, type HttpClient } from '@daneshjoam/api-client';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? '/api';
const isExternalApi = baseURL.startsWith('http');

export const usrHttpClient: HttpClient = createApiClient({
  baseURL,
  // Cross-origin Stella uses Bearer tokens; cookies + ACAO:* breaks CORS
  withCredentials: !isExternalApi,
});
