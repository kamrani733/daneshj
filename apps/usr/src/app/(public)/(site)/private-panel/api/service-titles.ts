import { toRequestQuery } from '@daneshjoam/api-client';

import { getActor, requireAccessToken } from '@private-panel/api/http';
import { mapServiceTitleItem, toListServiceTitlesQuery } from '@private-panel/api/transformers';
import type {
  ListServiceTitlesPayload,
  ServiceTitleItem,
  ServiceTitleListItemDto,
} from '@private-panel/types/api';

/** GET /service_titles/service-title/list-to-all — Prf-9 */
export async function listServiceTitlesToAll(
  payload: ListServiceTitlesPayload
): Promise<ServiceTitleItem[]> {
  requireAccessToken(payload.accessToken);
  const { data } = await getActor<ServiceTitleListItemDto[]>(
    '/service_titles/service-title/list-to-all',
    payload.accessToken,
    toRequestQuery(toListServiceTitlesQuery(payload))
  );
  return (data ?? []).map(mapServiceTitleItem);
}
