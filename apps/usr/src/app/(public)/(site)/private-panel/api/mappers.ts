import type { PanelSocialLink } from '@/components/panel';
import type { PrivatePanelProfile } from '@private-panel/data/private-panel-ui';
import {
  VISIBILITY_FIELD_DEFS,
  type VisibilityAcademicRecord,
  type VisibilityField,
  type VisibilityFieldDef,
} from '@private-panel/data/visibility-config';
import { pad2 } from '@/lib/jalali';

import type {
  ActorInfo,
  PrivateOwnerTabName,
  PrivateTabSubmitByOwnerBodyDto,
  ProfileRetrieveData,
  ProfileTabName,
  PublicTabSubmitByOwnerBodyDto,
} from './types';

const PRIVATE_OWNER_TABS: PrivateOwnerTabName[] = [
  'identity_information',
  'social_information',
  'contact_information',
  'educational_information',
];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function pickSection(
  data: ProfileRetrieveData | null | undefined,
  key: string
): Record<string, unknown> | null {
  if (!data) return null;
  const direct = asRecord(data[key]);
  if (direct) return direct;
  const nested = asRecord(data.data);
  if (nested) {
    const fromNested = asRecord(nested[key]);
    if (fromNested) return fromNested;
  }
  const profile = asRecord(data.profile);
  if (profile) {
    const fromProfile = asRecord(profile[key]);
    if (fromProfile) return fromProfile;
  }
  return null;
}

function unwrapFieldValue(raw: unknown): unknown {
  if (raw == null) return raw;
  if (typeof raw !== 'object' || Array.isArray(raw)) return raw;
  const field = raw as Record<string, unknown>;
  if (
    'value' in field ||
    'new_value' in field ||
    'previous_value' in field ||
    'pending' in field ||
    'editable' in field
  ) {
    if (field.value != null && field.value !== '') return field.value;
    if (field.new_value != null && field.new_value !== '') return field.new_value;
    if (field.previous_value != null) return field.previous_value;
    return field.value ?? '';
  }
  return raw;
}

function isWrappedPending(raw: unknown): boolean {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) return false;
  return Boolean((raw as Record<string, unknown>).pending);
}

function readPending(
  source: Record<string, unknown> | null,
  key: string
): boolean {
  if (!source) return false;
  return isWrappedPending(source[key]);
}

function readString(source: Record<string, unknown> | null, key: string): string {
  if (!source) return '';
  const value = unwrapFieldValue(source[key]);
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return '';
  return String(value);
}

function readFlag(
  flags: ProfileRetrieveData | null | undefined,
  section: string | null,
  field: string | null
): boolean | null {
  if (!section || !field) return null;
  const sectionData = pickSection(flags, section);
  if (!sectionData) return null;
  const value = sectionData[field];
  if (typeof value === 'boolean') return value;
  if (value == null) return null;
  return Boolean(value);
}

const GENDER_LABELS: Record<string, string> = {
  '1': 'مرد',
  '2': 'زن',
  '3': 'سایر',
  Male: 'مرد',
  Female: 'زن',
  Other: 'سایر',
};

const DEGREE_LABELS: Record<string, string> = {
  '1': 'کاردانی',
  '2': 'کارشناسی',
  '3': 'کارشناسی ارشد',
  '4': 'دکتری',
  '5': 'پسادکتری',
  '6': 'سایر',
};

const ACADEMIC_GROUP_LABELS: Record<string, string> = {
  '1': 'علوم پایه',
  '2': 'فنی مهندسی',
  '3': 'علوم انسانی',
  '4': 'پزشکی',
  '5': 'هنر',
  '6': 'زبان',
  '7': 'سایر',
};

const STUDY_STATUS_LABELS: Record<string, string> = {
  '1': 'در حال تحصیل',
  '2': 'فارغ‌التحصیل',
};

const OCCUPATION_STATUS_LABELS: Record<string, string> = {
  '1': 'دانشجو',
  '2': 'فارغ‌التحصیل',
  '3': 'مدرسه',
  '4': 'ورود',
  '5': 'سایر',
};

function formatIsoAsDateOnly(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const looksInstant =
    /[Tt]/.test(trimmed) ||
    /[Zz]$/.test(trimmed) ||
    /[+-]\d{2}:?\d{2}$/.test(trimmed);

  if (looksInstant) {
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
    }
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  return null;
}

function formatDisplayValue(def: VisibilityFieldDef, raw: string): string {
  if (!raw) return '';
  if (def.id === 'gender') return GENDER_LABELS[raw] ?? raw;
  if (def.id === 'gradEmploymentStatus') {
    return OCCUPATION_STATUS_LABELS[raw] ?? raw;
  }
  if (def.id === 'serviceProviderStatus') {
    if (raw === 'true') return 'سرویس‌دهنده انفرادی';
    if (raw === 'false') return '';
  }
  if (
    def.withCalendar ||
    def.id === 'membershipDate' ||
    def.id === 'membershipExpiry' ||
    def.id === 'birthDate'
  ) {
    return formatIsoAsDateOnly(raw) ?? raw;
  }
  return raw;
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
    return pickSection(privateData, sectionKey);
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
  const section = resolvePrivateSection(privateData, def);
  if (!section) return '';
  return formatDisplayValue(def, readString(section, def.valueField));
}

function readPrivatePending(
  privateData: ProfileRetrieveData | null | undefined,
  def: VisibilityFieldDef
): boolean {
  if (!def.valueField) return false;
  const section = resolvePrivateSection(privateData, def);
  return readPending(section, def.valueField);
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

  const firstName = readString(identity, 'first_name');
  const lastName = readString(identity, 'last_name');
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
        readString(pickSection(privateData, 'membership_type_user'), 'membership_type')
    ),
    providerBadgeKey: actorInfo?.isIndividualServiceProvider
      ? 'individualProvider'
      : null,
    location: locationParts.join('،'),
    bio: readString(identity, 'about_me'),
    avatarSrc,
    electronicCardHref,
    socialLinks,
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

export function mapVisibilityFields(
  privateData: ProfileRetrieveData | null | undefined,
  publicFlags: ProfileRetrieveData | null | undefined
): VisibilityField[] {
  return VISIBILITY_FIELD_DEFS.map((def) => {
    const flag = readFlag(publicFlags, def.apiSection, def.apiField);
    const value = readPrivateValue(privateData, def);
    const imageSrc = def.kind === 'photo' && value ? value : undefined;

    return {
      id: def.id,
      category: def.category,
      section: def.section,
      kind: def.kind,
      labelKey: def.labelKey,
      value,
      initiallyVisible: flag ?? false,
      selectedInitially: flag ?? false,
      locked: def.locked,
      lockedCaptionKey: def.lockedCaptionKey,
      hiddenCaptionKey: def.hiddenCaptionKey,
      withCalendar: def.withCalendar,
      imageSrc,
      pending: readPrivatePending(privateData, def),
    };
  });
}

function readRecordList(
  data: ProfileRetrieveData | null | undefined,
  key: string
): unknown[] {
  if (!data) return [];
  const direct = asArray(data[key]);
  if (direct.length > 0) return direct;
  const nestedData = asRecord(data.data);
  if (nestedData) {
    const nested = asArray(nestedData[key]);
    if (nested.length > 0) return nested;
  }
  const profile = asRecord(data.profile);
  if (profile) return asArray(profile[key]);
  return [];
}

function mapOneAcademicRecord(
  item: unknown,
  index: number,
  statusLabel: string,
  idPrefix: string
): VisibilityAcademicRecord {
  const row = asRecord(item) ?? {};
  const degreeLevel = readString(row, 'degree_level');
  const academicGroup = readString(row, 'academic_group');
  const studyStatus = readString(row, 'study_status');
  const fieldOfStudy = readString(row, 'field_of_study');
  const degree =
    [DEGREE_LABELS[degreeLevel] ?? degreeLevel, fieldOfStudy]
      .filter(Boolean)
      .join(' ') || fieldOfStudy;

  return {
    id: String(row.id ?? `${idPrefix}-${index}`),
    degree,
    university: readString(row, 'university'),
    faculty: readString(row, 'faculty'),
    fieldGroup: ACADEMIC_GROUP_LABELS[academicGroup] ?? academicGroup,
    description: readString(row, 'degree_level_description'),
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

export function toPublicVisibilitySubmitBody(
  selection: Record<string, boolean>,
  tabName: ProfileTabName | string
): PublicTabSubmitByOwnerBodyDto {
  const body: PublicTabSubmitByOwnerBodyDto = {};

  for (const def of VISIBILITY_FIELD_DEFS) {
    if (def.tabName !== tabName || !def.apiSection || !def.apiField) continue;
    if (def.locked) continue;

    const sectionKey = def.apiSection as keyof PublicTabSubmitByOwnerBodyDto;
    const section = (body[sectionKey] ??= {}) as Record<string, boolean>;
    section[def.apiField] = Boolean(selection[def.id]);
  }

  return body;
}

export function tabsAffectedBySelection(
  selection: Record<string, boolean>,
  savedSelection: Record<string, boolean>
): ProfileTabName[] {
  const tabs = new Set<ProfileTabName>();
  for (const def of VISIBILITY_FIELD_DEFS) {
    if (!def.tabName || !def.apiField) continue;
    if (Boolean(selection[def.id]) !== Boolean(savedSelection[def.id])) {
      tabs.add(def.tabName);
    }
  }
  return [...tabs];
}

const GENDER_SUBMIT: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  مرد: 1,
  زن: 2,
  سایر: 3,
};

const OCCUPATION_SUBMIT: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  دانشجو: 1,
  'فارغ‌التحصیل': 2,
  مدرسه: 3,
  ورود: 4,
  سایر: 5,
};

function parsePrivateFieldValue(
  def: VisibilityFieldDef,
  raw: string
): string | number | boolean | null {
  const trimmed = raw.trim();
  if (def.id === 'gender') {
    return GENDER_SUBMIT[trimmed] ?? (trimmed ? Number(trimmed) || null : null);
  }
  if (def.id === 'gradEmploymentStatus') {
    return (
      OCCUPATION_SUBMIT[trimmed] ?? (trimmed ? Number(trimmed) || null : null)
    );
  }
  if (def.id === 'serviceProviderStatus') {
    if (trimmed === 'true' || trimmed === 'سرویس‌دهنده انفرادی') return true;
    if (trimmed === 'false' || trimmed === '') return false;
  }
  return trimmed;
}

const PRIVATE_SUBMIT_SECTIONS = new Set([
  'identity_info_user',
  'social_info_user',
  'contact_info_user',
  'education_occupation_info_user',
]);

export function tabsAffectedByValues(
  values: Record<string, string>,
  savedValues: Record<string, string>
): PrivateOwnerTabName[] {
  const tabs = new Set<PrivateOwnerTabName>();
  for (const def of VISIBILITY_FIELD_DEFS) {
    if (!def.tabName || !def.valueField || !def.apiSection) continue;
    if (!PRIVATE_OWNER_TABS.includes(def.tabName as PrivateOwnerTabName)) {
      continue;
    }
    if (def.locked || def.kind === 'toggle') continue;
    if (!PRIVATE_SUBMIT_SECTIONS.has(def.apiSection)) continue;
    if ((values[def.id] ?? '') !== (savedValues[def.id] ?? '')) {
      tabs.add(def.tabName as PrivateOwnerTabName);
    }
  }
  return [...tabs];
}

export type PendingFieldRequest = {
  requestId: number;
  sectionKey: string;
  apiField: string;
  fieldId: string | null;
  labelKey: string | null;
  newValue: string;
  previousValue: string;
};

const PENDING_SECTIONS = [
  'identity_info_user',
  'social_info_user',
  'contact_info_user',
  'education_occupation_info_user',
] as const;

export function mapPendingFieldRequests(
  privateData: ProfileRetrieveData | null | undefined
): PendingFieldRequest[] {
  const items: PendingFieldRequest[] = [];
  if (!privateData) return items;

  for (const sectionKey of PENDING_SECTIONS) {
    const section = pickSection(privateData, sectionKey);
    if (!section) continue;
    for (const [apiField, raw] of Object.entries(section)) {
      if (apiField === 'id' || !isWrappedPending(raw)) continue;
      const wrapped = asRecord(raw) ?? {};
      const requestId = Number(wrapped.request_id);
      if (!Number.isFinite(requestId) || requestId <= 0) continue;
      const def = VISIBILITY_FIELD_DEFS.find(
        (item) =>
          item.apiSection === sectionKey && item.valueField === apiField
      );
      const newValue = unwrapFieldValue(wrapped.new_value ?? wrapped.value);
      const previousValue = unwrapFieldValue(wrapped.previous_value);
      items.push({
        requestId,
        sectionKey,
        apiField,
        fieldId: def?.id ?? null,
        labelKey: def?.labelKey ?? null,
        newValue:
          newValue == null || typeof newValue === 'object'
            ? ''
            : String(newValue),
        previousValue:
          previousValue == null || typeof previousValue === 'object'
            ? ''
            : String(previousValue),
      });
    }
  }

  return items;
}

export function sanitizeValuesForPrivateSubmit(
  values: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => !value.startsWith('blob:'))
  );
}

export function toPrivateTabSubmitBody(
  values: Record<string, string>,
  tabName: PrivateOwnerTabName,
  privateData?: ProfileRetrieveData | null,
  savedValues: Record<string, string> = {}
): PrivateTabSubmitByOwnerBodyDto {
  const body: PrivateTabSubmitByOwnerBodyDto = {};

  const sectionIds: Partial<Record<string, number>> = {};
  for (const key of [
    'identity_info_user',
    'social_info_user',
    'contact_info_user',
    'education_occupation_info_user',
  ] as const) {
    const section = pickSection(privateData, key);
    const id = section?.id;
    if (typeof id === 'number') sectionIds[key] = id;
  }

  for (const def of VISIBILITY_FIELD_DEFS) {
    if (def.tabName !== tabName || !def.valueField || !def.apiSection) continue;
    if (def.kind === 'toggle') continue;
    if (
      def.apiSection === 'social_info_user_division_code' ||
      def.apiSection === 'education_occupation_info_user_division_code' ||
      def.apiSection === 'academic_record_verified_user' ||
      def.apiSection === 'academic_record_submitted_user' ||
      def.apiSection === 'our_user' ||
      def.apiSection === 'membership_type_user'
    ) {
      continue;
    }

    const next = values[def.id] ?? '';
    const prev = savedValues[def.id] ?? '';
    if (next === prev) continue;

    const parsed = parsePrivateFieldValue(def, next);
    if (parsed === '' || parsed == null) continue;

    const sectionKey = def.apiSection as
      | 'identity_info_user'
      | 'social_info_user'
      | 'contact_info_user'
      | 'education_occupation_info_user';
    if (
      sectionKey !== 'identity_info_user' &&
      sectionKey !== 'social_info_user' &&
      sectionKey !== 'contact_info_user' &&
      sectionKey !== 'education_occupation_info_user'
    ) {
      continue;
    }

    const section = (body[sectionKey] ??= {
      ...(sectionIds[sectionKey] != null ? { id: sectionIds[sectionKey] } : {}),
    }) as Record<string, unknown>;
    section[def.valueField] = parsed;
  }

  for (const key of [
    'identity_info_user',
    'social_info_user',
    'contact_info_user',
    'education_occupation_info_user',
  ] as const) {
    const section = body[key] as Record<string, unknown> | undefined;
    if (!section) continue;
    const keys = Object.keys(section).filter((k) => k !== 'id');
    if (keys.length === 0) delete body[key];
  }

  return body;
}
