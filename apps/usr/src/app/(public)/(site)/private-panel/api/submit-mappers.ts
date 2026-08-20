import { VISIBILITY_FIELD_DEFS, type VisibilityFieldDef } from '@private-panel/data/visibility-config';
import {
  normalizeIranianMobile,
  normalizeNationalId,
  normalizeWebsiteUrl,
} from '@private-panel/utils/visibility-validation';

import {
  asArray,
  asRecord,
  pickSection,
} from '@private-panel/utils/mapper-utils';
import type {
  AcademicRecordUserDto,
  DivisionCodeDto,
  PrivateOwnerTabName,
  PrivateTabSubmitByOwnerBodyDto,
  ProfileRetrieveData,
  ProfileTabName,
  PublicTabSubmitByOwnerBodyDto,
} from '@private-panel/types/api';

const PRIVATE_OWNER_TABS: PrivateOwnerTabName[] = [
  'identity_information',
  'social_information',
  'contact_information',
  'educational_information',
];

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
  if (def.id === 'mobile' || def.id === 'workPhone') {
    return normalizeIranianMobile(trimmed) ?? trimmed;
  }
  if (def.id === 'nationalId') {
    return normalizeNationalId(trimmed) ?? trimmed;
  }
  if (def.id === 'website') {
    return normalizeWebsiteUrl(trimmed) ?? trimmed;
  }
  return trimmed;
}

const PRIVATE_SUBMIT_SECTIONS = new Set([
  'identity_info_user',
  'social_info_user',
  'contact_info_user',
  'education_occupation_info_user',
  'social_info_user_division_code',
  'education_occupation_info_user_division_code',
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

function parseDivisionLevel(raw: string): number | undefined {
  const digits = raw.replace(/[^\d۰-۹]/g, '');
  if (!digits) return undefined;
  const normalized = digits.replace(/[۰-۹]/g, (char) =>
    String('۰۱۲۳۴۵۶۷۸۹'.indexOf(char))
  );
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

function buildDivisionCodePayload(
  values: Record<string, string>,
  ids: { province: string; city: string; district: string },
  existingId?: number
): DivisionCodeDto {
  const province = (values[ids.province] ?? '').trim();
  const city = (values[ids.city] ?? '').trim();
  const district = (values[ids.district] ?? '').trim();
  const parsedLevel = parseDivisionLevel(district);
  const row: DivisionCodeDto = {
    level: parsedLevel ?? 0,
  };
  if (typeof existingId === 'number') row.id = existingId;
  if (province) row.normalized_code = province;
  if (city && district && parsedLevel == null) {
    row.other = `${city} — ${district}`;
  } else if (city) {
    row.other = city;
  } else if (district) {
    row.other = district;
  }
  return row;
}

function isDivisionAddressDirty(
  values: Record<string, string>,
  savedValues: Record<string, string>,
  ids: { province: string; city: string; district: string }
): boolean {
  return (
    (values[ids.province] ?? '') !== (savedValues[ids.province] ?? '') ||
    (values[ids.city] ?? '') !== (savedValues[ids.city] ?? '') ||
    (values[ids.district] ?? '') !== (savedValues[ids.district] ?? '')
  );
}

export function sanitizeValuesForPrivateSubmit(
  values: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => !value.startsWith('blob:'))
  );
}

export type PrivateSubmitDocument = {
  filePath: string;
  description?: string;
};

export function toPrivateTabSubmitBody(
  values: Record<string, string>,
  tabName: PrivateOwnerTabName,
  privateData?: ProfileRetrieveData | null,
  savedValues: Record<string, string> = {},
  options?: {
    academicDocuments?: PrivateSubmitDocument[];
    academicRecords?: AcademicRecordUserDto[];
  }
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

  if (tabName === 'social_information') {
    const addressIds = {
      province: 'province',
      city: 'city',
      district: 'district',
    } as const;
    if (isDivisionAddressDirty(values, savedValues, addressIds)) {
      const social = pickSection(privateData, 'social_info_user');
      const existingDivision = asRecord(
        asArray(social?.social_info_user_division_code)[0]
      );
      const existingId =
        typeof existingDivision?.id === 'number'
          ? existingDivision.id
          : undefined;
      const socialSection = (body.social_info_user ??= {
        ...(sectionIds.social_info_user != null
          ? { id: sectionIds.social_info_user }
          : {}),
      });
      socialSection.social_info_user_division_code = [
        buildDivisionCodePayload(values, addressIds, existingId),
      ];
    }
  }

  if (tabName === 'educational_information') {
    const addressIds = {
      province: 'eduProvince',
      city: 'eduCity',
      district: 'eduDistrict',
    } as const;
    if (isDivisionAddressDirty(values, savedValues, addressIds)) {
      const education = pickSection(
        privateData,
        'education_occupation_info_user'
      );
      const existingDivision = asRecord(
        asArray(education?.education_occupation_info_user_division_code)[0]
      );
      const existingId =
        typeof existingDivision?.id === 'number'
          ? existingDivision.id
          : undefined;
      const educationSection = (body.education_occupation_info_user ??= {
        ...(sectionIds.education_occupation_info_user != null
          ? { id: sectionIds.education_occupation_info_user }
          : {}),
      });
      educationSection.education_occupation_info_user_division_code = [
        buildDivisionCodePayload(values, addressIds, existingId),
      ];
    }

    const academicDocuments = options?.academicDocuments ?? [];
    if (academicDocuments.length > 0) {
      body.academic_document_user = academicDocuments.map((doc) => ({
        id: 0,
        file_path: doc.filePath,
        description: doc.description?.slice(0, 100) || null,
      }));
    }

    const academicRecords = options?.academicRecords ?? [];
    if (academicRecords.length > 0) {
      body.academic_record_submitted_user = academicRecords;
    }
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
