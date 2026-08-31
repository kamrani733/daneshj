import { actorHttpClient } from '@/shared/api/actor-http';

import type { ApiResponse } from '@public-panel/types/api';

function formatApiResponseError(
  message: string | null | undefined,
  errors?: Record<string, string>
): string {
  if (message?.trim()) return message.trim();
  const fieldErrors = Object.values(errors ?? {}).filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );
  if (fieldErrors.length > 0) return fieldErrors.join(' ');
  return 'Request failed';
}

function assertApiSuccess<T>(
  response: ApiResponse<T>,
  requireData = true
): T {
  if (!response.success || (requireData && response.data == null)) {
    throw new Error(formatApiResponseError(response.message, response.errors));
  }
  return response.data as T;
}

export function requireAccessToken(accessToken: string | null | undefined) {
  if (!accessToken) {
    throw new Error('Authentication credentials were not provided.');
  }
}

function authHeaders(accessToken?: string | null) {
  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;
}

export async function getActor<T>(
  path: string,
  accessToken: string | null | undefined,
  params?: object,
  requireData = true
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await actorHttpClient.get<ApiResponse<T>>(path, {
    params,
    headers: authHeaders(accessToken),
  });
  return {
    data: assertApiSuccess(response, requireData),
    message: response.message,
  };
}

export async function postActor<T>(
  path: string,
  accessToken: string | null | undefined,
  body: unknown = {},
  requireData = false,
  params?: object
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await actorHttpClient.post<ApiResponse<T>>(
    path,
    body,
    {
      params,
      headers: authHeaders(accessToken),
    }
  );
  return {
    data: assertApiSuccess(response, requireData),
    message: response.message,
  };
}

export async function putActor<T>(
  path: string,
  accessToken: string | null | undefined,
  body: unknown = {},
  requireData = false,
  params?: object
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await actorHttpClient.put<ApiResponse<T>>(
    path,
    body,
    {
      params,
      headers: authHeaders(accessToken),
    }
  );
  return {
    data: assertApiSuccess(response, requireData),
    message: response.message,
  };
}

export async function patchActor<T>(
  path: string,
  accessToken: string | null | undefined,
  body: unknown = {},
  requireData = false,
  params?: object
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await actorHttpClient.patch<ApiResponse<T>>(
    path,
    body,
    {
      params,
      headers: authHeaders(accessToken),
    }
  );
  return {
    data: assertApiSuccess(response, requireData),
    message: response.message,
  };
}
