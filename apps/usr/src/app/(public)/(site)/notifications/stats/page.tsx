import { getSession } from '@daneshjoam/auth';

import { NotificationsStatsView } from '../components/stats/view';

/** Notifications stats — Figma سکشن آمار + Adm-Ntf-6N10 */
export default async function NotificationsStatsPage() {
  const session = await getSession();

  return (
    <main>
      <NotificationsStatsView accessToken={session?.accessToken} />
    </main>
  );
}
