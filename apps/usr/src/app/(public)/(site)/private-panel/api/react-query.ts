'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { EMPTY_PUBLIC_PANEL } from '@public-panel/data/public-panel-ui';
import type { PrivatePanelProfile } from '@private-panel/data/private-panel-ui';

import {
  mapAcademicRecords,
  mapPrivatePanelProfile,
  mapPublicPanelProfile,
  mapVisibilityFields,
} from './mappers';
import {
  changePublicPanelStatusByAdmin,
  getActorInfo,
  getPublicPanelStatusByAdmin,
  getPublicPanelStatusByOwner,
  requestPublicPanelChangeStatus,
} from './profiles-base';
import {
  retrievePrivatePanelForAdmin,
  retrievePrivatePanelForOwner,
  retrievePublicPanelForAdmin,
  retrievePublicPanelForOwner,
  retrievePublicPanelForVisitor,
  reviewPrivateChangesByAdmin,
  reviewPrivateChangesByOwner,
  reviewPrivateStateByAdmin,
  reviewPrivateStateByOwner,
  submitPrivateStateByAdmin,
  submitPrivateStateByOwner,
  submitPrivateTabByAdmin,
  submitPrivateTabByOwner,
  submitPublicTabByOwner,
} from './profiles-user';
import { actorQueryKeys, privatePanelQueryKeys } from './query-keys';
import { listServiceTitlesToAll } from './service-titles';
import type {
  ActorTypeName,
  GetActorInfoPayload,
  GetPublicPanelStatusByOwnerPayload,
  ListServiceTitlesPayload,
  RequestPublicPanelChangeStatusPayload,
  RetrievePublicPanelForVisitorPayload,
  ReviewPrivateChangesByOwnerPayload,
  ReviewPrivateStateByOwnerPayload,
  SubmitPrivateStateByOwnerPayload,
  SubmitPrivateTabByOwnerPayload,
  SubmitPublicTabByOwnerPayload,
} from '../types/api';
import { ACTOR_TYPE_NAME } from '../types/api';

type AdminTargetPayload = {
  actorId?: number | null;
};

type SubmitPrivateTabPayload = SubmitPrivateTabByOwnerPayload &
  AdminTargetPayload;

type SubmitPrivateStatePayload = SubmitPrivateStateByOwnerPayload &
  AdminTargetPayload;

type ReviewPrivateChangesPayload = ReviewPrivateChangesByOwnerPayload &
  AdminTargetPayload;

type ReviewPrivateStatePayload = ReviewPrivateStateByOwnerPayload &
  AdminTargetPayload;

function canQueryActor() {
  return Boolean(process.env.NEXT_PUBLIC_ACTOR_API_URL);
}

function canFetch(accessToken: string | null | undefined) {
  return Boolean(accessToken) && canQueryActor();
}

const EMPTY_PROFILE: PrivatePanelProfile = {
  displayName: '',
  username: '',
  roleLabelKey: 'normal',
  location: '',
  bio: '',
  avatarSrc: '',
  electronicCardHref: '#',
  socialLinks: [],
};

function temporaryAdminProfile(actorId: number): PrivatePanelProfile {
  return {
    ...EMPTY_PROFILE,
    displayName: `کاربر ${actorId}`,
    username: `user-${actorId}`,
  };
}

async function fetchPrivatePanelProfile(
  accessToken: string,
  actorId?: number | null
): Promise<PrivatePanelProfile> {
  if (actorId) {
    const privateData = await retrievePrivatePanelForAdmin({
      accessToken,
      actorId,
    });
    const profile = mapPrivatePanelProfile(undefined, privateData);
    return profile.displayName || profile.username
      ? profile
      : temporaryAdminProfile(actorId);
  }

  const [actorInfoResult, privateData] = await Promise.all([
    getActorInfo({
      accessToken,
      actorType: ACTOR_TYPE_NAME.user,
    }).catch(() => undefined),
    retrievePrivatePanelForOwner({ accessToken }),
  ]);
  return mapPrivatePanelProfile(actorInfoResult, privateData);
}

export function usePrivatePanelProfileQuery(
  accessToken: string | null | undefined,
  actorId?: number | null
) {
  return useQuery({
    queryKey: privatePanelQueryKeys.profile(actorId),
    queryFn: () => fetchPrivatePanelProfile(accessToken ?? '', actorId),
    enabled: canFetch(accessToken),
    staleTime: 60_000,
    placeholderData: actorId ? temporaryAdminProfile(actorId) : EMPTY_PROFILE,
  });
}

export function useActorInfoQuery(
  payload: Omit<GetActorInfoPayload, 'accessToken' | 'actorType'> & {
    accessToken?: string | null;
    actorType?: ActorTypeName;
  },
  enabled = true
) {
  const actorType = payload.actorType ?? ACTOR_TYPE_NAME.user;
  return useQuery({
    queryKey: actorQueryKeys.actorInfo(actorType),
    queryFn: () =>
      getActorInfo({
        accessToken: payload.accessToken,
        actorType,
      }),
    enabled: enabled && canFetch(payload.accessToken),
  });
}

export function usePublicPanelStatusByOwnerQuery(
  payload: Omit<GetPublicPanelStatusByOwnerPayload, 'accessToken' | 'actorType'> & {
    accessToken?: string | null;
    actorType?: ActorTypeName;
  },
  enabled = true
) {
  const actorType = payload.actorType ?? ACTOR_TYPE_NAME.user;
  return useQuery({
    queryKey: actorQueryKeys.publicPanelStatus(actorType, payload.actorId),
    queryFn: () =>
      payload.actorId
        ? getPublicPanelStatusByAdmin({
            accessToken: payload.accessToken,
            actorType,
            actorId: payload.actorId,
          })
        : getPublicPanelStatusByOwner({
            accessToken: payload.accessToken,
            actorType,
          }),
    enabled: enabled && canFetch(payload.accessToken),
  });
}

export function usePrivatePanelForOwnerQuery(
  accessToken: string | null | undefined,
  actorId?: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: actorQueryKeys.privatePanelOwner(actorId),
    queryFn: () =>
      actorId
        ? retrievePrivatePanelForAdmin({ accessToken, actorId })
        : retrievePrivatePanelForOwner({ accessToken }),
    enabled: enabled && canFetch(accessToken),
  });
}

export function usePublicPanelForOwnerQuery(
  accessToken: string | null | undefined,
  actorId?: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: actorId
      ? actorQueryKeys.publicPanelAdmin(actorId)
      : actorQueryKeys.publicPanelOwner(),
    queryFn: () =>
      actorId
        ? retrievePublicPanelForAdmin({ accessToken, actorId })
        : retrievePublicPanelForOwner({ accessToken }),
    enabled: enabled && canFetch(accessToken),
  });
}

const EMPTY_MANAGE_VISIBILITY = {
  fields: mapVisibilityFields(null, null),
  records: [] as ReturnType<typeof mapAcademicRecords>,
  privateData: {} as Record<string, unknown>,
  publicFlags: {} as Record<string, unknown>,
};

export function useManageVisibilityQuery(
  accessToken: string | null | undefined,
  actorId?: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: actorQueryKeys.manageVisibility(actorId),
    queryFn: async () => {
      const [privateData, publicPanelStatus] = await Promise.all([
        actorId
          ? retrievePrivatePanelForAdmin({ accessToken, actorId })
          : retrievePrivatePanelForOwner({ accessToken }),
        actorId
          ? getPublicPanelStatusByAdmin({
              accessToken,
              actorType: ACTOR_TYPE_NAME.user,
              actorId,
            })
          : getPublicPanelStatusByOwner({
              accessToken,
              actorType: ACTOR_TYPE_NAME.user,
            }),
      ]);
      const publicFlags = publicPanelStatus.isPublicPanelActive
        ? await (actorId
            ? retrievePublicPanelForAdmin({ accessToken, actorId })
            : retrievePublicPanelForOwner({ accessToken }))
        : {};
      return {
        fields: mapVisibilityFields(privateData, publicFlags),
        records: mapAcademicRecords(privateData),
        privateData,
        publicFlags,
      };
    },
    enabled: enabled && canFetch(accessToken),
    placeholderData: EMPTY_MANAGE_VISIBILITY,
  });
}

export function usePublicPanelForVisitorQuery(
  payload: Omit<RetrievePublicPanelForVisitorPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  return useQuery({
    queryKey: actorQueryKeys.publicPanelVisitor(payload.actorId),
    queryFn: () =>
      retrievePublicPanelForVisitor({
        accessToken: payload.accessToken,
        actorId: payload.actorId,
      }),
    enabled: enabled && canFetch(payload.accessToken) && payload.actorId > 0,
  });
}

export function usePublicPanelProfileQuery(
  accessToken: string | null | undefined,
  actorId: number | null | undefined
) {
  const targetId = actorId ?? 0;
  return useQuery({
    queryKey: actorQueryKeys.publicPanelProfile(targetId),
    queryFn: async () => {
      const publicData = await retrievePublicPanelForVisitor({
        accessToken,
        actorId: targetId,
      });
      return mapPublicPanelProfile(targetId, publicData);
    },
    enabled: canFetch(accessToken) && targetId > 0,
    staleTime: 60_000,
    placeholderData: EMPTY_PUBLIC_PANEL,
  });
}

export function useServiceTitlesQuery(
  payload: Omit<ListServiceTitlesPayload, 'accessToken'> & {
    accessToken?: string | null;
  },
  enabled = true
) {
  const { accessToken, ...filters } = payload;
  return useQuery({
    queryKey: actorQueryKeys.serviceTitles(filters),
    queryFn: () => listServiceTitlesToAll({ ...filters, accessToken }),
    enabled: enabled && canFetch(accessToken),
  });
}

export function useRequestPublicPanelChangeStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestPublicPanelChangeStatusPayload) =>
      payload.actorId
        ? changePublicPanelStatusByAdmin({
            accessToken: payload.accessToken,
            actorType: payload.actorType,
            action: payload.action,
            actorId: payload.actorId,
          })
        : requestPublicPanelChangeStatus(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: actorQueryKeys.publicPanelStatus(
          variables.actorType,
          variables.actorId
        ),
      });
    },
  });
}

export function useSubmitPrivateTabByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitPrivateTabPayload) =>
      payload.actorId
        ? submitPrivateTabByAdmin({
            accessToken: payload.accessToken,
            actorId: payload.actorId,
            tabName: payload.tabName,
            body: payload.body,
          })
        : submitPrivateTabByOwner(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: actorQueryKeys.privatePanelOwner(variables.actorId),
      });
      void queryClient.invalidateQueries({
        queryKey: actorQueryKeys.manageVisibility(variables.actorId),
      });
      void queryClient.invalidateQueries({
        queryKey: privatePanelQueryKeys.profile(variables.actorId),
      });
      void queryClient.invalidateQueries({
        queryKey: [...actorQueryKeys.all, 'public-panel'],
      });
    },
  });
}

export function useSubmitPrivateStateByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitPrivateStatePayload) =>
      payload.actorId
        ? submitPrivateStateByAdmin({
            accessToken: payload.accessToken,
            actorId: payload.actorId,
            action: payload.action,
            tabName: payload.tabName,
            sectionName: payload.sectionName,
            objectId: payload.objectId,
          })
        : submitPrivateStateByOwner(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: actorQueryKeys.privatePanelOwner(variables.actorId),
      });
    },
  });
}

export function useReviewPrivateChangesByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewPrivateChangesPayload) =>
      payload.actorId
        ? reviewPrivateChangesByAdmin({
            accessToken: payload.accessToken,
            actorId: payload.actorId,
            confirmedRequests: payload.confirmedRequests,
            rejectedRequests: payload.rejectedRequests,
          })
        : reviewPrivateChangesByOwner(payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: actorQueryKeys.privatePanelOwner(variables.actorId),
        }),
        queryClient.invalidateQueries({
          queryKey: actorQueryKeys.manageVisibility(variables.actorId),
        }),
        queryClient.invalidateQueries({
          queryKey: privatePanelQueryKeys.profile(variables.actorId),
        }),
      ]);
    },
  });
}

export function useReviewPrivateStateByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewPrivateStatePayload) =>
      payload.actorId
        ? reviewPrivateStateByAdmin({
            accessToken: payload.accessToken,
            actorId: payload.actorId,
            confirmedRequests: payload.confirmedRequests,
            rejectedRequests: payload.rejectedRequests,
          })
        : reviewPrivateStateByOwner(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: actorQueryKeys.privatePanelOwner(variables.actorId),
      });
    },
  });
}

export function useSubmitPublicTabByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitPublicTabByOwnerPayload) =>
      submitPublicTabByOwner(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: actorQueryKeys.publicPanelOwner(),
      });
      void queryClient.invalidateQueries({
        queryKey: actorQueryKeys.publicTab(variables.tabName),
      });
      void queryClient.invalidateQueries({
        queryKey: actorQueryKeys.manageVisibility(),
      });
      void queryClient.invalidateQueries({
        queryKey: [...actorQueryKeys.all, 'public-panel'],
      });
    },
  });
}
