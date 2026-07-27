import { getSession } from '@daneshjoam/auth';

import { NotificationsSettingsView } from '../components/notifications-settings-view';

/** Notification channel preference settings — Figma تنظیمات اعلانات */
export default async function NotificationsSettingsPage() {
  const session = await getSession();

  return (
    <main>
      <NotificationsSettingsView accessToken={session?.accessToken} />
    </main>
  );
}
