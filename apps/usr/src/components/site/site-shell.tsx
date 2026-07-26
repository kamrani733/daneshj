import type { ReactNode } from 'react';
import { getSession } from '@daneshjoam/auth';

import { SessionKeepAlive } from '@/components/session-keep-alive';

import { SiteBgPattern } from './site-bg-pattern';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { SiteMotivationBox } from './site-motivation-box';

type SiteShellProps = {
  children: ReactNode;
};

/**
 * Shared chrome for public site pages (not auth flows):
 * header · background · page · motivation · footer.
 */
export async function SiteShell({ children }: SiteShellProps) {
  const session = await getSession();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-home-scene" dir="rtl">
      <SessionKeepAlive
        enabled={!!session?.refreshToken && !!session.sessionKey}
      />
      <SiteHeader
        isAuthenticated={!!session}
        userName={session?.user.name?.trim() || undefined}
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
