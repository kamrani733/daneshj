import type { ReactNode } from 'react';
import { getSession } from '@daneshjoam/auth';

import { SessionKeepAlive } from '@/components/session-keep-alive';

import { SiteBgPattern } from '@/components/site/site-bg-pattern';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { SiteMotivationBox } from '@/components/site/site-motivation-box';

type SiteShellProps = {
  children: ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
  const session = await getSession();
  const isUserSession =
    session?.user.id.startsWith('User_') || session?.loginType === 1;
  const userType = session ? (isUserSession ? 'user' : 'admin') : undefined;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-app-scene" dir="rtl">
      <SessionKeepAlive
        enabled={!!session?.refreshToken && !!session.sessionKey}
      />
      <SiteHeader
        isAuthenticated={!!session}
        userName={session?.user?.name?.trim() || undefined}
        userType={userType}
        accessToken={session?.accessToken}
      />
      <SiteBgPattern />
      <div className="relative z-[1]">{children}</div>
      <div className="relative z-10 mt-16 flex flex-col">
        <SiteMotivationBox />
        <SiteFooter />
      </div>
    </div>
  );
}
