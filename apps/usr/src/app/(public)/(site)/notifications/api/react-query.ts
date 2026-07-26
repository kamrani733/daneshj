'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { isNotificationApiMocked } from './mock';
import {
  getDetailedStatusReport,
  getLast5Notifications,
  getUnreadCount,
  listNotifications,
  markAllNotificationsAsRead,
  markLast5NotificationsAsRead,
  markNotificationAsRead,
} from './notifications';
import { notificationQueryKeys } from './query-keys';
import type {
  GetDetailedStatusReportPayload,
  ListNotificationsPayload,
} from './types';

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

export function useNotificationsListInfiniteQuery(
  payload: Omit<ListNotificationsPayload, 'accessToken' | 'page'> & {
    accessToken: string | null | undefined;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useInfiniteQuery({
    queryKey: notificationQueryKeys.list(filters),
    queryFn: ({ pageParam }) =>
      listNotifications({
        ...filters,
        page: pageParam,
        accessToken: accessToken ?? '',
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.currentPage < last.totalPages ? last.currentPage + 1 : undefined,
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

export function useDetailedStatusReportQuery(
  payload: Omit<GetDetailedStatusReportPayload, 'accessToken'> & {
    accessToken: string | null | undefined;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: notificationQueryKeys.detailedStatusReport(filters),
    queryFn: () =>
      getDetailedStatusReport({ ...filters, accessToken: accessToken ?? '' }),
    enabled: enabled && canFetch(accessToken),
  });
}
