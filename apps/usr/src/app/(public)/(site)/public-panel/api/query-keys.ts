import type {
  ActorQueryPayload,
  TargetQueryPayload,
} from './types';

export const interactiveOpsQueryKeys = {
  all: ['interactive-ops'] as const,
  followers: (filters: Omit<TargetQueryPayload, 'accessToken'>) =>
    [...interactiveOpsQueryKeys.all, 'followers', filters] as const,
  followings: (filters: Omit<ActorQueryPayload, 'accessToken'>) =>
    [...interactiveOpsQueryKeys.all, 'followings', filters] as const,
  likers: (filters: Omit<TargetQueryPayload, 'accessToken'>) =>
    [...interactiveOpsQueryKeys.all, 'likers', filters] as const,
  likees: (filters: Omit<ActorQueryPayload, 'accessToken'>) =>
    [...interactiveOpsQueryKeys.all, 'likees', filters] as const,
  dislikers: (filters: Omit<TargetQueryPayload, 'accessToken'>) =>
    [...interactiveOpsQueryKeys.all, 'dislikers', filters] as const,
  dislikees: (filters: Omit<ActorQueryPayload, 'accessToken'>) =>
    [...interactiveOpsQueryKeys.all, 'dislikees', filters] as const,
  averageScore: (targetId: number, targetType: number) =>
    [...interactiveOpsQueryKeys.all, 'average-score', targetType, targetId] as const,
  panelStats: (targetId: number, targetType: number) =>
    [...interactiveOpsQueryKeys.all, 'panel-stats', targetType, targetId] as const,
};
