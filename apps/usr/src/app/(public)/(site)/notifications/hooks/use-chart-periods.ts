'use client';

import { useState } from 'react';

import type { ChartPeriod } from '@notifications/data/charts-mock';

/** One period selection per chart id. */
export function useChartPeriods<TId extends string>(
  ids: readonly TId[],
  initial: ChartPeriod = 'day'
) {
  const [periods, setPeriods] = useState<Record<TId, ChartPeriod>>(() => {
    const next = {} as Record<TId, ChartPeriod>;
    for (const id of ids) next[id] = initial;
    return next;
  });

  function setPeriod(id: TId, period: ChartPeriod) {
    setPeriods((current) =>
      current[id] === period ? current : { ...current, [id]: period }
    );
  }

  return { periods, setPeriod } as const;
}
