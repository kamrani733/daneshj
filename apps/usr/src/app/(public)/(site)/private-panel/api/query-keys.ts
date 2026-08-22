import type {
  ActorTypeName,
  ListServiceTitlesPayload,
  ProfileTabName,
} from '@private-panel/types/api';

export const privatePanelQueryKeys = {
  all: ['private-panel'] as const,
  profile: (actorId?: number | null) =>
    [...privatePanelQueryKeys.all, 'profile', actorId ?? 'owner'] as const,
};

export const actorQueryKeys = {
  all: ['actor'] as const,
  actorInfo: (actorType: ActorTypeName) =>
    [...actorQueryKeys.all, 'actor-info', actorType] as const,
  publicPanelStatus: (actorType: ActorTypeName, actorId?: number | null) =>
    [
      ...actorQueryKeys.all,
      'public-panel-status',
      actorType,
      actorId ?? 'owner',
    ] as const,
  privatePanelOwner: (actorId?: number | null) =>
    [...actorQueryKeys.all, 'private-panel', actorId ?? 'owner'] as const,
  publicPanelOwner: () =>
    [...actorQueryKeys.all, 'public-panel', 'owner'] as const,
  publicPanelAdmin: (actorId: number) =>
    [...actorQueryKeys.all, 'public-panel', 'admin', actorId] as const,
  manageVisibility: (actorId?: number | null) =>
    [...actorQueryKeys.all, 'manage-visibility', actorId ?? 'owner'] as const,
  publicPanelVisitor: (actorId: number) =>
    [...actorQueryKeys.all, 'public-panel', 'visitor', actorId] as const,
  publicPanelProfile: (actorId: number) =>
    [...actorQueryKeys.all, 'public-panel', 'profile', actorId] as const,
  publicTab: (tabName: ProfileTabName) =>
    [...actorQueryKeys.all, 'public-tab', tabName] as const,
  serviceTitles: (
    filters: Omit<ListServiceTitlesPayload, 'accessToken'>
  ) => [...actorQueryKeys.all, 'service-titles', filters] as const,
};
