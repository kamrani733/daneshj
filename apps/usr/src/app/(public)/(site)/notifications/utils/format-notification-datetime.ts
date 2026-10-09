import { formatJalaliDateTime, toFaDigits } from '@/lib/jalali';

/** Format a JS Date for notification cards — Figma: ۱۴۰۴/۱۲/۰۶ · ۱:۱۵ ب.ظ */
export function formatNotificationDateTime(date: Date): {
  date: string;
  time: string;
} {
  return formatJalaliDateTime(date);
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
