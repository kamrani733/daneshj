import { getActor, patchActor, postActor, requireAccessToken } from '@public-panel/api/http';
import type {
  MutationResult,
  ProfileRetrieveData,
  RetrievePublicPanelForAdminPayload,
  RetrievePublicPanelForOwnerPayload,
  RetrievePublicPanelForVisitorPayload,
  ReviewPublicChangesByAdminPayload,
  SubmitBusinessPublicTabPayload,
} from '@public-panel/types/actor';

/** GET /profiles_business/public/retrieve-for-visitor — Usr-Prf-6N2 */
export async function retrieveBusinessPublicPanelForVisitor(
  payload: RetrievePublicPanelForVisitorPayload
): Promise<ProfileRetrieveData> {
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_business/public/retrieve-for-visitor',
    payload.accessToken,
    { actor_id: payload.actorId },
    false
  );
  return data ?? {};
}

/** GET /profiles_business/public/retrieve-for-owner — Prf-6 */
export async function retrieveBusinessPublicPanelForOwner(
  payload: RetrievePublicPanelForOwnerPayload
): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_business/public/retrieve-for-owner',
    payload.accessToken,
    undefined,
    false
  );
  return data ?? {};
}

/** GET /profiles_business/public/retrieve-for-admin — Adm-Prf-6 */
export async function retrieveBusinessPublicPanelForAdmin(
  payload: RetrievePublicPanelForAdminPayload
): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_business/public/retrieve-for-admin',
    payload.accessToken,
    { actor_id: payload.actorId },
    false
  );
  return data ?? {};
}

/** PATCH /profiles_business/public/tab/submit-by-owner — ASR-Prf-6N3 / 6N4 */
export async function submitBusinessPublicTabByOwner(
  payload: SubmitBusinessPublicTabPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await patchActor(
    '/profiles_business/public/tab/submit-by-owner',
    payload.accessToken,
    payload.body,
    false,
    { tab_name: payload.tabName }
  );
  return { message };
}

/** POST /profiles_business/public/review-by-admin — Adm-Prf-6N5 */
export async function reviewBusinessPublicChangesByAdmin(
  payload: ReviewPublicChangesByAdminPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await postActor(
    '/profiles_business/public/review-by-admin',
    payload.accessToken,
    {
      actor_id: payload.actorId,
      confirmed_request_ids: payload.confirmedRequestIds,
      rejected_request_ids: payload.rejectedRequestIds,
    }
  );
  return { message };
}
