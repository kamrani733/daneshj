/**
 * Operational panel reports — provisional shapes (no backend contract yet; all reports are mocked).
 * Five reports have Auth MS owner endpoints to map onto later (`docs/plans/operational-panel.md`).
 */

/** Mocked reports in export order. The notifications report (#12) reuses the notifications feature. */
export const OPERATIONAL_REPORT_IDS = [
  'publicPanelFields',
  'accountOps',
  'publicPanelLifecycle',
  'publicPanelRequests',
  'loginLogout',
  'securitySettings',
  'bruteForceUnblock',
  'manualBlock',
  'restrictions',
  'actorDeleteRestore',
  'wallet',
  'comments',
  'interactions',
  'referralLinks',
] as const;

export type OperationalReportId = (typeof OPERATIONAL_REPORT_IDS)[number];

/** Closed value sets shown in the export; labels live in `operationalPanel.enums`. */
export const REPORT_ENUMS = {
  publicPanelFieldAction: ['add', 'requestRemoval', 'approveRemoval', 'rejectRemoval'],
  reviewState: ['pending', 'approved', 'rejected'],
  panelAction: ['create', 'delete'],
  loginOperation: ['login', 'logout'],
  blockStatus: ['active', 'blocked'],
  periodUnit: ['minute', 'hour'],
} as const;

export type ReportEnumId = keyof typeof REPORT_ENUMS;

/**
 * How a cell renders: `ltr` = usernames, IPs, ids (isolated LTR) · `datetime` = ISO instant → Jalali ·
 * `money` = toman amount (unit in the header) · `hours` = «۱۸ ساعت» · `longText` = clamped to 2 lines.
 */
export type ReportColumnKind =
  | 'text'
  | 'longText'
  | 'ltr'
  | 'datetime'
  | 'number'
  | 'money'
  | 'hours'
  | 'enum';

export type ReportColumnDefinition = {
  key: string;
  kind: ReportColumnKind;
  enumId?: ReportEnumId;
};

/** Sort values: `<column>` ascending, `-<column>` descending. */
export type ReportSortValue = string;

export type ReportDefinition = {
  id: OperationalReportId;
  columns: ReportColumnDefinition[];
  /** Main date column: default sort (newest first) and the date-range filter. */
  dateColumn: string;
  sortOptions: ReportSortValue[];
  /** Columns the search box matches; defaults to every text-like column. */
  searchColumns?: string[];
  /** SRS path codes this report implements (only Rfl is in `docs/srs/`). */
  srs?: string[];
};

export type ReportCellValue = string | number | null;

export type ReportRow = { id: string } & Record<string, ReportCellValue>;

export type ReportFilters = {
  /** ISO `YYYY-MM-DD` bounds of `dateColumn` (inclusive); empty = open. */
  from: string;
  to: string;
  /** Enum column → selected values. */
  values: Record<string, string[]>;
};

export type ReportRequest = {
  q: string;
  sort: ReportSortValue;
  page: number;
  filters: ReportFilters;
};

export type ReportPage = {
  items: ReportRow[];
  page: number;
  pageSize: number;
  count: number;
  totalPages: number;
};
