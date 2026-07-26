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

/** Temporary mock — recent popover list. */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'unread',
  },
  {
    id: '2',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'unread',
  },
  {
    id: '3',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'read',
  },
  {
    id: '4',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'read',
  },
  {
    id: '5',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'read',
  },
];

function makeRecord(
  id: string,
  kind: NotificationRecord['kind'],
  unread = false
): NotificationRecord {
  return {
    id,
    kind,
    subject: 'موضوع یک',
    body: 'متن اعلان در این فسمت آورده میشود ',
    mainCategory: 'دسته بندی اصلی 1',
    subCategory: 'دسته بندی فرعی یک',
    link: 'https:/examplesite.com/examplelink',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    readDate: unread ? null : '1404/12/06 ',
    readTime: unread ? null : '1:15ب ظ',
    status: unread ? 'unread' : 'read',
  };
}

/** Unread positions (1-based) mirroring the Figma page mock. */
const UNREAD_MANUAL_ROWS = new Set([3, 5, 8, 12]);

/** Temporary mock — full notifications page. */
export const MOCK_NOTIFICATION_RECORDS: NotificationRecord[] = [
  ...Array.from({ length: 12 }, (_, i) =>
    makeRecord(`manual-${i + 1}`, 'manual', UNREAD_MANUAL_ROWS.has(i + 1))
  ),
  ...Array.from({ length: 6 }, (_, i) => makeRecord(`system-${i + 1}`, 'system', i === 0)),
];

export function countUnreadNotifications(items: NotificationItem[]) {
  return items.reduce((total, item) => (item.status === 'unread' ? total + 1 : total), 0);
}
