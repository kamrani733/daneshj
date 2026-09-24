import { interactiveOpsHttpClient } from '@/shared/api/interactive-ops-http';

import {
  mapAverageScore,
  mapInteractiveCount,
  toActorQuery,
  toFollowBody,
  toLikeBody,
  toLikeStatus,
  toScoreBody,
  toShareBody,
  toTargetQuery,
} from '@public-panel/api/transformers';
import type {
  ActorQueryPayload,
  ApiResponse,
  AverageScoreResult,
  FollowPayload,
  FollowResult,
  InteractiveCountResult,
  InteractiveListDataDto,
  LikePayload,
  LikeResult,
  ScorePayload,
  SharePayload,
  ShareResult,
  TargetQueryPayload,
} from '@public-panel/types/api';

function formatApiResponseError(
  message: string | null | undefined,
  errors?: Record<string, string>
): string {
  if (message?.trim()) return message.trim();
  const fieldErrors = Object.values(errors ?? {}).filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );
  if (fieldErrors.length > 0) return fieldErrors.join(' ');
  return 'Request failed';
}

function assertApiSuccess<T>(response: ApiResponse<T>, requireData = true): T {
  if (!response.success || (requireData && response.data == null)) {
    throw new Error(formatApiResponseError(response.message, response.errors));
  }
  return response.data as T;
}

function authHeaders(accessToken?: string | null) {
  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;
}

async function getInteractiveOps<T>(
  path: string,
  accessToken: string | null | undefined,
  params?: object,
  requireData = true
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await interactiveOpsHttpClient.get<ApiResponse<T>>(
    path,
    {
      params,
      headers: authHeaders(accessToken),
    }
  );
  return {
    data: assertApiSuccess(response, requireData),
    message: response.message,
  };
}

async function postInteractiveOps<T>(
  path: string,
  accessToken: string | null | undefined,
  body: unknown
): Promise<{ data: T; message: string | null }> {
  const { data: response } = await interactiveOpsHttpClient.post<ApiResponse<T>>(
    path,
    body,
    { headers: authHeaders(accessToken) }
  );
  return {
    data: assertApiSuccess(response),
    message: response.message,
  };
}

/** POST /interactive-ops/follow — USR1-53-1N1 */
export async function followEntity(
  payload: FollowPayload
): Promise<FollowResult> {
  const { data, message } = await postInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/follow',
    payload.accessToken,
    toFollowBody(payload)
  );
  return {
    isActive: Boolean(data?.is_active ?? payload.isActive),
    message,
  };
}

/** GET /interactive-ops/follow/followers/ — USR1-53-1N8 */
export async function getFollowers(
  payload: TargetQueryPayload
): Promise<InteractiveCountResult> {
  const { data, message } = await getInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/follow/followers/',
    payload.accessToken,
    toTargetQuery(payload)
  );
  return mapInteractiveCount(data, message);
}

/** GET /interactive-ops/follow/followings/ — USR1-53-1N9 */
export async function getFollowings(
  payload: ActorQueryPayload
): Promise<InteractiveCountResult> {
  const { data, message } = await getInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/follow/followings/',
    payload.accessToken,
    toActorQuery(payload)
  );
  return mapInteractiveCount(data, message);
}

/** POST /interactive-ops/like — USR1-53-1N2 / 1N3 */
export async function reactToEntity(payload: LikePayload): Promise<LikeResult> {
  const { data, message } = await postInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/like',
    payload.accessToken,
    toLikeBody(payload)
  );
  return {
    status: toLikeStatus(data?.status ?? payload.likeStatus),
    message,
  };
}

/** GET /interactive-ops/like/likers/ — USR1-53-1N10 */
export async function getLikers(
  payload: TargetQueryPayload
): Promise<InteractiveCountResult> {
  const { data, message } = await getInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/like/likers/',
    payload.accessToken,
    toTargetQuery(payload)
  );
  return mapInteractiveCount(data, message);
}

/** GET /interactive-ops/like/likees/ — USR1-53-1N11 */
export async function getLikees(
  payload: ActorQueryPayload
): Promise<InteractiveCountResult> {
  const { data, message } = await getInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/like/likees/',
    payload.accessToken,
    toActorQuery(payload)
  );
  return mapInteractiveCount(data, message);
}

/** GET /interactive-ops/like/dislikers/ — USR1-53-1N12 */
export async function getDislikers(
  payload: TargetQueryPayload
): Promise<InteractiveCountResult> {
  const { data, message } = await getInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/like/dislikers/',
    payload.accessToken,
    toTargetQuery(payload)
  );
  return mapInteractiveCount(data, message);
}

/** GET /interactive-ops/like/dislikees/ — USR1-53-1N13 */
export async function getDislikees(
  payload: ActorQueryPayload
): Promise<InteractiveCountResult> {
  const { data, message } = await getInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/like/dislikees/',
    payload.accessToken,
    toActorQuery(payload)
  );
  return mapInteractiveCount(data, message);
}

/** POST /interactive-ops/score — Usr1-53-1N6 */
export async function submitScore(
  payload: ScorePayload
): Promise<{ score: number; message: string | null }> {
  const { data, message } = await postInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/score',
    payload.accessToken,
    toScoreBody(payload)
  );
  const score = typeof data?.score === 'number' ? data.score : payload.score;
  return { score, message };
}

/** GET /interactive-ops/score/average — USR1-53-1N7 */
export async function getAverageScore(payload: {
  accessToken?: string | null;
  targetId: number;
  targetType: ScorePayload['targetType'];
}): Promise<AverageScoreResult> {
  const { data, message } = await getInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/score/average',
    payload.accessToken,
    {
      target_id: payload.targetId,
      target_type: payload.targetType,
    }
  );
  return mapAverageScore(data, message);
}

/** POST /interactive-ops/share — USR1-53-1N4 / 1N5 */
export async function shareEntity(payload: SharePayload): Promise<ShareResult> {
  const { message } = await postInteractiveOps<InteractiveListDataDto>(
    '/interactive-ops/share',
    payload.accessToken,
    toShareBody(payload)
  );
  return { message };
}
