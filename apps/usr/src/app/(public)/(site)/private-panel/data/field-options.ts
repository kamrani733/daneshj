import {
  COUNTRY_OPTIONS,
  IRAN_PROVINCE_OPTIONS,
  citiesForProvince,
  districtsForCity,
  type GeoOption,
} from '@private-panel/data/geo';

export type FieldOption = GeoOption;

export type FieldOptionsContext = {
  country?: string;
  province?: string;
  city?: string;
  eduCountry?: string;
  eduProvince?: string;
  eduCity?: string;
};

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
  { value: '3', label: 'مدرسه' },
  { value: '4', label: 'ورودی' },
  { value: '5', label: 'سایر' },
];

export const ACADEMIC_GROUP_OPTIONS: FieldOption[] = [
  { value: '1', label: 'علوم پایه' },
  { value: '2', label: 'فنی مهندسی' },
  { value: '3', label: 'علوم انسانی' },
  { value: '4', label: 'پزشکی' },
  { value: '5', label: 'هنر' },
  { value: '6', label: 'زبان' },
  { value: '7', label: 'سایر' },
];

export const DEGREE_LEVEL_OPTIONS: FieldOption[] = [
  { value: '1', label: 'کاردانی' },
  { value: '2', label: 'کارشناسی' },
  { value: '3', label: 'کارشناسی ارشد' },
  { value: '4', label: 'دکتری' },
  { value: '5', label: 'پسادکتری' },
  { value: '6', label: 'سایر' },
];

export const STUDY_STATUS_OPTIONS: FieldOption[] = [
  { value: '1', label: 'دانشجو' },
  { value: '2', label: 'فارغ‌التحصیل' },
];

const STATIC_BY_ID: Record<string, FieldOption[]> = {
  gender: GENDER_OPTIONS,
  militaryStatus: MILITARY_OPTIONS,
  maritalStatus: MARITAL_OPTIONS,
  country: COUNTRY_OPTIONS,
  eduCountry: COUNTRY_OPTIONS,
  province: IRAN_PROVINCE_OPTIONS,
  eduProvince: IRAN_PROVINCE_OPTIONS,
  gradEmploymentStatus: OCCUPATION_OPTIONS,
  academicGroup: ACADEMIC_GROUP_OPTIONS,
  degreeLevel: DEGREE_LEVEL_OPTIONS,
  studyStatus: STUDY_STATUS_OPTIONS,
};

export function optionsForField(
  fieldId: string,
  context: FieldOptionsContext = {}
): FieldOption[] {
  if (fieldId === 'province') {
    const country = context.country || 'IR';
    return country === 'IR' ? IRAN_PROVINCE_OPTIONS : [];
  }
  if (fieldId === 'eduProvince') {
    const country = context.eduCountry || 'IR';
    return country === 'IR' ? IRAN_PROVINCE_OPTIONS : [];
  }
  if (fieldId === 'city') {
    return citiesForProvince(context.province ?? '');
  }
  if (fieldId === 'eduCity') {
    return citiesForProvince(context.eduProvince ?? '');
  }
  if (fieldId === 'district') {
    return districtsForCity(context.city ?? '');
  }
  if (fieldId === 'eduDistrict') {
    return districtsForCity(context.eduCity ?? '');
  }
  return STATIC_BY_ID[fieldId] ?? [];
}
