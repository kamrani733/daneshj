import type {
  ActorQueryPayload,
  AverageScoreResult,
  FollowPayload,
  FollowRequestDto,
  InteractiveCountResult,
  InteractiveListDataDto,
  InteractivePerson,
  LikePayload,
  LikeRequestDto,
  LikeStatus,
  ScorePayload,
  ScoreRequestDto,
  SharePayload,
  ShareRequestDto,
  TargetQueryPayload,
} from './types';
import { LIKE_STATUS, SHARE_PLATFORM } from './types';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function mapInteractivePerson(raw: unknown): InteractivePerson | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return {
      id: String(raw),
      actorId: raw,
      username: String(raw),
      displayName: String(raw),
    };
  }
  if (typeof raw === 'string' && /^\d+$/.test(raw.trim())) {
    const actorId = Number(raw.trim());
    return {
      id: raw.trim(),
      actorId,
      username: raw.trim(),
      displayName: raw.trim(),
    };
  }
  const row = asRecord(raw);
  if (!row) return null;
  const actorId = Number(
    row.actor_id ?? row.target_id ?? row.id ?? row.user_id
  );
  if (!Number.isFinite(actorId) || actorId <= 0) return null;
  const username = String(
    row.username ?? row.actor_username ?? row.handle ?? actorId
  );
  const displayName = String(
    row.name ?? row.display_name ?? row.full_name ?? username
  );
  const avatarSrc = String(
    row.avatar ?? row.avatar_src ?? row.profile_picture_path ?? ''
  );
  return {
    id: String(actorId),
    actorId,
    username,
    displayName,
    avatarSrc: avatarSrc || undefined,
  };
}

function collectPeople(
  data: InteractiveListDataDto | null | undefined
): InteractivePerson[] {
  if (!data) return [];
  const buckets = [
    data.actor_ids,
    data.target_ids,
    data.results,
    data.followers,
    data.followings,
    data.likers,
    data.likees,
    data.dislikers,
  ];
  const people: InteractivePerson[] = [];
  const seen = new Set<number>();
  for (const bucket of buckets) {
    if (!Array.isArray(bucket)) continue;
    for (const item of bucket) {
      const person = mapInteractivePerson(item);
      if (!person || seen.has(person.actorId)) continue;
      seen.add(person.actorId);
      people.push(person);
    }
  }
  return people;
}

/** Extract people + display count from OpenAPI list payloads / messages. */
export function mapInteractiveCount(
  data: InteractiveListDataDto | null | undefined,
  message: string | null = null
): InteractiveCountResult {
  const people = collectPeople(data);
  const fromMessage = parseCountFromMessage(message);
  return {
    count: people.length > 0 ? people.length : (fromMessage ?? 0),
    people,
    message,
  };
}

export function mapAverageScore(
  data: InteractiveListDataDto | null | undefined,
  message: string | null = null
): AverageScoreResult {
  const averageRaw = data?.average_score ?? data?.average ?? data?.score;
  const average =
    typeof averageRaw === 'number'
      ? averageRaw
      : typeof averageRaw === 'string'
        ? Number(averageRaw)
        : parseAverageFromMessage(message);
  const countRaw = data?.count ?? data?.scorers_count ?? data?.number_of_scorers;
  const count =
    typeof countRaw === 'number'
      ? countRaw
      : parseScorersFromMessage(message) ?? 0;

  return {
    average: Number.isFinite(Number(average)) ? Number(average) : null,
    count,
    message,
  };
}

export function toScoreBody(payload: ScorePayload): ScoreRequestDto {
  return {
    actor_type: payload.actorType,
    actor_id: payload.actorId,
    target_type: payload.targetType,
    target_id: payload.targetId,
    score: payload.score,
  };
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

function parseAverageFromMessage(message: string | null | undefined): number | null {
  if (!message?.trim()) return null;
  const match = message.match(/average score of\s+([0-9]+(?:\.[0-9]+)?)/i);
  return match?.[1] ? Number(match[1]) : null;
}

function parseScorersFromMessage(message: string | null | undefined): number | null {
  if (!message?.trim()) return null;
  const match = message.match(/based on\s+(\d+)\s+submitted scores/i);
  return match?.[1] ? Number(match[1]) : null;
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
