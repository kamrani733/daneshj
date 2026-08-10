'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PrivatePanelProfile } from '@private-panel/data/private-panel-ui';

import {
  mapAcademicRecords,
  mapPrivatePanelProfile,
  mapVisibilityFields,
} from './mappers';
import {
  getActorInfo,
  getPublicPanelStatusByOwner,
  requestPublicPanelChangeStatus,
} from './profiles-base';
import {
  retrievePrivatePanelForOwner,
  retrievePublicPanelForOwner,
  retrievePublicPanelForVisitor,
  reviewPrivateChangesByOwner,
  reviewPrivateStateByOwner,
  submitPrivateStateByOwner,
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
} from './types';
import { ACTOR_TYPE_NAME } from './types';

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

async function fetchPrivatePanelProfile(
  accessToken: string
): Promise<PrivatePanelProfile> {
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
  accessToken: string | null | undefined
) {
  return useQuery({
    queryKey: privatePanelQueryKeys.profile(),
    queryFn: () => fetchPrivatePanelProfile(accessToken ?? ''),
    enabled: canFetch(accessToken),
    staleTime: 60_000,
    placeholderData: EMPTY_PROFILE,
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
    queryKey: actorQueryKeys.publicPanelStatus(actorType),
    queryFn: () =>
      getPublicPanelStatusByOwner({
        accessToken: payload.accessToken,
        actorType,
      }),
    enabled: enabled && canFetch(payload.accessToken),
  });
}

export function usePrivatePanelForOwnerQuery(
  accessToken: string | null | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: actorQueryKeys.privatePanelOwner(),
    queryFn: () => retrievePrivatePanelForOwner({ accessToken }),
    enabled: enabled && canFetch(accessToken),
  });
}

export function usePublicPanelForOwnerQuery(
  accessToken: string | null | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: actorQueryKeys.publicPanelOwner(),
    queryFn: () => retrievePublicPanelForOwner({ accessToken }),
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
  enabled = true
) {
  return useQuery({
    queryKey: [...actorQueryKeys.all, 'manage-visibility'] as const,
    queryFn: async () => {
      const [privateData, publicFlags] = await Promise.all([
        retrievePrivatePanelForOwner({ accessToken }),
        retrievePublicPanelForOwner({ accessToken }),
      ]);
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
      requestPublicPanelChangeStatus(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: actorQueryKeys.publicPanelStatus(variables.actorType),
      });
    },
  });
}

export function useSubmitPrivateTabByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitPrivateTabByOwnerPayload) =>
      submitPrivateTabByOwner(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: actorQueryKeys.privatePanelOwner(),
      });
      void queryClient.invalidateQueries({
        queryKey: [...actorQueryKeys.all, 'manage-visibility'],
      });
      void queryClient.invalidateQueries({
        queryKey: privatePanelQueryKeys.profile(),
      });
    },
  });
}

export function useSubmitPrivateStateByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitPrivateStateByOwnerPayload) =>
      submitPrivateStateByOwner(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: actorQueryKeys.privatePanelOwner(),
      });
    },
  });
}

export function useReviewPrivateChangesByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewPrivateChangesByOwnerPayload) =>
      reviewPrivateChangesByOwner(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: actorQueryKeys.privatePanelOwner(),
        }),
        queryClient.invalidateQueries({
          queryKey: [...actorQueryKeys.all, 'manage-visibility'],
        }),
        queryClient.invalidateQueries({
          queryKey: privatePanelQueryKeys.profile(),
        }),
      ]);
    },
  });
}

export function useReviewPrivateStateByOwnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewPrivateStateByOwnerPayload) =>
      reviewPrivateStateByOwner(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: actorQueryKeys.privatePanelOwner(),
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
        queryKey: [...actorQueryKeys.all, 'manage-visibility'],
      });
    },
  });
}
