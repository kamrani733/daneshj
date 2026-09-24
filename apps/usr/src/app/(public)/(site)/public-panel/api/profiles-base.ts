import { getActor, postActor, putActor, requireAccessToken } from '@public-panel/api/http';
import type {
  GetPublicPanelStatusPayload,
  MutationResult,
  PublicPanelStatus,
  PublicPanelStatusDataDto,
  RequestPublicPanelChangeStatusPayload,
} from '@public-panel/types/actor';

function mapPublicPanelStatus(
  data: PublicPanelStatusDataDto,
  message: string | null = null
): PublicPanelStatus {
  return {
    isPublicPanelActive: Boolean(data.is_public_panel_active),
    isPublicPanelActiveIndividual: Boolean(
      data.is_public_panel_active_individual
    ),
    message,
  };
}

/** GET /profiles_base/public/get-status-by-owner — Usr-Prf-6 */
export async function getPublicPanelStatusByOwner(
  payload: GetPublicPanelStatusPayload
): Promise<PublicPanelStatus> {
  requireAccessToken(payload.accessToken);
  const { data, message } = await getActor<PublicPanelStatusDataDto>(
    '/profiles_base/public/get-status-by-owner',
    payload.accessToken,
    { actor_type: payload.actorType }
  );
  return mapPublicPanelStatus(data, message);
}

/** GET /profiles_base/public/get-status-by-admin — Adm-Prf-6 */
export async function getPublicPanelStatusByAdmin(
  payload: GetPublicPanelStatusPayload & { actorId: number }
): Promise<PublicPanelStatus> {
  requireAccessToken(payload.accessToken);
  const { data, message } = await getActor<PublicPanelStatusDataDto>(
    '/profiles_base/public/get-status-by-admin',
    payload.accessToken,
    { actor_id: payload.actorId, actor_type: payload.actorType }
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
export async function changePublicPanelStatusByAdmin(
  payload: RequestPublicPanelChangeStatusPayload & { actorId: number }
): Promise<MutationResult> {
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
