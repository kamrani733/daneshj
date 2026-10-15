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

/** Reports that live on their own sidebar pages (used services, wallet, interactions), not in «گزارشات». */
export const OPERATIONAL_PAGE_REPORT_IDS = [
  'usedServices',
  'walletTransactions',
  'interactionsByActor',
  'interactionsToActor',
] as const;

export type OperationalReportId =
  | (typeof OPERATIONAL_REPORT_IDS)[number]
  | (typeof OPERATIONAL_PAGE_REPORT_IDS)[number];

/** Closed value sets shown in the export; labels live in `operationalPanel.enums`. */
export const REPORT_ENUMS = {
  publicPanelFieldAction: ['add', 'requestRemoval', 'approveRemoval', 'rejectRemoval'],
  reviewState: ['pending', 'approved', 'rejected'],
  panelAction: ['create', 'delete'],
  loginOperation: ['login', 'logout'],
  blockStatus: ['active', 'blocked'],
  periodUnit: ['minute', 'hour'],
  transactionType: ['deposit', 'withdrawal'],
  interactorType: ['user', 'provider', 'admin'],
  interactionType: ['like', 'dislike', 'share', 'follow'],
  interactionValue: ['active', 'inactive'],
} as const;

export type ReportEnumId = keyof typeof REPORT_ENUMS;

/**
 * How a cell renders: `ltr` = usernames, IPs, ids (isolated LTR) · `datetime` = ISO instant → Jalali ·
 * `date` = ISO instant → Jalali day only · `money` = toman amount (unit in the header) ·
 * `signedMoney` = «+۵۰۰٬۰۰۰» green / «-۹۰٬۵۰۰» red · `hours` = «۱۸ ساعت» · `longText` = clamped to 2 lines ·
 * `link` = text linked to `row[<key>Href]` · `action` = fixed label (`operationalPanel.<labelKey>`) linked the same way.
 */
export type ReportColumnKind =
  | 'text'
  | 'longText'
  | 'ltr'
  | 'datetime'
  | 'date'
  | 'number'
  | 'money'
  | 'signedMoney'
  | 'hours'
  | 'enum'
  | 'link'
  | 'action';

export type ReportColumnDefinition = {
  key: string;
  kind: ReportColumnKind;
  enumId?: ReportEnumId;
  /** `link`: isolate the text as LTR (usernames). */
  ltr?: boolean;
  /** `action`: label key in `operationalPanel`. */
  labelKey?: string;
  /** Shown instead of «—» when the value is empty, key in `operationalPanel` (e.g. «ندارد»). */
  emptyKey?: string;
};

/** Sort values: `<column>` ascending, `-<column>` descending. */
export type ReportSortValue = string;

export type ReportDefinition = {
  id: OperationalReportId;
  columns: ReportColumnDefinition[];
  /** Main date column: default sort (newest first) and the date-range filter. */
  dateColumn: string;
  sortOptions: ReportSortValue[];
  /** Date-range filter labelled `reports.<id>.dateFilter` (the design names it unlike the column). */
  dateFilterLabel?: boolean;
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
