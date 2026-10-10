'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { NoResultState } from '@/components/ui/no-result-state';
import { normalizeFaText } from '@/lib/normalize-fa';

import { ChartSection } from '@operational-panel/components/chart-section';
import { ComparisonSection } from '@operational-panel/components/comparison/comparison-section';
import { DateRangeFilterBar } from '@operational-panel/components/date-range-filter-bar';
import { NotificationsChartsSection } from '@operational-panel/components/notifications-charts-section';
import { OperationalShell } from '@operational-panel/components/operational-shell';
import { useDateRangeUrlState } from '@operational-panel/hooks/use-date-range-url-state';
import { CHART_SECTIONS } from '@operational-panel/utils/chart-definitions';
import { REPORT_SEARCH_MAX_LENGTH } from '@operational-panel/utils/report-params';

type OperationalChartsViewProps = {
  displayName?: string;
  accessToken?: string | null;
  sessionUserId?: string | null;
};

/** `/operational-panel/charts` — Figma «پنل عملیاتی» › «نمودار». The search box narrows charts by title. */
export function OperationalChartsView({ displayName, accessToken, sessionUserId }: OperationalChartsViewProps) {
  const t = useTranslations('operationalPanel.charts');
  const tToolbar = useTranslations('operationalPanel.toolbar');
  const { range } = useDateRangeUrlState('charts');
  const [query, setQuery] = useState('');
  const needle = normalizeFaText(query).toLowerCase();
  const matches = (title: string) => !needle || normalizeFaText(title).toLowerCase().includes(needle);

  const sections = CHART_SECTIONS.map((section) => {
    const title = t(`sections.${section.id}`);
    if (section.source === 'notifications') {
      const titles = [t('titles.manualReceived'), t('titles.systemReceived'), t('titles.unreadRatio'), t('titles.linkClickRatio')];
      return { section, title, visible: matches(title) || titles.some(matches), charts: section.charts };
    }
    const charts = matches(title) ? section.charts : section.charts.filter((chart) => matches(t(`titles.${chart.id}`)));
    return { section, title, visible: charts.length > 0, charts };
  });
  const comparisonVisible = matches(t('sections.comparison'));
  const nothing = !sections.some((item) => item.visible) && !comparisonVisible;

  return (
    <OperationalShell section="charts" displayName={displayName}>
      <DateRangeFilterBar
        prefix="charts"
        search={{ value: query, onChange: setQuery, label: tToolbar('search'), maxLength: REPORT_SEARCH_MAX_LENGTH }}
      />

      {sections.map(({ section, title, visible, charts }) => {
        if (!visible) return null;
        return section.source === 'notifications' ? (
          <NotificationsChartsSection
            key={section.id}
            title={title}
            accessToken={accessToken}
            sessionUserId={sessionUserId}
          />
        ) : (
          <ChartSection key={section.id} title={title} charts={charts} range={range} />
        );
      })}

      {comparisonVisible ? <ComparisonSection /> : null}
      {nothing ? <NoResultState message={t('noResult')} /> : null}
    </OperationalShell>
  );
}
