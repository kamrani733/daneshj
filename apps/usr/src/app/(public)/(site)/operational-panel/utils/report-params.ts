import { normalizeFaText, toLatinDigits } from '@/lib/normalize-fa';

import {
  REPORT_ENUMS,
  type NumberRange,
  type ReportColumnDefinition,
  type ReportDefinition,
  type ReportFilters,
  type ReportRequest,
} from '@operational-panel/types';

/** SRS input convention: search fields accept at most 50 characters. */
export const REPORT_SEARCH_MAX_LENGTH = 50;

/** Rule `30-data-layer`: panel lists show 24 records per page. */
export const REPORT_PAGE_SIZE = 24;

const MAX_PAGE = 10_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type ParamsReader = { get(name: string): string | null; keys(): Iterable<string> };

/** Persian letters, Latin digits, ≤ 50 characters. */
export function normalizeReportQuery(raw: string): string {
  return normalizeFaText(raw).slice(0, REPORT_SEARCH_MAX_LENGTH).trim();
}

export const EMPTY_REPORT_FILTERS: ReportFilters = { from: '', to: '', values: {} };

export function emptyReportRequest(definition: ReportDefinition): ReportRequest {
  return {
    q: '',
    sort: definition.sortOptions[0],
    page: 1,
    filters: EMPTY_REPORT_FILTERS,
  };
}

/** Typed amount → whole non-negative number (Persian digits and separators accepted), or `null`. */
export function parseRangeBound(raw: string | null): number | null {
  const digits = toLatinDigits(raw ?? '').replace(/[,،٬\s]/g, '');
  if (!/^\d{1,15}$/.test(digits)) return null;
  return Number(digits);
}

/** Enum columns double as checkbox filters. */
export function enumFilterColumns(
  definition: ReportDefinition,
): Array<ReportColumnDefinition & { enumId: keyof typeof REPORT_ENUMS }> {
  return definition.columns.filter(
    (column): column is ReportColumnDefinition & { enumId: keyof typeof REPORT_ENUMS } =>
      column.kind === 'enum' && column.enumId !== undefined,
  );
}

/** True when a date bound, an enum value or a range bound is applied. */
export function hasActiveFilters(request: ReportRequest): boolean {
  return (
    request.filters.from !== '' ||
    request.filters.to !== '' ||
    Object.values(request.filters.values).some((values) => values.length > 0) ||
    Object.values(request.filters.ranges ?? {}).some((range) => range.min !== null || range.max !== null)
  );
}

/** Param names are namespaced per report (`loginLogout.q`, `loginLogout.page`, …) — 14 reports share one URL. */
const param = (definition: ReportDefinition, name: string) => `${definition.id}.${name}`;

function readIsoDate(value: string | null): string {
  return value && ISO_DATE.test(value) ? value : '';
}

/** URL → request for one report. Unknown or malformed values fall back to defaults, never trusted. */
export function parseReportParams(definition: ReportDefinition, params: ParamsReader): ReportRequest {
  const fallback = emptyReportRequest(definition);
  const sort = params.get(param(definition, 'sort'));
  const page = Number(params.get(param(definition, 'page')));

  const values: Record<string, string[]> = {};
  for (const column of enumFilterColumns(definition)) {
    const allowed: readonly string[] = REPORT_ENUMS[column.enumId];
    const raw = params.get(param(definition, `f.${column.key}`));
    const selected = raw ? Array.from(new Set(raw.split(','))).filter((value) => allowed.includes(value)) : [];
    if (selected.length > 0) values[column.key] = selected;
  }

  let from = readIsoDate(params.get(param(definition, 'from')));
  let to = readIsoDate(params.get(param(definition, 'to')));
  if (from && to && from > to) [from, to] = [to, from];

  const ranges: Record<string, NumberRange> = {};
  for (const column of definition.rangeColumns ?? []) {
    let min = parseRangeBound(params.get(param(definition, `r.${column}.min`)));
    let max = parseRangeBound(params.get(param(definition, `r.${column}.max`)));
    if (min !== null && max !== null && min > max) [min, max] = [max, min];
    if (min !== null || max !== null) ranges[column] = { min, max };
  }

  return {
    q: normalizeReportQuery(params.get(param(definition, 'q')) ?? ''),
    sort: sort && definition.sortOptions.includes(sort) ? sort : fallback.sort,
    page: Number.isInteger(page) && page >= 1 && page <= MAX_PAGE ? page : 1,
    filters: { from, to, values, ...(Object.keys(ranges).length > 0 ? { ranges } : {}) },
  };
}

/** Replaces this report's params in `current` (other reports' params are kept). Defaults are omitted. */
export function writeReportParams(
  definition: ReportDefinition,
  request: ReportRequest,
  current: ParamsReader,
): URLSearchParams {
  const next = new URLSearchParams();
  const prefix = `${definition.id}.`;
  for (const key of Array.from(current.keys())) {
    const value = current.get(key);
    if (!key.startsWith(prefix) && value !== null) next.set(key, value);
  }

  const q = normalizeReportQuery(request.q);
  if (q) next.set(param(definition, 'q'), q);
  if (request.sort !== definition.sortOptions[0] && definition.sortOptions.includes(request.sort)) {
    next.set(param(definition, 'sort'), request.sort);
  }
  if (request.page > 1) next.set(param(definition, 'page'), String(request.page));
  if (ISO_DATE.test(request.filters.from)) next.set(param(definition, 'from'), request.filters.from);
  if (ISO_DATE.test(request.filters.to)) next.set(param(definition, 'to'), request.filters.to);
  for (const [column, values] of Object.entries(request.filters.values)) {
    if (values.length > 0) next.set(param(definition, `f.${column}`), values.join(','));
  }
  for (const column of definition.rangeColumns ?? []) {
    const range = request.filters.ranges?.[column];
    if (range?.min != null) next.set(param(definition, `r.${column}.min`), String(range.min));
    if (range?.max != null) next.set(param(definition, `r.${column}.max`), String(range.max));
  }
  return next;
}
