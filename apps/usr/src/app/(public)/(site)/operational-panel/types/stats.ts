/** Operational panel «آمار» — provisional shapes (mocked; no backend contract yet). */

export type StatTrend = {
  percent: number;
  direction: 'up' | 'down';
};

export type CountStatValue = {
  kind: 'count';
  value: number;
  /** Server label shown above the value, e.g. the most frequent interaction type. */
  caption?: string;
  trend: StatTrend;
};

export type RatioStatValue = {
  kind: 'ratio';
  value: number;
  total: number;
  /** 0–100. */
  percent: number;
  trend: StatTrend;
};

export type StatValue = CountStatValue | RatioStatValue;

/** Card id → value. */
export type OperationalStats = Record<string, StatValue>;

/** ISO `YYYY-MM-DD` bounds (inclusive); empty = whole history. */
export type StatsFilters = {
  from: string;
  to: string;
};
