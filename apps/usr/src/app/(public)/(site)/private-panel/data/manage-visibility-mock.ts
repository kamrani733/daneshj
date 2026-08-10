/** Mock public-panel visibility fields until Actor MS is wired. */

export type VisibilityCategoryId =
  | 'identity'
  | 'social'
  | 'contact'
  | 'account'
  | 'education'
  | 'provider';

export type VisibilityFieldKind = 'text' | 'photo' | 'textarea' | 'toggle';

export type VisibilityAcademicRecord = {
  id: string;
  degree: string;
  university: string;
  faculty: string;
  fieldGroup: string;
  description: string;
  endDate: string;
  roleLabel: string;
  statusLabel: string;
  initiallyVisible: boolean;
};

export type VisibilitySection = {
  key: string;
  /** Key under manageVisibility.sections or categories. */
  titleKey: string;
};

export type VisibilityField = {
  id: string;
  category: VisibilityCategoryId;
  /** Groups fields into bordered fieldsets within a category. */
  section: string;
  kind: VisibilityFieldKind;
  labelKey: string;
  value: string;
  /** Committed public visibility (server truth) — drives pending-removal. */
  initiallyVisible: boolean;
  /** Current checkbox seed; defaults to `initiallyVisible`. */
  selectedInitially?: boolean;
  /** System-locked — cannot be toggled on. */
  locked?: boolean;
  /** Caption when locked (default privacy `locked`). */
  lockedCaptionKey?: 'locked' | 'notDisplayed';
  /** Optional alternate caption key when unchecked (e.g. gender). */
  hiddenCaptionKey?: 'notDisplayed';
  /** Show calendar adornment in the value field. */
  withCalendar?: boolean;
  /** Image src for photo fields. */
  imageSrc?: string;
};

export const VISIBILITY_CATEGORIES: VisibilityCategoryId[] = [
  'identity',
  'social',
  'contact',
  'account',
  'education',
  'provider',
];

/** Section order per category (fieldset legends). */
export const VISIBILITY_SECTIONS: Record<
  VisibilityCategoryId,
  VisibilitySection[]
> = {
  identity: [{ key: 'identity', titleKey: 'identity' }],
  social: [
    { key: 'social', titleKey: 'social' },
    { key: 'address', titleKey: 'address' },
  ],
  contact: [{ key: 'contact', titleKey: 'contact' }],
  account: [{ key: 'account', titleKey: 'account' }],
  education: [
    { key: 'educationExtra', titleKey: 'educationExtra' },
    { key: 'educationWorkAddress', titleKey: 'educationWorkAddress' },
    { key: 'academicRecords', titleKey: 'academicRecords' },
  ],
  provider: [{ key: 'provider', titleKey: 'provider' }],
};

export const MOCK_ACADEMIC_RECORDS: VisibilityAcademicRecord[] = [
  {
    id: 'edu-1',
    degree: 'کارشناسی حقوق',
    university: 'دانشگاه علامه طباطبایی',
    faculty: 'دانشکده حقوق',
    fieldGroup: 'علوم انسانی',
    description:
      'توضیح مقطع تحصیلی اگر وجود دارد در این قسمت نوشته می‌شود',
    endDate: '۱۳۹۲/۰۷/۱۲',
    roleLabel: 'فارغ‌التحصیل',
    statusLabel: 'تایید شده',
    initiallyVisible: true,
  },
  {
    id: 'edu-2',
    degree: 'کارشناسی حقوق',
    university: 'دانشگاه علامه طباطبایی',
    faculty: 'دانشکده حقوق',
    fieldGroup: 'علوم انسانی',
    description:
      'توضیح مقطع تحصیلی اگر وجود دارد در این قسمت نوشته می‌شود',
    endDate: '۱۳۹۲/۰۷/۱۲',
    roleLabel: 'فارغ‌التحصیل',
    statusLabel: 'تایید شده',
    initiallyVisible: true,
  },
  {
    id: 'edu-3',
    degree: 'کارشناسی حقوق',
    university: 'دانشگاه علامه طباطبایی',
    faculty: 'دانشکده حقوق',
    fieldGroup: 'علوم انسانی',
    description:
      'توضیح مقطع تحصیلی اگر وجود دارد در این قسمت نوشته می‌شود',
    endDate: '۱۳۹۲/۰۷/۱۲',
    roleLabel: 'فارغ‌التحصیل',
    statusLabel: 'تایید شده',
    initiallyVisible: false,
  },
];

export const MOCK_VISIBILITY_FIELDS: VisibilityField[] = [
  {
    id: 'avatar',
    category: 'identity',
    section: 'identity',
    kind: 'photo',
    labelKey: 'avatar',
    value: '',
    initiallyVisible: true,
    imageSrc: '/images/public-panel/avatar.png',
  },
  {
    id: 'electronicCardPhoto',
    category: 'identity',
    section: 'identity',
    kind: 'photo',
    labelKey: 'electronicCardPhoto',
    value: '',
    initiallyVisible: true,
    imageSrc: '/images/public-panel/avatar.png',
  },
  {
    id: 'firstName',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'firstName',
    value: 'سعید',
    initiallyVisible: true,
  },
  {
    id: 'lastName',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'lastName',
    value: 'سعیدی',
    initiallyVisible: true,
  },
  {
    id: 'legalFirstName',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'legalFirstName',
    value: 'سعید',
    initiallyVisible: false,
  },
  {
    id: 'legalLastName',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'legalLastName',
    value: 'سعیدی',
    initiallyVisible: false,
  },
  {
    id: 'nationalId',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'nationalId',
    value: '۰۰۲۲۶۶۵۵۴۴',
    initiallyVisible: false,
    locked: true,
  },
  {
    id: 'birthDate',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'birthDate',
    value: '۱۳۷۸/۱۲/۱۹',
    initiallyVisible: false,
    withCalendar: true,
  },
  {
    id: 'gender',
    category: 'identity',
    section: 'identity',
    kind: 'text',
    labelKey: 'gender',
    value: 'مرد',
    initiallyVisible: false,
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'bio',
    category: 'identity',
    section: 'identity',
    kind: 'textarea',
    labelKey: 'bio',
    value: 'عاشق موسیقی و سفر و تجربه غذاهای محلی',
    initiallyVisible: true,
  },
  {
    id: 'militaryStatus',
    category: 'social',
    section: 'social',
    kind: 'text',
    labelKey: 'militaryStatus',
    value: 'پایان خدمت',
    initiallyVisible: false,
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'maritalStatus',
    category: 'social',
    section: 'social',
    kind: 'text',
    labelKey: 'maritalStatus',
    value: 'مجرد',
    initiallyVisible: false,
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'country',
    category: 'social',
    section: 'address',
    kind: 'text',
    labelKey: 'country',
    value: 'ایران',
    initiallyVisible: true,
  },
  {
    id: 'province',
    category: 'social',
    section: 'address',
    kind: 'text',
    labelKey: 'province',
    value: 'تهران',
    initiallyVisible: true,
  },
  {
    id: 'city',
    category: 'social',
    section: 'address',
    kind: 'text',
    labelKey: 'city',
    value: 'تهران',
    initiallyVisible: false,
  },
  {
    id: 'district',
    category: 'social',
    section: 'address',
    kind: 'text',
    labelKey: 'district',
    value: '',
    initiallyVisible: false,
  },
  {
    id: 'mobile',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'mobile',
    value: '۰۹۱۲۱۵۴۵۴۵',
    initiallyVisible: false,
    locked: true,
  },
  {
    id: 'email',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'email',
    value: 'Saeed@domain.com',
    initiallyVisible: true,
  },
  {
    id: 'whatsapp',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'whatsapp',
    value: 'Saeedjhjh',
    initiallyVisible: false,
  },
  {
    id: 'telegram',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'telegram',
    value: 'Saeedjhjh',
    initiallyVisible: false,
  },
  {
    id: 'instagram',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'instagram',
    value: 'Saeedjhjh',
    initiallyVisible: false,
  },
  {
    id: 'x',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'x',
    value: 'Saeedjhjh',
    initiallyVisible: true,
  },
  {
    id: 'linkedin',
    category: 'contact',
    section: 'contact',
    kind: 'text',
    labelKey: 'linkedin',
    value: 'Saeedjhjh',
    initiallyVisible: true,
  },
  {
    id: 'username',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'username',
    value: 'saeedd1122',
    initiallyVisible: true,
    selectedInitially: false,
  },
  {
    id: 'membershipType',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'membershipType',
    value: 'دانشجو',
    initiallyVisible: true,
  },
  {
    id: 'membershipDate',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'membershipDate',
    value: '۱۳۷۸/۱۲/۱۹',
    initiallyVisible: false,
    withCalendar: true,
  },
  {
    id: 'membershipExpiry',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'membershipExpiry',
    value: '۱۳۷۸/۱۲/۱۹',
    initiallyVisible: false,
    withCalendar: true,
  },
  {
    id: 'levelChangeMethod',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'levelChangeMethod',
    value: 'اتوماتیک',
    initiallyVisible: false,
    locked: true,
    lockedCaptionKey: 'notDisplayed',
  },
  {
    id: 'serviceProviderStatus',
    category: 'account',
    section: 'account',
    kind: 'text',
    labelKey: 'serviceProviderStatus',
    value: '',
    initiallyVisible: false,
  },
  {
    id: 'gradEmploymentStatus',
    category: 'education',
    section: 'educationExtra',
    kind: 'text',
    labelKey: 'gradEmploymentStatus',
    value: 'فارغ‌التحصیل',
    initiallyVisible: false,
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'studentNumber',
    category: 'education',
    section: 'educationExtra',
    kind: 'text',
    labelKey: 'studentNumber',
    value: '۸۹۱۲۱۵۴۵۶۶۵۴',
    initiallyVisible: false,
    locked: true,
  },
  {
    id: 'eduCountry',
    category: 'education',
    section: 'educationWorkAddress',
    kind: 'text',
    labelKey: 'country',
    value: 'ایران',
    initiallyVisible: false,
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'eduProvince',
    category: 'education',
    section: 'educationWorkAddress',
    kind: 'text',
    labelKey: 'province',
    value: 'تهران',
    initiallyVisible: false,
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'eduCity',
    category: 'education',
    section: 'educationWorkAddress',
    kind: 'text',
    labelKey: 'city',
    value: 'تهران',
    initiallyVisible: false,
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'eduDistrict',
    category: 'education',
    section: 'educationWorkAddress',
    kind: 'text',
    labelKey: 'district',
    value: '',
    initiallyVisible: false,
    hiddenCaptionKey: 'notDisplayed',
  },
  {
    id: 'recordMajor',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordMajor',
    value: '',
    initiallyVisible: true,
  },
  {
    id: 'recordUniversity',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordUniversity',
    value: '',
    initiallyVisible: true,
  },
  {
    id: 'recordFieldGroup',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordFieldGroup',
    value: '',
    initiallyVisible: true,
  },
  {
    id: 'recordDegreeLevel',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordDegreeLevel',
    value: '',
    initiallyVisible: true,
  },
  {
    id: 'recordFaculty',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordFaculty',
    value: '',
    initiallyVisible: true,
  },
  {
    id: 'recordStudentStatus',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordStudentStatus',
    value: '',
    initiallyVisible: false,
  },
  {
    id: 'recordDegreeDescription',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordDegreeDescription',
    value: '',
    initiallyVisible: false,
  },
  {
    id: 'recordGraduationDate',
    category: 'education',
    section: 'academicRecords',
    kind: 'toggle',
    labelKey: 'recordGraduationDate',
    value: '',
    initiallyVisible: false,
  },
  {
    id: 'workPhone',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workPhone',
    value: '۰۹۱۲۱۲۴۶',
    initiallyVisible: true,
  },
  {
    id: 'workEmail',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workEmail',
    value: 'Companyname @domain.com',
    initiallyVisible: true,
  },
  {
    id: 'workWhatsapp',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workWhatsapp',
    value: '@Companyname',
    initiallyVisible: true,
  },
  {
    id: 'workTelegram',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workTelegram',
    value: '@Companyname',
    initiallyVisible: true,
  },
  {
    id: 'workInstagram',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workInstagram',
    value: '@Companyname',
    initiallyVisible: true,
  },
  {
    id: 'workX',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workX',
    value: '@Companyname',
    initiallyVisible: true,
  },
  {
    id: 'workLinkedin',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'workLinkedin',
    value: '@Companyname',
    initiallyVisible: true,
  },
  {
    id: 'github',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'github',
    value: '@Companyname',
    initiallyVisible: true,
  },
  {
    id: 'website',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'website',
    value: 'www.Companyname.com',
    initiallyVisible: true,
  },
  {
    id: 'providerCredit',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'providerCredit',
    value: 'متن جایگزین',
    initiallyVisible: true,
    selectedInitially: false,
  },
  {
    id: 'offeredServices',
    category: 'provider',
    section: 'provider',
    kind: 'text',
    labelKey: 'offeredServices',
    value: 'سرویس یک - سرویس دو - سرویس سه',
    initiallyVisible: true,
  },
];
