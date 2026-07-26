import fa from '../../../../../messages/fa.json';

import type {
  ListNotificationsPayload,
  MarkNotificationAsReadData,
  NotificationItem,
  NotificationListResult,
  UnreadCounts,
} from './types';

export function isNotificationApiMocked() {
  return !process.env.NEXT_PUBLIC_API_URL;
}

const m = fa.notifications.mock;

const MOCK_ITEMS: NotificationItem[] = [
  {
    id: '191',
    subject: m.accountSubject,
    body: m.accountBody,
    date: '1404-11-25',
    time: '13:39:34',
    status: 'unread',
    kind: 'system',
    mainCategory: m.accountSubject,
    subCategory: m.accountSubCategory,
    link: 'www.changeuser.com',
    sentAt: '1404-11-25 13:39:34',
  },
  {
    id: '190',
    subject: m.genericSubject,
    body: m.genericBody,
    date: '1404-12-06',
    time: m.timePm,
    status: 'unread',
    kind: 'manual',
    mainCategory: '—',
    subCategory: '—',
    link: 'https://examplesite.com/examplelink',
    sentAt: '1404-12-06 13:15:00',
  },
  {
    id: '189',
    subject: m.financeSubject,
    body: m.financeBody,
    date: '1404-11-25',
    time: '13:39:34',
    status: 'read',
    kind: 'system',
    mainCategory: m.financeSubject,
    subCategory: m.financeSubCategory,
    link: 'www.deposti.com',
    sentAt: '1404-11-25 13:39:34',
  },
  {
    id: '188',
    subject: m.genericSubject,
    body: m.genericBody,
    date: '1404-12-06',
    time: m.timePm,
    status: 'read',
    kind: 'manual',
    mainCategory: '—',
    subCategory: '—',
    link: 'https://examplesite.com/examplelink',
    sentAt: '1404-12-06 13:15:00',
  },
  {
    id: '186',
    subject: m.genericSubject,
    body: m.genericBody,
    date: '1404-12-06',
    time: m.timePm,
    status: 'read',
    kind: 'manual',
    mainCategory: '—',
    subCategory: '—',
    link: '',
    sentAt: '1404-12-06 13:15:00',
  },
];

export async function mockGetLast5Notifications(): Promise<NotificationItem[]> {
  return MOCK_ITEMS.slice(0, 5);
}

export async function mockListNotifications(
  payload: ListNotificationsPayload
): Promise<NotificationListResult> {
  const page = payload.page ?? 1;
  let items = [...MOCK_ITEMS];

  if (payload.type) {
    items = items.filter((item) => item.kind === payload.type);
  }
  if (payload.isRead !== undefined) {
    items = items.filter((item) =>
      payload.isRead ? item.status === 'read' : item.status === 'unread'
    );
  }
  if (payload.search?.trim()) {
    const q = payload.search.trim();
    items = items.filter(
      (item) => item.subject.includes(q) || item.body.includes(q)
    );
  }

  const manual = MOCK_ITEMS.filter(
    (item) => item.kind === 'manual' && item.status === 'unread'
  ).length;
  const system = MOCK_ITEMS.filter(
    (item) => item.kind === 'system' && item.status === 'unread'
  ).length;

  return {
    items,
    count: items.length,
    totalPages: 1,
    currentPage: page,
    unreadCounts: { manual, system },
    message: 'success',
  };
}

export async function mockMarkNotificationAsRead(
  sentNotificationId: number | string
): Promise<MarkNotificationAsReadData> {
  return {
    actor_id: 1,
    notification_id: sentNotificationId,
    read_at: '1404-11-25 13:39:34',
  };
}

export async function mockMarkAllNotificationsAsRead(): Promise<void> {
  return;
}

export async function mockMarkLast5NotificationsAsRead(): Promise<void> {
  return;
}

export async function mockGetUnreadCount(): Promise<UnreadCounts> {
  const manual = MOCK_ITEMS.filter(
    (item) => item.kind === 'manual' && item.status === 'unread'
  ).length;
  const system = MOCK_ITEMS.filter(
    (item) => item.kind === 'system' && item.status === 'unread'
  ).length;
  return { total: manual + system, manual, system };
}
