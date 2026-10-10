import type { ChartTone } from '@/components/charts';

export type ChartSectionId = 'account' | 'interactions' | 'comments' | 'notifications' | 'support' | 'referral';

export type ChartDefinition =
  | {
      id: string;
      type: 'bar';
      tone: ChartTone;
      /** Unit above the value axis. */
      valueUnit?: 'hours';
    }
  | {
      id: string;
      type: 'groupedBar';
      /** Series keys → `operationalPanel.charts.series.<key>`. */
      series: Array<{ key: string; tone: ChartTone }>;
    }
  | {
      id: string;
      type: 'donut';
      tone: ChartTone;
      /** `operationalPanel.charts.legends.<legend>.{highlight,rest}`. */
      legend: string;
      /** Footer unit: `operationalPanel.charts.totals.<total>`. */
      total: 'requests' | 'targets' | 'users' | 'notifications';
    };

export type ChartSectionDefinition = {
  id: ChartSectionId;
  /** `notifications` = Notification MS charts report (real API); everything else is mocked. */
  source: 'mock' | 'notifications';
  charts: ChartDefinition[];
};

const bar = (id: string, tone: ChartTone = 'primary', valueUnit?: 'hours'): ChartDefinition => ({
  id,
  type: 'bar',
  tone,
  valueUnit,
});

const donut = (
  id: string,
  tone: ChartTone,
  legend: string,
  total: 'requests' | 'targets' | 'users' | 'notifications' = 'requests',
): ChartDefinition => ({ id, type: 'donut', tone, legend, total });

/**
 * Sections in the stats-tab order; inside a section bar charts come first, then donuts (2 per row).
 * Orange (`secondary`) = the negative metrics the export draws orange. Titles:
 * `operationalPanel.charts.titles.<id>`.
 */
export const CHART_SECTIONS: ChartSectionDefinition[] = [
  {
    id: 'account',
    source: 'mock',
    charts: [
      bar('completedFields'),
      bar('movedFields'),
      bar('approvedRequests'),
      bar('editRequests'),
      bar('responseTime', 'primary', 'hours'),
      bar('rejectedRequests', 'secondary'),
      donut('rejectedRatio', 'secondary', 'rejected'),
      donut('approvedRatio', 'primary', 'approved'),
    ],
  },
  {
    id: 'interactions',
    source: 'mock',
    charts: [
      bar('interactionTargets'),
      bar('lowLikeTargets'),
      bar('highLikeTargets'),
      bar('topInteractionType'),
      donut('lowScoreRatio', 'secondary', 'lowScore', 'targets'),
      donut('fullScoreRatio', 'primary', 'fullScore', 'targets'),
      donut('likedVsDisliked', 'secondary', 'liked', 'targets'),
      donut('followVsUnfollow', 'primary', 'follow', 'targets'),
      donut('likePerView', 'secondary', 'like', 'targets'),
      donut('interactionsVsPrevious', 'primary', 'current', 'targets'),
    ],
  },
  {
    id: 'comments',
    source: 'mock',
    charts: [
      bar('commentsSubmitted'),
      bar('commentsReplied'),
      bar('commentsLiked'),
      bar('commentsDisliked', 'secondary'),
      bar('commentsReported'),
      bar('commentsInappropriate', 'secondary'),
    ],
  },
  { id: 'notifications', source: 'notifications', charts: [] },
  {
    id: 'support',
    source: 'mock',
    charts: [
      bar('ticketsAverage'),
      bar('ticketResolutionTime'),
      bar('operatorResponseTime'),
      bar('adminReplyTime'),
    ],
  },
  {
    id: 'referral',
    source: 'mock',
    charts: [
      bar('linksCreated'),
      bar('linksShared'),
      bar('linkClicks'),
      bar('registrations'),
      bar('upgradedRegistrations'),
      {
        id: 'rewardsCreated',
        type: 'groupedBar',
        series: [
          { key: 'inviter', tone: 'primary' },
          { key: 'invitee', tone: 'secondary' },
        ],
      },
      {
        id: 'maxRewards',
        type: 'groupedBar',
        series: [
          { key: 'inviter', tone: 'primary' },
          { key: 'invitee', tone: 'secondary' },
        ],
      },
      donut('upgradedRatio', 'secondary', 'upgraded', 'users'),
    ],
  },
];

/** Charts that can be compared between two user groups (every mocked count series). */
export const COMPARABLE_CHART_IDS: string[] = CHART_SECTIONS.filter((section) => section.source === 'mock').flatMap(
  (section) => section.charts.filter((chart) => chart.type === 'bar').map((chart) => chart.id),
);

export function findChartDefinition(chartId: string): ChartDefinition | undefined {
  for (const section of CHART_SECTIONS) {
    const chart = section.charts.find((item) => item.id === chartId);
    if (chart) return chart;
  }
  return undefined;
}
