const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toFaDigits(value: string) {
  return value.replace(/\d/g, (digit) => FA_DIGITS[Number(digit)] ?? digit);
}

function mapDayPeriod(value: string): string {
  const normalized = value.replace(/\s+/g, '').toLowerCase();
  if (
    normalized.includes('بعد') ||
    normalized.includes('pm') ||
    normalized === 'ب.ظ' ||
    normalized === 'بظ'
  ) {
    return 'ب.ظ';
  }
  if (
    normalized.includes('قبل') ||
    normalized.includes('am') ||
    normalized === 'ق.ظ' ||
    normalized === 'قظ'
  ) {
    return 'ق.ظ';
  }
  return value;
}

/** Format a JS Date for notification cards — Figma: ۱۴۰۴/۱۲/۰۶ · ۱:۱۵ ب.ظ */
export function formatNotificationDateTime(date: Date): {
  date: string;
  time: string;
} {
  const dateLabel = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  const parts = new Intl.DateTimeFormat('fa-IR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === 'hour')?.value ?? '';
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '';
  const dayPeriod = parts.find((part) => part.type === 'dayPeriod')?.value ?? '';
  const timeLabel = dayPeriod
    ? `${hour}:${minute} ${mapDayPeriod(dayPeriod)}`
    : `${hour}:${minute}`;

  return { date: dateLabel, time: timeLabel };
}

function formatAsciiClock(timePart: string): string {
  const match = timePart.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (!match) return toFaDigits(timePart.trim());

  const hour24 = Number(match[1]);
  const minute = match[2];
  if (Number.isNaN(hour24)) return toFaDigits(timePart.trim());

  const period = hour24 >= 12 ? 'ب.ظ' : 'ق.ظ';
  const hour12 = hour24 % 12 || 12;
  return `${toFaDigits(String(hour12))}:${toFaDigits(minute)} ${period}`;
}

/**
 * Split API `sent_at` into display date/time.
 * Supports ISO instants (`2026-07-29T14:37:19Z`) and preformatted jalali strings.
 */
export function splitSentAt(sentAt: string | null): { date: string; time: string } {
  if (!sentAt?.trim()) return { date: '', time: '' };
  const raw = sentAt.trim();

  const year = Number(raw.slice(0, 4));
  const looksGregorianInstant =
    /[Tt]/.test(raw) ||
    /[Zz]$/.test(raw) ||
    /[+-]\d{2}:?\d{2}$/.test(raw) ||
    (year >= 1900 && year <= 2100);

  if (looksGregorianInstant) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return formatNotificationDateTime(parsed);
    }
  }

  const [datePart = '', timePart = ''] = raw.split(/\s+/);
  return {
    date: toFaDigits(datePart.replace(/-/g, '/')),
    time: timePart ? formatAsciiClock(timePart) : '',
  };
}
