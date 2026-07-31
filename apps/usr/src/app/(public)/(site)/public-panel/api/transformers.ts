import type {
  ActorQueryPayload,
  FollowPayload,
  FollowRequestDto,
  InteractiveCountResult,
  InteractiveListDataDto,
  LikePayload,
  LikeRequestDto,
  LikeStatus,
  SharePayload,
  ShareRequestDto,
  TargetQueryPayload,
} from './types';
import { LIKE_STATUS, SHARE_PLATFORM } from './types';

/** Extract a display count from OpenAPI list messages / actor_ids. */
export function mapInteractiveCount(
  data: InteractiveListDataDto | null | undefined,
  message: string | null = null
): InteractiveCountResult {
  if (Array.isArray(data?.actor_ids)) {
    return { count: data.actor_ids.length, message };
  }

  const fromMessage = parseCountFromMessage(message);
  return { count: fromMessage ?? 0, message };
}

function parseCountFromMessage(message: string | null | undefined): number | null {
  if (!message?.trim()) return null;

  const patterns = [
    /has\s+(\d+)\s+followers/i,
    /is\s+following\s+(\d+)/i,
    /has\s+received\s+(\d+)\s+likes/i,
    /has\s+received\s+(\d+)\s+dislikes/i,
    /has\s+liked\s+(\d+)/i,
    /has\s+disliked\s+(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) return Number(match[1]);
  }

  return null;
}

export function toFollowBody(payload: FollowPayload): FollowRequestDto {
  return {
    actor_type: payload.actorType,
    actor_id: payload.actorId,
    target_type: payload.targetType,
    target_id: payload.targetId,
    is_active: payload.isActive,
  };
}

export function toLikeBody(payload: LikePayload): LikeRequestDto {
  return {
    actor_type: payload.actorType,
    actor_id: payload.actorId,
    target_type: payload.targetType,
    target_id: payload.targetId,
    like_status: payload.likeStatus,
  };
}

export function toShareBody(payload: SharePayload): ShareRequestDto {
  return {
    actor_type: payload.actorType,
    actor_id: payload.actorId,
    target_type: payload.targetType,
    target_id: payload.targetId,
    platform: payload.platform ?? SHARE_PLATFORM.inSite,
    destination_type: payload.destinationType ?? null,
    destination_id: payload.destinationId ?? null,
    reason: payload.reason ?? '',
    url: payload.url ?? '',
  };
}

export function toTargetQuery(payload: TargetQueryPayload) {
  return {
    target_id: payload.targetId,
    target_type: payload.targetType,
  };
}

export function toActorQuery(payload: ActorQueryPayload) {
  return {
    actor_id: payload.actorId,
    actor_type: payload.actorType,
  };
}

export function toLikeStatus(value: unknown): LikeStatus {
  if (value === LIKE_STATUS.dislike || value === 3) return LIKE_STATUS.dislike;
  if (value === LIKE_STATUS.none || value === 2) return LIKE_STATUS.none;
  return LIKE_STATUS.like;
}
