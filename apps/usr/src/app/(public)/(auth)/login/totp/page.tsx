'use client';

import { TotpForm } from '@auth/components/auth-forms';
import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function LoginTotpPage() {
  return <TotpForm successPath={AUTH_ROUTES.afterLogin} />;
}
