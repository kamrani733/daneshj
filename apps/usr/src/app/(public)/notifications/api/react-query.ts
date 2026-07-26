'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { isNotificationApiMocked } from './mock';
import {
  getLast5Notifications,
  getUnreadCount,
  listNotifications,
  markAllNotificationsAsRead,
  markLast5NotificationsAsRead,
  markNotificationAsRead,
} from './notifications';
import { notificationQueryKeys } from './query-keys';
import type { ListNotificationsPayload } from './types';

function canFetch(accessToken: string | null | undefined) {
  return !!accessToken || isNotificationApiMocked();
}

export function useLast5NotificationsQuery(
  accessToken: string | null | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: notificationQueryKeys.last5(),
    queryFn: () =>
      getLast5Notifications({ accessToken: accessToken ?? '' }),
    enabled: enabled && canFetch(accessToken),
  });
}

export function useNotificationsListQuery(
  payload: Omit<ListNotificationsPayload, 'accessToken'> & {
    accessToken: string | null | undefined;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: notificationQueryKeys.list(filters),
    queryFn: () =>
      listNotifications({ ...filters, accessToken: accessToken ?? '' }),
    enabled: enabled && canFetch(accessToken),
  });
}

export function useUnreadCountQuery(
  accessToken: string | null | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: () => getUnreadCount({ accessToken: accessToken ?? '' }),
    enabled: enabled && canFetch(accessToken),
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export function useMarkLast5NotificationsAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markLast5NotificationsAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}
