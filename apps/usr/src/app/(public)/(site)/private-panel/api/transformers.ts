import type {
  ActorInfo,
  ActorInfoDataDto,
  ChangeReviewBodyDto,
  ChangeStateRecordBodyDto,
  ListServiceTitlesPayload,
  PublicPanelStatus,
  PublicPanelStatusDataDto,
  RecordChangeReviewBodyDto,
  ReviewPrivateChangesByOwnerPayload,
  ReviewPrivateStateByOwnerPayload,
  ServiceTitleItem,
  ServiceTitleListItemDto,
  SubmitPrivateStateByOwnerPayload,
} from '@private-panel/types/api';

function readApiString(value: unknown): string {
  if (value == null || typeof value === 'object') return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

export function mapActorInfo(data: ActorInfoDataDto): ActorInfo {
  return {
    username: readApiString(data.username),
    name: readApiString(data.name),
    membership:
      readApiString(data.membership) || readApiString(data.membership_type),
    isDeleted: Boolean(data.is_deleted),
    blockStatus: Boolean(data.block_status),
    isPublicPanelActive: Boolean(data.is_public_panel_active),
    isIndividualServiceProvider: Boolean(data.is_individual_service_provider),
  };
}

export function mapPublicPanelStatus(
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

export function toPrivateStateSubmitBody(
  payload: SubmitPrivateStateByOwnerPayload
): ChangeStateRecordBodyDto {
  return {
    action: payload.action,
    tab_name: payload.tabName,
    section_name: payload.sectionName,
    object_id: payload.objectId,
  };
}

export function toPrivateReviewBody(
  payload: ReviewPrivateChangesByOwnerPayload
): ChangeReviewBodyDto {
  return {
    confirmed_requests: payload.confirmedRequests,
    rejected_requests: payload.rejectedRequests,
  };
}

export function toPrivateStateReviewBody(
  payload: ReviewPrivateStateByOwnerPayload
): RecordChangeReviewBodyDto {
  return {
    confirmed_requests: payload.confirmedRequests,
    rejected_requests: payload.rejectedRequests,
  };
}

export function toListServiceTitlesQuery(payload: ListServiceTitlesPayload) {
  return {
    actor_type: payload.actorType,
    category_code: payload.categoryCode,
    ordering: payload.ordering,
    page: payload.page,
    paginate: payload.paginate,
    search_query: payload.searchQuery,
  };
}

export function mapServiceTitleItem(
  item: ServiceTitleListItemDto
): ServiceTitleItem {
  return {
    code: Number(item.code ?? 0),
    abbreviation: String(item.abbreviation ?? ''),
    name: item.name ?? {},
    categoryCode: Number(item.category_code ?? 0),
    actorTypes: Array.isArray(item.actor_type) ? item.actor_type : [],
    isDeleted: Boolean(item.is_deleted),
  };
}
