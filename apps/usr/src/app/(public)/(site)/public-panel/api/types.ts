/** Wire + app types for Interactive Operations MS (USR1-53-1*). */

export interface ApiResponse<T> {
  data: T | null;
  message: string | null;
  status_code: number;
  errors: Record<string, string>;
  success: boolean;
}

/** Actor that can follow/like/share (YAML FollowRequest.actor_type). */
export type InteractiveActorType = 1 | 2 | 3 | 4;

/** Target for follow (no comment). */
export type FollowTargetType = 1 | 2 | 3 | 4 | 5 | 6;

/** Target for like/share (includes comment = 7). */
export type InteractiveTargetType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** YAML LikeRequest.like_status */
export type LikeStatus = 1 | 2 | 3;

export const LIKE_STATUS = {
  like: 1,
  none: 2,
  dislike: 3,
} as const;

/** YAML ShareRequest.platform */
export type SharePlatform = 1 | 2 | 3;

export const SHARE_PLATFORM = {
  inSite: 1,
  telegram: 2,
  whatsapp: 3,
} as const;

export const ACTOR_TYPE = {
  user: 1,
  university: 2,
  industry: 3,
  business: 4,
} as const;

export const TARGET_TYPE = {
  user: 1,
  university: 2,
  industry: 3,
  business: 4,
  product: 5,
  service: 6,
  comment: 7,
} as const;

/** Loose list payload — examples mix actor_* / target_* / actor_ids. */
export interface InteractiveListDataDto {
  actor_id?: number;
  actor_type?: number;
  actor_ids?: unknown[];
  target_id?: number;
  target_type?: number;
  is_active?: boolean;
  status?: number;
  platform?: number;
  [key: string]: unknown;
}

export interface FollowRequestDto {
  actor_type: InteractiveActorType;
  actor_id: number;
  target_type: FollowTargetType;
  target_id: number;
  is_active: boolean;
}

export interface LikeRequestDto {
  actor_type: InteractiveActorType;
  actor_id: number;
  target_type: InteractiveTargetType;
  target_id: number;
  like_status: LikeStatus;
}

export interface ShareRequestDto {
  actor_type: InteractiveActorType;
  actor_id: number;
  target_type: InteractiveTargetType;
  target_id: number;
  platform: SharePlatform;
  destination_type?: InteractiveTargetType | null;
  destination_id?: number | null;
  reason?: string;
  url?: string;
}

export interface FollowPayload {
  accessToken?: string | null;
  actorType: InteractiveActorType;
  actorId: number;
  targetType: FollowTargetType;
  targetId: number;
  isActive: boolean;
}

export interface LikePayload {
  accessToken?: string | null;
  actorType: InteractiveActorType;
  actorId: number;
  targetType: InteractiveTargetType;
  targetId: number;
  likeStatus: LikeStatus;
}

export interface SharePayload {
  accessToken?: string | null;
  actorType: InteractiveActorType;
  actorId: number;
  targetType: InteractiveTargetType;
  targetId: number;
  platform?: SharePlatform;
  destinationType?: InteractiveTargetType | null;
  destinationId?: number | null;
  reason?: string;
  url?: string;
}

export interface TargetQueryPayload {
  accessToken?: string | null;
  targetType: FollowTargetType | InteractiveTargetType;
  targetId: number;
}

export interface ActorQueryPayload {
  accessToken?: string | null;
  actorType: InteractiveActorType;
  actorId: number;
}

export interface InteractiveCountResult {
  count: number;
  message: string | null;
}

export interface FollowResult {
  isActive: boolean;
  message: string | null;
}

export interface LikeResult {
  status: LikeStatus;
  message: string | null;
}

export interface ShareResult {
  message: string | null;
}

/** Panel engagement bundle for stats bar. */
export interface PanelInteractiveStats {
  followers: number;
  following: number;
  likers: number;
  liked: number;
  thumbsUp: number;
  thumbsDown: number;
}
