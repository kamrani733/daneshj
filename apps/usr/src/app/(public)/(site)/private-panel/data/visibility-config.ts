/** UI catalog for public-panel visibility — values/flags come from Actor MS. */

/** Mirrors Actor `tab_name` query (profiles_user public/private). */
export type VisibilityTabName =
  | 'contact_information'
  | 'educational_information'
  | 'identity_information'
  | 'social_information'
  | 'user_information';

export type VisibilityCategoryId =
  | 'identity'
  | 'social'
  | 'contact'
  | 'account'
  | 'education'
  | 'provider';

export type VisibilityFieldKind = 'text' | 'photo' | 'textarea' | 'toggle';

export type VisibilityAcademicRecord = {
  id: string;
  degree: string;
  university: string;
  faculty: string;
  fieldGroup: string;
  description: string;
  endDate: string;
  roleLabel: string;
  statusLabel: string;
  initiallyVisible: boolean;
};

export type VisibilitySection = {
  key: string;
  titleKey: string;
};

export type VisibilityField = {
  id: string;
  category: VisibilityCategoryId;
  section: string;
  kind: VisibilityFieldKind;
  labelKey: string;
  value: string;
  initiallyVisible: boolean;
  selectedInitially?: boolean;
  locked?: boolean;
  lockedCaptionKey?: 'locked' | 'notDisplayed';
  hiddenCaptionKey?: 'notDisplayed';
  withCalendar?: boolean;
  imageSrc?: string;
  /** True when Actor wrapped value is awaiting admin approval. */
  pending?: boolean;
};

/** Maps a UI field to YAML PatchedUserDynamicFlagSerializersRequest paths. */
export type VisibilityFieldDef = {
  id: string;
  category: VisibilityCategoryId;
  section: string;
  kind: VisibilityFieldKind;
  labelKey: string;
  /** Public-panel tab_name for submit-by-owner. */
  tabName: VisibilityTabName | null;
  /** Section key inside the public flag body. */
  apiSection: string | null;
  /** Boolean flag field name inside that section. */
  apiField: string | null;
  /** Value path under private retrieve section (snake_case). */
  valueField?: string | null;
  locked?: boolean;
  lockedCaptionKey?: 'locked' | 'notDisplayed';
  hiddenCaptionKey?: 'notDisplayed';
  withCalendar?: boolean;
};

export const VISIBILITY_CATEGORIES: VisibilityCategoryId[] = [
  'identity',
  'social',
  'contact',
  'account',
  'education',
  'provider',
];

export const VISIBILITY_SECTIONS: Record<
  VisibilityCategoryId,
  VisibilitySection[]
> = {
  identity: [{ key: 'identity', titleKey: 'identity' }],
  social: [
    { key: 'social', titleKey: 'social' },
    { key: 'address', titleKey: 'address' },
  ],
  contact: [{ key: 'contact', titleKey: 'contact' }],
  account: [{ key: 'account', titleKey: 'account' }],
  education: [
    { key: 'educationExtra', titleKey: 'education' },
    { key: 'educationWorkAddress', titleKey: 'educationWorkAddress' },
    { key: 'academicRecords', titleKey: 'academicRecords' },
  ],
  provider: [{ key: 'provider', titleKey: 'provider' }],
};

export const CATEGORY_TO_TAB: Record<
  VisibilityCategoryId,
  VisibilityTabName | null
> = {
    identity: 'identity_information',
    social: 'social_information',
    contact: 'contact_information',
    account: 'user_information',
    education: 'educational_information',
    provider: null,
  };

export const VISIBILITY_FIELD_DEFS: VisibilityFieldDef[] = [
  {
    id: 'avatar',
    category: 'identity',
    section: 'identity',
    kind: 'photo',
    labelKey: 'avatar',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'profile_picture_path',
    valueField: 'profile_picture_path',
  },
  {
    id: 'electronicCardPhoto',
    category: 'identity',
    section: 'identity',
    kind: 'photo',
    labelKey: 'electronicCardPhoto',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'electronic_card_picture_path',
    valueField: 'electronic_card_picture_path',
  },
  {
    id: 'firstName',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'firstName',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'first_name',
    valueField: 'first_name',
  },
  {
    id: 'lastName',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'lastName',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'last_name',
    valueField: 'last_name',
  },
  {
    id: 'legalFirstName',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'legalFirstName',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'legal_first_name',
    valueField: 'legal_first_name',
  },
  {
    id: 'legalLastName',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'legalLastName',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'legal_last_name',
    valueField: 'legal_last_name',
  },
  {
    id: 'nationalId',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'nationalId',
    tabName: null,
    apiSection: null,
    apiField: null,
    valueField: 'national_code',
    locked: true,
  },
  {
    id: 'birthDate',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'birthDate',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'birth_date',
    valueField: 'birth_date',
    withCalendar: true,
  },
  {
    id: 'gender',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'gender',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'gender',
    valueField: 'gender',
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'bio',
    category: 'identity',
    section: 'identity',
    kind: 'textarea',
    labelKey: 'bio',
    tabName: 'identity_information',
    apiSection: 'identity_info_user',
    apiField: 'about_me',
    valueField: 'about_me',
  },
  {
    id: 'militaryStatus',
    category: 'social',
    section: 'social',
    kind: 'text',
    labelKey: 'militaryStatus',
    tabName: 'social_information',
    apiSection: 'social_info_user',
    apiField: 'military_status',
    valueField: 'military_status',
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'maritalStatus',
    category: 'social',
    section: 'social',
    kind: 'text',
    labelKey: 'maritalStatus',
    tabName: 'social_information',
    apiSection: 'social_info_user',
    apiField: 'marital_status',
    valueField: 'marital_status',
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'country',
    category: 'social',
    section: 'address',
    kind: 'text',
    labelKey: 'country',
    tabName: 'social_information',
    apiSection: 'social_info_user',
    apiField: 'country_code',
    valueField: 'country_code',
  },
  {
    id: 'province',
    category: 'social',
    section: 'address',
    kind: 'text',
    labelKey: 'province',
    tabName: 'social_information',
    apiSection: 'social_info_user_division_code',
    apiField: 'normalized_code',
    valueField: 'normalized_code',
  },
  {
    id: 'city',
    category: 'social',
    section: 'address',
    kind: 'text',
    labelKey: 'city',
    tabName: 'social_information',
    apiSection: 'social_info_user_division_code',
    apiField: 'other',
    valueField: 'other',
  },
  {
    id: 'district',
    category: 'social',
    section: 'address',
    kind: 'text',
    labelKey: 'district',
    tabName: 'social_information',
    apiSection: 'social_info_user_division_code',
    apiField: 'level',
    valueField: 'level',
  },
  {
    id: 'mobile',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'mobile',
    tabName: null,
    apiSection: null,
    apiField: null,
    valueField: 'mobile',
    locked: true,
  },
  {
    id: 'email',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'email',
    tabName: 'contact_information',
    apiSection: 'contact_info_user',
    apiField: 'email',
    valueField: 'email',
  },
  {
    id: 'whatsapp',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'whatsapp',
    tabName: 'contact_information',
    apiSection: 'contact_info_user',
    apiField: 'whatsapp_id',
    valueField: 'whatsapp_id',
  },
  {
    id: 'telegram',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'telegram',
    tabName: 'contact_information',
    apiSection: 'contact_info_user',
    apiField: 'telegram_id',
    valueField: 'telegram_id',
  },
  {
    id: 'instagram',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'instagram',
    tabName: 'contact_information',
    apiSection: 'contact_info_user',
    apiField: 'instagram_id',
    valueField: 'instagram_id',
  },
  {
    id: 'x',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'x',
    tabName: 'contact_information',
    apiSection: 'contact_info_user',
    apiField: 'twitter_id',
    valueField: 'twitter_id',
  },
  {
    id: 'linkedin',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'linkedin',
    tabName: 'contact_information',
    apiSection: 'contact_info_user',
    apiField: 'linkedin_id',
    valueField: 'linkedin_id',
  },
  {
    id: 'username',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'username',
    tabName: 'user_information',
    apiSection: 'our_user',
    apiField: 'username',
    valueField: 'username',
  },
  {
    id: 'membershipType',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'membershipType',
    tabName: 'user_information',
    apiSection: 'membership_type_user',
    apiField: 'membership_type',
    valueField: 'membership_type',
  },
  {
    id: 'membershipDate',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'membershipDate',
    tabName: 'user_information',
    apiSection: 'our_user',
    apiField: 'create_time',
    valueField: 'create_time',
    withCalendar: true,
  },
  {
    id: 'membershipExpiry',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'membershipExpiry',
    tabName: 'user_information',
    apiSection: 'membership_type_user',
    apiField: 'membership_expiry',
    valueField: 'membership_expiry',
    withCalendar: true,
  },
  {
    id: 'levelChangeMethod',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'levelChangeMethod',
    tabName: 'user_information',
    apiSection: 'membership_type_user',
    apiField: 'membership_level_change_method',
    valueField: 'membership_level_change_method',
    locked: true,
    lockedCaptionKey: 'notDisplayed',
  },
  {
    id: 'serviceProviderStatus',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'serviceProviderStatus',
    tabName: 'user_information',
    apiSection: 'our_user',
    apiField: 'is_individual_service_provider',
    valueField: 'is_individual_service_provider',
  },
  {
    id: 'gradEmploymentStatus',
    category: 'education',
    section: 'educationExtra',
    kind: 'text',
    labelKey: 'gradEmploymentStatus',
    tabName: 'educational_information',
    apiSection: 'education_occupation_info_user',
    apiField: 'status',
    valueField: 'status',
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'studentNumber',
    category: 'education',
    section: 'educationExtra',
    kind: 'text',
    labelKey: 'studentNumber',
    tabName: null,
    apiSection: null,
    apiField: null,
    valueField: 'student_id',
    locked: true,
  },
  {
    id: 'eduCountry',
    category: 'education',
    section: 'educationWorkAddress',
    kind: 'text',
    labelKey: 'country',
    tabName: 'educational_information',
    apiSection: 'education_occupation_info_user',
    apiField: 'country_code',
    valueField: 'country_code',
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'eduProvince',
    category: 'education',
    section: 'educationWorkAddress',
    kind: 'text',
    labelKey: 'province',
    tabName: 'educational_information',
    apiSection: 'education_occupation_info_user_division_code',
    apiField: 'normalized_code',
    valueField: 'normalized_code',
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'eduCity',
    category: 'education',
    section: 'educationWorkAddress',
    kind: 'text',
    labelKey: 'city',
    tabName: 'educational_information',
    apiSection: 'education_occupation_info_user_division_code',
    apiField: 'other',
    valueField: 'other',
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'eduDistrict',
    category: 'education',
    section: 'educationWorkAddress',
    kind: 'text',
    labelKey: 'district',
    tabName: 'educational_information',
    apiSection: 'education_occupation_info_user_division_code',
    apiField: 'level',
    valueField: 'level',
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'recordMajor',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordMajor',
    tabName: 'educational_information',
    apiSection: 'academic_record_verified_user',
    apiField: 'field_of_study',
  },
  {
    id: 'recordUniversity',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordUniversity',
    tabName: 'educational_information',
    apiSection: 'academic_record_verified_user',
    apiField: 'university',
  },
  {
    id: 'recordFieldGroup',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordFieldGroup',
    tabName: 'educational_information',
    apiSection: 'academic_record_verified_user',
    apiField: 'academic_group',
  },
  {
    id: 'recordDegreeLevel',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordDegreeLevel',
    tabName: 'educational_information',
    apiSection: 'academic_record_verified_user',
    apiField: 'degree_level',
  },
  {
    id: 'recordFaculty',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordFaculty',
    tabName: 'educational_information',
    apiSection: 'academic_record_verified_user',
    apiField: 'faculty',
  },
  {
    id: 'recordStudentStatus',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordStudentStatus',
    tabName: 'educational_information',
    apiSection: 'academic_record_verified_user',
    apiField: 'study_status',
  },
  {
    id: 'recordDegreeDescription',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordDegreeDescription',
    tabName: 'educational_information',
    apiSection: 'academic_record_verified_user',
    apiField: 'degree_level_description',
  },
  {
    id: 'recordGraduationDate',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordGraduationDate',
    tabName: 'educational_information',
    apiSection: 'academic_record_verified_user',
    apiField: 'graduation_date',
  },
  // Provider fields — no matching public-flag section in current Actor YAML.
  {
    id: 'workPhone',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workPhone',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'workEmail',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workEmail',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'workWhatsapp',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workWhatsapp',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'workTelegram',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workTelegram',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'workInstagram',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workInstagram',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'workX',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workX',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'workLinkedin',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workLinkedin',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'github',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'github',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'website',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'website',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'providerCredit',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'providerCredit',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
  {
    id: 'offeredServices',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'offeredServices',
    tabName: null,
    apiSection: null,
    apiField: null,
  },
];

export function academicRecordSelectionSeed(
  records: VisibilityAcademicRecord[]
): Record<string, boolean> {
  return Object.fromEntries(
    records.map((record) => [record.id, record.initiallyVisible])
  );
}
