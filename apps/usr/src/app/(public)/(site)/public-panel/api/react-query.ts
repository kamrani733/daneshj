'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  followEntity,
  getDislikers,
  getFollowers,
  getFollowings,
  getLikees,
  getLikers,
  reactToEntity,
  shareEntity,
} from './interactive-ops';
import { interactiveOpsQueryKeys } from './query-keys';
import type {
  ActorQueryPayload,
  FollowPayload,
  InteractiveActorType,
  InteractiveTargetType,
  LikePayload,
  PanelInteractiveStats,
  SharePayload,
  TargetQueryPayload,
} from './types';
import { TARGET_TYPE } from './types';

function canQueryInteractiveOps() {
  return Boolean(process.env.NEXT_PUBLIC_INTERACTIVE_OPS_API_URL);
}

export function useFollowersQuery(
  payload: Omit<TargetQueryPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: interactiveOpsQueryKeys.followers(filters),
    queryFn: () => getFollowers({ ...filters, accessToken }),
    enabled: enabled && canQueryInteractiveOps() && filters.targetId > 0,
  });
}

export function useFollowingsQuery(
  payload: Omit<ActorQueryPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: interactiveOpsQueryKeys.followings(filters),
    queryFn: () => getFollowings({ ...filters, accessToken }),
    enabled: enabled && canQueryInteractiveOps() && filters.actorId > 0,
  });
}

export function useLikersQuery(
  payload: Omit<TargetQueryPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: interactiveOpsQueryKeys.likers(filters),
    queryFn: () => getLikers({ ...filters, accessToken }),
    enabled: enabled && canQueryInteractiveOps() && filters.targetId > 0,
  });
}

export function useLikeesQuery(
  payload: Omit<ActorQueryPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: interactiveOpsQueryKeys.likees(filters),
    queryFn: () => getLikees({ ...filters, accessToken }),
    enabled: enabled && canQueryInteractiveOps() && filters.actorId > 0,
  });
}

export function useDislikersQuery(
  payload: Omit<TargetQueryPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: interactiveOpsQueryKeys.dislikers(filters),
    queryFn: () => getDislikers({ ...filters, accessToken }),
    enabled: enabled && canQueryInteractiveOps() && filters.targetId > 0,
  });
}

/** Aggregate follow/like counts for a public-panel owner. */
export function usePanelInteractiveStatsQuery(
  payload: {
    accessToken?: string | null;
    targetId: number;
    targetType?: InteractiveTargetType;
    actorType?: InteractiveActorType;
  },
  enabled = true,
  fallback?: PanelInteractiveStats
) {
  const targetType = payload.targetType ?? TARGET_TYPE.user;
  const actorType = payload.actorType ?? (targetType as InteractiveActorType);
  const canRun =
    enabled && canQueryInteractiveOps() && payload.targetId > 0;

  const followers = useFollowersQuery(
    {
      accessToken: payload.accessToken,
      targetId: payload.targetId,
      targetType: targetType as TargetQueryPayload['targetType'],
    },
    canRun
  );
  const followings = useFollowingsQuery(
    {
      accessToken: payload.accessToken,
      actorId: payload.targetId,
      actorType,
    },
    canRun
  );
  const likers = useLikersQuery(
    {
      accessToken: payload.accessToken,
      targetId: payload.targetId,
      targetType: targetType as TargetQueryPayload['targetType'],
    },
    canRun
  );
  const likees = useLikeesQuery(
    {
      accessToken: payload.accessToken,
      actorId: payload.targetId,
      actorType,
    },
    canRun
  );
  const dislikers = useDislikersQuery(
    {
      accessToken: payload.accessToken,
      targetId: payload.targetId,
      targetType: targetType as TargetQueryPayload['targetType'],
    },
    canRun
  );

  const isLoading =
    canRun &&
    (followers.isLoading ||
      followings.isLoading ||
      likers.isLoading ||
      likees.isLoading ||
      dislikers.isLoading);

  const stats: PanelInteractiveStats = {
    followers: followers.data?.count ?? fallback?.followers ?? 0,
    following: followings.data?.count ?? fallback?.following ?? 0,
    likers: likers.data?.count ?? fallback?.likers ?? 0,
    liked: likees.data?.count ?? fallback?.liked ?? 0,
    thumbsUp: likers.data?.count ?? fallback?.thumbsUp ?? 0,
    thumbsDown: dislikers.data?.count ?? fallback?.thumbsDown ?? 0,
  };

  return {
    stats,
    isLoading,
    refetchAll: async () => {
      await Promise.all([
        followers.refetch(),
        followings.refetch(),
        likers.refetch(),
        likees.refetch(),
        dislikers.refetch(),
      ]);
    },
  };
}

export function useFollowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FollowPayload) => followEntity(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: interactiveOpsQueryKeys.followers({
          targetId: variables.targetId,
          targetType: variables.targetType,
        }),
      });
      void queryClient.invalidateQueries({
        queryKey: interactiveOpsQueryKeys.panelStats(
          variables.targetId,
          variables.targetType
        ),
      });
    },
  });
}

export function useLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LikePayload) => reactToEntity(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: interactiveOpsQueryKeys.likers({
          targetId: variables.targetId,
          targetType: variables.targetType as TargetQueryPayload['targetType'],
        }),
      });
      void queryClient.invalidateQueries({
        queryKey: interactiveOpsQueryKeys.dislikers({
          targetId: variables.targetId,
          targetType: variables.targetType as TargetQueryPayload['targetType'],
        }),
      });
      void queryClient.invalidateQueries({
        queryKey: interactiveOpsQueryKeys.panelStats(
          variables.targetId,
          variables.targetType
        ),
      });
    },
  });
}

export function useShareMutation() {
  return useMutation({
    mutationFn: (payload: SharePayload) => shareEntity(payload),
  });
}
