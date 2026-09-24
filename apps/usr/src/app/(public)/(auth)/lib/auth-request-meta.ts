import { headers } from 'next/headers';

import type { AuthRequestMeta } from '../api/auth';
import { pickForwardHeaders } from './forward-headers';

export async function getAuthRequestMeta(): Promise<AuthRequestMeta> {
  const forwarded = pickForwardHeaders(await headers());
  return {
    headers: forwarded,
    userAgent: forwarded['User-Agent'],
  };
}
