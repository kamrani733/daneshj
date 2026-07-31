import { createApiClient, type HttpClient } from '@daneshjoam/api-client';

/**
 * Interactive Operations MS client.
 *
 * Paths are `/interactive-ops/...` (see InteractiveoperationsMS swagger).
 * Prefer same-origin proxy: NEXT_PUBLIC_INTERACTIVE_OPS_API_URL=/api
 */
const baseURL = process.env.NEXT_PUBLIC_INTERACTIVE_OPS_API_URL ?? '';
const isExternalApi = baseURL.startsWith('http');

export const interactiveOpsHttpClient: HttpClient = createApiClient({
  baseURL,
  withCredentials: !isExternalApi,
  timeout: 20_000,
});
