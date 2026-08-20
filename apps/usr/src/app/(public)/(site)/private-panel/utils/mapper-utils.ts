import { pad2 } from '@/lib/jalali';
import type { VisibilityFieldDef } from '@private-panel/data/visibility-config';

import type { ProfileRetrieveData } from '@private-panel/types/api';

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function pickSection(
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

export function unwrapFieldValue(raw: unknown): unknown {
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

export function isWrappedPending(raw: unknown): boolean {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const field = raw as Record<string, unknown>;
  if (field.pending !== true) return false;
  const requestId = Number(field.request_id);
  return Number.isFinite(requestId) && requestId > 0;
}

export function readPending(
  source: Record<string, unknown> | null,
  key: string
): boolean {
  if (!source) return false;
  return isWrappedPending(source[key]);
}

export function readString(
  source: Record<string, unknown> | null,
  key: string
): string {
  if (!source) return '';
  const value = unwrapFieldValue(source[key]);
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return '';
  return String(value);
}

export function readFlag(
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

export const DEGREE_LABELS: Record<string, string> = {
  '1': 'کاردانی',
  '2': 'کارشناسی',
  '3': 'کارشناسی ارشد',
  '4': 'دکتری',
  '5': 'پسادکتری',
  '6': 'سایر',
};

export const ACADEMIC_GROUP_LABELS: Record<string, string> = {
  '1': 'علوم پایه',
  '2': 'فنی مهندسی',
  '3': 'علوم انسانی',
  '4': 'پزشکی',
  '5': 'هنر',
  '6': 'زبان',
  '7': 'سایر',
};

export const STUDY_STATUS_LABELS: Record<string, string> = {
  '1': 'دانشجو',
  '2': 'فارغ‌التحصیل',
};

export function formatIsoAsDateOnly(raw: string): string | null {
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

export function formatDisplayValue(
  def: VisibilityFieldDef,
  raw: string
): string {
  if (!raw) return '';
  if (def.id === 'serviceProviderStatus') {
    if (raw === 'true') return 'true';
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

export function readRecordList(
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
