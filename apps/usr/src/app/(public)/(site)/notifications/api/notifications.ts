import { notificationHttpClient } from '@/shared/api/notification-http';

import { formatApiResponseError } from './errors';
import {
  isNotificationApiMocked,
  mockApplyActorSetting,
  mockGetActorSettings,
  mockGetChartsReport,
  mockGetDetailedStatusReport,
  mockGetLast5Notifications,
  mockGetUnreadCount,
  mockListNotifications,
  mockMarkAllNotificationsAsRead,
  mockMarkLast5NotificationsAsRead,
  mockMarkNotificationAsRead,
} from './mock';
import {
  mapActorNotification,
  mapActorSettingsList,
  mapChartsReport,
  mapDetailedStatusReportList,
  mapNotificationList,
  mapUnreadCounts,
  toChartsReportQuery,
  toDetailedStatusReportQuery,
  toListNotificationsQuery,
} from './transformers';
import type {
  ActorNotificationDto,
  ActorNotificationListData,
  ActorSettingItem,
  ActorSettingsDto,
  ApiResponse,
  ApplyActorSettingPayload,
  ApplyActorSettingsPayload,
  ChartsReportResult,
  DetailedStatusReportListData,
  DetailedStatusReportResult,
  GetActorSettingsPayload,
  GetChartsReportPayload,
  GetDetailedStatusReportPayload,
  GetLast5NotificationsPayload,
  GetUnreadCountPayload,
  ListNotificationsPayload,
  MarkAllNotificationsAsReadPayload,
  MarkLast5NotificationsAsReadPayload,
  MarkNotificationAsReadData,
  MarkNotificationAsReadPayload,
  NotificationChartsDataDto,
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
  const { data: response } = await notificationHttpClient.get<ApiResponse<T>>(
    path,
    {
      params,
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
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
  const { data: response } = await notificationHttpClient.post<ApiResponse<T>>(
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
    return mockGetLast5Notifications();
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
    return mockListNotifications(payload);
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
  if (isNotificationApiMocked()) {
    return mockMarkNotificationAsRead(payload.sentNotificationId);
  }

  requireAccessToken(payload.accessToken);
  const { data } = await postNotification<MarkNotificationAsReadData>(
    `/notification/actor-notifications/${payload.sentNotificationId}/read`,
    payload.accessToken
  );
  return data;
}

/** POST /notification/actor-notifications/read-all — USR-Ntf-1N9 */
export async function markAllNotificationsAsRead(
  payload: MarkAllNotificationsAsReadPayload
): Promise<void> {
  if (isNotificationApiMocked()) {
    return mockMarkAllNotificationsAsRead();
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
    return mockMarkLast5NotificationsAsRead();
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
    return mockGetUnreadCount();
  }

  requireAccessToken(payload.accessToken);
  const { data } = await getNotification<UnreadCountData>(
    '/notification/actor-notifications/unread-count',
    payload.accessToken
  );
  return mapUnreadCounts(data);
}

/** GET /notification/report/detailed_status_report — Usr-Ntf-6N5 */
export async function getDetailedStatusReport(
  payload: GetDetailedStatusReportPayload
): Promise<DetailedStatusReportResult> {
  if (isNotificationApiMocked()) {
    return mockGetDetailedStatusReport(payload);
  }

  requireAccessToken(payload.accessToken);
  const { data, message } = await getNotification<DetailedStatusReportListData>(
    '/notification/report/detailed_status_report',
    payload.accessToken,
    toDetailedStatusReportQuery(payload)
  );
  return mapDetailedStatusReportList(data, message);
}

/** GET /notification/report/charts_report — Adm-Ntf-6N11 */
export async function getChartsReport(
  payload: GetChartsReportPayload
): Promise<ChartsReportResult> {
  if (isNotificationApiMocked()) {
    return mockGetChartsReport(payload);
  }

  requireAccessToken(payload.accessToken);
  const { data, message } = await getNotification<NotificationChartsDataDto>(
    '/notification/report/charts_report',
    payload.accessToken,
    toChartsReportQuery(payload)
  );
  return mapChartsReport(data, message);
}

/**
 * GET /notification/actor-settings/list
 * OpenAPI tags Admin; used to hydrate actor channel prefs when available.
 */
export async function getActorSettings(
  payload: GetActorSettingsPayload
): Promise<ActorSettingItem[]> {
  if (isNotificationApiMocked()) {
    return mockGetActorSettings();
  }

  requireAccessToken(payload.accessToken);
  const { data: response } = await notificationHttpClient.get<
    ApiResponse<ActorSettingsDto[]> | ActorSettingsDto[]
  >('/notification/actor-settings/list', {
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  });

  if (Array.isArray(response)) {
    return mapActorSettingsList(response);
  }

  return mapActorSettingsList(assertApiSuccess(response, false) ?? []);
}

/** POST /notification/actor-settings/create — USR-Ntf-5N2 */
export async function applyActorSetting(
  payload: ApplyActorSettingPayload
): Promise<ActorSettingItem | null> {
  if (isNotificationApiMocked()) {
    return mockApplyActorSetting(payload);
  }

  requireAccessToken(payload.accessToken);
  const { data } = await postNotification<ActorSettingsDto[] | ActorSettingsDto>(
    '/notification/actor-settings/create',
    payload.accessToken,
    {
      category: payload.categoryId,
      channels: payload.channels,
    },
    false
  );

  if (Array.isArray(data)) {
    return mapActorSettingsList(data)[0] ?? null;
  }
  if (data && typeof data === 'object' && 'category' in data) {
    return mapActorSettingsList([data])[0] ?? null;
  }
  return null;
}

/** Apply many category settings sequentially (one POST per category). */
export async function applyActorSettings(
  payload: ApplyActorSettingsPayload
): Promise<void> {
  for (const setting of payload.settings) {
    await applyActorSetting({
      accessToken: payload.accessToken,
      categoryId: setting.categoryId,
      channels: setting.channels,
    });
  }
}
