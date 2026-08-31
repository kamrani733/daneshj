import { createApiClient, type HttpClient } from '@daneshjoam/api-client';

/**
 * Interactive Operations MS client.
 *
 * Paths are `/interactive-ops/...` (see InteractiveoperationsMS swagger).
 * Default same-origin proxy `/api` → next.config rewrite → INTERACTIVE_OPS_API_URL.
 */
const baseURL = process.env.NEXT_PUBLIC_INTERACTIVE_OPS_API_URL || '/api';
const isExternalApi = baseURL.startsWith('http');

export const interactiveOpsHttpClient: HttpClient = createApiClient({
  baseURL,
  withCredentials: !isExternalApi,
  timeout: 20_000,
});
