'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  CHARTS_TOTAL_REQUESTS,
  getLinkClickDonut,
  getManualReceivedSeries,
  getReadRatioDonut,
  getSystemReceivedSeries,
  type ChartPeriod,
} from '@notifications/data/charts-mock';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { ChartPeriodToggle } from './chart-period-toggle';
import { NotificationsBarChart } from './notifications-bar-chart';
import { NotificationsDonutChart } from './notifications-donut-chart';

/** Figma fixed charts block — cream shell + stacked white chart cards. */
export function NotificationsChartsPanel() {
  const t = useTranslations('notifications.charts');
  const [open, setOpen] = useState(true);
  const [systemPeriod, setSystemPeriod] = useState<ChartPeriod>('day');
  const [manualPeriod, setManualPeriod] = useState<ChartPeriod>('day');
  const [readPeriod, setReadPeriod] = useState<ChartPeriod>('day');
  const [linkPeriod, setLinkPeriod] = useState<ChartPeriod>('day');

  const readDonut = getReadRatioDonut();
  const linkDonut = getLinkClickDonut();
  const totalLabel = t('totalRequests', {
    count: formatFaNumber(CHARTS_TOTAL_REQUESTS),
  });

  return (
    <section className="overflow-hidden rounded-xl bg-home-search-fill ring-1 ring-border/40">
      <header className="flex items-center justify-between gap-3 px-4 py-3.5 min-[720px]:px-5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-5 w-1.5 shrink-0 rounded-full bg-warning-400"
          />
          <h2 className="text-base font-bold leading-6 text-primary-700">
            {t('fixedTitle')}
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-expanded={open}
          aria-label={open ? t('collapse') : t('expand')}
          onClick={() => setOpen((value) => !value)}
          className="size-8 shrink-0 text-primary-700 hover:bg-transparent hover:text-primary-700"
        >
          <ChevronDown
            className={cn(
              'size-5 transition-transform',
              !open && '-rotate-90'
            )}
            strokeWidth={1.75}
            aria-hidden
          />
        </Button>
      </header>

      {open ? (
        <div className="flex flex-col gap-4 px-3 pb-4 min-[720px]:gap-5 min-[720px]:px-5 min-[720px]:pb-5">
          <ChartCard
            title={t('systemReceived')}
            period={systemPeriod}
            onPeriodChange={setSystemPeriod}
            headerLayout="split"
          >
            <NotificationsBarChart
              data={getSystemReceivedSeries(systemPeriod)}
              barColor="var(--color-warning-400)"
            />
          </ChartCard>

          <ChartCard
            title={t('manualReceived')}
            period={manualPeriod}
            onPeriodChange={setManualPeriod}
            headerLayout="split"
          >
            <NotificationsBarChart
              data={getManualReceivedSeries(manualPeriod)}
              barColor="var(--color-primary)"
              showValueLabels
            />
          </ChartCard>

          <div className="grid grid-cols-1 gap-4 min-[960px]:grid-cols-2 min-[960px]:gap-5">
            <ChartCard
              title={t('readRatio')}
              period={readPeriod}
              onPeriodChange={setReadPeriod}
              footer={totalLabel}
              className="min-w-0"
            >
              <NotificationsDonutChart
                data={readDonut}
                primaryColor="var(--color-warning-400)"
                centerPercent={18}
                centerLabel={t('rejected')}
                legend={[
                  {
                    label: t('rejected'),
                    value: `${formatFaNumber(18)}٪`,
                    color: 'var(--color-warning-400)',
                  },
                  {
                    label: t('other'),
                    value: `${formatFaNumber(82)}٪`,
                    color: 'var(--color-neutral-300)',
                  },
                ]}
              />
            </ChartCard>

            <ChartCard
              title={t('linkClickRatio')}
              period={linkPeriod}
              onPeriodChange={setLinkPeriod}
              footer={totalLabel}
              className="min-w-0"
            >
              <NotificationsDonutChart
                data={linkDonut}
                primaryColor="var(--color-primary)"
                centerPercent={74}
                centerLabel={t('confirmed')}
                legend={[
                  {
                    label: t('confirmed'),
                    value: formatFaNumber(743),
                    color: 'var(--color-primary)',
                  },
                  {
                    label: t('other'),
                    value: formatFaNumber(262),
                    color: 'var(--color-neutral-300)',
                  },
                ]}
              />
            </ChartCard>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ChartCard({
  title,
  period,
  onPeriodChange,
  footer,
  headerLayout = 'stack',
  className,
  children,
}: {
  title: string;
  period: ChartPeriod;
  onPeriodChange: (value: ChartPeriod) => void;
  footer?: string;
  /** split: title left · period toggles right (bar charts) */
  headerLayout?: 'stack' | 'split';
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        '@container/chart flex h-full flex-col gap-4 rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-border/30 min-[720px]:gap-5 min-[720px]:px-5 min-[720px]:py-6',
        className
      )}
    >
      <div
        dir={headerLayout === 'split' ? 'ltr' : undefined}
        className={cn(
          headerLayout === 'split'
            ? 'flex flex-wrap items-center justify-between gap-x-4 gap-y-3'
            : 'flex flex-col items-center gap-3 text-center'
        )}
      >
        <h3
          dir="rtl"
          className={cn(
            'text-sm font-medium leading-6 text-primary-700',
            headerLayout === 'split' && 'min-w-0 flex-1'
          )}
        >
          {title}
        </h3>
        <ChartPeriodToggle
          value={period}
          onValueChange={onPeriodChange}
          className={cn(headerLayout === 'split' && 'ms-auto shrink-0')}
        />
      </div>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
      {footer ? (
        <p className="border-t border-border/60 pt-3 text-start text-xs font-medium text-neutral-500">
          {footer}
        </p>
      ) : null}
    </article>
  );
}
