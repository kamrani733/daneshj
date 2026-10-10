// MOCK ONLY — fake «آمار» values (numbers from the Operational Panel export). Imported by `@operational-panel/api`.
import type { OperationalStats, StatTrend, StatValue, StatsFilters } from '@operational-panel/types/stats';

const LATENCY_MS = 350;

const up = (percent = 18): StatTrend => ({ percent, direction: 'up' });
const down = (percent = 18): StatTrend => ({ percent, direction: 'down' });

const countStat = (value: number, trend: StatTrend = up(), caption?: string): StatValue => ({
  kind: 'count',
  value,
  caption,
  trend,
});

const ratioStat = (value: number, total: number, trend: StatTrend = up()): StatValue => ({
  kind: 'ratio',
  value,
  total,
  percent: total > 0 ? Math.round((value / total) * 100) : 0,
  trend,
});

/** Whole-history values. A date range scales counts down (simulated server-side filtering). */
const BASE: OperationalStats = {
  editRequests: countStat(17),
  approvedRequests: countStat(16),
  rejectedRequests: countStat(1, down()),
  adminResponseTime: countStat(20, down()),
  privateFieldsCompleted: countStat(18),
  publicFieldsMoved: countStat(12),
  rejectedRatio: ratioStat(1, 17),
  approvedRatio: ratioStat(16, 17),

  interactionTargets: countStat(1247),
  lowLikeTargets: countStat(1247, down()),
  topInteractionType: countStat(1247, up(), 'پسندیدن'),
  averageScore: countStat(3.2),
  highLikeTargets: countStat(1247),
  likePerView: ratioStat(1894, 2557),
  lowScoreTargets: ratioStat(1894, 2557),
  fullScoreTargets: ratioStat(1894, 2557),
  interactionsVsPrevious: ratioStat(1894, 2557),
  likedVsDisliked: ratioStat(1894, 2557),
  followVsUnfollow: ratioStat(1894, 2557),

  commentsSubmitted: countStat(135),
  commentsReplied: countStat(135),
  commentsLiked: countStat(135),
  commentsDisliked: countStat(135),
  commentsInappropriate: countStat(135),
  commentsReported: countStat(135),

  ticketsAverage: countStat(135),
  ticketResolutionTime: countStat(135),
  operatorResponseTime: countStat(12),
  adminReplyTime: countStat(5),

  linksCreated: countStat(17),
  linksShared: countStat(16),
  linkClicks: countStat(1, down()),
  registrations: countStat(24, down()),
  upgradedRegistrations: countStat(18),
  rewardsCreated: countStat(12),
  maxRewards: countStat(18),
  upgradedRatio: ratioStat(1894, 2557),
};

/** Durations and averages do not shrink with a shorter period. */
const NOT_SCALED = new Set([
  'adminResponseTime',
  'averageScore',
  'ticketsAverage',
  'ticketResolutionTime',
  'operatorResponseTime',
  'adminReplyTime',
]);

const DAY_MS = 86_400_000;

function rangeFactor({ from, to }: StatsFilters): number {
  if (!from && !to) return 1;
  const start = from ? Date.parse(from) : Date.parse('2025-03-21');
  const end = to ? Date.parse(to) : Date.now();
  const days = Math.max((end - start) / DAY_MS + 1, 1);
  return Math.min(days / 365, 1);
}

export function queryMockStats(filters: StatsFilters): OperationalStats {
  const factor = rangeFactor(filters);
  if (factor === 1) return BASE;
  return Object.fromEntries(
    Object.entries(BASE).map(([id, stat]) => {
      if (NOT_SCALED.has(id)) return [id, stat];
      if (stat.kind === 'count') return [id, { ...stat, value: Math.max(Math.round(stat.value * factor), 0) }];
      const value = Math.round(stat.value * factor);
      const total = Math.max(Math.round(stat.total * factor), value);
      return [id, { ...stat, value, total, percent: total > 0 ? Math.round((value / total) * 100) : 0 }];
    }),
  );
}

export function mockGetStats(filters: StatsFilters): Promise<OperationalStats> {
  return new Promise((resolve) => setTimeout(() => resolve(queryMockStats(filters)), LATENCY_MS));
}
