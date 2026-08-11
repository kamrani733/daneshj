import { z } from 'zod';

import { VISIBILITY_FIELD_DEFS } from './visibility-config';

export type VisibilityValidationErrorKey =
  | 'required'
  | 'tooLong'
  | 'invalidEmail'
  | 'invalidUrl'
  | 'invalidPhone'
  | 'invalidCountryCode'
  | 'invalidDate'
  | 'invalidHandle'
  | 'invalidName'
  | 'invalidGender'
  | 'invalidStatus'
  | 'invalidNationalId'
  | 'notEditable';

const NAME = z
  .string()
  .min(1, { error: 'required' })
  .max(64, { error: 'tooLong' })
  .regex(/^[\p{L}\p{M}\s'\u200c.-]+$/u, { error: 'invalidName' });

const BIO = z.string().max(1000, { error: 'tooLong' });

const EMAIL = z.email({ error: 'invalidEmail' }).max(254, { error: 'tooLong' });

/** Accept bare domains (`example.com`) or full URLs; normalize to https. */
export function normalizeWebsiteUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    const host = url.hostname;
    if (!host || host.includes(' ')) return null;
    if (host === 'localhost') return withProtocol;
    if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(host)) return null;
    return withProtocol;
  } catch {
    return null;
  }
}

const URL_VALUE = z.string().refine(
  (value) => normalizeWebsiteUrl(value) != null,
  { error: 'invalidUrl' }
);

const COUNTRY_CODE = z
  .string()
  .regex(/^[A-Za-z]{2}$/, { error: 'invalidCountryCode' });

const DATE = z.string().refine((value) => {
  if (/^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(value)) {
    return !Number.isNaN(Date.parse(value));
  }
  return /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(value);
}, { error: 'invalidDate' });

const HANDLE = z
  .string()
  .min(1, { error: 'required' })
  .max(64, { error: 'tooLong' })
  .regex(/^[A-Za-z0-9._@-]+$/, { error: 'invalidHandle' });

const LINK_OR_HANDLE = z
  .string()
  .max(500, { error: 'tooLong' })
  .refine(
    (value) =>
      URL_VALUE.safeParse(value).success || HANDLE.safeParse(value).success,
    { error: 'invalidUrl' }
  );

const normalizeDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (char) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(char)))
    .replace(/[٠-٩]/g, (char) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(char)))
    .replace(/[\s-]/g, '');

/** Accept 09…, 9…, +98…, 0098… — always return local `09xxxxxxxxx`. */
export function normalizeIranianMobile(value: string): string | null {
  let digits = normalizeDigits(value).replace(/^\+/, '');
  if (digits.startsWith('0098')) digits = digits.slice(4);
  else if (digits.startsWith('98')) digits = digits.slice(2);
  if (/^09\d{9}$/.test(digits)) return digits;
  if (/^9\d{9}$/.test(digits)) return `0${digits}`;
  return null;
}

const IRANIAN_MOBILE = z.string().refine(
  (value) => normalizeIranianMobile(value) != null,
  { error: 'invalidPhone' }
);

const GENDER = z.enum(['1', '2', '3', 'مرد', 'زن', 'سایر'], {
  error: 'invalidGender',
});

const OCCUPATION = z.enum(
  ['1', '2', '3', '4', '5', 'دانشجو', 'فارغ‌التحصیل', 'مدرسه', 'ورود', 'سایر'],
  { error: 'invalidStatus' }
);

const SHORT_TEXT = z.string().max(128, { error: 'tooLong' });
const MEDIUM_TEXT = z.string().max(255, { error: 'tooLong' });
const STUDENT_ID = z.string().max(10, { error: 'tooLong' });

/** Accept Persian/Arabic digits; return ASCII 10-digit national id or null. */
export function normalizeNationalId(value: string): string | null {
  const digits = normalizeDigits(value.trim());
  if (!/^\d{10}$/.test(digits)) return null;
  return digits;
}

const NATIONAL_ID = z.string().refine(
  (value) => normalizeNationalId(value) != null,
  { error: 'invalidNationalId' }
);

const FIELD_SCHEMAS: Record<string, z.ZodType<string>> = {
  firstName: NAME,
  lastName: NAME,
  legalFirstName: NAME,
  legalLastName: NAME,
  nationalId: NATIONAL_ID,
  birthDate: DATE,
  gender: GENDER,
  bio: BIO,
  militaryStatus: SHORT_TEXT,
  maritalStatus: SHORT_TEXT,
  country: COUNTRY_CODE,
  eduCountry: COUNTRY_CODE,
  province: SHORT_TEXT,
  city: SHORT_TEXT,
  district: SHORT_TEXT,
  eduProvince: SHORT_TEXT,
  eduCity: SHORT_TEXT,
  eduDistrict: SHORT_TEXT,
  email: EMAIL,
  workEmail: EMAIL,
  mobile: IRANIAN_MOBILE,
  whatsapp: HANDLE,
  telegram: HANDLE,
  instagram: HANDLE,
  x: HANDLE,
  linkedin: LINK_OR_HANDLE,
  workWhatsapp: HANDLE,
  workTelegram: HANDLE,
  workInstagram: HANDLE,
  workX: HANDLE,
  workLinkedin: LINK_OR_HANDLE,
  github: HANDLE,
  website: URL_VALUE,
  workPhone: IRANIAN_MOBILE,
  username: HANDLE,
  gradEmploymentStatus: OCCUPATION,
  studentNumber: STUDENT_ID,
  membershipType: SHORT_TEXT,
  membershipDate: DATE,
  membershipExpiry: DATE,
  serviceProviderStatus: SHORT_TEXT,
  providerCredit: MEDIUM_TEXT,
  offeredServices: MEDIUM_TEXT,
};

const EDITABLE_VALUE_IDS = new Set(
  VISIBILITY_FIELD_DEFS.filter(
    (def) =>
      !def.locked &&
      (def.kind === 'text' || def.kind === 'textarea') &&
      Boolean(def.valueField || def.category === 'provider')
  ).map((def) => def.id)
);

function errorKeyFromZod(error: z.ZodError): VisibilityValidationErrorKey {
  const message = error.issues[0]?.message;
  switch (message) {
    case 'required':
    case 'tooLong':
    case 'invalidEmail':
    case 'invalidUrl':
    case 'invalidPhone':
    case 'invalidCountryCode':
    case 'invalidDate':
    case 'invalidHandle':
    case 'invalidName':
    case 'invalidGender':
    case 'invalidStatus':
    case 'invalidNationalId':
    case 'notEditable':
      return message;
    default:
      return 'tooLong';
  }
}

/** Validate dirty editable values. Empty values are allowed (not submitted). */
export function validateVisibilityValues(
  values: Record<string, string>,
  savedValues: Record<string, string> = {}
): Record<string, VisibilityValidationErrorKey> {
  const errors: Record<string, VisibilityValidationErrorKey> = {};

  for (const def of VISIBILITY_FIELD_DEFS) {
    if (def.kind !== 'text' && def.kind !== 'textarea') continue;
    const next = values[def.id] ?? '';
    const prev = savedValues[def.id] ?? '';
    if (next === prev) continue;

    if (def.locked) {
      errors[def.id] = 'notEditable';
      continue;
    }

    if (!EDITABLE_VALUE_IDS.has(def.id)) continue;

    const trimmed = next.trim();
    if (!trimmed) continue;

    const schema = FIELD_SCHEMAS[def.id] ?? MEDIUM_TEXT;
    const result = schema.safeParse(trimmed);
    if (!result.success) {
      errors[def.id] = errorKeyFromZod(result.error);
    }
  }

  return errors;
}

export function firstCategoryWithErrors(
  fieldErrors: Record<string, VisibilityValidationErrorKey>
): string | null {
  const ids = Object.keys(fieldErrors);
  if (ids.length === 0) return null;
  for (const def of VISIBILITY_FIELD_DEFS) {
    if (ids.includes(def.id)) return def.category;
  }
  return null;
}
