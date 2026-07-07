'use client';

import { OtpForm } from '@auth/components/auth-forms';
import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function RegisterOtpPage() {
  return <OtpForm purpose="register" successPath={AUTH_ROUTES.dashboard} />;
}
