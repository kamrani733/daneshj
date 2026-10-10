'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { BarChart, ChartCard, ChartPeriodToggle, type BarDatum, type ChartPeriod } from '@/components/charts';
import { ErrorState } from '@/components/ui/error-state';
import { ReportSection } from '@/components/ui/report-section';
import { SearchSelect } from '@/components/ui/search-select';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

import { ComparisonEmptyState, ComparisonIllustration } from '@operational-panel/components/comparison/empty-state';
import { ComparisonFilterPanel } from '@operational-panel/components/comparison/filter-panel';
import { ComparisonGroupCard, type GroupChip } from '@operational-panel/components/comparison/group-card';
import { useComparisonQuery } from '@operational-panel/hooks/use-chart-queries';
import { useComparisonFieldOptions } from '@operational-panel/hooks/use-comparison-field-options';
import {
  COMPARISON_FIELDS,
  type ComparisonField,
  type ComparisonFilters,
  type ComparisonGroupId,
  type ComparisonResult,
} from '@operational-panel/types/charts';
import { COMPARABLE_CHART_IDS } from '@operational-panel/utils/chart-definitions';

type ViewMode = 'combined' | 'adapted';
const GROUPS: ComparisonGroupId[] = ['a', 'b'];

/**
 * «نمودارهای قابل تنظیم» — compare one statistic between two user groups (Figma Empty / Half full /
 * Combine / Adapted). Provisional: no SRS or backend contract yet (mocked).
 */
export function ComparisonSection() {
  const t = useTranslations('operationalPanel.charts');
  const tc = useTranslations('operationalPanel.charts.comparison');
  const [open, setOpen] = useState(true);
  const [statId, setStatId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Record<ComparisonGroupId, ComparisonFilters>>({ a: {}, b: {} });
  const [editing, setEditing] = useState<ComparisonGroupId | null>(null);
  const [view, setView] = useState<ViewMode>('combined');
  const [period, setPeriod] = useState<ChartPeriod>('day');

  const optionsA = useComparisonFieldOptions(groups.a);
  const optionsB = useComparisonFieldOptions(groups.b);
  const chips: Record<ComparisonGroupId, GroupChip[]> = {
    a: toChips(groups.a, optionsA),
    b: toChips(groups.b, optionsB),
  };

  const configured = GROUPS.filter((group) => Object.keys(groups[group]).length > 0);
  const request = useMemo(
    () => ({
      statId: statId ?? '',
      period,
      groups: Object.fromEntries(
        GROUPS.filter((group) => Object.keys(groups[group]).length > 0).map((group) => [group, groups[group]])
      ),
    }),
    [statId, period, groups]
  );
  const query = useComparisonQuery(request, statId !== null && configured.length > 0);

  const groupLegend = (group: ComparisonGroupId) =>
    chips[group][0] ? tc('legend', { group: tc(`groups.${group}`), filter: chips[group][0].label }) : tc(`groups.${group}`);

  return (
    <ReportSection title={t('sections.comparison')} open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-4 min-[720px]:gap-6">
        <div className="flex flex-col gap-2 rounded-medium bg-surface-container-lowest p-4 shadow-app-elevation-1">
          <SearchSelect
            label={tc('statLabel')}
            options={COMPARABLE_CHART_IDS.map((id) => ({ value: id, label: t(`titles.${id}`) }))}
            value={statId}
            onValueChange={setStatId}
            clearLabel={tc('clearField', { field: tc('statLabel') })}
            emptyLabel={tc('noOptions')}
            labelSurfaceClassName="bg-surface-container-lowest"
          />
          <p className="text-label-small text-on-surface-variant">{tc('statHint')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[600px]:grid-cols-2 min-[720px]:gap-6">
          {GROUPS.map((group) => (
            <ComparisonGroupCard
              key={group}
              group={group}
              chips={chips[group]}
              editing={editing === group}
              onEdit={() => setEditing((current) => (current === group ? null : group))}
              onRemove={(field) =>
                setGroups((current) => {
                  const next = { ...current[group] };
                  delete next[field];
                  return { ...current, [group]: next };
                })
              }
            />
          ))}
        </div>

        {editing ? (
          <ComparisonFilterPanel
            group={editing}
            filters={groups[editing]}
            onApply={(filters) => {
              setGroups((current) => ({ ...current, [editing]: filters }));
              setEditing(null);
            }}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ChartPeriodToggle value={period} onValueChange={setPeriod} />
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(next) => {
              if (next) setView(next as ViewMode);
            }}
            spacing={1}
            aria-label={tc('viewLabel')}
            className="rounded-medium bg-surface-container p-1"
          >
            {(['combined', 'adapted'] as const).map((mode) => (
              <ToggleGroupItem
                key={mode}
                value={mode}
                className={cn(
                  'h-10 rounded-medium border-0 px-4 text-primary shadow-none hover:bg-transparent hover:text-primary',
                  'data-[state=on]:bg-primary data-[state=on]:text-on-primary data-[state=on]:hover:bg-primary data-[state=on]:hover:text-on-primary'
                )}
              >
                <span className="text-label-large font-medium">{tc(`views.${mode}`)}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {statId === null || configured.length === 0 ? (
          <ComparisonEmptyState />
        ) : query.isPending ? (
          <div role="status" className="flex min-h-64 items-center justify-center rounded-medium bg-surface-container-lowest">
            <Spinner className="size-8 text-primary" aria-label={t('loading')} />
          </div>
        ) : query.isError ? (
          <ErrorState message={t('error')} retryLabel={t('retry')} onRetry={() => void query.refetch()} />
        ) : view === 'combined' ? (
          <ChartCard title={tc('combinedTitle')}>
            <BarChart
              data={toPoints(query.data)}
              series={configured.map((group) => ({
                key: group,
                label: groupLegend(group),
                tone: group === 'a' ? 'primary' : 'secondary',
              }))}
            />
          </ChartCard>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[600px]:grid-cols-2 min-[720px]:gap-6">
            {GROUPS.map((group) => (
              <ChartCard key={group} title={tc(`groups.${group}`)} className="min-w-0">
                {query.data.series[group] ? (
                  <BarChart
                    data={toPoints(query.data)}
                    series={[{ key: group, label: groupLegend(group), tone: group === 'a' ? 'primary' : 'secondary' }]}
                  />
                ) : (
                  <div className="flex h-56 flex-col items-center justify-center gap-3">
                    <ComparisonIllustration />
                    <p className="text-label-small text-outline">{tc('noFilters')}</p>
                  </div>
                )}
              </ChartCard>
            ))}
          </div>
        )}
      </div>
    </ReportSection>
  );
}

/** Chips in the order the filters were picked (the legend names the first one). */
function toChips(filters: ComparisonFilters, options: ReturnType<typeof useComparisonFieldOptions>): GroupChip[] {
  const known = new Set<string>(COMPARISON_FIELDS);
  return Object.entries(filters).flatMap(([key, value]) => {
    if (!known.has(key) || !value) return [];
    const field = key as ComparisonField;
    const label = options[field].find((option) => option.value === value)?.label;
    return label ? [{ field, label }] : [];
  });
}

function toPoints(result: ComparisonResult): BarDatum[] {
  return result.labels.map((label, index) => ({
    label,
    ...(result.series.a ? { a: result.series.a[index] } : {}),
    ...(result.series.b ? { b: result.series.b[index] } : {}),
  }));
}
