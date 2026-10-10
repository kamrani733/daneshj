'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DateRangeInputs } from '@/components/ui/filter-fields';
import { ReportToolbar } from '@/components/ui/report-toolbar';

import { useDateRangeUrlState } from '@operational-panel/hooks/use-date-range-url-state';
import { EMPTY_DATE_RANGE, type DateRange } from '@operational-panel/utils/date-range-params';

type DateRangeFilterBarProps = {
  /** URL namespace, e.g. `stats` → `stats.from`, `stats.to`. */
  prefix: string;
  search?: Parameters<typeof ReportToolbar>[0]['search'];
};

/**
 * Figma «فیلترها» bar of the stats / charts tabs. The export draws no filter fields, so the panel offers a
 * date range only (provisional — `docs/09-known-issues.md`).
 */
export function DateRangeFilterBar({ prefix, search }: DateRangeFilterBarProps) {
  const t = useTranslations('operationalPanel');
  const { range, setRange } = useDateRangeUrlState(prefix);
  const [open, setOpen] = useState(false);

  return (
    <ReportToolbar
      search={search}
      filter={{
        label: t('toolbar.filters'),
        open,
        onOpenChange: setOpen,
        panel: (
          <RangePanel
            range={range}
            onApply={(next) => {
              setRange(next);
              setOpen(false);
            }}
            onClear={() => setRange(EMPTY_DATE_RANGE)}
          />
        ),
      }}
    />
  );
}

function RangePanel({
  range,
  onApply,
  onClear,
}: {
  range: DateRange;
  onApply: (range: DateRange) => void;
  onClear: () => void;
}) {
  const t = useTranslations('operationalPanel.filters');
  const [draft, setDraft] = useState(range);

  return (
    <div className="flex flex-col gap-2 pt-4">
      <p className="px-4 text-label-large font-medium text-on-surface">{t('period')}</p>
      <DateRangeInputs
        startLabel={t('from')}
        endLabel={t('to')}
        placeholder={t('datePlaceholder')}
        hint={t('dateHint')}
        startValue={draft.from}
        endValue={draft.to}
        onStartChange={(from) => setDraft((current) => ({ ...current, from }))}
        onEndChange={(to) => setDraft((current) => ({ ...current, to }))}
      />
      <div className="flex items-center justify-end gap-3 px-4 pb-4">
        <Button
          type="button"
          variant="link"
          onClick={() => {
            setDraft(EMPTY_DATE_RANGE);
            onClear();
          }}
          className="h-auto px-0"
        >
          <span className="text-label-large">{t('clear')}</span>
        </Button>
        <Button type="button" size="pillSm" onClick={() => onApply(draft)}>
          {t('apply')}
        </Button>
      </div>
    </div>
  );
}
