import type {
  GetChartsReportPayload,
  GetDetailedStatusReportPayload,
  GetStatisticsReportPayload,
  ListNotificationsPayload,
} from './types';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  last5: () => [...notificationQueryKeys.all, 'last5'] as const,
  list: (filters: Omit<ListNotificationsPayload, 'accessToken'>) =>
    [...notificationQueryKeys.all, 'list', filters] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unread-count'] as const,
  detailedStatusReport: (
    filters: Omit<GetDetailedStatusReportPayload, 'accessToken'>
  ) => [...notificationQueryKeys.all, 'detailed-status-report', filters] as const,
  chartsReport: (filters: Omit<GetChartsReportPayload, 'accessToken'>) =>
    [...notificationQueryKeys.all, 'charts-report', filters] as const,
  statisticsReport: (
    filters: Omit<GetStatisticsReportPayload, 'accessToken'>
  ) => [...notificationQueryKeys.all, 'statistics-report', filters] as const,
  actorSettings: () => [...notificationQueryKeys.all, 'actor-settings'] as const,
};
