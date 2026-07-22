import { redirect } from 'next/navigation';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function RegisterSessionsPage() {
  redirect(AUTH_ROUTES.loginSessions);
}
