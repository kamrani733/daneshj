import type {
  PanelAcademicRecord,
  PanelEducationAddress,
  PanelSocialLink,
} from '@/components/panel';
import { formatAcademicDate } from '@/lib/jalali';
import { COUNTRY_OPTIONS } from '@private-panel/data/geo';
import type { PrivatePanelProfile } from '@private-panel/data/private-panel-ui';
import {
  VISIBILITY_FIELD_DEFS,
  type VisibilityAcademicRecord,
  type VisibilityField,
  type VisibilityFieldDef,
} from '@private-panel/data/visibility-config';
import { EMPTY_PUBLIC_PANEL } from '@public-panel/data/public-panel-ui';
import type { PublicPanelProfile } from '@public-panel/types/ui';

import {
  ACADEMIC_GROUP_LABELS,
  DEGREE_LABELS,
  STUDY_STATUS_LABELS,
  asArray,
  asRecord,
  formatDisplayValue,
  pickSection,
  readFlag,
  readPending,
  readRecordList,
  readString,
} from '@private-panel/utils/mapper-utils';
import type {
  AcademicRecordUserDto,
  ActorInfo,
  ProfileRetrieveData,
} from '@private-panel/types/api';

const TRANSLATION_SECTION_BY_PARENT: Record<string, string> = {
  identity_info_user: 'identity_info_user_translation',
  social_info_user: 'social_info_user_translation',
};

const TRANSLATED_FIELDS_BY_SECTION: Record<string, Set<string>> = {
  identity_info_user: new Set([
    'first_name',
    'last_name',
    'legal_first_name',
    'legal_last_name',
    'about_me',
  ]),
  social_info_user: new Set(['military_status', 'marital_status']),
};

function pickPreferredTranslationRow(
  privateData: ProfileRetrieveData | null | undefined,
  parent: Record<string, unknown> | null,
  translationKey: string,
  fieldKey?: string
): Record<string, unknown> | null {
  const nested = asArray(parent?.[translationKey]);
  const rows = nested.length > 0 ? nested : readRecordList(privateData, translationKey);
  const records = rows
    .map((item) => {
      const row = asRecord(item);
      const data = asRecord(row?.data);
      return row && data ? { ...row, ...data } : row;
    })
    .filter((item): item is Record<string, unknown> => Boolean(item));
  const candidates = fieldKey
    ? records.filter((item) => fieldKey in item)
    : records;
  return (
    candidates.find((item) => readString(item, 'target_language') === 'fa') ??
    candidates.find((item) => readString(item, 'target_language') === 'en') ??
    candidates[0] ??
    null
  );
}

function resolvePrivateFieldSection(
  privateData: ProfileRetrieveData | null | undefined,
  def: VisibilityFieldDef
): Record<string, unknown> | null {
  const section = resolvePrivateSection(privateData, def);
  if (!def.valueField || !def.apiSection) return section;

  const translationKey = TRANSLATION_SECTION_BY_PARENT[def.apiSection];
  const translatedFields = TRANSLATED_FIELDS_BY_SECTION[def.apiSection];
  if (!translationKey || !translatedFields?.has(def.valueField)) return section;

  const translation = pickPreferredTranslationRow(
    privateData,
    section,
    translationKey,
    def.valueField
  );
  if (!translation || !(def.valueField in translation)) return section;

  return translation;
}

function resolvePrivateSection(
  privateData: ProfileRetrieveData | null | undefined,
  def: VisibilityFieldDef
): Record<string, unknown> | null {
  if (!def.valueField) return null;

  if (
    def.apiSection === 'social_info_user_division_code' ||
    def.apiSection === 'education_occupation_info_user_division_code'
  ) {
    const parentKey =
      def.apiSection === 'social_info_user_division_code'
        ? 'social_info_user'
        : 'education_occupation_info_user';
    const parent = pickSection(privateData, parentKey);
    const divisions = asArray(
      parent?.[def.apiSection] ?? privateData?.[def.apiSection]
    );
    return asRecord(divisions[0]);
  }

  if (
    def.apiSection === 'academic_record_verified_user' ||
    def.apiSection === 'academic_record_submitted_user'
  ) {
    return null;
  }

  const sectionKey =
    def.apiSection === 'membership_type_user'
      ? 'membership_type_user'
      : def.apiSection === 'our_user'
        ? 'our_user'
        : def.apiSection === 'education_occupation_info_user'
          ? 'education_occupation_info_user'
          : def.apiSection === 'contact_info_user'
            ? 'contact_info_user'
            : def.apiSection === 'social_info_user'
              ? 'social_info_user'
              : def.apiSection === 'identity_info_user'
                ? 'identity_info_user'
                : null;

  if (sectionKey) {
    return (
      pickSection(privateData, sectionKey) ??
      asRecord(readRecordList(privateData, sectionKey)[0])
    );
  }

  for (const key of [
    'identity_info_user',
    'contact_info_user',
    'our_user',
    'education_occupation_info_user',
  ]) {
    const section = pickSection(privateData, key);
    if (section && def.valueField in section) return section;
  }

  return null;
}

function readPrivateValue(
  privateData: ProfileRetrieveData | null | undefined,
  def: VisibilityFieldDef
): string {
  if (!def.valueField) return '';
  const section = resolvePrivateFieldSection(privateData, def);
  if (!section) return '';
  return formatDisplayValue(def, readString(section, def.valueField));
}

function readPrivatePending(
  privateData: ProfileRetrieveData | null | undefined,
  def: VisibilityFieldDef
): boolean {
  if (!def.valueField) return false;
  const section = resolvePrivateFieldSection(privateData, def);
  return readPending(section, def.valueField);
}

function readPublicFlag(
  publicFlags: ProfileRetrieveData | null | undefined,
  def: VisibilityFieldDef
): boolean | null {
  const direct = readFlag(publicFlags, def.apiSection, def.apiField);
  if (direct != null || !def.apiSection || !def.apiField) return direct;

  const translationKey = TRANSLATION_SECTION_BY_PARENT[def.apiSection];
  const translatedFields = TRANSLATED_FIELDS_BY_SECTION[def.apiSection];
  if (!translationKey || !translatedFields?.has(def.apiField)) return null;
  return readFlag(publicFlags, translationKey, def.apiField);
}

function readTranslatedString(
  privateData: ProfileRetrieveData | null | undefined,
  primary: Record<string, unknown> | null,
  translationKey: string,
  key: string
): string {
  const translation = pickPreferredTranslationRow(
    privateData,
    primary,
    translationKey,
    key
  );
  if (translation && (!primary || !(key in primary) || readPending(translation, key))) {
    return readString(translation, key);
  }
  return readString(primary, key) || readString(translation, key);
}

function socialHref(
  network: PanelSocialLink['network'],
  value: string
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  switch (network) {
    case 'email':
      return trimmed.includes('@') ? `mailto:${trimmed}` : null;
    case 'telegram':
      return `https://t.me/${trimmed.replace(/^@/, '')}`;
    case 'instagram':
      return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
    case 'x':
      return `https://x.com/${trimmed.replace(/^@/, '')}`;
    case 'whatsapp':
      return `https://wa.me/${trimmed.replace(/\D/g, '')}`;
    case 'linkedin':
      return trimmed.startsWith('http')
        ? trimmed
        : `https://linkedin.com/in/${trimmed.replace(/^@/, '')}`;
    case 'website':
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    default:
      return null;
  }
}

export function mapPrivatePanelProfile(
  actorInfo: ActorInfo | undefined,
  privateData: ProfileRetrieveData | null | undefined
): PrivatePanelProfile {
  const identity = pickSection(privateData, 'identity_info_user');
  const social = pickSection(privateData, 'social_info_user');
  const contact = pickSection(privateData, 'contact_info_user');
  const divisions = asArray(social?.social_info_user_division_code);

  const firstName = readTranslatedString(
    privateData,
    identity,
    'identity_info_user_translation',
    'first_name'
  );
  const lastName = readTranslatedString(
    privateData,
    identity,
    'identity_info_user_translation',
    'last_name'
  );
  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') ||
    actorInfo?.name ||
    actorInfo?.username ||
    '';

  const locationParts = [
    readString(social, 'country_code'),
    ...divisions
      .map((item) => {
        const row = asRecord(item);
        return (
          readString(row, 'other') ||
          readString(row, 'normalized_code') ||
          ''
        );
      })
      .filter(Boolean),
  ].filter(Boolean);

  const socialLinks: PanelSocialLink[] = [];
  const candidates: Array<[PanelSocialLink['network'], string]> = [
    ['email', readString(contact, 'email')],
    ['telegram', readString(contact, 'telegram_id')],
    ['instagram', readString(contact, 'instagram_id')],
    ['x', readString(contact, 'twitter_id')],
    ['whatsapp', readString(contact, 'whatsapp_id')],
    ['linkedin', readString(contact, 'linkedin_id')],
  ];
  for (const [network, value] of candidates) {
    const href = socialHref(network, value);
    if (href) socialLinks.push({ network, href });
  }

  const avatarSrc = readString(identity, 'profile_picture_path');
  const electronicCardPath = readString(
    identity,
    'electronic_card_picture_path'
  );
  const electronicCardHref =
    !electronicCardPath || electronicCardPath === '[object Object]'
      ? '#'
      : electronicCardPath;

  return {
    displayName,
    username:
      actorInfo?.username ||
      readString(pickSection(privateData, 'our_user'), 'username'),
    roleLabelKey: mapMembershipRole(
      actorInfo?.membership ||
        readString(
          pickSection(privateData, 'membership_type_user'),
          'membership_type'
        )
    ),
    providerBadgeKey: actorInfo?.isIndividualServiceProvider
      ? 'individualProvider'
      : null,
    location: locationParts.join('،'),
    bio: readTranslatedString(
      privateData,
      identity,
      'identity_info_user_translation',
      'about_me'
    ),
    avatarSrc,
    electronicCardHref,
    socialLinks,
  };
}

function countryLabel(code: string): string {
  if (!code) return '';
  return COUNTRY_OPTIONS.find((option) => option.value === code)?.label ?? code;
}

function divisionPlaceName(row: Record<string, unknown> | null): string {
  if (!row) return '';
  return readString(row, 'other') || readString(row, 'normalized_code');
}

function mapEducationAddress(
  publicData: ProfileRetrieveData | null | undefined
): PanelEducationAddress {
  const education = pickSection(publicData, 'education_occupation_info_user');
  const divisions = asArray(
    education?.education_occupation_info_user_division_code ??
      publicData?.education_occupation_info_user_division_code
  )
    .map((item) => asRecord(item))
    .filter((row): row is Record<string, unknown> => Boolean(row));

  const sorted = [...divisions].sort(
    (a, b) => Number(a.level ?? 0) - Number(b.level ?? 0)
  );
  const byLevel = (level: number) =>
    sorted.find((row) => Number(row.level) === level);

  return {
    country: countryLabel(readString(education, 'country_code')),
    province: divisionPlaceName(byLevel(1) ?? sorted[0] ?? null),
    city: divisionPlaceName(byLevel(2) ?? sorted[1] ?? null),
    district: divisionPlaceName(byLevel(3) ?? sorted[2] ?? null),
  };
}

export function toPanelAcademicRecord(
  record: VisibilityAcademicRecord
): PanelAcademicRecord {
  const isGraduate =
    record.studyStatus === '2' || record.roleLabel.includes('فارغ');

  return {
    id: record.id,
    degree: record.degree,
    university: [record.university, record.faculty].filter(Boolean).join('، '),
    fieldGroup: record.fieldGroup,
    description: record.description,
    endDate: formatAcademicDate(record.endDate),
    role: isGraduate ? 'graduate' : 'student',
    roleLabel: record.roleLabel,
    status: record.source === 'verified' ? 'verified' : 'declared',
    statusLabel: record.statusLabel,
  };
}

function mapPublicAcademicRecords(
  publicData: ProfileRetrieveData | null | undefined
): PanelAcademicRecord[] {
  return mapAcademicRecords(publicData).map(toPanelAcademicRecord);
}

function collectSocialLinks(
  contact: Record<string, unknown> | null
): PanelSocialLink[] {
  const links: PanelSocialLink[] = [];
  const candidates: Array<[PanelSocialLink['network'], string]> = [
    ['email', readString(contact, 'email')],
    ['telegram', readString(contact, 'telegram_id')],
    ['instagram', readString(contact, 'instagram_id')],
    ['x', readString(contact, 'twitter_id')],
    ['whatsapp', readString(contact, 'whatsapp_id')],
    ['linkedin', readString(contact, 'linkedin_id')],
    ['website', readString(contact, 'website')],
  ];
  for (const [network, value] of candidates) {
    const href = socialHref(network, value);
    if (href) links.push({ network, href });
  }
  return links;
}

export function mapPublicPanelProfile(
  actorId: number,
  publicData: ProfileRetrieveData | null | undefined
): PublicPanelProfile {
  const identity = mapPrivatePanelProfile(undefined, publicData);
  const ourUser = pickSection(publicData, 'our_user');
  const social = pickSection(publicData, 'social_info_user');
  const contact = pickSection(publicData, 'contact_info_user');
  const socialLinks = collectSocialLinks(contact);
  const locationParts = [
    countryLabel(readString(social, 'country_code')),
    ...asArray(social?.social_info_user_division_code)
      .map((item) => divisionPlaceName(asRecord(item)))
      .filter(Boolean),
  ].filter(Boolean);

  const isProvider =
    readString(ourUser, 'is_individual_service_provider') === 'true';

  return {
    ...EMPTY_PUBLIC_PANEL,
    ...identity,
    actorId,
    actorType: 1,
    location: locationParts.join('، ') || identity.location,
    providerBadgeKey: isProvider ? 'individualProvider' : identity.providerBadgeKey,
    // Visitor page hides the card CTA when there is no real link (private panel keeps '#').
    electronicCardHref:
      identity.electronicCardHref === '#' ? '' : identity.electronicCardHref,
    socialLinks,
    serviceSocialLinks: socialLinks,
    academicRecords: mapPublicAcademicRecords(publicData),
    educationAddress: mapEducationAddress(publicData),
  };
}

function mapMembershipRole(
  raw: string | undefined
): PrivatePanelProfile['roleLabelKey'] {
  const value = (raw ?? '').trim().toLowerCase();
  if (!value) return 'normal';
  if (
    value === '2' ||
    value.includes('student') ||
    value.includes('دانشجو')
  ) {
    return 'student';
  }
  if (
    value === '3' ||
    value.includes('graduate') ||
    value.includes('فارغ')
  ) {
    return 'graduate';
  }
  return 'normal';
}

type VisibilityFieldsOptions = {
  submitter?: 'owner' | 'admin';
};

function isFieldLockedForSubmitter(
  def: VisibilityFieldDef,
  submitter: 'owner' | 'admin'
): boolean {
  if (submitter === 'admin' && def.id === 'nationalId') return true;
  return Boolean(def.locked);
}

export function mapVisibilityFields(
  privateData: ProfileRetrieveData | null | undefined,
  publicFlags: ProfileRetrieveData | null | undefined,
  options: VisibilityFieldsOptions = {}
): VisibilityField[] {
  const submitter = options.submitter ?? 'owner';
  return VISIBILITY_FIELD_DEFS.map((def) => {
    const flag = readPublicFlag(publicFlags, def);
    const value =
      def.id === 'providerFullName'
        ? readFullName(privateData)
        : readPrivateValue(privateData, def);
    const imageSrc = def.kind === 'photo' && value ? value : undefined;
    const locked = isFieldLockedForSubmitter(def, submitter);

    return {
      id: def.id,
      category: def.category,
      section: def.section,
      kind: def.kind,
      labelKey: def.labelKey,
      value,
      initiallyVisible: flag ?? false,
      selectedInitially: flag ?? false,
      locked,
      lockedCaptionKey:
        locked && def.id === 'nationalId' ? 'locked' : def.lockedCaptionKey,
      hiddenCaptionKey: def.hiddenCaptionKey,
      withCalendar: def.withCalendar,
      imageSrc,
      documentSlot: def.documentSlot,
      pending: readPrivatePending(privateData, def),
    };
  });
}

function readFullName(
  privateData: ProfileRetrieveData | null | undefined
): string {
  const identity = pickSection(privateData, 'identity_info_user');
  const first = readTranslatedString(
    privateData,
    identity,
    'identity_info_user_translation',
    'first_name'
  );
  const last = readTranslatedString(
    privateData,
    identity,
    'identity_info_user_translation',
    'last_name'
  );
  return [first, last].filter(Boolean).join(' ');
}

function mapOneAcademicRecord(
  item: unknown,
  index: number,
  statusLabel: string,
  source: 'verified' | 'submitted'
): VisibilityAcademicRecord {
  const row = asRecord(item) ?? {};
  const translationKey =
    source === 'verified'
      ? 'academic_record_verified_user_translation'
      : 'academic_record_submitted_user_translation';
  const translation = pickPreferredTranslationRow(
    null,
    row,
    translationKey
  );
  const translationApiId =
    typeof translation?.id === 'number' ? translation.id : null;
  const targetLanguage = readString(translation, 'target_language') || 'fa';
  const degreeLevel = readString(row, 'degree_level');
  const academicGroup = readString(row, 'academic_group');
  const studyStatus = readString(row, 'study_status');
  const fieldOfStudy =
    readString(translation, 'field_of_study') ||
    readString(row, 'field_of_study');
  const degree =
    [DEGREE_LABELS[degreeLevel] ?? degreeLevel, fieldOfStudy]
      .filter(Boolean)
      .join(' ') || fieldOfStudy;
  const apiId = typeof row.id === 'number' ? row.id : null;

  return {
    id: String(apiId ?? `${source}-${index}`),
    apiId,
    translationApiId,
    targetLanguage,
    source,
    academicGroup,
    fieldOfStudy,
    university:
      readString(translation, 'university') || readString(row, 'university'),
    faculty: readString(translation, 'faculty') || readString(row, 'faculty'),
    degreeLevel,
    studyStatus,
    degree,
    fieldGroup: ACADEMIC_GROUP_LABELS[academicGroup] ?? academicGroup,
    description:
      readString(translation, 'degree_level_description') ||
      readString(row, 'degree_level_description'),
    endDate: readString(row, 'graduation_date'),
    roleLabel: STUDY_STATUS_LABELS[studyStatus] ?? studyStatus,
    statusLabel,
    initiallyVisible: false,
  };
}

export function mapAcademicRecords(
  privateData: ProfileRetrieveData | null | undefined
): VisibilityAcademicRecord[] {
  const verified = readRecordList(privateData, 'academic_record_verified_user');
  const submitted = readRecordList(
    privateData,
    'academic_record_submitted_user'
  );

  return [
    ...verified.map((item, index) =>
      mapOneAcademicRecord(item, index, 'تایید شده', 'verified')
    ),
    ...submitted.map((item, index) =>
      mapOneAcademicRecord(item, index, 'اظهاری', 'submitted')
    ),
  ];
}

export function toAcademicRecordUserDto(
  record: Pick<
    VisibilityAcademicRecord,
    | 'apiId'
    | 'translationApiId'
    | 'targetLanguage'
    | 'academicGroup'
    | 'fieldOfStudy'
    | 'faculty'
    | 'university'
    | 'degreeLevel'
    | 'description'
    | 'studyStatus'
    | 'endDate'
  >
): AcademicRecordUserDto {
  const academicGroup = Number(record.academicGroup);
  const degreeLevel = Number(record.degreeLevel);
  const studyStatus = Number(record.studyStatus);
  const translation = {
    ...(record.translationApiId != null ? { id: record.translationApiId } : {}),
    target_language: record.targetLanguage || 'fa',
    field_of_study: record.fieldOfStudy.trim() || null,
    faculty: record.faculty.trim() || null,
    university: record.university.trim() || null,
    degree_level_description: record.description.trim() || null,
  };

  return {
    id: record.apiId ?? 0,
    academic_group:
      academicGroup >= 1 && academicGroup <= 7
        ? (academicGroup as AcademicRecordUserDto['academic_group'])
        : null,
    degree_level:
      degreeLevel >= 1 && degreeLevel <= 6
        ? (degreeLevel as AcademicRecordUserDto['degree_level'])
        : null,
    study_status:
      studyStatus === 1 || studyStatus === 2
        ? (studyStatus as AcademicRecordUserDto['study_status'])
        : null,
    graduation_date: record.endDate.trim() || null,
    academic_record_submitted_user_translation: [translation],
  };
}
