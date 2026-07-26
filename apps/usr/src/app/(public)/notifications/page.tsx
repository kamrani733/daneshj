import { getSession } from '@daneshjoam/auth';

import { HomeBgPattern } from '@/app/(public)/home/components/home-bg-pattern';
import { HomeFooter } from '@/app/(public)/home/components/home-footer';
import { HomeHeader } from '@/app/(public)/home/components/home-header';
import { HomeMotivationBox } from '@/app/(public)/home/components/home-motivation-box';

import { NotificationsPageView } from './components/notifications-page-view';

/** Figma Notifications #2392:4782 */
export default async function NotificationsPage() {
  const session = await getSession();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#FAFAF7]" dir="rtl">
      <HomeHeader
        isAuthenticated={!!session}
        userName={session?.user.name?.trim() || undefined}
      />
      <HomeBgPattern />
      <main className="relative z-[1]">
        <NotificationsPageView />
      </main>
      <HomeMotivationBox />
      <HomeFooter />
    </div>
  );
}
