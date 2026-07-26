/** Wire + app types for Notification Microservice (actor notifications). */

export interface ApiResponse<T> {
  data: T | null;
  message: string | null;
  status_code: number;
  errors: Record<string, string>;
  success: boolean;
}

export type NotificationType = 'manual' | 'system';

export type NotificationOrdering =
  | 'created_at'
  | '-created_at'
  | 'is_read'
  | '-is_read';

/** YAML: ActorLastFiveNotification / ActorNotificationList */
export interface ActorNotificationDto {
  id: number;
  subject: string | null;
  main_category: string | null;
  sub_category: string | null;
  notification_type: NotificationType | string;
  sent_at: string | null;
  content: string;
  link: string | null;
  is_read: boolean;
}

/** YAML example for list — paginated envelope (schema incorrectly types data as array). */
export interface ActorNotificationListData {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: ActorNotificationDto[];
  unread_counts: {
    manual_count: number;
    system_count: number;
  };
}

/** YAML: MarkNotificationAsRead */
export interface MarkNotificationAsReadData {
  actor_id: number;
  notification_id: string | number;
  read_at: string;
}

/** Best-effort unread-count payload (OpenAPI response schema is incomplete). */
export interface UnreadCountData {
  count?: number;
  manual_count?: number;
  system_count?: number;
}

/** App-facing notification (bell popover + shared UI). */
export interface NotificationItem {
  id: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  status: 'unread' | 'read';
  kind: NotificationType;
  mainCategory: string;
  subCategory: string;
  link: string;
  sentAt: string | null;
}

export interface NotificationListResult {
  items: NotificationItem[];
  count: number;
  totalPages: number;
  currentPage: number;
  unreadCounts: {
    manual: number;
    system: number;
  };
  message: string | null;
}

export interface UnreadCounts {
  total: number;
  manual: number;
  system: number;
}

export interface GetLast5NotificationsPayload {
  accessToken: string;
}

export interface ListNotificationsPayload {
  accessToken: string;
  page?: number;
  search?: string;
  type?: NotificationType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  mainCategoryId?: number;
  subCategoryId?: number;
  ordering?: NotificationOrdering;
}

export interface MarkNotificationAsReadPayload {
  accessToken: string;
  sentNotificationId: number | string;
}

export interface MarkAllNotificationsAsReadPayload {
  accessToken: string;
}

export interface MarkLast5NotificationsAsReadPayload {
  accessToken: string;
}

export interface GetUnreadCountPayload {
  accessToken: string;
}
