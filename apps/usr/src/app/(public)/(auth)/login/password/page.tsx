'use client';

import { PasswordLoginForm } from '@auth/components/auth-forms';
import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function LoginPasswordPage() {
  return <PasswordLoginForm successPath={AUTH_ROUTES.afterLogin} />;
}
