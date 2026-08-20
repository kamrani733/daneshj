import {
  VISIBILITY_FIELD_DEFS,
  type VisibilityCategoryId,
  type VisibilityFieldDef,
  type VisibilityFieldKind,
  type VisibilityTabName,
} from '@private-panel/data/visibility-config';

import {
  ACADEMIC_GROUP_LABELS,
  DEGREE_LABELS,
  STUDY_STATUS_LABELS,
  asRecord,
  formatIsoAsDateOnly,
  isWrappedPending,
  pickSection,
  readRecordList,
  unwrapFieldValue,
} from '@private-panel/utils/mapper-utils';
import type { ProfileRetrieveData } from '@private-panel/types/api';

export type PendingFieldRequest = {
  requestId: number;
  sectionKey: string;
  apiField: string;
  category: VisibilityCategoryId;
  tabName: VisibilityTabName | null;
  fieldId: string | null;
  kind: VisibilityFieldKind;
  labelKey: string | null;
  newValue: string;
  previousValue: string;
  academicRecord?: {
    key: string;
    fields: Array<{
      apiField: string;
      labelKey: string | null;
      value: string;
      pending: boolean;
    }>;
  };
};

const PENDING_SECTIONS = [
  'identity_info_user',
  'social_info_user',
  'contact_info_user',
  'education_occupation_info_user',
] as const;

const ACADEMIC_RECORD_PENDING_SECTIONS = [
  'academic_record_verified_user',
  'academic_record_submitted_user',
] as const;

function stringifyPendingValue(value: unknown): string {
  if (value == null || typeof value === 'object') return '';
  return String(value);
}

function findPendingDef(
  sectionKey: string,
  apiField: string
): VisibilityFieldDef | undefined {
  return VISIBILITY_FIELD_DEFS.find(
    (item) =>
      item.apiSection === sectionKey &&
      (item.valueField === apiField || item.apiField === apiField)
  );
}

function findAcademicRecordDef(
  apiField: string
): VisibilityFieldDef | undefined {
  return VISIBILITY_FIELD_DEFS.find(
    (item) =>
      item.section === 'academicRecords' && item.apiField === apiField
  );
}

function formatAcademicRecordValue(
  apiField: string,
  raw: unknown
): string {
  const value = unwrapFieldValue(raw);
  if (value == null || typeof value === 'object') return '';
  const stringValue = String(value);
  if (apiField === 'degree_level') {
    return DEGREE_LABELS[stringValue] ?? stringValue;
  }
  if (apiField === 'academic_group') {
    return ACADEMIC_GROUP_LABELS[stringValue] ?? stringValue;
  }
  if (apiField === 'study_status') {
    return STUDY_STATUS_LABELS[stringValue] ?? stringValue;
  }
  if (apiField === 'graduation_date') {
    return formatIsoAsDateOnly(stringValue) ?? stringValue;
  }
  return stringValue;
}

function mapPendingAcademicRecordFields(
  row: Record<string, unknown>,
  recordKey: string
): PendingFieldRequest[] {
  const contextFields = Object.entries(row).flatMap(([apiField, raw]) => {
    if (apiField === 'id') return [];
    const def = findAcademicRecordDef(apiField);
    if (!def) return [];
    return [
      {
        apiField,
        labelKey: def.labelKey,
        value: formatAcademicRecordValue(apiField, raw),
        pending: isWrappedPending(raw),
      },
    ];
  });

  return Object.entries(row).flatMap(([apiField, raw]) => {
    if (apiField === 'id' || !isWrappedPending(raw)) return [];
    const wrapped = asRecord(raw) ?? {};
    const requestId = Number(wrapped.request_id);
    if (!Number.isFinite(requestId) || requestId <= 0) return [];
    const def = findAcademicRecordDef(apiField);
    const newValue = unwrapFieldValue(wrapped.new_value ?? wrapped.value);
    const previousValue = unwrapFieldValue(wrapped.previous_value);
    return [
      {
        requestId,
        sectionKey: 'academic_record',
        apiField,
        category: 'education' as const,
        tabName: 'educational_information' as const,
        fieldId: def?.id ?? null,
        kind: def?.withCalendar ? 'text' : (def?.kind ?? 'text'),
        labelKey: def?.labelKey ?? null,
        newValue: stringifyPendingValue(newValue),
        previousValue: stringifyPendingValue(previousValue),
        academicRecord: {
          key: recordKey,
          fields: contextFields,
        },
      },
    ];
  });
}

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
      const def = findPendingDef(sectionKey, apiField);
      if (def?.kind === 'photo') continue;
      const newValue = unwrapFieldValue(wrapped.new_value ?? wrapped.value);
      const previousValue = unwrapFieldValue(wrapped.previous_value);
      items.push({
        requestId,
        sectionKey,
        apiField,
        category: def?.category ?? 'identity',
        tabName: def?.tabName ?? null,
        fieldId: def?.id ?? null,
        kind: def?.kind ?? 'text',
        labelKey: def?.labelKey ?? null,
        newValue: stringifyPendingValue(newValue),
        previousValue: stringifyPendingValue(previousValue),
      });
    }
  }

  for (const sectionKey of ACADEMIC_RECORD_PENDING_SECTIONS) {
    const records = readRecordList(privateData, sectionKey);
    records.forEach((item, index) => {
      const row = asRecord(item);
      if (!row) return;
      const apiId = typeof row.id === 'number' ? row.id : null;
      items.push(
        ...mapPendingAcademicRecordFields(
          row,
          `${sectionKey}-${apiId ?? index}`
        )
      );
    });
  }

  return items;
}
