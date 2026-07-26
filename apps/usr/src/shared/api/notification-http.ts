import { createApiClient, type HttpClient } from '@daneshjoam/api-client';

/**
 * Notification MS client — separate from auth (`usrHttpClient` / :3009).
 *
 * Dev: http://dev.stella.webpanel.systems:4002
 * Paths are `/notification/...` (see swagger `/api/schema/swagger-ui/`).
 * Leave unset to serve mocks with no network calls.
 */
const baseURL = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ?? '';
const isExternalApi = baseURL.startsWith('http');

export const notificationHttpClient: HttpClient = createApiClient({
  baseURL,
  withCredentials: !isExternalApi,
});
