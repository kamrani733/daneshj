import { isApiError } from '@daneshjoam/api-client';

import type { ApiResponse } from './types';

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

const KNOWN_AUTH_ERROR_MESSAGES: Record<string, string> = {
  'you must enter email/mobile for reset password.':
    'برای بازیابی رمز عبور باید شماره‌همراه یا ایمیل وارد کنید',
  'you must enter email/mobile for reset password':
    'برای بازیابی رمز عبور باید شماره‌همراه یا ایمیل وارد کنید',
};

function translateKnownAuthError(message: string): string {
  const normalized = message.trim().toLowerCase();
  return KNOWN_AUTH_ERROR_MESSAGES[normalized] ?? message;
}

/** Prefer backend `message` / `errors` over generic client fallbacks. */
export function getAuthApiErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    if (isApiResponseBody(error.data)) {
      const message = formatApiResponseError(error.data.message, error.data.errors);
      if (message !== 'Request failed') return translateKnownAuthError(message);
    }

    const data = error.data as { message?: string; errors?: Record<string, string> } | undefined;
    if (data) {
      const message = formatApiResponseError(data.message, data.errors);
      if (message !== 'Request failed') return translateKnownAuthError(message);
    }

    if (error.message && error.message !== 'Request failed') {
      return translateKnownAuthError(error.message);
    }
  }

  if (error instanceof Error && error.message && error.message !== 'Request failed') {
    return translateKnownAuthError(error.message);
  }

  return fallback;
}
