'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { BarChart, ChartCard, ChartPeriodToggle, DonutChart, type ChartPeriod } from '@/components/charts';
import { AssignmentIcon, EditIcon, NotificationsIcon, WalletIcon } from '@/components/icons/material-icons';
import { PanelNav } from '@/components/panel';
import { HorizontalScroller } from '@/components/ui/horizontal-scroller';
import { Pagination } from '@/components/ui/pagination';
import { ReportCardList } from '@/components/ui/report-card-list';
import { ReportSection } from '@/components/ui/report-section';
import { ReportTable } from '@/components/ui/report-table';
import { ReportToolbar } from '@/components/ui/report-toolbar';
import { StatCountCard, StatRatioCard } from '@/components/ui/stat-card';
import { formatFaNumber } from '@/lib/format-fa';

const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
const ROWS = [1, 2, 3].map((row) => ({ id: String(row) }));
const BARS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].map((label, index) => ({
  label,
  value: [32, 51, 40, 67, 58, 44, 29][index],
  other: [21, 38, 47, 30, 52, 26, 35][index],
}));

/** `/dev/ui-kit` — panel shell, report blocks, stat cards and charts (operational panel, notifications). */
export function UiKitPanels() {
  const t = useTranslations('uiKit');
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<ChartPeriod>('week');

  return (
    <div className="flex flex-col gap-6 rounded-large border border-outline-variant bg-surface-container-lowest p-4">
      <h3 className="text-title-medium font-bold text-on-surface">{t('groupPanels')}</h3>

      <div className="flex flex-col gap-4 min-[720px]:flex-row min-[720px]:items-start">
        <PanelNav
          items={[
            { key: 'wallet', label: t('navWallet'), icon: WalletIcon },
            { key: 'reports', label: t('navReports'), icon: AssignmentIcon, href: '/dev/ui-kit' },
          ]}
          label={t('navLabel')}
          menuLabel={t('navLabel')}
          centeredMenuTrigger
        />
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 min-[480px]:grid-cols-2">
          <StatCountCard
            icon={EditIcon}
            label={t('statCountLabel')}
            value={formatFaNumber(17)}
            trend={{ direction: 'up', label: t('statTrend') }}
          />
          <StatRatioCard
            icon={NotificationsIcon}
            label={t('statRatioLabel')}
            fraction={t('statFraction')}
            percent={74}
            percentLabel={`${formatFaNumber(74)}٪`}
            trend={{ direction: 'down', label: t('statTrend') }}
          />
        </div>
      </div>

      <ReportSection title={t('reportTitle')} open={open} onOpenChange={setOpen}>
        <ReportToolbar
          search={{ value: query, onChange: setQuery, label: t('searchCommentsLabel'), maxLength: 50 }}
          sort={{
            label: t('sortLabel'),
            value: sort,
            options: [
              { value: 'newest', label: t('sortNewest') },
              { value: 'oldest', label: t('sortOldest') },
            ],
            onChange: setSort,
          }}
          filter={{
            label: t('filtersLabel'),
            open: filtersOpen,
            onOpenChange: setFiltersOpen,
            panel: <p className="p-4 text-body-medium text-on-surface-variant">{t('filtersPanel')}</p>,
          }}
        />
        <HorizontalScroller label={t('reportTitle')} scrollStartLabel={t('scrollStart')} scrollEndLabel={t('scrollEnd')}>
          <ReportTable
            caption={t('reportTitle')}
            columns={COLUMNS.map((key) => ({ key, header: t('columnHeader', { n: formatFaNumber(COLUMNS.indexOf(key) + 1) }) }))}
            rows={ROWS}
            getRowKey={(row) => row.id}
            renderCell={(row, key) => t('cellValue', { row: formatFaNumber(Number(row.id)), column: key.toUpperCase() })}
          />
        </HorizontalScroller>
        <Pagination page={page} totalPages={25} onPageChange={setPage} />
        <ReportCardList
          items={ROWS.slice(0, 1).map((row) => ({
            key: row.id,
            fields: COLUMNS.slice(0, 3).map((key, index) => ({
              key,
              label: t('columnHeader', { n: formatFaNumber(index + 1) }),
              value: t('cellValue', { row: formatFaNumber(1), column: key.toUpperCase() }),
            })),
          }))}
        />
      </ReportSection>

      <div className="@container grid grid-cols-1 gap-4">
        <ChartCard title={t('chartBarTitle')} actions={<ChartPeriodToggle value={period} onValueChange={setPeriod} />}>
          <BarChart
            data={BARS}
            series={[
              { key: 'value', label: t('chartSeriesA'), tone: 'primary' },
              { key: 'other', label: t('chartSeriesB'), tone: 'secondary' },
            ]}
            fadeLast
          />
        </ChartCard>
        <ChartCard title={t('chartDonutTitle')} footer={t('chartFooter')}>
          <DonutChart
            percent={18}
            tone="secondary"
            centerValue={`${formatFaNumber(18)}٪`}
            centerLabel={t('chartDonutHighlight')}
            legend={[
              { label: t('chartDonutHighlight'), value: `${formatFaNumber(18)}٪`, tone: 'secondary' },
              { label: t('chartDonutRest'), value: `${formatFaNumber(82)}٪`, tone: null },
            ]}
          />
        </ChartCard>
      </div>
    </div>
  );
}
