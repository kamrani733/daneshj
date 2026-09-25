import {
  mapActorChartsReport,
  mapActorStatisticsReport,
} from '../src/app/(public)/(site)/notifications/api/transformers';

describe('notifications actor report mappers', () => {
  it('maps actor statistics to UI KPI shape', () => {
    const result = mapActorStatisticsReport({
      absolute_statistics: {
        manual_notifications_received_count: 3,
        system_notifications_received_count: 7,
      },
      relative_statistics: {
        unread_notifications_percentage: 25,
        link_click_to_total_link_ratio: 10,
      },
    });

    expect(result.countStats).toEqual([
      { id: 'manual', titleKey: 'manualReceived', value: 3 },
      { id: 'system', titleKey: 'systemReceived', value: 7 },
    ]);
    expect(result.ratioStats).toHaveLength(2);
    expect(result.ratioStats[0]?.percent).toBe(25);
    expect(result.ratioStats[1]?.percent).toBe(10);
  });

  it('maps actor charts bar and pie series for the charts UI', () => {
    const result = mapActorChartsReport({
      bar_charts_by_time: {
        manual_notifications_received_chart: {
          series: [{ date: '2026-08-01', count: 2 }],
        },
        system_notifications_received_chart: {
          series: [{ date: '2026-08-01', count: 5 }],
        },
      },
      pie_charts: {
        unread_notifications_ratio_chart: {
          series: [
            { label: 'Unread', count: 1, percentage: 20 },
            { label: 'Read', count: 4, percentage: 80 },
          ],
        },
        link_click_ratio_chart: {
          series: [
            { label: 'Clicked', count: 3, percentage: 60 },
            { label: 'Not Clicked', count: 2, percentage: 40 },
          ],
        },
      },
    });

    expect(result.reactionTimeSeries).toHaveLength(1);
    expect(result.conversionRateSeries).toHaveLength(1);
    expect(result.readVsUnread.centerPercent).toBe(80);
    expect(result.receivedByCategory.totalCount).toBe(7);
  });
});
