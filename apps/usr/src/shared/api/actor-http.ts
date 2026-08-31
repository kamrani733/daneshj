import { createApiClient, type HttpClient } from '@daneshjoam/api-client';

/**
 * Actor Microservice client (profiles + service titles).
 *
 * Paths are `/profiles_base/...`, `/profiles_user/...`,
 * `/profiles_individual/...`, `/profiles_business/...`, `/service_titles/...`
 * (see Actor Microservice API OpenAPI).
 * Default same-origin proxy `/api` → next.config rewrite → ACTOR_API_URL.
 */
const baseURL = process.env.NEXT_PUBLIC_ACTOR_API_URL || '/api';
const isExternalApi = baseURL.startsWith('http');

export const actorHttpClient: HttpClient = createApiClient({
  baseURL,
  withCredentials: !isExternalApi,
  timeout: 20_000,
});

/**
 * Actor `retrieve-for-visitor` returns 500 when Accept-Language is a real
 * locale (`en-US`, `fa`, `*`). Browser clients send that header by default.
 * Empty matches the working backend contract (omit / blank).
 */
actorHttpClient.interceptors.request.use((config) => {
  config.headers.set('Accept-Language', '');
  return config;
});
