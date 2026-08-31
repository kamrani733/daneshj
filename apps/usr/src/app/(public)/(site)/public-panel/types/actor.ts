/** Actor Microservice types for public-panel (Prf-6). */

/** YAML actor_type query enum on `/profiles_base/public/*`. */
export type ActorTypeName =
  | 'Business'
  | 'Industry'
  | 'University'
  | 'User';

export const ACTOR_TYPE_NAME = {
  business: 'Business',
  industry: 'Industry',
  university: 'University',
  user: 'User',
} as const satisfies Record<string, ActorTypeName>;

/**
 * Which public-profile resource to load.
 * Individual is a user who is a service provider (`profiles_individual`).
 */
export type PublicPanelKind = 'user' | 'individual' | 'business';

export const PUBLIC_PANEL_KIND = {
  user: 'user',
  individual: 'individual',
  business: 'business',
} as const satisfies Record<PublicPanelKind, PublicPanelKind>;

export function parsePublicPanelKind(
  raw: string | undefined
): PublicPanelKind {
  const value = raw?.trim().toLowerCase();
  if (value === 'individual' || value === 'provider') return 'individual';
  if (value === 'business') return 'business';
  return 'user';
}

export type PublicPanelStatusAction = 'CREATE' | 'DELETE';

export type UserPublicTabName =
  | 'contact_information'
  | 'educational_information'
  | 'identity_information'
  | 'social_information'
  | 'user_information';

export type IndividualPublicTabName = 'individual_information';

export type BusinessPublicTabName =
  | 'actor_information'
  | 'contact_information'
  | 'identity_information'
  | 'representatives_info'
  | 'social_information'
  | 'working_time';

/** YAML: PublicPanelStatusData */
export interface PublicPanelStatusDataDto {
  is_public_panel_active: boolean;
  is_public_panel_active_individual: boolean;
}

export interface PublicPanelStatus {
  isPublicPanelActive: boolean;
  isPublicPanelActiveIndividual: boolean;
  message: string | null;
}

/** Retrieve payloads are underspecified in OpenAPI — keep loose. */
export type ProfileRetrieveData = Record<string, unknown>;

export type FieldVisibilityFlags = Record<string, boolean | undefined>;

/** YAML: PatchedUserDynamicFlagSerializersRequest */
export type UserPublicTabSubmitBodyDto = Record<string, FieldVisibilityFlags>;

/** YAML: PatchedIndividualDynamicFlagSerializersRequest */
export type IndividualPublicTabSubmitBodyDto = Record<
  string,
  FieldVisibilityFlags
>;

/** YAML: PatchedBusinessDynamicFlagSerializersRequest */
export type BusinessPublicTabSubmitBodyDto = Record<
  string,
  FieldVisibilityFlags
>;

export interface AccessTokenPayload {
  accessToken?: string | null;
}

export interface GetPublicPanelStatusPayload extends AccessTokenPayload {
  actorType: ActorTypeName;
  actorId?: number | null;
}

export interface RequestPublicPanelChangeStatusPayload extends AccessTokenPayload {
  actorType: ActorTypeName;
  action: PublicPanelStatusAction;
  actorId?: number | null;
}

export type RetrievePublicPanelForOwnerPayload = AccessTokenPayload;

export interface RetrievePublicPanelForVisitorPayload extends AccessTokenPayload {
  actorId: number;
}

export interface RetrievePublicPanelForAdminPayload extends AccessTokenPayload {
  actorId: number;
}

export interface SubmitUserPublicTabPayload extends AccessTokenPayload {
  tabName: UserPublicTabName;
  body: UserPublicTabSubmitBodyDto;
}

export interface SubmitIndividualPublicTabPayload extends AccessTokenPayload {
  tabName?: IndividualPublicTabName;
  body: IndividualPublicTabSubmitBodyDto;
}

export interface SubmitBusinessPublicTabPayload extends AccessTokenPayload {
  tabName: BusinessPublicTabName;
  body: BusinessPublicTabSubmitBodyDto;
}

export interface ReviewPublicChangesByAdminPayload extends AccessTokenPayload {
  actorId: number;
  confirmedRequestIds?: number[];
  rejectedRequestIds?: number[];
}

export interface MutationResult {
  message: string | null;
}
