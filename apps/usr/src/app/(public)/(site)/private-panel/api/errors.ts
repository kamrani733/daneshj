import { isApiError } from '@daneshjoam/api-client';

import type { ApiResponse } from './types';

export type ActorKnownErrorKey = 'internal' | 'unauthorized' | 'notFound';

function isApiResponseBody(data: unknown): data is ApiResponse<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    'errors' in data
  );
}

export function formatApiResponseError(
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

const KNOWN_ACTOR_ERROR_KEYS: Record<string, ActorKnownErrorKey> = {
  'internal server error': 'internal',
  'authentication credentials were not provided.': 'unauthorized',
  'not found.': 'notFound',
};

function resolveKnownError(
  message: string,
  tKnown?: (key: ActorKnownErrorKey) => string
): string {
  const key = KNOWN_ACTOR_ERROR_KEYS[message.trim().toLowerCase()];
  if (key && tKnown) return tKnown(key);
  return message;
}

/** Prefer backend `message` / `errors` over generic client fallbacks. */
export function getActorApiErrorMessage(
  error: unknown,
  fallback: string,
  tKnown?: (key: ActorKnownErrorKey) => string
): string {
  if (isApiError(error)) {
    if (isApiResponseBody(error.data)) {
      const message = formatApiResponseError(error.data.message, error.data.errors);
      if (message !== 'Request failed') {
        return resolveKnownError(message, tKnown);
      }
    }

    const data = error.data as
      | { message?: string; errors?: Record<string, string> }
      | undefined;
    if (data) {
      const message = formatApiResponseError(data.message, data.errors);
      if (message !== 'Request failed') {
        return resolveKnownError(message, tKnown);
      }
    }

    if (error.message && error.message !== 'Request failed') {
      return resolveKnownError(error.message, tKnown);
    }
  }

  if (error instanceof Error && error.message && error.message !== 'Request failed') {
    return resolveKnownError(error.message, tKnown);
  }

  return fallback;
}
