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
  formatDisplayValue,
  isWrappedPending,
  pickSection,
  readRecordList,
  unwrapFieldValue,
} from '@private-panel/utils/mapper-utils';
import type { ProfileRetrieveData } from '@private-panel/types/api';

type PendingViewer = 'Owner' | 'Admin';

type PendingMapperOptions = {
  viewer?: PendingViewer;
};

export type PendingFieldRequest = {
  requestId: number;
  requestKey: string;
  requestType?: 1 | 2;
  sectionKey: string;
  apiField: string;
  category: VisibilityCategoryId;
  tabName: VisibilityTabName | null;
  fieldId: string | null;
  kind: VisibilityFieldKind;
  labelKey: string | null;
  newValue: string;
  previousValue: string;
  renderAsFile?: boolean;
  academicRecord?: {
    key: string;
    fields: Array<{
      apiField: string;
      labelKey: string | null;
      value: string;
      previousValue?: string;
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

const TRANSLATION_PENDING_SECTIONS = [
  {
    sectionKey: 'identity_info_user_translation',
    parentSectionKey: 'identity_info_user',
    defSectionKey: 'identity_info_user',
  },
  {
    sectionKey: 'social_info_user_translation',
    parentSectionKey: 'social_info_user',
    defSectionKey: 'social_info_user',
  },
] as const;

const ACADEMIC_RECORD_PENDING_SECTIONS = [
  'academic_record_verified_user',
  'academic_record_submitted_user',
] as const;

const ACADEMIC_DOCUMENT_PENDING_SECTIONS = ['academic_document_user'] as const;

function pendingRequestKey(
  sectionKey: string,
  requestType: 1 | 2,
  requestId: number,
  apiField: string
): string {
  return `${sectionKey}:${requestType}:${requestId}:${apiField}`;
}

function stringifyPendingValue(value: unknown): string {
  if (value == null || typeof value === 'object') return '';
  return String(value);
}

function formatPendingValue(
  def: VisibilityFieldDef | undefined,
  value: unknown
): string {
  const raw = stringifyPendingValue(value);
  return def ? formatDisplayValue(def, raw) : raw;
}

function readActorType(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null;
}

function isPendingForViewer(
  metadata: Record<string, unknown>,
  viewer: PendingViewer
): boolean {
  const pendingFor =
    readActorType(metadata.pending_for_actor_type) ??
    readActorType(metadata.pending_for);
  return pendingFor === viewer;
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

function readTranslationRows(
  privateData: ProfileRetrieveData,
  sectionKey: string,
  parentSectionKey: string
): Record<string, unknown>[] {
  const directRows = readRecordList(privateData, sectionKey);
  const parent = pickSection(privateData, parentSectionKey);
  const nestedRows = Array.isArray(parent?.[sectionKey])
    ? (parent[sectionKey] as unknown[])
    : [];
  const rows = directRows.length > 0 ? directRows : nestedRows;
  return rows
    .map((item) => asRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item));
}

function pushPendingFieldsFromSection(
  items: PendingFieldRequest[],
  section: Record<string, unknown>,
  sectionKey: string,
  defSectionKey = sectionKey,
  viewer: PendingViewer = 'Owner'
): void {
  for (const [apiField, raw] of Object.entries(section)) {
    if (
      apiField === 'id' ||
      apiField === 'target_language' ||
      !isWrappedPending(raw)
    ) {
      continue;
    }
    const wrapped = asRecord(raw) ?? {};
    const requestId = Number(wrapped.request_id);
    if (!Number.isFinite(requestId) || requestId <= 0) continue;
    if (!isPendingForViewer(wrapped, viewer)) continue;
    const def = findPendingDef(defSectionKey, apiField);
    const newValue = unwrapFieldValue(wrapped.new_value ?? wrapped.value);
    const previousValue = unwrapFieldValue(wrapped.previous_value);
    items.push({
      requestId,
      requestType: 1,
      requestKey: pendingRequestKey(sectionKey, 1, requestId, apiField),
      sectionKey,
      apiField,
      category: def?.category ?? 'identity',
      tabName: def?.tabName ?? null,
      fieldId: def?.id ?? null,
      kind: def?.kind ?? 'text',
      labelKey: def?.labelKey ?? null,
      newValue: formatPendingValue(def, newValue),
      previousValue: formatPendingValue(def, previousValue),
    });
  }
}

function isPendingRecordStatus(status: unknown): boolean {
  return status === 'pending' || status === 'updated_pending';
}

function buildCreateRecordRequest(
  row: Record<string, unknown>,
  sectionKey: string,
  defSectionKey: string,
  requestId: number
): PendingFieldRequest | null {
  const fields = Object.entries(row).flatMap(([apiField, raw]) => {
    if (
      apiField === 'id' ||
      apiField === 'target_language' ||
      apiField === 'record_status'
    ) {
      return [];
    }
    const def = findPendingDef(defSectionKey, apiField);
    const value = formatPendingValue(def, unwrapFieldValue(raw));
    return [
      {
        apiField,
        labelKey: def?.labelKey ?? null,
        value,
        pending: true,
      },
    ];
  });
  if (fields.length === 0) return null;

  const firstDef = findPendingDef(defSectionKey, fields[0]?.apiField ?? '');
  return {
    requestId,
    requestType: 2,
    requestKey: pendingRequestKey(sectionKey, 2, requestId, 'create_record'),
    sectionKey,
    apiField: 'create_record',
    category: firstDef?.category ?? 'identity',
    tabName: firstDef?.tabName ?? null,
    fieldId: null,
    kind: 'textarea',
    labelKey: null,
    newValue: fields.map((field) => field.value).filter(Boolean).join('\n'),
    previousValue: '',
    academicRecord: {
      key: `${sectionKey}-${requestId}`,
      fields,
    },
  };
}

function mapPendingCreateRecord(
  row: Record<string, unknown>,
  sectionKey: string,
  defSectionKey: string,
  viewer: PendingViewer = 'Owner'
): PendingFieldRequest | null {
  const recordStatus = asRecord(row.record_status);
  if (
    recordStatus?.pending === true &&
    recordStatus.is_pending_create === true
  ) {
    if (!isPendingForViewer(recordStatus, viewer)) return null;
    const requestId = Number(recordStatus.request_id);
    if (!Number.isFinite(requestId) || requestId <= 0) return null;
    return buildCreateRecordRequest(row, sectionKey, defSectionKey, requestId);
  }

  if (
    row.request_type !== 'create_record' ||
    !isPendingRecordStatus(row.status)
  ) {
    return null;
  }
  const requestId = Number(row.request_id);
  if (!Number.isFinite(requestId) || requestId <= 0) return null;
  if (!isPendingForViewer(row, viewer)) return null;

  const data = asRecord(row.data);
  if (!data) return null;
  return buildCreateRecordRequest(data, sectionKey, defSectionKey, requestId);
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
  recordKey: string,
  viewer: PendingViewer
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
    if (!isPendingForViewer(wrapped, viewer)) return [];
    const def = findAcademicRecordDef(apiField);
    const newValue = unwrapFieldValue(wrapped.new_value ?? wrapped.value);
    const previousValue = unwrapFieldValue(wrapped.previous_value);
    return [
      {
        requestId,
        requestKey: pendingRequestKey(
          'academic_record',
          1,
          requestId,
          apiField
        ),
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
  privateData: ProfileRetrieveData | null | undefined,
  options: PendingMapperOptions = {}
): PendingFieldRequest[] {
  const items: PendingFieldRequest[] = [];
  if (!privateData) return items;
  const viewer = options.viewer ?? 'Owner';

  for (const sectionKey of PENDING_SECTIONS) {
    const section = pickSection(privateData, sectionKey);
    if (!section) continue;
    pushPendingFieldsFromSection(items, section, sectionKey, sectionKey, viewer);
  }

  for (const item of TRANSLATION_PENDING_SECTIONS) {
    const rows = readTranslationRows(
      privateData,
      item.sectionKey,
      item.parentSectionKey
    );
    rows.forEach((row) => {
      const createRecord = mapPendingCreateRecord(
        row,
        item.sectionKey,
        item.defSectionKey,
        viewer
      );
      if (createRecord) {
        items.push(createRecord);
        return;
      }
      pushPendingFieldsFromSection(
        items,
        row,
        item.sectionKey,
        item.defSectionKey,
        viewer
      );
    });
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
          `${sectionKey}-${apiId ?? index}`,
          viewer
        )
      );
    });
  }

  for (const sectionKey of ACADEMIC_DOCUMENT_PENDING_SECTIONS) {
    const documents = readRecordList(privateData, sectionKey);
    documents.forEach((item, index) => {
      const row = asRecord(item);
      if (!row) return;
      for (const apiField of ['file_path', 'description']) {
        const raw = row[apiField];
        if (!isWrappedPending(raw)) continue;
        const wrapped = asRecord(raw) ?? {};
        const requestId = Number(wrapped.request_id);
        if (!Number.isFinite(requestId) || requestId <= 0) continue;
        if (!isPendingForViewer(wrapped, viewer)) continue;
        const newValue = unwrapFieldValue(wrapped.new_value ?? wrapped.value);
        const previousValue = unwrapFieldValue(wrapped.previous_value);
        items.push({
          requestId,
          requestKey: pendingRequestKey(sectionKey, 1, requestId, apiField),
          sectionKey,
          apiField,
          category: 'education',
          tabName: 'educational_information',
          fieldId: null,
          kind: apiField === 'description' ? 'textarea' : 'text',
          labelKey: null,
          newValue: stringifyPendingValue(newValue),
          previousValue: stringifyPendingValue(previousValue),
          renderAsFile: apiField === 'file_path',
          academicRecord: {
            key: `${sectionKey}-${index}`,
            fields: Object.entries(row).flatMap(([field, value]) => {
              if (field === 'id') return [];
              return [
                {
                  apiField: field,
                  labelKey: null,
                  value: stringifyPendingValue(unwrapFieldValue(value)),
                  pending: isWrappedPending(value),
                },
              ];
            }),
          },
        });
      }
    });
  }

  return items;
}
