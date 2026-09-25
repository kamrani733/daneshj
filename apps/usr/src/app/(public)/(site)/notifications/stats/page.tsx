import { getSession } from '@daneshjoam/auth';

import { NotificationsStatsView } from '@notifications/components/stats/view';

/** Notifications stats — Usr/ASR-Ntf-6N12 or Adm-Ntf-6N10 (by session actor). */
export default async function NotificationsStatsPage() {
  const session = await getSession();

  return (
    <main>
      <NotificationsStatsView
        accessToken={session?.accessToken}
        sessionUserId={session?.user.id}
      />
    </main>
  );
}
