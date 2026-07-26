import { toRequestQuery } from '@daneshjoam/api-client';

import type {
  ActorNotificationDto,
  ActorNotificationListData,
  ListNotificationsPayload,
  NotificationItem,
  NotificationListResult,
  NotificationType,
  UnreadCountData,
  UnreadCounts,
} from './types';

function splitSentAt(sentAt: string | null): { date: string; time: string } {
  if (!sentAt?.trim()) return { date: '', time: '' };
  const [datePart = '', timePart = ''] = sentAt.trim().split(/\s+/);
  return { date: datePart, time: timePart };
}

function toNotificationType(value: string): NotificationType {
  return value === 'manual' ? 'manual' : 'system';
}

/** Map wire DTO → UI notification item. */
export function mapActorNotification(
  dto: ActorNotificationDto
): NotificationItem {
  const { date, time } = splitSentAt(dto.sent_at);
  return {
    id: String(dto.id),
    subject: dto.subject?.trim() || dto.main_category?.trim() || '',
    body: dto.content,
    date,
    time,
    status: dto.is_read ? 'read' : 'unread',
    kind: toNotificationType(String(dto.notification_type)),
    mainCategory: dto.main_category?.trim() || '—',
    subCategory: dto.sub_category?.trim() || '—',
    link: dto.link?.trim() || '',
    sentAt: dto.sent_at,
  };
}

/** Accept paginated example shape or raw array (OpenAPI schema mismatch). */
export function mapNotificationList(
  data: ActorNotificationListData | ActorNotificationDto[] | null,
  message: string | null
): NotificationListResult {
  if (Array.isArray(data)) {
    const items = data.map(mapActorNotification);
    return {
      items,
      count: items.length,
      totalPages: 1,
      currentPage: 1,
      unreadCounts: {
        manual: items.filter((i) => i.kind === 'manual' && i.status === 'unread')
          .length,
        system: items.filter((i) => i.kind === 'system' && i.status === 'unread')
          .length,
      },
      message,
    };
  }

  const results = data?.results ?? [];
  return {
    items: results.map(mapActorNotification),
    count: data?.count ?? results.length,
    totalPages: data?.total_pages ?? 1,
    currentPage: data?.current_page ?? 1,
    unreadCounts: {
      manual: data?.unread_counts?.manual_count ?? 0,
      system: data?.unread_counts?.system_count ?? 0,
    },
    message,
  };
}

export function mapUnreadCounts(data: UnreadCountData | null): UnreadCounts {
  if (!data || typeof data !== 'object') {
    return { total: 0, manual: 0, system: 0 };
  }
  const manual = data.manual_count ?? 0;
  const system = data.system_count ?? 0;
  const total = data.count ?? manual + system;
  return { total, manual, system };
}

/** YAML query for /notification/actor-notifications/list */
export function toListNotificationsQuery(payload: ListNotificationsPayload) {
  return toRequestQuery({
    page: payload.page ?? 1,
    search: payload.search,
    type: payload.type,
    is_read:
      payload.isRead === undefined ? undefined : payload.isRead ? 'true' : 'false',
    start_date: payload.startDate,
    end_date: payload.endDate,
    main_category_id: payload.mainCategoryId,
    sub_category_id: payload.subCategoryId,
    ordering: payload.ordering,
  });
}
