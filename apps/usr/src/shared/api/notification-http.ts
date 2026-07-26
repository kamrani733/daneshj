import { createApiClient, type HttpClient } from '@daneshjoam/api-client';

/**
 * Notification MS client — separate from auth (`usrHttpClient` / :3009).
 *
 * Auth host schema is "Authentication Microservice API" and has no `/notification/*`.
 * Set `NEXT_PUBLIC_NOTIFICATION_API_URL` to the Notification MS origin (or `/api` + rewrite).
 */
const baseURL = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ?? '/api';
const isExternalApi = baseURL.startsWith('http');

export const notificationHttpClient: HttpClient = createApiClient({
  baseURL,
  withCredentials: !isExternalApi,
});
