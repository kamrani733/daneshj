import { headers } from 'next/headers';

import type { AuthRequestMeta } from '@auth/api/auth';
import { pickForwardHeaders } from '@auth/lib/forward-headers';

export async function getAuthRequestMeta(): Promise<AuthRequestMeta> {
  const forwarded = pickForwardHeaders(await headers());
  return {
    headers: forwarded,
    userAgent: forwarded['User-Agent'],
  };
}
