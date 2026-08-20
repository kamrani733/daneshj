/** Shared notifications paths and default helpers. */

import type { NotificationStatus } from '@notifications/types/ui';

export type * from '@notifications/types/ui';

export const NOTIFICATIONS_PATH = '/notifications';

export function countUnreadNotifications(
  items: Array<{ status: NotificationStatus }>
) {
  return items.reduce(
    (total, item) => (item.status === 'unread' ? total + 1 : total),
    0
  );
}
