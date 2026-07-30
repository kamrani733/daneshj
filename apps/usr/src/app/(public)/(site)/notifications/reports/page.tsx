import { getSession } from '@daneshjoam/auth';

import { NotificationsReportsView } from '../components/reports/view';

/** Notifications reports — Figma گزارش اعلان‌های دریافتی و وضعیت آنها */
export default async function NotificationsReportsPage() {
  const session = await getSession();

  return (
    <main>
      <NotificationsReportsView accessToken={session?.accessToken} />
    </main>
  );
}
