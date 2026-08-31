import { getActor, patchActor, postActor, requireAccessToken } from './http';
import type {
  MutationResult,
  ProfileRetrieveData,
  RetrievePublicPanelForAdminPayload,
  RetrievePublicPanelForOwnerPayload,
  RetrievePublicPanelForVisitorPayload,
  ReviewPublicChangesByAdminPayload,
  SubmitUserPublicTabPayload,
} from '@public-panel/types/actor';

/** GET /profiles_user/public/retrieve-for-visitor — Usr-Prf-6N1 */
export async function retrieveUserPublicPanelForVisitor(
  payload: RetrievePublicPanelForVisitorPayload
): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_user/public/retrieve-for-visitor',
    payload.accessToken,
    { actor_id: payload.actorId },
    false
  );
  return data ?? {};
}

/** GET /profiles_user/public/retrieve-for-owner — Prf-6 */
export async function retrieveUserPublicPanelForOwner(
  payload: RetrievePublicPanelForOwnerPayload
): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_user/public/retrieve-for-owner',
    payload.accessToken,
    undefined,
    false
  );
  return data ?? {};
}

/** GET /profiles_user/public/retrieve-for-admin — Adm-Prf-6 */
export async function retrieveUserPublicPanelForAdmin(
  payload: RetrievePublicPanelForAdminPayload
): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_user/public/retrieve-for-admin',
    payload.accessToken,
    { actor_id: payload.actorId },
    false
  );
  return data ?? {};
}

/** PATCH /profiles_user/public/tab/submit-by-owner — Usr-Prf-6N3 / 6N4 */
export async function submitUserPublicTabByOwner(
  payload: SubmitUserPublicTabPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await patchActor(
    '/profiles_user/public/tab/submit-by-owner',
    payload.accessToken,
    payload.body,
    false,
    { tab_name: payload.tabName }
  );
  return { message };
}

/** POST /profiles_user/public/review-by-admin — Adm-Prf-6N5 */
export async function reviewUserPublicChangesByAdmin(
  payload: ReviewPublicChangesByAdminPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await postActor(
    '/profiles_user/public/review-by-admin',
    payload.accessToken,
    {
      actor_id: payload.actorId,
      confirmed_request_ids: payload.confirmedRequestIds,
      rejected_request_ids: payload.rejectedRequestIds,
    }
  );
  return { message };
}
