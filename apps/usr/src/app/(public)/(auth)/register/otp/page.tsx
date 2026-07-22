import { redirect } from 'next/navigation';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function RegisterOtpPage() {
  redirect(AUTH_ROUTES.loginOtp);
}
