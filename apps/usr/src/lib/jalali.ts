/** Compact Jalali ↔ Gregorian helpers (no external deps). */

export type JalaliDate = { year: number; month: number; day: number };

export const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const;

/** Weekday labels Sat→Fri (RTL calendar header starts with ش on the right). */
export const JALALI_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const;

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export function toFaDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)] ?? digit);
}

export function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function div(a: number, b: number) {
  return Math.floor(a / b);
}

/** Gregorian y/m/d → Jalali y/m/d */
export function toJalali(gy: number, gm: number, gd: number): JalaliDate {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    gdm[gm - 1]!;
  let jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { year: jy, month: jm, day: jd };
}

/** Jalali y/m/d → Gregorian y/m/d */
export function toGregorian(jy: number, jm: number, jd: number): {
  year: number;
  month: number;
  day: number;
} {
  jy += 1595;
  let days =
    -355668 +
    365 * jy +
    div(jy, 33) * 8 +
    div((jy % 33) + 3, 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * div(days, 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * div(--days, 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    gy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const salA = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (gm = 1; gm <= 12 && gd > salA[gm]!; gm++) gd -= salA[gm]!;
  return { year: gy, month: gm, day: gd };
}

export function isJalaliLeap(year: number) {
  return (((year + 12) % 33) % 4) === 1;
}

export function jalaliMonthLength(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeap(year) ? 30 : 29;
}

export function dateToJalali(date: Date): JalaliDate {
  return toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function jalaliToDate(j: JalaliDate): Date {
  const g = toGregorian(j.year, j.month, j.day);
  return new Date(g.year, g.month - 1, g.day);
}

/** Gregorian ISO `YYYY-MM-DD` → Jalali parts (local calendar day). */
export function parseIsoDate(value: string | null | undefined): JalaliDate | null {
  if (!value?.trim()) return null;
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return toJalali(year, month, day);
}

/** Jalali parts → Gregorian ISO `YYYY-MM-DD` for API query params. */
export function toIsoDate(j: JalaliDate): string {
  const g = toGregorian(j.year, j.month, j.day);
  return `${g.year}-${pad2(g.month)}-${pad2(g.day)}`;
}

/** Display `۱۴۰۴/۰۸/۱۷` */
export function formatJalaliDisplay(j: JalaliDate): string {
  return toFaDigits(`${j.year}/${pad2(j.month)}/${pad2(j.day)}`);
}

/** Saturday=0 … Friday=6 for the given Jalali date. */
export function jalaliWeekdaySat0(j: JalaliDate): number {
  const date = jalaliToDate(j);
  // JS: 0=Sun … 6=Sat → Sat=0
  return (date.getDay() + 1) % 7;
}

export function addJalaliMonths(j: JalaliDate, delta: number): JalaliDate {
  const index = j.year * 12 + (j.month - 1) + delta;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  const day = Math.min(j.day, jalaliMonthLength(year, month));
  return { year, month, day };
}

export type CalendarCell = {
  jalali: JalaliDate;
  inCurrentMonth: boolean;
  iso: string;
};

/** 6×7 grid for a Jalali month view. */
export function buildJalaliMonthGrid(year: number, month: number): CalendarCell[] {
  const firstWeekday = jalaliWeekdaySat0({ year, month, day: 1 });
  const monthLen = jalaliMonthLength(year, month);
  const prev = addJalaliMonths({ year, month, day: 1 }, -1);
  const prevLen = jalaliMonthLength(prev.year, prev.month);
  const cells: CalendarCell[] = [];

  for (let i = 0; i < firstWeekday; i++) {
    const day = prevLen - firstWeekday + 1 + i;
    const jalali = { year: prev.year, month: prev.month, day };
    cells.push({ jalali, inCurrentMonth: false, iso: toIsoDate(jalali) });
  }

  for (let day = 1; day <= monthLen; day++) {
    const jalali = { year, month, day };
    cells.push({ jalali, inCurrentMonth: true, iso: toIsoDate(jalali) });
  }

  let nextDay = 1;
  const next = addJalaliMonths({ year, month, day: 1 }, 1);
  while (cells.length < 42) {
    const jalali = { year: next.year, month: next.month, day: nextDay++ };
    cells.push({ jalali, inCurrentMonth: false, iso: toIsoDate(jalali) });
  }

  return cells;
}
