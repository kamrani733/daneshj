import type { PublicPanelKind } from '@public-panel/types/actor';
import type {
  ActorQueryPayload,
  TargetQueryPayload,
} from '@public-panel/types/api';

export const interactiveOpsQueryKeys = {
  all: ['interactive-ops'] as const,
  demoSegment: (demoMode: boolean) => (demoMode ? 'demo' : 'live'),
  followers: (filters: Omit<TargetQueryPayload, 'accessToken'>, demoMode = false) =>
    [...interactiveOpsQueryKeys.all, 'followers', filters, interactiveOpsQueryKeys.demoSegment(demoMode)] as const,
  followings: (filters: Omit<ActorQueryPayload, 'accessToken'>, demoMode = false) =>
    [...interactiveOpsQueryKeys.all, 'followings', filters, interactiveOpsQueryKeys.demoSegment(demoMode)] as const,
  likers: (filters: Omit<TargetQueryPayload, 'accessToken'>, demoMode = false) =>
    [...interactiveOpsQueryKeys.all, 'likers', filters, interactiveOpsQueryKeys.demoSegment(demoMode)] as const,
  likees: (filters: Omit<ActorQueryPayload, 'accessToken'>, demoMode = false) =>
    [...interactiveOpsQueryKeys.all, 'likees', filters, interactiveOpsQueryKeys.demoSegment(demoMode)] as const,
  dislikers: (filters: Omit<TargetQueryPayload, 'accessToken'>, demoMode = false) =>
    [...interactiveOpsQueryKeys.all, 'dislikers', filters, interactiveOpsQueryKeys.demoSegment(demoMode)] as const,
  dislikees: (filters: Omit<ActorQueryPayload, 'accessToken'>, demoMode = false) =>
    [...interactiveOpsQueryKeys.all, 'dislikees', filters, interactiveOpsQueryKeys.demoSegment(demoMode)] as const,
  averageScore: (targetId: number, targetType: number, demoMode = false) =>
    [...interactiveOpsQueryKeys.all, 'average-score', targetType, targetId, interactiveOpsQueryKeys.demoSegment(demoMode)] as const,
  panelStats: (targetId: number, targetType: number, demoMode = false) =>
    [...interactiveOpsQueryKeys.all, 'panel-stats', targetType, targetId, interactiveOpsQueryKeys.demoSegment(demoMode)] as const,
};

export const publicPanelActorQueryKeys = {
  all: ['public-panel', 'actor'] as const,
  demoSegment: (demoMode: boolean) => (demoMode ? 'demo' : 'live'),
  profile: (actorId: number, kind: PublicPanelKind, demoMode = false) =>
    [...publicPanelActorQueryKeys.all, 'profile', kind, actorId, publicPanelActorQueryKeys.demoSegment(demoMode)] as const,
  visitor: (actorId: number, kind: PublicPanelKind, demoMode = false) =>
    [...publicPanelActorQueryKeys.all, 'visitor', kind, actorId, publicPanelActorQueryKeys.demoSegment(demoMode)] as const,
  owner: (kind: PublicPanelKind, demoMode = false) =>
    [...publicPanelActorQueryKeys.all, 'owner', kind, publicPanelActorQueryKeys.demoSegment(demoMode)] as const,
  status: (actorType: string, actorId?: number | null, demoMode = false) =>
    [
      ...publicPanelActorQueryKeys.all,
      'status',
      actorType,
      actorId ?? 'owner',
      publicPanelActorQueryKeys.demoSegment(demoMode),
    ] as const,
};
