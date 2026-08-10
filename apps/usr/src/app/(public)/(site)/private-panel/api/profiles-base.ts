import { getActor, postActor, putActor, requireAccessToken } from './http';
import { mapActorInfo, mapPublicPanelStatus } from './transformers';
import type {
  ActorInfo,
  ActorInfoDataDto,
  GetActorInfoPayload,
  GetPublicPanelStatusByOwnerPayload,
  MutationResult,
  PublicPanelStatus,
  PublicPanelStatusDataDto,
  RequestPublicPanelChangeStatusPayload,
} from './types';

/** GET /profiles_base/get_actor_info — All Actor */
export async function getActorInfo(
  payload: GetActorInfoPayload
): Promise<ActorInfo> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ActorInfoDataDto>(
    '/profiles_base/get_actor_info',
    payload.accessToken,
    { actor_type: payload.actorType }
  );
  return mapActorInfo(data);
}

/** GET /profiles_base/public/get-status-by-owner — Usr-Prf-6 */
export async function getPublicPanelStatusByOwner(
  payload: GetPublicPanelStatusByOwnerPayload
): Promise<PublicPanelStatus> {
  requireAccessToken(payload.accessToken);
  const { data, message } = await getActor<PublicPanelStatusDataDto>(
    '/profiles_base/public/get-status-by-owner',
    payload.accessToken,
    { actor_type: payload.actorType }
  );
  return mapPublicPanelStatus(data, message);
}

/** POST /profiles_base/public/change-status-request — Usr-Prf-6N6 / 6N7 */
export async function requestPublicPanelChangeStatus(
  payload: RequestPublicPanelChangeStatusPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await postActor(
    '/profiles_base/public/change-status-request',
    payload.accessToken,
    { action: payload.action },
    false,
    { actor_type: payload.actorType }
  );
  return { message };
}

/** PUT /profiles_base/public/change-status — Adm-Prf-6N8 / 6N9 */
export async function changePublicPanelStatusByAdmin(payload: {
  accessToken?: string | null;
  actorType: RequestPublicPanelChangeStatusPayload['actorType'];
  action: RequestPublicPanelChangeStatusPayload['action'];
  actorId: number;
}): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await putActor(
    '/profiles_base/public/change-status',
    payload.accessToken,
    { action: payload.action, actor_id: payload.actorId },
    false,
    { actor_type: payload.actorType }
  );
  return { message };
}

/** GET /profiles_base/public/get-status-by-admin — Adm-Prf-6 */
export async function getPublicPanelStatusByAdmin(payload: {
  accessToken?: string | null;
  actorType: RequestPublicPanelChangeStatusPayload['actorType'];
  actorId: number;
}): Promise<PublicPanelStatus> {
  requireAccessToken(payload.accessToken);
  const { data, message } = await getActor<PublicPanelStatusDataDto>(
    '/profiles_base/public/get-status-by-admin',
    payload.accessToken,
    { actor_id: payload.actorId, actor_type: payload.actorType }
  );
  return mapPublicPanelStatus(data, message);
}
