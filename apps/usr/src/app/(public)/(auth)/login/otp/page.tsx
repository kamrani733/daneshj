'use client';

import { OtpForm } from '@auth/components/auth-forms';
import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function LoginOtpPage() {
  return <OtpForm purpose="login" successPath={AUTH_ROUTES.afterLogin} />;
}

