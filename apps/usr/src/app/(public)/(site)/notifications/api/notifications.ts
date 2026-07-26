import { withMockFallback } from '@daneshjoam/api-client';

import { usrHttpClient } from '@/shared/api/usr-http';

import { formatApiResponseError } from './errors';
import {
  isNotificationApiMocked,
  mockGetLast5Notifications,
  mockGetUnreadCount,
  mockListNotifications,
  mockMarkAllNotificationsAsRead,
  mockMarkLast5NotificationsAsRead,
  mockMarkNotificationAsRead,
} from './mock';
import {
  mapActorNotification,
  mapNotificationList,
  mapUnreadCounts,
  toListNotificationsQuery,
} from './transformers';
import type {
  ActorNotificationDto,
  ActorNotificationListData,
  ApiResponse,
  GetLast5NotificationsPayload,
  GetUnreadCountPayload,
  ListNotificationsPayload,
  MarkAllNotificationsAsReadPayload,
  MarkLast5NotificationsAsReadPayload,
  MarkNotificationAsReadData,
  MarkNotificationAsReadPayload,
  NotificationItem,
  NotificationListResult,
  UnreadCountData,
  UnreadCounts,
} from './types';

function assertApiSuccess<T>(response: ApiResponse<T>, requireData = true): T {
  if (!response.success || (requireData && response.data == null)) {
    throw new Error(formatApiResponseError(response.message, response.errors));
  }
  return response.data as T;
}

async function getNotification<T>(
  path: string,
  accessToken: string,
  params?: object,
  requireData = true
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await usrHttpClient.get<ApiResponse<T>>(path, {
    params,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    data: assertApiSuccess(response, requireData),
    message: response.message,
  };
}

async function postNotification<T>(
  path: string,
  accessToken: string,
  body: unknown = {},
  requireData = true
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await usrHttpClient.post<ApiResponse<T>>(
    path,
    body,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return {
    data: assertApiSuccess(response, requireData),
    message: response.message,
  };
}

function requireAccessToken(accessToken: string) {
  if (!accessToken) {
    throw new Error('Authentication credentials were not provided.');
  }
}

/** GET /notification/actor-notifications/last5 — USR-Ntf-1N1 */
export async function getLast5Notifications(
  payload: GetLast5NotificationsPayload
): Promise<NotificationItem[]> {
  if (isNotificationApiMocked()) {
    return withMockFallback(async () => {
      requireAccessToken(payload.accessToken);
      const { data } = await getNotification<ActorNotificationDto[]>(
        '/notification/actor-notifications/last5',
        payload.accessToken
      );
      return (data ?? []).map(mapActorNotification);
    }, mockGetLast5Notifications());
  }

  requireAccessToken(payload.accessToken);
  const { data } = await getNotification<ActorNotificationDto[]>(
    '/notification/actor-notifications/last5',
    payload.accessToken
  );
  return (data ?? []).map(mapActorNotification);
}

/** GET /notification/actor-notifications/list — USR-Ntf-1N2…1N5 */
export async function listNotifications(
  payload: ListNotificationsPayload
): Promise<NotificationListResult> {
  if (isNotificationApiMocked()) {
    return withMockFallback(async () => {
      requireAccessToken(payload.accessToken);
      const { data, message } = await getNotification<ActorNotificationListData>(
        '/notification/actor-notifications/list',
        payload.accessToken,
        toListNotificationsQuery(payload)
      );
      return mapNotificationList(data, message);
    }, mockListNotifications(payload));
  }

  requireAccessToken(payload.accessToken);
  const { data, message } = await getNotification<ActorNotificationListData>(
    '/notification/actor-notifications/list',
    payload.accessToken,
    toListNotificationsQuery(payload)
  );
  return mapNotificationList(data, message);
}

/** POST /notification/actor-notifications/{id}/read — USR-Ntf-1N6 / 1N8 */
export async function markNotificationAsRead(
  payload: MarkNotificationAsReadPayload
): Promise<MarkNotificationAsReadData> {
  const path = `/notification/actor-notifications/${payload.sentNotificationId}/read`;

  if (isNotificationApiMocked()) {
    return withMockFallback(async () => {
      requireAccessToken(payload.accessToken);
      const { data } = await postNotification<MarkNotificationAsReadData>(
        path,
        payload.accessToken
      );
      return data;
    }, mockMarkNotificationAsRead(payload.sentNotificationId));
  }

  requireAccessToken(payload.accessToken);
  const { data } = await postNotification<MarkNotificationAsReadData>(
    path,
    payload.accessToken
  );
  return data;
}

/** POST /notification/actor-notifications/read-all — USR-Ntf-1N9 */
export async function markAllNotificationsAsRead(
  payload: MarkAllNotificationsAsReadPayload
): Promise<void> {
  if (isNotificationApiMocked()) {
    return withMockFallback(async () => {
      requireAccessToken(payload.accessToken);
      await postNotification<Record<string, never>>(
        '/notification/actor-notifications/read-all',
        payload.accessToken,
        {},
        false
      );
    }, mockMarkAllNotificationsAsRead());
  }

  requireAccessToken(payload.accessToken);
  await postNotification<Record<string, never>>(
    '/notification/actor-notifications/read-all',
    payload.accessToken,
    {},
    false
  );
}

/** POST /notification/actor-notifications/read-last-5 — USR-Ntf-1N7 */
export async function markLast5NotificationsAsRead(
  payload: MarkLast5NotificationsAsReadPayload
): Promise<void> {
  if (isNotificationApiMocked()) {
    return withMockFallback(async () => {
      requireAccessToken(payload.accessToken);
      await postNotification<unknown>(
        '/notification/actor-notifications/read-last-5',
        payload.accessToken,
        {},
        false
      );
    }, mockMarkLast5NotificationsAsRead());
  }

  requireAccessToken(payload.accessToken);
  await postNotification<unknown>(
    '/notification/actor-notifications/read-last-5',
    payload.accessToken,
    {},
    false
  );
}

/** GET /notification/actor-notifications/unread-count */
export async function getUnreadCount(
  payload: GetUnreadCountPayload
): Promise<UnreadCounts> {
  if (isNotificationApiMocked()) {
    return withMockFallback(async () => {
      requireAccessToken(payload.accessToken);
      const { data } = await getNotification<UnreadCountData>(
        '/notification/actor-notifications/unread-count',
        payload.accessToken
      );
      return mapUnreadCounts(data);
    }, mockGetUnreadCount());
  }

  requireAccessToken(payload.accessToken);
  const { data } = await getNotification<UnreadCountData>(
    '/notification/actor-notifications/unread-count',
    payload.accessToken
  );
  return mapUnreadCounts(data);
}
