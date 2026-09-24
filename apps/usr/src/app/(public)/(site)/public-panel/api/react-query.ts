'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { EMPTY_PUBLIC_PANEL } from '@public-panel/data/public-panel-ui';

import {
  followEntity,
  getAverageScore,
  getDislikees,
  getDislikers,
  getFollowers,
  getFollowings,
  getLikees,
  getLikers,
  reactToEntity,
  shareEntity,
  submitScore,
} from '@public-panel/api/interactive-ops';
import {
  isIndividualServiceProvider,
  mapVisitorPublicPanel,
} from '@public-panel/api/profile-mappers';
import {
  getPublicPanelStatusByAdmin,
  getPublicPanelStatusByOwner,
  requestPublicPanelChangeStatus,
} from '@public-panel/api/profiles-base';
import { retrieveBusinessPublicPanelForVisitor } from '@public-panel/api/profiles-business';
import { retrieveIndividualPublicPanelForVisitor } from '@public-panel/api/profiles-individual';
import {
  canFetchVisitorProfile,
  canQueryActor,
} from '@public-panel/api/actor-query';
import { retrieveUserPublicPanelForVisitor } from '@public-panel/api/profiles-user';
import {
  interactiveOpsQueryKeys,
  publicPanelActorQueryKeys,
} from '@public-panel/api/query-keys';
import type {
  GetPublicPanelStatusPayload,
  PublicPanelKind,
  RequestPublicPanelChangeStatusPayload,
} from '@public-panel/types/actor';
import type {
  ActorQueryPayload,
  FollowPayload,
  InteractiveActorType,
  InteractiveTargetType,
  LikePayload,
  PanelInteractiveStats,
  ScorePayload,
  SharePayload,
  TargetQueryPayload,
} from '@public-panel/types/api';
import { TARGET_TYPE } from '@public-panel/types/api';

function canQueryInteractiveOps() {
  return true;
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

  const people = {
    followers: followers.data?.people ?? [],
    following: followings.data?.people ?? [],
    likers: likers.data?.people ?? [],
    liked: likees.data?.people ?? [],
  };

  return {
    stats,
    people,
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
        queryKey: interactiveOpsQueryKeys.followings({
          actorId: variables.actorId,
          actorType: variables.actorType,
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

export function useDislikeesQuery(
  payload: Omit<ActorQueryPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: interactiveOpsQueryKeys.dislikees(filters),
    queryFn: () => getDislikees({ ...filters, accessToken }),
    enabled: enabled && canQueryInteractiveOps() && filters.actorId > 0,
  });
}

export function useAverageScoreQuery(
  payload: {
    accessToken?: string | null;
    targetId: number;
    targetType: ScorePayload['targetType'];
  },
  enabled = true
) {
  return useQuery({
    queryKey: interactiveOpsQueryKeys.averageScore(
      payload.targetId,
      payload.targetType
    ),
    queryFn: () =>
      getAverageScore({
        accessToken: payload.accessToken,
        targetId: payload.targetId,
        targetType: payload.targetType,
      }),
    enabled: enabled && canQueryInteractiveOps() && payload.targetId > 0,
  });
}

export function useScoreMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ScorePayload) => submitScore(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: interactiveOpsQueryKeys.averageScore(
          variables.targetId,
          variables.targetType
        ),
      });
    },
  });
}

function canFetchActor(accessToken: string | null | undefined) {
  return Boolean(accessToken) && canQueryActor();
}

async function fetchVisitorPublicPanel(
  accessToken: string | null | undefined,
  actorId: number,
  kind: PublicPanelKind
) {
  if (kind === 'business') {
    const businessData = await retrieveBusinessPublicPanelForVisitor({
      accessToken,
      actorId,
    });
    return mapVisitorPublicPanel(actorId, kind, undefined, undefined, businessData);
  }

  const userData = await retrieveUserPublicPanelForVisitor({
    accessToken,
    actorId,
  });
  const shouldLoadIndividual =
    kind === 'individual' || isIndividualServiceProvider(userData);
  const individualData = shouldLoadIndividual
    ? await retrieveIndividualPublicPanelForVisitor({
        accessToken,
        actorId,
      }).catch(() => null)
    : null;
  return mapVisitorPublicPanel(
    actorId,
    shouldLoadIndividual ? 'individual' : 'user',
    userData,
    individualData
  );
}

/** GET public retrieve-for-visitor — Usr-Prf-6N1 / 6N2 */
export function usePublicPanelProfileQuery(
  accessToken: string | null | undefined,
  actorId: number | null | undefined,
  kind: PublicPanelKind = 'user'
) {
  const targetId = actorId ?? 0;
  return useQuery({
    queryKey: publicPanelActorQueryKeys.profile(targetId, kind),
    queryFn: () => fetchVisitorPublicPanel(accessToken, targetId, kind),
    enabled: canFetchVisitorProfile(targetId),
    staleTime: 60_000,
    placeholderData: EMPTY_PUBLIC_PANEL,
  });
}

export function usePublicPanelVisitorQuery(
  accessToken: string | null | undefined,
  actorId: number | null | undefined,
  kind: PublicPanelKind = 'user',
  enabled = true
) {
  const targetId = actorId ?? 0;
  return useQuery({
    queryKey: publicPanelActorQueryKeys.visitor(targetId, kind),
    queryFn: () => fetchVisitorPublicPanel(accessToken, targetId, kind),
    enabled: enabled && canFetchVisitorProfile(targetId),
  });
}

export function usePublicPanelStatusQuery(
  payload: Omit<GetPublicPanelStatusPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  return useQuery({
    queryKey: publicPanelActorQueryKeys.status(
      payload.actorType,
      payload.actorId
    ),
    queryFn: () =>
      payload.actorId
        ? getPublicPanelStatusByAdmin({
            accessToken: payload.accessToken,
            actorType: payload.actorType,
            actorId: payload.actorId,
          })
        : getPublicPanelStatusByOwner({
            accessToken: payload.accessToken,
            actorType: payload.actorType,
          }),
    enabled: enabled && canFetchActor(payload.accessToken),
  });
}

export function useRequestPublicPanelChangeStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestPublicPanelChangeStatusPayload) =>
      requestPublicPanelChangeStatus(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: publicPanelActorQueryKeys.status(
          variables.actorType,
          variables.actorId
        ),
      });
    },
  });
}
