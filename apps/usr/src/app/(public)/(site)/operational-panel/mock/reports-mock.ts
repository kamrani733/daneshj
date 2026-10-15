// MOCK ONLY — fake operational-panel report endpoints. Imported by `@operational-panel/api` only.
import { normalizeFaText } from '@/lib/normalize-fa';

import { getMockRows } from '@operational-panel/mock/fixtures';
import type {
  NumberRange,
  ReportCellValue,
  ReportDefinition,
  ReportPage,
  ReportRequest,
  ReportRow,
} from '@operational-panel/types';
import { REPORT_PAGE_SIZE } from '@operational-panel/utils/report-params';

/** Typing this query simulates a failed request (error state + retry). */
export const MOCK_REPORT_ERROR_QUERY = 'خطای آزمایشی';

const LATENCY_MS = 350;

const TEXT_KINDS = new Set(['text', 'longText', 'ltr', 'link']);

function searchColumns(definition: ReportDefinition): string[] {
  return (
    definition.searchColumns ??
    definition.columns.filter((column) => TEXT_KINDS.has(column.kind)).map((column) => column.key)
  );
}

function matchesQuery(row: ReportRow, columns: string[], query: string): boolean {
  const needle = query.toLowerCase();
  return columns.some((key) => {
    const value = row[key];
    return value !== null && normalizeFaText(String(value)).toLowerCase().includes(needle);
  });
}

/** Compares the calendar day (ISO `YYYY-MM-DD`) of the date column with inclusive bounds. */
function inDateRange(value: ReportCellValue, from: string, to: string): boolean {
  if (!from && !to) return true;
  if (typeof value !== 'string') return false;
  const day = value.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
}

/** Compares the absolute amount (signed wallet amounts) with inclusive bounds. */
function inNumberRange(value: ReportCellValue, range: NumberRange): boolean {
  if (typeof value !== 'number') return range.min === null && range.max === null;
  const amount = Math.abs(value);
  return (range.min === null || amount >= range.min) && (range.max === null || amount <= range.max);
}

function compare(a: ReportCellValue, b: ReportCellValue): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'fa');
}

/** Filters, sorts and paginates in memory with the same params the real endpoint will receive. */
export function queryMockReport(definition: ReportDefinition, request: ReportRequest): ReportPage {
  const columns = searchColumns(definition);
  const { from, to, values } = request.filters;

  const filtered = getMockRows(definition.id).filter(
    (row) =>
      (!request.q || matchesQuery(row, columns, request.q)) &&
      inDateRange(row[definition.dateColumn], from, to) &&
      Object.entries(request.filters.ranges ?? {}).every(([column, range]) => inNumberRange(row[column], range)) &&
      Object.entries(values).every(
        ([column, selected]) => selected.length === 0 || selected.includes(String(row[column])),
      ),
  );

  const descending = request.sort.startsWith('-');
  const sortColumn = descending ? request.sort.slice(1) : request.sort;
  const sorted = [...filtered].sort((a, b) => {
    const order = compare(a[sortColumn], b[sortColumn]);
    return descending ? -order : order;
  });

  const totalPages = Math.max(Math.ceil(sorted.length / REPORT_PAGE_SIZE), 1);
  const page = Math.min(request.page, totalPages);
  return {
    items: sorted.slice((page - 1) * REPORT_PAGE_SIZE, page * REPORT_PAGE_SIZE),
    page,
    pageSize: REPORT_PAGE_SIZE,
    count: sorted.length,
    totalPages,
  };
}

export function mockGetReport(definition: ReportDefinition, request: ReportRequest): Promise<ReportPage> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (request.q === MOCK_REPORT_ERROR_QUERY) {
        reject(new Error('mock report failure'));
        return;
      }
      resolve(queryMockReport(definition, request));
    }, LATENCY_MS),
  );
}
