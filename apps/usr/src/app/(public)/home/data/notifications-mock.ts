export type NotificationStatus = 'unread' | 'read';

export type NotificationItem = {
  id: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  status: NotificationStatus;
};

/** Full page row — Figma Notifications #100:5489 */
export type NotificationRecord = NotificationItem & {
  kind: 'manual' | 'system';
  mainCategory: string;
  subCategory: string;
  link: string;
  readDate: string | null;
  readTime: string | null;
};

export const NOTIFICATIONS_PATH = '/notifications';

export function countUnreadNotifications(items: NotificationItem[]) {
  return items.reduce((total, item) => (item.status === 'unread' ? total + 1 : total), 0);
}
