import { getSession } from '@daneshjoam/auth';

import { NotificationsChartsView } from '../components/notifications-charts-view';

/** Notifications charts — Figma نمودارهای ثابت + Adm-Ntf-6N11 */
export default async function NotificationsChartsPage() {
  const session = await getSession();

  return (
    <main>
      <NotificationsChartsView accessToken={session?.accessToken} />
    </main>
  );
}
