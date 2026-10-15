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
  // Filter frames «Browser Item», «operation system Item» (login / logout report).
  browser: ['chrome', 'firefox', 'safari', 'edge', 'opera', 'other'],
  operatingSystem: ['windows', 'macos', 'linux', 'ios', 'android', 'ipados'],
  transactionType: ['deposit', 'withdrawal'],
  interactorType: ['user', 'provider', 'admin'],
  interactionType: ['like', 'dislike', 'follow', 'unfollow', 'share'],
  // Filter frames «Financial report filter», «Comment report filter», «Interaction report filter».
  walletOperation: ['createWallet', 'increaseBalance', 'decreaseBalance'],
  commentOperation: [
    'create',
    'edit',
    'delete',
    'restore',
    'reply',
    'moveToPublicPanel',
    'removeFromPublicPanel',
    'feature',
    'unfeature',
    'report',
  ],
  interactionTarget: ['comment', 'publicPanel'],
  shareChannel: ['whatsapp', 'telegram', 'instagram', 'x', 'bale', 'rubika'],
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
  /**
   * Date columns with their own range, labelled `reports.<id>.dateFilters.<key>` (Figma: «بازه زمانی شروع مسدودی»,
   * «بازه زمانی پایان مسدودی», …). Replaces the single range on `dateColumn` when set.
   */
  dateFilterColumns?: string[];
  /** Numeric columns filtered by a «شروع بازه / پایان بازه» pair, labelled `reports.<id>.rangeFilter.<key>`. */
  rangeColumns?: string[];
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
  /** Range column → inclusive bounds; `null` = open. */
  ranges?: Record<string, NumberRange>;
  /** `dateFilterColumns` → ISO `YYYY-MM-DD` bounds (inclusive); empty = open. */
  dates?: Record<string, DateBounds>;
};

export type DateBounds = { from: string; to: string };

export type NumberRange = { min: number | null; max: number | null };

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
