import {
  COUNTRY_OPTIONS,
  IRAN_PROVINCE_OPTIONS,
  type GeoOption,
} from './geo';

export type FieldOption = GeoOption;

export const GENDER_OPTIONS: FieldOption[] = [
  { value: '1', label: 'مرد' },
  { value: '2', label: 'زن' },
  { value: '3', label: 'سایر' },
];

export const MILITARY_OPTIONS: FieldOption[] = [
  { value: 'معاف', label: 'معاف' },
  { value: 'مشمول', label: 'مشمول' },
  { value: 'پایان خدمت', label: 'پایان خدمت' },
];

export const MARITAL_OPTIONS: FieldOption[] = [
  { value: 'مجرد', label: 'مجرد' },
  { value: 'متاهل', label: 'متاهل' },
];

export const OCCUPATION_OPTIONS: FieldOption[] = [
  { value: '1', label: 'دانشجو' },
  { value: '2', label: 'فارغ‌التحصیل' },
  { value: '3', label: 'شاغل' },
  { value: '5', label: 'سایر' },
];

const BY_ID: Record<string, FieldOption[]> = {
  gender: GENDER_OPTIONS,
  militaryStatus: MILITARY_OPTIONS,
  maritalStatus: MARITAL_OPTIONS,
  country: COUNTRY_OPTIONS,
  eduCountry: COUNTRY_OPTIONS,
  province: IRAN_PROVINCE_OPTIONS,
  eduProvince: IRAN_PROVINCE_OPTIONS,
  gradEmploymentStatus: OCCUPATION_OPTIONS,
};

export function optionsForField(fieldId: string): FieldOption[] {
  return BY_ID[fieldId] ?? [];
}
