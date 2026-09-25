import { DEFAULT_DEMO_PERSONA, type DemoPersonaId } from '@/lib/demo-mode/persona';
import type { PublicPanelKind } from '@public-panel/types/actor';
import type {
  ActorQueryPayload,
  TargetQueryPayload,
} from '@public-panel/types/api';

export const interactiveOpsQueryKeys = {
  all: ['interactive-ops'] as const,
  demoSegment: (demoMode: boolean, persona?: DemoPersonaId | null) =>
    demoMode ? `demo:${persona ?? DEFAULT_DEMO_PERSONA}` : 'live',
  followers: (
    filters: Omit<TargetQueryPayload, 'accessToken'>,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...interactiveOpsQueryKeys.all,
      'followers',
      filters,
      interactiveOpsQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  followings: (
    filters: Omit<ActorQueryPayload, 'accessToken'>,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...interactiveOpsQueryKeys.all,
      'followings',
      filters,
      interactiveOpsQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  likers: (
    filters: Omit<TargetQueryPayload, 'accessToken'>,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...interactiveOpsQueryKeys.all,
      'likers',
      filters,
      interactiveOpsQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  likees: (
    filters: Omit<ActorQueryPayload, 'accessToken'>,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...interactiveOpsQueryKeys.all,
      'likees',
      filters,
      interactiveOpsQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  dislikers: (
    filters: Omit<TargetQueryPayload, 'accessToken'>,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...interactiveOpsQueryKeys.all,
      'dislikers',
      filters,
      interactiveOpsQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  dislikees: (
    filters: Omit<ActorQueryPayload, 'accessToken'>,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...interactiveOpsQueryKeys.all,
      'dislikees',
      filters,
      interactiveOpsQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  averageScore: (
    targetId: number,
    targetType: number,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...interactiveOpsQueryKeys.all,
      'average-score',
      targetType,
      targetId,
      interactiveOpsQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  panelStats: (
    targetId: number,
    targetType: number,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...interactiveOpsQueryKeys.all,
      'panel-stats',
      targetType,
      targetId,
      interactiveOpsQueryKeys.demoSegment(demoMode, persona),
    ] as const,
};

export const publicPanelActorQueryKeys = {
  all: ['public-panel', 'actor'] as const,
  demoSegment: (demoMode: boolean, persona?: DemoPersonaId | null) =>
    demoMode ? `demo:${persona ?? DEFAULT_DEMO_PERSONA}` : 'live',
  profile: (
    actorId: number,
    kind: PublicPanelKind,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...publicPanelActorQueryKeys.all,
      'profile',
      kind,
      actorId,
      publicPanelActorQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  visitor: (
    actorId: number,
    kind: PublicPanelKind,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...publicPanelActorQueryKeys.all,
      'visitor',
      kind,
      actorId,
      publicPanelActorQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  owner: (
    kind: PublicPanelKind,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...publicPanelActorQueryKeys.all,
      'owner',
      kind,
      publicPanelActorQueryKeys.demoSegment(demoMode, persona),
    ] as const,
  status: (
    actorType: string,
    actorId?: number | null,
    demoMode = false,
    persona?: DemoPersonaId | null
  ) =>
    [
      ...publicPanelActorQueryKeys.all,
      'status',
      actorType,
      actorId ?? 'owner',
      publicPanelActorQueryKeys.demoSegment(demoMode, persona),
    ] as const,
};
