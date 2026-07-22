import { redirect } from 'next/navigation';
import { getSession } from '@daneshjoam/auth';

import { AuthFlowClientLayout } from './auth-flow-client-layout';

/**
 * Block guest auth flows when a session cookie with accessToken already exists.
 * Session-limit (/login/sessions) still works — that flow has no established session yet.
 */
export default async function AuthFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.accessToken) {
    redirect('/dashboard');
  }

  return <AuthFlowClientLayout>{children}</AuthFlowClientLayout>;
}
