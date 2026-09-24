import { actorHttpClient } from '@/shared/api/actor-http';

import { formatApiResponseError } from '@private-panel/api/errors';
import { requireAccessToken } from '@private-panel/api/http';
import type { ApiResponse } from '@private-panel/types/api';

function authHeaders(accessToken?: string | null) {
  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;
}

function extractUploadedUrl(payload: unknown): string | null {
  if (typeof payload === 'string' && payload.trim()) return payload.trim();
  if (!payload || typeof payload !== 'object') return null;
  const row = payload as Record<string, unknown>;
  for (const key of ['url', 'file_path', 'path', 'filePath', 'location']) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  if (row.data != null) return extractUploadedUrl(row.data);
  return null;
}

export function isPrivateFileUploadConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FILE_UPLOAD_URL?.trim());
}

export async function uploadPrivatePanelFile(payload: {
  accessToken?: string | null;
  file: File;
}): Promise<string> {
  requireAccessToken(payload.accessToken);
  const uploadUrl = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL?.trim();
  if (!uploadUrl) {
    throw new Error('FILE_UPLOAD_UNAVAILABLE');
  }

  const form = new FormData();
  form.append('file', payload.file);

  const { data: response } = await actorHttpClient.post<
    ApiResponse<unknown> | Record<string, unknown>
  >(uploadUrl, form, {
    headers: authHeaders(payload.accessToken),
  });

  if (
    response &&
    typeof response === 'object' &&
    'success' in response &&
    (response as ApiResponse<unknown>).success === false
  ) {
    const failed = response as ApiResponse<unknown>;
    throw new Error(formatApiResponseError(failed.message, failed.errors));
  }

  const url =
    extractUploadedUrl(response) ||
    extractUploadedUrl((response as ApiResponse<unknown>).data);
  if (!url) {
    throw new Error('FILE_UPLOAD_UNAVAILABLE');
  }
  return url;
}
