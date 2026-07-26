import type { ListNotificationsPayload } from './types';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  last5: () => [...notificationQueryKeys.all, 'last5'] as const,
  list: (filters: Omit<ListNotificationsPayload, 'accessToken'>) =>
    [...notificationQueryKeys.all, 'list', filters] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unread-count'] as const,
};
