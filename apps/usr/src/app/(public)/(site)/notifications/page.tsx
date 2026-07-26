import { getSession } from '@daneshjoam/auth';

import { NotificationsPageView } from './components/notifications-page-view';

/** Figma Notifications #2392:4782 / #2419:2680 */
export default async function NotificationsPage() {
  const session = await getSession();

  return (
    <main>
      <NotificationsPageView accessToken={session?.accessToken} />
    </main>
  );
}
