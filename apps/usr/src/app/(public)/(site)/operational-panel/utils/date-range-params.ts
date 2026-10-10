/** Date-range filter of a stats / charts block in the URL (`<prefix>.from`, `<prefix>.to`, ISO `YYYY-MM-DD`). */

export type DateRange = {
  from: string;
  to: string;
};

export const EMPTY_DATE_RANGE: DateRange = { from: '', to: '' };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type ParamsReader = { get(name: string): string | null; keys(): Iterable<string> };

const read = (value: string | null) => (value && ISO_DATE.test(value) ? value : '');

/** URL → range; malformed dates are dropped and a reversed range is put in order. */
export function parseDateRange(prefix: string, params: ParamsReader): DateRange {
  let from = read(params.get(`${prefix}.from`));
  let to = read(params.get(`${prefix}.to`));
  if (from && to && from > to) [from, to] = [to, from];
  return { from, to };
}

/** Replaces this block's range in `current`; other params are kept, empty bounds omitted. */
export function writeDateRange(prefix: string, range: DateRange, current: ParamsReader): URLSearchParams {
  const next = new URLSearchParams();
  for (const key of Array.from(current.keys())) {
    const value = current.get(key);
    if (!key.startsWith(`${prefix}.`) && value !== null) next.set(key, value);
  }
  if (ISO_DATE.test(range.from)) next.set(`${prefix}.from`, range.from);
  if (ISO_DATE.test(range.to)) next.set(`${prefix}.to`, range.to);
  return next;
}

export function hasDateRange(range: DateRange): boolean {
  return range.from !== '' || range.to !== '';
}
