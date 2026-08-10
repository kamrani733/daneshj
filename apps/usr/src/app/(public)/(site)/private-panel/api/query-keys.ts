import type {
  ActorTypeName,
  ListServiceTitlesPayload,
  ProfileTabName,
} from './types';

export const privatePanelQueryKeys = {
  all: ['private-panel'] as const,
  profile: () => [...privatePanelQueryKeys.all, 'profile'] as const,
};

export const actorQueryKeys = {
  all: ['actor'] as const,
  actorInfo: (actorType: ActorTypeName) =>
    [...actorQueryKeys.all, 'actor-info', actorType] as const,
  publicPanelStatus: (actorType: ActorTypeName) =>
    [...actorQueryKeys.all, 'public-panel-status', actorType] as const,
  privatePanelOwner: () =>
    [...actorQueryKeys.all, 'private-panel', 'owner'] as const,
  publicPanelOwner: () =>
    [...actorQueryKeys.all, 'public-panel', 'owner'] as const,
  publicPanelVisitor: (actorId: number) =>
    [...actorQueryKeys.all, 'public-panel', 'visitor', actorId] as const,
  publicTab: (tabName: ProfileTabName) =>
    [...actorQueryKeys.all, 'public-tab', tabName] as const,
  serviceTitles: (
    filters: Omit<ListServiceTitlesPayload, 'accessToken'>
  ) => [...actorQueryKeys.all, 'service-titles', filters] as const,
};
