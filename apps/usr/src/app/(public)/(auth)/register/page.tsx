import { redirect } from 'next/navigation';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';

/** Login and register share one flow — keep old /register URLs working. */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') qs.set(key, value);
    else if (Array.isArray(value) && value[0]) qs.set(key, value[0]);
  }
  const query = qs.toString();
  redirect(query ? `${AUTH_ROUTES.login}?${query}` : AUTH_ROUTES.login);
}
