'use client';

import { SessionManagementForm } from '@auth/components/session-management-form';
import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function RegisterSessionsPage() {
  return (
    <SessionManagementForm
      purpose="register"
      successPath={AUTH_ROUTES.dashboard}
    />
  );
}
