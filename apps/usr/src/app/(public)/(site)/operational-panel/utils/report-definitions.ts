import type {
  OperationalReportId,
  ReportColumnDefinition,
  ReportDefinition,
  ReportEnumId,
} from '@operational-panel/types';

const text = (key: string): ReportColumnDefinition => ({ key, kind: 'text' });
const longText = (key: string): ReportColumnDefinition => ({ key, kind: 'longText' });
const ltr = (key: string): ReportColumnDefinition => ({ key, kind: 'ltr' });
const datetime = (key: string): ReportColumnDefinition => ({ key, kind: 'datetime' });
const date = (key: string): ReportColumnDefinition => ({ key, kind: 'date' });
const link = (key: string, ltr = false): ReportColumnDefinition => ({ key, kind: 'link', ltr });
const enumColumn = (key: string, enumId: ReportEnumId): ReportColumnDefinition => ({ key, kind: 'enum', enumId });

/** Newest / oldest by the main date column — the only sort the export implies (provisional). */
const byDate = (column: string) => [`-${column}`, column];

const INTERACTION_COLUMNS: ReportColumnDefinition[] = [
  datetime('interactedAt'),
  link('interactor', true),
  enumColumn('interactorType', 'interactorType'),
  enumColumn('interactionType', 'interactionType'),
  enumColumn('interactionValue', 'interactionValue'),
];

/**
 * Column order = desktop table (start → end), followed by the fields that only the tablet cards show
 * (the export clips wide desktop tables). Headers: `operationalPanel.reports.<id>.columns.<key>`.
 */
export const REPORT_DEFINITIONS: Record<OperationalReportId, ReportDefinition> = {
  publicPanelFields: {
    id: 'publicPanelFields',
    columns: [
      ltr('actorUsername'),
      datetime('reviewedAt'),
      { key: 'action', kind: 'enum', enumId: 'publicPanelFieldAction' },
      text('field'),
      text('status'),
      datetime('requestedAt'),
    ],
    dateColumn: 'requestedAt',
    // Figma filter: «بازه زمانی تایید/رد», «نوع اقدام».
    dateFilterColumns: ['reviewedAt'],
    sortOptions: byDate('requestedAt'),
  },
  accountOps: {
    id: 'accountOps',
    columns: [
      ltr('actorUsername'),
      datetime('actedAt'),
      { key: 'action', kind: 'enum', enumId: 'reviewState' },
      text('field'),
      text('previousValue'),
      text('newValue'),
      text('status'),
    ],
    dateColumn: 'actedAt',
    // Figma filter: «بازه زمانی اقدام», «نوع اقدام».
    dateFilterLabel: true,
    sortOptions: byDate('actedAt'),
  },
  publicPanelLifecycle: {
    id: 'publicPanelLifecycle',
    columns: [
      ltr('adminUsername'),
      datetime('requestedAt'),
      text('action'),
      datetime('actedAt'),
      { key: 'responseHours', kind: 'hours' },
    ],
    dateColumn: 'requestedAt',
    // Figma filter: «بازه زمانی اقدام», «بازه زمانی درخواست» (+ «نوع اقدام», «فاصله زمانی درخواست تا اقدام»: not built).
    dateFilterColumns: ['actedAt', 'requestedAt'],
    sortOptions: byDate('requestedAt'),
  },
  publicPanelRequests: {
    id: 'publicPanelRequests',
    columns: [
      ltr('ticketId'),
      text('status'),
      { key: 'action', kind: 'enum', enumId: 'panelAction' },
      datetime('requestedAt'),
    ],
    dateColumn: 'requestedAt',
    sortOptions: byDate('requestedAt'),
  },
  loginLogout: {
    id: 'loginLogout',
    columns: [
      datetime('occurredAt'),
      { key: 'operation', kind: 'enum', enumId: 'loginOperation' },
      text('operationType'),
      ltr('ip'),
      enumColumn('os', 'operatingSystem'),
      enumColumn('browser', 'browser'),
    ],
    dateColumn: 'occurredAt',
    // Figma filter: «بازه زمانی ورود و خروج», «عملیات», «سیستم عامل», «مرورگر» (+ «نوع ورود» / «نوع خروج»: placeholders).
    dateFilterLabel: true,
    sortOptions: byDate('occurredAt'),
  },
  securitySettings: {
    id: 'securitySettings',
    columns: [datetime('actedAt'), text('field'), text('previousValue'), text('newValue')],
    dateColumn: 'actedAt',
    // Figma filter: «بازه زمانی اقدام» (+ «فیلد ویرایش شده»: placeholders).
    dateFilterLabel: true,
    sortOptions: byDate('actedAt'),
  },
  bruteForceUnblock: {
    id: 'bruteForceUnblock',
    columns: [
      text('blockType'),
      text('blockReason'),
      longText('blockReasonDescription'),
      datetime('blockStart'),
      datetime('blockEnd'),
      ltr('blockedIp'),
      datetime('earlyUnblockAt'),
      text('earlyUnblockReason'),
    ],
    dateColumn: 'blockStart',
    // Figma filter: three date ranges (+ block type, reasons: placeholders).
    dateFilterColumns: ['blockStart', 'blockEnd', 'earlyUnblockAt'],
    sortOptions: byDate('blockStart'),
  },
  manualBlock: {
    id: 'manualBlock',
    columns: [
      ltr('adminUsername'),
      { key: 'blockStatus', kind: 'enum', enumId: 'blockStatus' },
      text('blockType'),
      { key: 'periodUnit', kind: 'enum', enumId: 'periodUnit' },
      { key: 'duration', kind: 'number' },
      text('blockReason'),
      longText('blockReasonDescription'),
      datetime('blockStart'),
      datetime('blockEnd'),
      ltr('blockedIp'),
      datetime('earlyUnblockAt'),
      text('earlyUnblockReason'),
      longText('earlyUnblockDescription'),
    ],
    dateColumn: 'blockStart',
    // Figma filter: «وضعیت مسدودی», three date ranges (+ type, period type, reasons: placeholders or unlike the table).
    dateFilterColumns: ['blockStart', 'blockEnd', 'earlyUnblockAt'],
    sortOptions: byDate('blockStart'),
  },
  restrictions: {
    id: 'restrictions',
    columns: [
      ltr('adminId'),
      ltr('subOperationId'),
      text('targetType'),
      text('restrictionType'),
      text('targetActorTypes'),
      ltr('targetActorIds'),
      ltr('targetProductIds'),
      ltr('targetServiceIds'),
      text('defaultAccess'),
      text('overriddenAccess'),
      text('reason'),
      longText('reasonDescription'),
      datetime('createdAt'),
      datetime('startAt'),
      datetime('endAt'),
      ltr('liftedByAdminId'),
      datetime('earlyLiftAt'),
      text('liftReason'),
      longText('liftReasonDescription'),
    ],
    dateColumn: 'createdAt',
    // Figma filter: four date ranges (+ target / access types and ID fields: placeholders or ID ranges, not built).
    dateFilterColumns: ['createdAt', 'startAt', 'endAt', 'earlyLiftAt'],
    sortOptions: byDate('createdAt'),
  },
  // Filter: «بازه زمانی اقدام» (+ «نوع عملگر», options still placeholders) · sort menu: admin, actor type, newest.
  actorDeleteRestore: {
    id: 'actorDeleteRestore',
    columns: [ltr('adminUsername'), text('actorType'), datetime('actedAt'), text('reason')],
    dateColumn: 'actedAt',
    dateFilterLabel: true,
    sortOptions: ['adminUsername', 'actorType', '-actedAt'],
  },
  // Filter: «بازه زمانی تراکنش», «بازه میزان تراکنش», «نوع عملیات» (+ «منبع تراکنش», «نوع تراکنش», options still
  // placeholders) · sort menu: newest only.
  wallet: {
    id: 'wallet',
    columns: [
      datetime('transactionAt'),
      { key: 'amount', kind: 'money' },
      text('source'),
      ltr('adminUsername'),
      longText('description'),
      text('transactionType'),
      enumColumn('operationType', 'walletOperation'),
    ],
    dateColumn: 'transactionAt',
    dateFilterLabel: true,
    rangeColumns: ['amount'],
    sortOptions: ['-transactionAt'],
  },
  // Filter: «بازه زمانی اقدام», «نوع عملیات» · sort menu: newest, comment id.
  comments: {
    id: 'comments',
    columns: [
      ltr('actorUsername'),
      datetime('sentAt'),
      ltr('commentId'),
      enumColumn('operation', 'commentOperation'),
      longText('previousText'),
      longText('text'),
      text('transferReason'),
    ],
    dateColumn: 'sentAt',
    dateFilterLabel: true,
    sortOptions: ['-sentAt', 'commentId'],
  },
  // Filter: «بازه زمانی تعامل», «نوع هدف تعامل» (two real options), «نوع تعامل», «محیط اشتراک گذاری».
  interactions: {
    id: 'interactions',
    columns: [
      enumColumn('targetType', 'interactionTarget'),
      text('target'),
      enumColumn('interactionType', 'interactionType'),
      text('amount'),
      datetime('sentAt'),
      text('shareReason'),
      enumColumn('shareChannel', 'shareChannel'),
    ],
    dateColumn: 'sentAt',
    dateFilterLabel: true,
    sortOptions: byDate('sentAt'),
  },
  // SRS: Usr-Rfl-2N1 — search: link title, invited username · filter: creation time ·
  // sort: link title, creation time, invited username.
  referralLinks: {
    id: 'referralLinks',
    columns: [
      text('title'),
      datetime('createdAt'),
      ltr('registeredUsername'),
      datetime('registeredAt'),
      ltr('upgradedUsername'),
      datetime('upgradedAt'),
      text('invitedUserType'),
      text('invitedUniversity'),
      text('invitedGender'),
      text('invitedProvince'),
      text('invitedCity'),
      text('invitedDegree'),
      text('invitedMajor'),
    ],
    dateColumn: 'createdAt',
    sortOptions: ['-createdAt', 'createdAt', 'title', 'registeredUsername'],
    searchColumns: ['title', 'registeredUsername'],
    srs: ['Usr-Rfl-2N1'],
  },
  // «سرویس‌های استفاده شده» page (Figma web overview 890:64903): one table, no section header.
  usedServices: {
    id: 'usedServices',
    columns: [
      link('serviceName'),
      link('usedProduct'),
      date('usedAt'),
      { key: 'financialInteraction', kind: 'money', emptyKey: 'values.none' },
      { key: 'operations', kind: 'action', labelKey: 'usedServices.goToServicePanel' },
    ],
    dateColumn: 'usedAt',
    dateFilterLabel: true,
    sortOptions: byDate('usedAt'),
    searchColumns: ['serviceName', 'usedProduct'],
  },
  // «کیف پول» page › «سابقه تراکنش ها» (export «Operational Panel۳»): filters + search, no sort control.
  walletTransactions: {
    id: 'walletTransactions',
    columns: [
      datetime('transactionAt'),
      enumColumn('transactionType', 'transactionType'),
      { key: 'amount', kind: 'signedMoney' },
      longText('description'),
    ],
    dateColumn: 'transactionAt',
    sortOptions: byDate('transactionAt'),
    searchColumns: ['description'],
  },
  // «مشاهده تعاملات» tabs (export «Notifications», tablet frame): same fields in both directions.
  interactionsByActor: {
    id: 'interactionsByActor',
    columns: INTERACTION_COLUMNS,
    dateColumn: 'interactedAt',
    sortOptions: byDate('interactedAt'),
    searchColumns: ['interactor'],
  },
  interactionsToActor: {
    id: 'interactionsToActor',
    columns: INTERACTION_COLUMNS,
    dateColumn: 'interactedAt',
    sortOptions: byDate('interactedAt'),
    searchColumns: ['interactor'],
  },
};

export function getReportDefinition(id: OperationalReportId): ReportDefinition {
  return REPORT_DEFINITIONS[id];
}
