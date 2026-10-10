import { periodLabels, queryMockChart, queryMockComparison } from '@operational-panel/mock/charts-mock';
import { queryMockStats } from '@operational-panel/mock/stats-mock';
import { CHART_SECTIONS, COMPARABLE_CHART_IDS } from '@operational-panel/utils/chart-definitions';
import { STAT_SECTIONS } from '@operational-panel/utils/stat-definitions';

const NO_RANGE = { from: '', to: '' };

describe('stats mock', () => {
  it('returns a value of the right kind for every mocked card', () => {
    const stats = queryMockStats(NO_RANGE);
    for (const section of STAT_SECTIONS.filter((item) => item.source === 'mock')) {
      for (const card of section.cards) {
        expect(stats[card.id]?.kind).toBe(card.kind);
      }
    }
  });

  it('keeps ratios consistent and scales counts (not averages) for a short range', () => {
    const all = queryMockStats(NO_RANGE);
    const month = queryMockStats({ from: '2026-02-01', to: '2026-03-01' });
    const ratio = month.approvedRatio;
    expect(ratio.kind).toBe('ratio');
    if (ratio.kind === 'ratio') {
      expect(ratio.value).toBeLessThanOrEqual(ratio.total);
      expect(ratio.percent).toBe(ratio.total > 0 ? Math.round((ratio.value / ratio.total) * 100) : 0);
    }
    expect(month.interactionTargets.value).toBeLessThan(all.interactionTargets.value);
    expect(month.operatorResponseTime.value).toBe(all.operatorResponseTime.value);
  });
});

describe('charts mock', () => {
  it('uses hours, weekdays, days, weeks and months as buckets', () => {
    expect(periodLabels('day')).toHaveLength(24);
    expect(periodLabels('week')).toHaveLength(7);
    expect(periodLabels('month')).toHaveLength(30);
    expect(periodLabels('season')).toHaveLength(13);
    expect(periodLabels('year')).toHaveLength(12);
  });

  it('returns the shape each chart definition expects, deterministically', () => {
    for (const section of CHART_SECTIONS) {
      for (const chart of section.charts) {
        const data = queryMockChart(chart, 'week', NO_RANGE);
        expect(queryMockChart(chart, 'week', NO_RANGE)).toEqual(data);
        if (chart.type === 'donut') {
          expect(data.kind).toBe('donut');
          if (data.kind === 'donut') {
            expect(data.percent).toBeGreaterThanOrEqual(0);
            expect(data.percent).toBeLessThanOrEqual(100);
          }
        } else {
          expect(data.kind).toBe('bar');
          if (data.kind === 'bar') {
            expect(data.points).toHaveLength(7);
            const keys = chart.type === 'groupedBar' ? chart.series.map((item) => item.key) : ['value'];
            for (const key of keys) expect(typeof data.points[0][key]).toBe('number');
          }
        }
      }
    }
  });

  it('compares only the groups that have filters', () => {
    const statId = COMPARABLE_CHART_IDS[0];
    const onlyA = queryMockComparison({ statId, period: 'season', groups: { a: { gender: '2' } } });
    expect(onlyA.labels).toHaveLength(13);
    expect(onlyA.series.a).toHaveLength(13);
    expect(onlyA.series.b).toBeUndefined();

    const both = queryMockComparison({ statId, period: 'season', groups: { a: { gender: '2' }, b: { gender: '1' } } });
    expect(both.series.b).toHaveLength(13);
    expect(both.series.a).not.toEqual(both.series.b);
  });
});
