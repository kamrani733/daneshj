/** Wire + app types for Actor Microservice (profiles_base / profiles_user / service_titles). */

export interface ApiResponse<T> {
  data: T | null;
  message: string | null;
  status_code: number;
  errors: Record<string, string>;
  success: boolean;
}

/** YAML actor_type query enum (profiles_base). */
export type ActorTypeName =
  | 'Business'
  | 'Industry'
  | 'University'
  | 'User';

/** Broader actor_type used by service titles. */
export type ServiceTitleActorType =
  | 'User'
  | 'Admin'
  | 'Organiser'
  | 'University'
  | 'Industry'
  | 'Business'
  | 'Individual';

export const ACTOR_TYPE_NAME = {
  business: 'Business',
  industry: 'Industry',
  university: 'University',
  user: 'User',
} as const satisfies Record<string, ActorTypeName>;

/** Private / public panel tab_name query. */
export type ProfileTabName =
  | 'contact_information'
  | 'educational_information'
  | 'identity_information'
  | 'social_information'
  | 'user_information';

/** Owner private tab submit omits user_information. */
export type PrivateOwnerTabName = Exclude<ProfileTabName, 'user_information'>;

export type PublicPanelStatusAction = 'CREATE' | 'DELETE';

export type RecordStateAction = 'DELETE' | 'RESTORE';

export type Gender = 1 | 2 | 3;

export type OccupationStatus = 1 | 2 | 3 | 4 | 5;

export type AcademicGroup = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DegreeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type StudyStatus = 1 | 2;

/** YAML: ActorInfoData (+ example fields). */
export interface ActorInfoDataDto {
  username: string;
  name?: string;
  membership?: string;
  membership_type?: string;
  is_deleted: boolean;
  block_status: boolean;
  is_public_panel_active?: boolean;
  is_individual_service_provider?: boolean;
}

/** YAML: PublicPanelStatusData */
export interface PublicPanelStatusDataDto {
  is_public_panel_active: boolean;
  is_public_panel_active_individual: boolean;
}

export interface DivisionCodeDto {
  id?: number;
  level?: number;
  normalized_code?: string | null;
  other?: string | null;
}

export interface IdentityInfoUserDto {
  id?: number;
  first_name?: string | null;
  last_name?: string | null;
  legal_first_name?: string | null;
  legal_last_name?: string | null;
  gender?: Gender | null;
  national_code?: string | null;
  birth_date?: string | null;
  profile_picture_path?: string | null;
  electronic_card_picture_path?: string | null;
  about_me?: string | null;
}

export interface SocialInfoUserDto {
  id?: number;
  military_status?: string | null;
  marital_status?: string | null;
  country_code?: string;
  social_info_user_division_code?: DivisionCodeDto[];
}

export interface ContactInfoUserDto {
  id?: number;
  mobile?: string | null;
  email?: string | null;
  whatsapp_id?: string | null;
  telegram_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
  linkedin_id?: string | null;
}

export interface EducationOccupationInfoUserDto {
  id?: number;
  status?: OccupationStatus | null;
  country_code?: string;
  student_id?: string | null;
  education_occupation_info_user_division_code?: DivisionCodeDto[];
}

export interface AcademicRecordUserDto {
  id?: number;
  academic_group?: AcademicGroup | null;
  field_of_study?: string | null;
  faculty?: string | null;
  university?: string | null;
  degree_level?: DegreeLevel | null;
  degree_level_description?: string | null;
  study_status?: StudyStatus | null;
  graduation_date?: string | null;
}

export interface AcademicDocumentUserDto {
  id?: number;
  file_path?: string;
  description?: string | null;
}

export interface OurUserDto {
  id?: number;
  is_individual_service_provider?: boolean;
}

/** YAML: PatchedUserAppConfigownerRequest */
export interface PrivateTabSubmitByOwnerBodyDto {
  identity_info_user?: IdentityInfoUserDto;
  social_info_user?: SocialInfoUserDto;
  contact_info_user?: ContactInfoUserDto;
  education_occupation_info_user?: EducationOccupationInfoUserDto;
  academic_record_submitted_user?: AcademicRecordUserDto[];
  academic_document_user?: AcademicDocumentUserDto[];
}

/** YAML: PatchedUserAppConfigadminRequest */
export interface PrivateTabSubmitByAdminBodyDto {
  our_user?: OurUserDto;
  identity_info_user?: IdentityInfoUserDto;
  social_info_user?: SocialInfoUserDto;
  contact_info_user?: ContactInfoUserDto;
  education_occupation_info_user?: EducationOccupationInfoUserDto;
  academic_record_verified_user?: AcademicRecordUserDto[];
}

/** YAML: PatchedChangeStateRecordRequest */
export interface ChangeStateRecordBodyDto {
  action?: string;
  tab_name?: string;
  section_name?: string;
  object_id?: number;
  actor_id?: number;
}

export interface ConfirmedRequestItemDto {
  request_id: number;
  request_type?: 1 | 2;
}

export interface RejectedRequestItemDto {
  request_id: number;
  request_type?: 1 | 2;
  reason?: string;
  new_value?: string;
}

export interface RecordRejectedRequestItemDto {
  request_id: number;
  reason?: string;
}

export interface ChangeReviewBodyDto {
  confirmed_requests?: ConfirmedRequestItemDto[];
  rejected_requests?: RejectedRequestItemDto[];
  actor_id?: number;
}

export interface RecordChangeReviewBodyDto {
  confirmed_requests?: ConfirmedRequestItemDto[];
  rejected_requests?: RecordRejectedRequestItemDto[];
  actor_id?: number;
}

/** Boolean visibility flags per section (YAML *_userRequest). */
export type FieldVisibilityFlags = Record<string, boolean | undefined>;

/** YAML: PatchedUserDynamicFlagSerializersRequest */
export interface PublicTabSubmitByOwnerBodyDto {
  our_user?: FieldVisibilityFlags;
  membership_type_user?: FieldVisibilityFlags;
  identity_info_user?: FieldVisibilityFlags;
  social_info_user?: FieldVisibilityFlags;
  social_info_user_division_code?: FieldVisibilityFlags;
  contact_info_user?: FieldVisibilityFlags;
  education_occupation_info_user?: FieldVisibilityFlags;
  education_occupation_info_user_division_code?: FieldVisibilityFlags;
  academic_record_submitted_user?: FieldVisibilityFlags;
  academic_record_verified_user?: FieldVisibilityFlags;
}

export interface PublicChangeReviewByAdminBodyDto {
  actor_id: number;
  confirmed_request_ids?: number[];
  rejected_request_ids?: number[];
}

export interface TranslationsDto {
  en?: string | null;
  fa?: string | null;
  ar?: string | null;
}

export interface ServiceTitleListItemDto {
  code?: number;
  actor_type?: string[];
  abbreviation?: string;
  name?: TranslationsDto;
  category_code?: number;
  category_name?: TranslationsDto;
  created_by_admin_id?: number;
  created_at?: string;
  is_deleted?: boolean;
  [key: string]: unknown;
}

export interface ServiceCategoryListItemDto {
  code?: number;
  description?: string | null;
  name?: TranslationsDto;
  created_by_admin_id?: number;
  created_at?: string;
  is_deleted?: boolean;
  [key: string]: unknown;
}

/** Retrieve payloads are underspecified in OpenAPI — keep loose. */
export type ProfileRetrieveData = Record<string, unknown>;

export interface AccessTokenPayload {
  accessToken?: string | null;
}

export interface GetActorInfoPayload extends AccessTokenPayload {
  actorType: ActorTypeName;
}

export interface GetPublicPanelStatusByOwnerPayload extends AccessTokenPayload {
  actorType: ActorTypeName;
}

export interface RequestPublicPanelChangeStatusPayload extends AccessTokenPayload {
  actorType: ActorTypeName;
  action: PublicPanelStatusAction;
}

export type RetrievePrivatePanelForOwnerPayload = AccessTokenPayload;

export type RetrievePublicPanelForOwnerPayload = AccessTokenPayload;

export interface RetrievePublicPanelForVisitorPayload extends AccessTokenPayload {
  actorId: number;
}

export interface SubmitPrivateTabByOwnerPayload extends AccessTokenPayload {
  tabName: PrivateOwnerTabName;
  body: PrivateTabSubmitByOwnerBodyDto;
}

export interface SubmitPrivateStateByOwnerPayload extends AccessTokenPayload {
  action: RecordStateAction | string;
  tabName: string;
  sectionName: string;
  objectId: number;
}

export interface ReviewPrivateChangesByOwnerPayload extends AccessTokenPayload {
  confirmedRequests?: ConfirmedRequestItemDto[];
  rejectedRequests?: RejectedRequestItemDto[];
}

export interface ReviewPrivateStateByOwnerPayload extends AccessTokenPayload {
  confirmedRequests?: ConfirmedRequestItemDto[];
  rejectedRequests?: RecordRejectedRequestItemDto[];
}

export interface SubmitPublicTabByOwnerPayload extends AccessTokenPayload {
  tabName: ProfileTabName;
  body: PublicTabSubmitByOwnerBodyDto;
}

export interface ListServiceTitlesPayload extends AccessTokenPayload {
  actorType?: ServiceTitleActorType | ServiceTitleActorType[];
  categoryCode?: number;
  ordering?:
    | 'name'
    | '-name'
    | 'abbreviation'
    | '-abbreviation'
    | 'created_at'
    | '-created_at';
  page?: number;
  paginate?: boolean;
  searchQuery?: string;
}

export interface ActorInfo {
  username: string;
  name: string;
  membership: string;
  isDeleted: boolean;
  blockStatus: boolean;
  isPublicPanelActive: boolean;
  isIndividualServiceProvider: boolean;
}

export interface PublicPanelStatus {
  isPublicPanelActive: boolean;
  isPublicPanelActiveIndividual: boolean;
  message: string | null;
}

export interface MutationResult {
  message: string | null;
}

export interface ServiceTitleItem {
  code: number;
  abbreviation: string;
  name: TranslationsDto;
  categoryCode: number;
  actorTypes: string[];
  isDeleted: boolean;
}
