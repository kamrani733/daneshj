import { hasDateRange, parseDateRange, writeDateRange } from '@operational-panel/utils/date-range-params';

describe('date range URL params', () => {
  it('reads its own prefix, drops malformed dates and orders a reversed range', () => {
    const params = new URLSearchParams({
      'stats.from': '2026-03-09',
      'stats.to': '2026-03-01',
      'charts.from': 'yesterday',
    });
    expect(parseDateRange('stats', params)).toEqual({ from: '2026-03-01', to: '2026-03-09' });
    expect(parseDateRange('charts', params)).toEqual({ from: '', to: '' });
  });

  it('replaces only its own params and omits empty bounds', () => {
    const current = new URLSearchParams({ 'stats.from': '2026-01-01', 'loginLogout.page': '2' });
    const next = writeDateRange('stats', { from: '', to: '2026-02-01' }, current);
    expect(Object.fromEntries(next)).toEqual({ 'loginLogout.page': '2', 'stats.to': '2026-02-01' });
  });

  it('detects an applied range', () => {
    expect(hasDateRange({ from: '', to: '' })).toBe(false);
    expect(hasDateRange({ from: '2026-01-01', to: '' })).toBe(true);
  });
});
