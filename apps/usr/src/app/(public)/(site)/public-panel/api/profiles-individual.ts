import { getActor, patchActor, postActor, requireAccessToken } from '@public-panel/api/http';
import type {
  MutationResult,
  ProfileRetrieveData,
  RetrievePublicPanelForAdminPayload,
  RetrievePublicPanelForOwnerPayload,
  RetrievePublicPanelForVisitorPayload,
  ReviewPublicChangesByAdminPayload,
  SubmitIndividualPublicTabPayload,
} from '@public-panel/types/actor';

/** GET /profiles_individual/public/retrieve-for-visitor — Usr-Prf-6N2 */
export async function retrieveIndividualPublicPanelForVisitor(
  payload: RetrievePublicPanelForVisitorPayload
): Promise<ProfileRetrieveData> {
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_individual/public/retrieve-for-visitor',
    payload.accessToken,
    { actor_id: payload.actorId },
    false
  );
  return data ?? {};
}

/** GET /profiles_individual/public/retrieve-for-owner — Prf-6 */
export async function retrieveIndividualPublicPanelForOwner(
  payload: RetrievePublicPanelForOwnerPayload
): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_individual/public/retrieve-for-owner',
    payload.accessToken,
    undefined,
    false
  );
  return data ?? {};
}

/** GET /profiles_individual/public/retrieve-for-admin — Adm-Prf-6 */
export async function retrieveIndividualPublicPanelForAdmin(
  payload: RetrievePublicPanelForAdminPayload
): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_individual/public/retrieve-for-admin',
    payload.accessToken,
    { actor_id: payload.actorId },
    false
  );
  return data ?? {};
}

/** PATCH /profiles_individual/public/tab/submit-by-owner — ASR-Prf-6N3 / 6N4 */
export async function submitIndividualPublicTabByOwner(
  payload: SubmitIndividualPublicTabPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await patchActor(
    '/profiles_individual/public/tab/submit-by-owner',
    payload.accessToken,
    payload.body,
    false,
    { tab_name: payload.tabName ?? 'individual_information' }
  );
  return { message };
}

/** POST /profiles_individual/public/review-by-admin — Adm-Prf-6N5 */
export async function reviewIndividualPublicChangesByAdmin(
  payload: ReviewPublicChangesByAdminPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await postActor(
    '/profiles_individual/public/review-by-admin',
    payload.accessToken,
    {
      actor_id: payload.actorId,
      confirmed_request_ids: payload.confirmedRequestIds,
      rejected_request_ids: payload.rejectedRequestIds,
    }
  );
  return { message };
}
