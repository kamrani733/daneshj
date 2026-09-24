import {
  getActor,
  patchActor,
  postActor,
  requireAccessToken,
} from '@private-panel/api/http';
import {
  toPrivateReviewBody,
  toPrivateStateReviewBody,
  toPrivateStateSubmitBody,
} from '@private-panel/api/transformers';
import type {
  MutationResult,
  PrivateTabSubmitByAdminBodyDto,
  PrivateTabSubmitByOwnerBodyDto,
  ProfileRetrieveData,
  RetrievePrivatePanelForOwnerPayload,
  RetrievePublicPanelForOwnerPayload,
  RetrievePublicPanelForVisitorPayload,
  ReviewPrivateChangesByOwnerPayload,
  ReviewPrivateStateByOwnerPayload,
  SubmitPrivateStateByOwnerPayload,
  SubmitPrivateTabByOwnerPayload,
  SubmitPublicTabByOwnerPayload,
} from '@private-panel/types/api';

/** GET /profiles_user/private/retrieve-for-owner — Prf-2 */
export async function retrievePrivatePanelForOwner(
  payload: RetrievePrivatePanelForOwnerPayload
): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_user/private/retrieve-for-owner',
    payload.accessToken,
    undefined,
    false
  );
  return data ?? {};
}

/** GET /profiles_user/private/retrieve-for-admin — Adm-Prf-2 */
export async function retrievePrivatePanelForAdmin(payload: {
  accessToken?: string | null;
  actorId: number;
}): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_user/private/retrieve-for-admin',
    payload.accessToken,
    { actor_id: payload.actorId },
    false
  );
  return data ?? {};
}

/** PATCH /profiles_user/private/tab/submit-by-owner — USR-Prf-2N2 */
export async function submitPrivateTabByOwner(
  payload: SubmitPrivateTabByOwnerPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await patchActor(
    '/profiles_user/private/tab/submit-by-owner',
    payload.accessToken,
    payload.body,
    false,
    { tab_name: payload.tabName }
  );
  return { message };
}

/** PATCH /profiles_user/private/tab/submit-by-admin — Adm-Prf-2N3 */
export async function submitPrivateTabByAdmin(payload: {
  accessToken?: string | null;
  actorId: number;
  tabName: SubmitPrivateTabByOwnerPayload['tabName'] | 'user_information';
  body: PrivateTabSubmitByAdminBodyDto | PrivateTabSubmitByOwnerBodyDto;
}): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await patchActor(
    '/profiles_user/private/tab/submit-by-admin',
    payload.accessToken,
    payload.body,
    false,
    { actor_id: payload.actorId, tab_name: payload.tabName }
  );
  return { message };
}

/** PATCH /profiles_user/private/state/submit-by-owner — USR-Prf-2N2 */
export async function submitPrivateStateByOwner(
  payload: SubmitPrivateStateByOwnerPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await patchActor(
    '/profiles_user/private/state/submit-by-owner',
    payload.accessToken,
    toPrivateStateSubmitBody(payload)
  );
  return { message };
}

/** PATCH /profiles_user/private/state/submit-by-admin — Adm-Prf-2N3 */
export async function submitPrivateStateByAdmin(payload: {
  accessToken?: string | null;
  action: string;
  tabName: string;
  sectionName: string;
  objectId: number;
  actorId: number;
}): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await patchActor(
    '/profiles_user/private/state/submit-by-admin',
    payload.accessToken,
    {
      action: payload.action,
      tab_name: payload.tabName,
      section_name: payload.sectionName,
      object_id: payload.objectId,
      actor_id: payload.actorId,
    }
  );
  return { message };
}

/** POST /profiles_user/private/review-by-owner — USR-Prf-2N7 */
export async function reviewPrivateChangesByOwner(
  payload: ReviewPrivateChangesByOwnerPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await postActor(
    '/profiles_user/private/review-by-owner',
    payload.accessToken,
    toPrivateReviewBody(payload)
  );
  return { message };
}

/** POST /profiles_user/private/review-by-admin — Adm-Prf-2N8 */
export async function reviewPrivateChangesByAdmin(payload: {
  accessToken?: string | null;
  actorId: number;
  confirmedRequests?: ReviewPrivateChangesByOwnerPayload['confirmedRequests'];
  rejectedRequests?: ReviewPrivateChangesByOwnerPayload['rejectedRequests'];
}): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await postActor(
    '/profiles_user/private/review-by-admin',
    payload.accessToken,
    {
      actor_id: payload.actorId,
      confirmed_requests: payload.confirmedRequests,
      rejected_requests: payload.rejectedRequests,
    }
  );
  return { message };
}

/** POST /profiles_user/private/state/review-by-owner — USR-Prf-2N7 */
export async function reviewPrivateStateByOwner(
  payload: ReviewPrivateStateByOwnerPayload
): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await postActor(
    '/profiles_user/private/state/review-by-owner',
    payload.accessToken,
    toPrivateStateReviewBody(payload)
  );
  return { message };
}

/** POST /profiles_user/private/state/review-by-admin — Adm-Prf-2N8 */
export async function reviewPrivateStateByAdmin(payload: {
  accessToken?: string | null;
  actorId: number;
  confirmedRequests?: ReviewPrivateStateByOwnerPayload['confirmedRequests'];
  rejectedRequests?: ReviewPrivateStateByOwnerPayload['rejectedRequests'];
}): Promise<MutationResult> {
  requireAccessToken(payload.accessToken);
  const { message } = await postActor(
    '/profiles_user/private/state/review-by-admin',
    payload.accessToken,
    {
      actor_id: payload.actorId,
      confirmed_requests: payload.confirmedRequests,
      rejected_requests: payload.rejectedRequests,
    }
  );
  return { message };
}

/** GET /profiles_user/public/retrieve-for-owner — Prf-6 */
export async function retrievePublicPanelForOwner(
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
export async function retrievePublicPanelForAdmin(payload: {
  accessToken?: string | null;
  actorId: number;
}): Promise<ProfileRetrieveData> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ProfileRetrieveData>(
    '/profiles_user/public/retrieve-for-admin',
    payload.accessToken,
    { actor_id: payload.actorId },
    false
  );
  return data ?? {};
}

/** GET /profiles_user/public/retrieve-for-visitor — Usr-Prf-6N1 */
export async function retrievePublicPanelForVisitor(
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

/** PATCH /profiles_user/public/tab/submit-by-owner — Usr-Prf-6N3 / 6N4 */
export async function submitPublicTabByOwner(
  payload: SubmitPublicTabByOwnerPayload
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
export async function reviewPublicChangesByAdmin(payload: {
  accessToken?: string | null;
  actorId: number;
  confirmedRequestIds?: number[];
  rejectedRequestIds?: number[];
}): Promise<MutationResult> {
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
