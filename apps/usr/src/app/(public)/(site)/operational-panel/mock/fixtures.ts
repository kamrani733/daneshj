// MOCK ONLY — fake report rows (values copied from the Operational Panel export). Used by `reports-mock.ts`.
import type { OperationalReportId, ReportRow } from '@operational-panel/types';

/** Rows per report: enough for several 24-row pages. */
export const MOCK_ROWS_PER_REPORT = 60;

/** 1404/12/14 09:10 Tehran — newest row; older rows step back by `stepHours`. */
const BASE_TIME = Date.UTC(2026, 2, 5, 5, 40);
const HOUR = 3_600_000;

const iso = (index: number, stepHours = 7, offsetHours = 0) =>
  new Date(BASE_TIME - (index * stepHours + offsetHours) * HOUR).toISOString();

const pick = <T>(list: readonly T[], index: number): T => list[index % list.length];

const ORDINALS = ['یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده', 'یازده', 'دوازده'];
const ordinal = (index: number) => pick(ORDINALS, index);

const USERNAMES = ['Username', 'EpsilonX', 'ThetaUser', 'Gamma_3', 'DeltaUser', 'UserAlpha', 'KappaUser', 'Eta_Prod', 'ZetaUser', 'IotaTeam', 'BetaUser', 'Lambda_Dev'];
const ADMINS = ['OperatorX', 'UserB', 'SupervisorY', 'UserA', 'Admin username', 'UserE', 'AdminZ', 'SupervisorF', 'UserOne', 'OperatorC', 'OperatorG', 'AdminD'];
const PROFILE_FIELDS = ['نام خانوادگی شناسنامه ای', 'نام خانوادگی', 'نام پدر', 'تاریخ تولد', 'شهر محل زندگی', 'استان محل زندگی', 'دانشگاه', 'دانشکده', 'آیدی تلگرام', 'آیدی واتس اپ', 'آیدی لینکداین', 'شماره همراه'];
const PREVIOUS_VALUES = ['رضایی', 'ندارد', 'علی', 'ندارد', 'ندارد', 'شیراز', 'ندارد', 'ندارد', 'username', 'ندارد', 'username', '09121211212'];
const NEW_VALUES = ['رضایی درودی', 'رضایی درودی همدانی', 'علیرضا', '1361/04/02', 'تهران', 'تهران', 'بوعلی سینا', 'مهندسی', 'username12', 'username12', 'username12', '09353535321'];
const LIFECYCLE_STEPS = ['در حال بررسی', 'ارسال شده', 'ثبت نشده', 'در انتظار تایید', 'در حال پردازش', 'تأیید شده', 'در انتظار ایجاد', 'در انتظار ارسال', 'خطا در پردازش', 'در انتظار بازخورد', 'تکمیل شده', 'منتظر بارگذاری'];
const OS = ['ویندوز', 'اندروید', 'ویندوز', 'ویندوز', 'اندروید'];
const PROVIDER_KINDS = ['سرویس دهنده یک', 'سرویس دهنده دو', 'سرویس دهنده سه', 'سرویس دهنده بهداشتی', 'سرویس دهنده حمل و نقل', 'سرویس دهنده ورزشی', 'سرویس دهنده فناوری', 'سرویس دهنده انفرادی'];
const SHARE_CHANNELS = ['اینستاگرام', 'تلگرام', 'واتساپ', 'لینکداین'];
const PROVINCES = [['فارس', 'شیراز', 'دانشگاه علوم پزشکی شیراز'], ['تهران', 'تهران', 'دانشگاه تهران'], ['اصفهان', 'اصفهان', 'دانشگاه صنعتی اصفهان']] as const;
const DEGREES = ['دکتری', 'کارشناسی', 'کارشناسی ارشد'];
const MAJORS = ['داروسازی', 'مهندسی کامپیوتر', 'حقوق'];

const ip = (index: number) => `198.12.123.${15 + (index % 11)}`;
const id = (base: number, index: number) => String(base + index);

type RowBuilder = (index: number) => Omit<ReportRow, 'id'>;

const BUILDERS: Record<OperationalReportId, RowBuilder> = {
  publicPanelFields: (i) => ({
    actorUsername: pick(USERNAMES, i),
    reviewedAt: iso(i, 9, -2),
    action: pick(['add', 'requestRemoval', 'approveRemoval', 'add', 'approveRemoval', 'requestRemoval', 'rejectRemoval'], i),
    field: pick(PROFILE_FIELDS, i),
    status: pick(PREVIOUS_VALUES, i),
    requestedAt: iso(i, 9),
  }),
  accountOps: (i) => ({
    actorUsername: pick(USERNAMES, i),
    actedAt: iso(i, 8),
    action: pick(['pending', 'approved', 'rejected', 'approved', 'pending'], i),
    field: pick(PROFILE_FIELDS, i),
    previousValue: pick(PREVIOUS_VALUES, i),
    newValue: pick(NEW_VALUES, i),
    status: `وضعیت ${ordinal(i % 2)}`,
  }),
  publicPanelLifecycle: (i) => {
    const responseHours = pick([18, 15, 48, 3, 24, 30, 12, 9, 36, 20, 6, 21], i);
    return {
      adminUsername: pick(USERNAMES, i),
      requestedAt: iso(i, 11, responseHours),
      action: pick(LIFECYCLE_STEPS, i),
      actedAt: iso(i, 11),
      responseHours,
    };
  },
  publicPanelRequests: (i) => ({
    ticketId: id(2154654212, i),
    status: 'در حال بررسی',
    action: pick(['create', 'delete', 'create'], i),
    requestedAt: iso(i, 13),
  }),
  loginLogout: (i) => ({
    occurredAt: iso(i, 5),
    operation: pick(['login', 'logout', 'login', 'login', 'logout'], i),
    operationType: `نوع ${ordinal(i % 3)}`,
    ip: ip(i),
    os: pick(OS, i),
    browser: pick(['Chrome', 'Firefox', 'Safari'], i),
  }),
  securitySettings: (i) => ({
    actedAt: iso(i, 17),
    field: `فیلد شماره ${ordinal(i)}`,
    previousValue: `مقدار قبلی ${ordinal(i)}`,
    newValue: `مقدار جدید ${ordinal(i)}`,
  }),
  bruteForceUnblock: (i) => ({
    blockType: `نوع مسدودی ${ordinal(i)}`,
    blockReason: `دلیل مسدودی ${ordinal(i)}`,
    blockReasonDescription: `توضیح ${ordinal(i)}`,
    blockStart: iso(i, 19, 6),
    blockEnd: iso(i, 19),
    blockedIp: ip(i),
    earlyUnblockAt: iso(i, 19, 2),
    earlyUnblockReason: `دلیل رفع مسدودی ${ordinal(i)}`,
  }),
  manualBlock: (i) => ({
    adminUsername: `username${(i % 12) + 1}`,
    blockStatus: pick(['active', 'blocked', 'blocked', 'active'], i),
    blockType: `نوع مسدودی ${ordinal(i)}`,
    periodUnit: pick(['minute', 'hour', 'hour', 'minute'], i),
    duration: 60 + ((i * 5) % 75),
    blockReason: `دلیل ${ordinal(i)}`,
    blockReasonDescription: `توضیح ${ordinal(i)}`,
    blockStart: iso(i, 21, 8),
    blockEnd: iso(i, 21),
    blockedIp: ip(i),
    earlyUnblockAt: iso(i, 21, 3),
    earlyUnblockReason: `جزئیات مورد ${ordinal(i)}`,
    earlyUnblockDescription: `شرح ${ordinal(i)}`,
  }),
  restrictions: (i) => ({
    adminId: id(1323213, i),
    subOperationId: id(1323213, i + 4),
    targetType: `نوع هدف ${ordinal(i)}`,
    restrictionType: `نوع محدودی ${ordinal(i)}`,
    targetActorTypes: pick(PROVIDER_KINDS, i),
    targetActorIds: id(5421321321, i),
    targetProductIds: id(1323213, i + 9),
    targetServiceIds: id(331365645, i),
    defaultAccess: `دسترسی ${ordinal(i)}`,
    overriddenAccess: `دسترسی ${ordinal(i + 1)}`,
    reason: `دلیل محدودی ${ordinal(i)}`,
    reasonDescription: `توضیح ${ordinal(i + 2)}`,
    createdAt: iso(i, 23, 4),
    startAt: iso(i, 23, 3),
    endAt: iso(i, 23),
    liftedByAdminId: id(1323213, i + 1),
    earlyLiftAt: iso(i, 23, 1),
    liftReason: `دلیل محدودی ${ordinal(i + 3)}`,
    liftReasonDescription: `توضیح دلیل محدودی ${ordinal(i)}`,
  }),
  actorDeleteRestore: (i) => ({
    adminUsername: pick(ADMINS, i),
    actorType: `عملگر ${ordinal(i)}`,
    actedAt: iso(i, 15),
    reason: `دلیل شماره ${ordinal(i)}`,
  }),
  wallet: (i) => ({
    transactionAt: iso(i, 6),
    amount: pick([123000, 45000, 250000, 1200000, 80000], i),
    source: `منبع تراکنش ${ordinal(i % 3)}`,
    adminUsername: `Adminusername${(i % 4) + 1}`,
    description: 'شرح تراکنش در این بخش آورده میشود',
    transactionType: `نوع ${ordinal(i % 2)}`,
    operationType: `نوع عملیات ${ordinal(i % 3)}`,
  }),
  comments: (i) => ({
    actorUsername: `Username${(i % 5) + 1}`,
    sentAt: iso(i, 4),
    commentId: id(1324446, i),
    operation: pick(['پاسخ', 'ویرایش', 'انتقال'], i),
    previousText: 'متن قدیم دیدگاه در این بخش آورده میشود',
    text: 'متن دیدگاه در این بخش آورده میشود',
    transferReason: `دلیل انتقال ${ordinal(i % 3)}`,
  }),
  interactions: (i) => ({
    targetType: `نوع هدف ${ordinal((i % 3) + 2)}`,
    target: pick(['دیدگاه ها', 'محصولات', 'خبرها'], i),
    interactionType: pick(['نپسندیدن', 'پسندیدن', 'اشتراک گذاری'], i),
    amount: `مقدار ${ordinal(i % 2)}`,
    sentAt: iso(i, 10),
    shareReason: 'اطلاع رسانی مهم',
    shareChannel: pick(SHARE_CHANNELS, i),
  }),
  referralLinks: (i) => {
    const [province, city, university] = pick(PROVINCES, i);
    return {
      title: `عنوان ${ordinal(i)}`,
      createdAt: iso(i, 97, 30),
      registeredUsername: `invitedusername${(i % 12) + 1}`,
      registeredAt: iso(i, 97, 12),
      upgradedUsername: `invitedusername${(i % 12) + 1}`,
      upgradedAt: iso(i, 97),
      invitedUserType: 'کاربر عادی',
      invitedUniversity: university,
      invitedGender: pick(['مرد', 'زن'], i),
      invitedProvince: province,
      invitedCity: city,
      invitedDegree: pick(DEGREES, i),
      invitedMajor: pick(MAJORS, i),
    };
  },
};

const cache = new Map<OperationalReportId, ReportRow[]>();

/** Stable rows for one report, newest first. */
export function getMockRows(reportId: OperationalReportId): ReportRow[] {
  const cached = cache.get(reportId);
  if (cached) return cached;
  const rows = Array.from({ length: MOCK_ROWS_PER_REPORT }, (_, index) => ({
    id: `${reportId}-${index + 1}`,
    ...BUILDERS[reportId](index),
  })) as ReportRow[];
  cache.set(reportId, rows);
  return rows;
}
