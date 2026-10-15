import { getReportDefinition } from '@operational-panel/utils/report-definitions';
import {
  emptyReportRequest,
  enumFilterColumns,
  hasActiveFilters,
  normalizeReportQuery,
  parseRangeBound,
  parseReportParams,
  writeReportParams,
} from '@operational-panel/utils/report-params';

const login = getReportDefinition('loginLogout');
const referral = getReportDefinition('referralLinks');

describe('normalizeReportQuery', () => {
  it('normalizes Arabic letters and digits and clamps to 50 characters', () => {
    expect(normalizeReportQuery('  علي ۱۲  ')).toBe('علی 12');
    expect(normalizeReportQuery('ك'.repeat(60))).toHaveLength(50);
  });
});

describe('parseReportParams', () => {
  it('returns defaults for an empty URL', () => {
    expect(parseReportParams(login, new URLSearchParams())).toEqual(emptyReportRequest(login));
  });

  it('reads namespaced params and drops unknown or malformed values', () => {
    const params = new URLSearchParams({
      'loginLogout.q': 'Chrome',
      'loginLogout.sort': 'occurredAt',
      'loginLogout.page': '3',
      'loginLogout.from': '2026-03-01',
      'loginLogout.to': 'not-a-date',
      'loginLogout.f.operation': 'login,hacked,login',
      'wallet.page': '9',
    });
    expect(parseReportParams(login, params)).toEqual({
      q: 'Chrome',
      sort: 'occurredAt',
      page: 3,
      filters: { from: '2026-03-01', to: '', values: { operation: ['login'] } },
    });
  });

  it('rejects unknown sorts and impossible pages, and orders a reversed date range', () => {
    const params = new URLSearchParams({
      'loginLogout.sort': 'password',
      'loginLogout.page': '-2',
      'loginLogout.from': '2026-03-09',
      'loginLogout.to': '2026-03-01',
    });
    const request = parseReportParams(login, params);
    expect(request.sort).toBe('-occurredAt');
    expect(request.page).toBe(1);
    expect(request.filters).toMatchObject({ from: '2026-03-01', to: '2026-03-09' });
  });
});

describe('writeReportParams', () => {
  it('keeps other reports params, replaces its own and omits defaults', () => {
    const current = new URLSearchParams({ 'wallet.page': '2', 'loginLogout.q': 'old' });
    const next = writeReportParams(
      login,
      { ...emptyReportRequest(login), page: 2, filters: { from: '', to: '', values: { operation: ['logout'] } } },
      current,
    );
    expect(Object.fromEntries(next)).toEqual({
      'wallet.page': '2',
      'loginLogout.page': '2',
      'loginLogout.f.operation': 'logout',
    });
  });

  it('round-trips through parseReportParams', () => {
    const request = {
      q: 'عنوان',
      sort: 'title',
      page: 4,
      filters: { from: '2025-01-01', to: '2026-01-01', values: {} },
    };
    expect(parseReportParams(referral, writeReportParams(referral, request, new URLSearchParams()))).toEqual(request);
  });
});

describe('filters', () => {
  it('uses enum columns as checkbox filters', () => {
    expect(enumFilterColumns(login).map((column) => column.key)).toEqual(['operation']);
    expect(enumFilterColumns(referral)).toEqual([]);
  });

  it('detects applied filters', () => {
    expect(hasActiveFilters(emptyReportRequest(login))).toBe(false);
    expect(
      hasActiveFilters({ ...emptyReportRequest(login), filters: { from: '2026-01-01', to: '', values: {} } }),
    ).toBe(true);
  });
});

describe('amount range filter (wallet report)', () => {
  const wallet = getReportDefinition('wallet');

  it('reads Persian digits and separators, rejects junk', () => {
    expect(parseRangeBound('۱۲۰٬۰۰۰')).toBe(120000);
    expect(parseRangeBound('45,000')).toBe(45000);
    expect(parseRangeBound('-5')).toBeNull();
    expect(parseRangeBound('abc')).toBeNull();
    expect(parseRangeBound('')).toBeNull();
  });

  it('round-trips through the URL and swaps reversed bounds', () => {
    const request = {
      ...emptyReportRequest(wallet),
      filters: { from: '', to: '', values: {}, ranges: { amount: { min: 250000, max: 45000 } } },
    };
    const params = writeReportParams(wallet, request, new URLSearchParams());
    expect(params.get('wallet.r.amount.min')).toBe('250000');
    expect(parseReportParams(wallet, params).filters.ranges).toEqual({ amount: { min: 45000, max: 250000 } });
    expect(hasActiveFilters(parseReportParams(wallet, params))).toBe(true);
  });

  it('ignores range params on reports without range columns', () => {
    const params = new URLSearchParams('loginLogout.r.amount.min=5');
    expect(parseReportParams(login, params).filters.ranges).toBeUndefined();
  });
});
