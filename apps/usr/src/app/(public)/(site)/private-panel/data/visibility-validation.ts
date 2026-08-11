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
  | 'notEditable';

const NAME = z
  .string()
  .min(1, { error: 'required' })
  .max(64, { error: 'tooLong' })
  .regex(/^[\p{L}\p{M}\s'\u200c.-]+$/u, { error: 'invalidName' });

const BIO = z.string().max(1000, { error: 'tooLong' });

const EMAIL = z.email({ error: 'invalidEmail' }).max(254, { error: 'tooLong' });

const URL_VALUE = z.url({ error: 'invalidUrl' }).max(500, { error: 'tooLong' });

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

const PHONE = z
  .string()
  .regex(/^(?:\+98|0)?9\d{9}$|^\+\d{8,15}$/, { error: 'invalidPhone' });

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

const FIELD_SCHEMAS: Record<string, z.ZodType<string>> = {
  firstName: NAME,
  lastName: NAME,
  legalFirstName: NAME,
  legalLastName: NAME,
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
  workPhone: PHONE,
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
