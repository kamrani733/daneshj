import { getSession } from '@daneshjoam/auth';

import { NotificationsChartsView } from '@notifications/components/charts/view';

/** Notifications charts — Usr/ASR-Ntf-6N13 or Adm-Ntf-6N11 (by session actor). */
export default async function NotificationsChartsPage() {
  const session = await getSession();

  return (
    <main>
      <NotificationsChartsView
        accessToken={session?.accessToken}
        sessionUserId={session?.user.id}
      />
    </main>
  );
}
