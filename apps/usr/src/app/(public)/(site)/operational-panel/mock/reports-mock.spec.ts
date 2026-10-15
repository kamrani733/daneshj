import { MOCK_ROWS_PER_REPORT, getMockRows } from '@operational-panel/mock/fixtures';
import { queryMockReport } from '@operational-panel/mock/reports-mock';
import { OPERATIONAL_PAGE_REPORT_IDS, OPERATIONAL_REPORT_IDS, REPORT_ENUMS } from '@operational-panel/types';
import { getReportDefinition } from '@operational-panel/utils/report-definitions';
import { REPORT_PAGE_SIZE, emptyReportRequest } from '@operational-panel/utils/report-params';

describe('operational panel report mocks', () => {
  it.each([...OPERATIONAL_REPORT_IDS, ...OPERATIONAL_PAGE_REPORT_IDS])('%s rows match the definition columns and enums', (reportId) => {
    const definition = getReportDefinition(reportId);
    const rows = getMockRows(reportId);
    expect(rows).toHaveLength(MOCK_ROWS_PER_REPORT);
    for (const row of rows) {
      // `action` cells carry only a translated label (and an optional `<key>Href`).
      for (const column of definition.columns.filter((item) => item.kind !== 'action')) {
        expect(row).toHaveProperty(column.key);
        if (column.kind === 'enum' && column.enumId) {
          expect(REPORT_ENUMS[column.enumId]).toContain(row[column.key]);
        }
        if (column.kind === 'datetime' || column.kind === 'date') {
          expect(Number.isNaN(Date.parse(String(row[column.key])))).toBe(false);
        }
      }
    }
  });

  it('paginates 24 rows per page, newest first by default', () => {
    const definition = getReportDefinition('loginLogout');
    const first = queryMockReport(definition, emptyReportRequest(definition));
    expect(first).toMatchObject({ page: 1, pageSize: REPORT_PAGE_SIZE, count: MOCK_ROWS_PER_REPORT, totalPages: 3 });
    expect(first.items).toHaveLength(REPORT_PAGE_SIZE);
    const times = first.items.map((row) => String(row.occurredAt));
    expect([...times].sort().reverse()).toEqual(times);

    const last = queryMockReport(definition, { ...emptyReportRequest(definition), page: 99 });
    expect(last.page).toBe(3);
    expect(last.items).toHaveLength(MOCK_ROWS_PER_REPORT - 2 * REPORT_PAGE_SIZE);
  });

  it('filters by enum value and date range', () => {
    const definition = getReportDefinition('loginLogout');
    const logouts = queryMockReport(definition, {
      ...emptyReportRequest(definition),
      filters: { from: '', to: '', values: { operation: ['logout'] } },
    });
    expect(logouts.count).toBeGreaterThan(0);
    expect(logouts.items.every((row) => row.operation === 'logout')).toBe(true);

    const day = String(getMockRows('loginLogout')[0].occurredAt).slice(0, 10);
    const sameDay = queryMockReport(definition, {
      ...emptyReportRequest(definition),
      filters: { from: day, to: day, values: {} },
    });
    expect(sameDay.count).toBeGreaterThan(0);
    expect(sameDay.items.every((row) => String(row.occurredAt).startsWith(day))).toBe(true);
  });

  it('Usr-Rfl-2N1 searches link title and invited username only', () => {
    const definition = getReportDefinition('referralLinks');
    const byTitle = queryMockReport(definition, { ...emptyReportRequest(definition), q: 'عنوان سه' });
    expect(byTitle.count).toBeGreaterThan(0);
    const byUsername = queryMockReport(definition, { ...emptyReportRequest(definition), q: 'invitedusername12' });
    expect(byUsername.count).toBeGreaterThan(0);
    const byCity = queryMockReport(definition, { ...emptyReportRequest(definition), q: 'شیراز' });
    expect(byCity.count).toBe(0);
  });

  it('Usr-Rfl-2N1 sorts by link title', () => {
    const definition = getReportDefinition('referralLinks');
    const page = queryMockReport(definition, { ...emptyReportRequest(definition), sort: 'title' });
    const titles = page.items.map((row) => String(row.title));
    expect([...titles].sort((a, b) => a.localeCompare(b, 'fa'))).toEqual(titles);
  });

  it('wallet transactions: withdrawals are negative, deposits positive', () => {
    const definition = getReportDefinition('walletTransactions');
    const filtered = (type: string) =>
      queryMockReport(definition, {
        ...emptyReportRequest(definition),
        filters: { from: '', to: '', values: { transactionType: [type] } },
      }).items;
    expect(filtered('withdrawal').every((row) => Number(row.amount) < 0)).toBe(true);
    expect(filtered('deposit').every((row) => Number(row.amount) > 0)).toBe(true);
  });

  it('used services search the service and product names only', () => {
    const definition = getReportDefinition('usedServices');
    const byProduct = queryMockReport(definition, { ...emptyReportRequest(definition), q: 'نام محصول سه' });
    expect(byProduct.count).toBeGreaterThan(0);
    expect(byProduct.items.every((row) => String(row.usedProduct).includes('سه'))).toBe(true);
  });
});
