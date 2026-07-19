import { redirect } from 'next/navigation';
import { getSession } from '@daneshjoam/auth';

import { SessionKeepAlive } from '@/components/session-keep-alive';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <SessionKeepAlive enabled={!!session.refreshToken && !!session.sessionKey} />
      {children}
    </>
  );
}
