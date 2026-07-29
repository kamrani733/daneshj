import fa from '@messages/fa.json';

import { flattenSettingsEvents } from '@notifications/data/settings-mock';

import { toActorChannelSettingRequest } from './transformers';
import type {
  ActorSettingItem,
  ApplyActorSettingPayload,
  ChartsReportResult,
  DetailedStatusReportItem,
  DetailedStatusReportResult,
  GetChartsReportPayload,
  GetDetailedStatusReportPayload,
  ListNotificationsPayload,
  MarkNotificationAsReadData,
  NotificationChartsDataDto,
  NotificationItem,
  NotificationListResult,
  UnreadCounts,
} from './types';
import { mapChartsReport } from './transformers';

/** Live calls only when a Notification MS base URL is configured. */
export function isNotificationApiMocked() {
  return !process.env.NEXT_PUBLIC_NOTIFICATION_API_URL;
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

const MOCK_REPORT_ITEMS: DetailedStatusReportItem[] = Array.from(
  { length: 11 },
  (_, index) => {
    const n = 11 - index;
    return {
      id: String(250 + n),
      subject: `موضوع ${n}`,
      body: 'تمام یا بخشی از متن اعلان در این قسمت آورده می‌شود',
      mainCategory: `نام دسته‌بندی ${n}`,
      subCategory: `نام دسته‌بندی فرعی ${n}`,
      priority: n % 3 === 0 ? 'high' : n % 2 === 0 ? 'medium' : 'low',
      sender: `username${n}`,
      status: n % 2 === 0 ? 'unread' : 'read',
      channels: n % 2 === 0 ? ['site', 'email'] : ['site'],
      sentAt: '1404/12/06 13:15:00',
      sentDate: '1404/12/06',
      sentTime: '1:15ب ظ',
    };
  }
);

export async function mockGetDetailedStatusReport(
  payload: GetDetailedStatusReportPayload
): Promise<DetailedStatusReportResult> {
  const page = payload.page ?? 1;
  const pageSize = 10;
  let items = [...MOCK_REPORT_ITEMS];

  if (payload.search?.trim()) {
    const q = payload.search.trim();
    items = items.filter(
      (item) =>
        item.subject.includes(q) ||
        item.body.includes(q) ||
        item.sender.includes(q)
    );
  }
  if (payload.priority) {
    items = items.filter((item) => item.priority === payload.priority);
  }
  if (payload.status) {
    items = items.filter((item) => item.status === payload.status);
  }
  if (payload.channel) {
    items = items.filter((item) => item.channels.includes(payload.channel!));
  }

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items: pageItems,
    count: items.length,
    totalPages,
    currentPage: page,
    message: 'success',
  };
}

/** In-memory actor settings for mock create/list. */
let mockActorSettingsStore: ActorSettingItem[] = flattenSettingsEvents().map(
  (eventItem, index) => ({
    id: index + 1,
    categoryId: eventItem.categoryId,
    categoryTitle: eventItem.titleKey,
    channels: toActorChannelSettingRequest(
      eventItem.channels.map((channel) => ({ ...channel }))
    ),
  })
);

/** GET /notification/actor-settings/list */
export async function mockGetActorSettings(): Promise<ActorSettingItem[]> {
  return mockActorSettingsStore.map((item) => ({
    ...item,
    channels: item.channels.map((channel) => ({ ...channel })),
  }));
}

/** POST /notification/actor-settings/create — USR-Ntf-5N2 */
export async function mockApplyActorSetting(
  payload: ApplyActorSettingPayload
): Promise<ActorSettingItem> {
  const existingIndex = mockActorSettingsStore.findIndex(
    (item) => item.categoryId === payload.categoryId
  );
  const next: ActorSettingItem = {
    id:
      existingIndex >= 0
        ? mockActorSettingsStore[existingIndex]!.id
        : mockActorSettingsStore.length + 1,
    categoryId: payload.categoryId,
    categoryTitle:
      existingIndex >= 0
        ? mockActorSettingsStore[existingIndex]!.categoryTitle
        : String(payload.categoryId),
    channels: payload.channels.map((channel) => ({ ...channel })),
  };

  if (existingIndex >= 0) {
    mockActorSettingsStore[existingIndex] = next;
  } else {
    mockActorSettingsStore.push(next);
  }

  return { ...next, channels: next.channels.map((channel) => ({ ...channel })) };
}

/** OpenAPI NotificationChartsReportExample — GET charts_report */
const MOCK_CHARTS_DATA: NotificationChartsDataDto = {
  user_reaction_time_chart: {
    chart_type: 'line',
    series: [
      {
        date: '2026-07-25',
        average_reaction_time_seconds: 8167.06,
        average_reaction_time_formatted: '2 ساعت و 16 دقیقه و 7 ثانیه',
      },
      {
        date: '2026-07-26',
        average_reaction_time_seconds: 3443.79,
        average_reaction_time_formatted: '57 دقیقه و 23 ثانیه',
      },
      {
        date: '2026-07-27',
        average_reaction_time_seconds: 8609.52,
        average_reaction_time_formatted: '2 ساعت و 23 دقیقه و 29 ثانیه',
      },
    ],
  },
  main_category_read_rate_chart: {
    chart_type: 'pie',
    series: [
      {
        main_category_id: 14,
        main_category_name: 'مالی',
        read_percentage: 65,
      },
      {
        main_category_id: 25,
        main_category_name: 'دیدگاه',
        read_percentage: 68,
      },
      {
        main_category_id: 58,
        main_category_name: 'سرویس-رخدادهای تقویمی',
        read_percentage: 85.71,
      },
    ],
  },
  unread_to_read_conversion_rate_chart: {
    chart_type: 'line',
    series: [
      { date: '2026-07-25', conversion_rate: 66.67 },
      { date: '2026-07-26', conversion_rate: 75 },
      { date: '2026-07-27', conversion_rate: 85.71 },
    ],
  },
  read_vs_unread_distribution_chart: {
    chart_type: 'pie',
    series: [
      { status_label: 'خوانده شده', count: 102, percentage: 64.15 },
      { status_label: 'خوانده نشده', count: 57, percentage: 35.85 },
    ],
  },
  received_notifications_by_main_category_chart: {
    chart_type: 'pie',
    series: [
      {
        main_category_id: 58,
        main_category_name: 'سرویس-رخدادهای تقویمی',
        count: 35,
        percentage: 22.01,
      },
      {
        main_category_id: 25,
        main_category_name: 'دیدگاه',
        count: 25,
        percentage: 15.72,
      },
      {
        main_category_id: 14,
        main_category_name: 'مالی',
        count: 20,
        percentage: 12.58,
      },
    ],
  },
};

/** GET /notification/report/charts_report — Adm-Ntf-6N11 */
export async function mockGetChartsReport(
  _payload: GetChartsReportPayload
): Promise<ChartsReportResult> {
  return mapChartsReport(MOCK_CHARTS_DATA, 'executed');
}
