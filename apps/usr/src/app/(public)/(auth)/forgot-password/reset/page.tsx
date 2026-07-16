'use client';

import { ResetPasswordForm } from '@auth/components/auth-forms';
import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function ForgotPasswordResetPage() {
  return <ResetPasswordForm successPath={AUTH_ROUTES.dashboard} />;
}
