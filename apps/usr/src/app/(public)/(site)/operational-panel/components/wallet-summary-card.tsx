'use client';

import { useTranslations } from 'next-intl';
import { useId, type CSSProperties, type ReactNode } from 'react';

import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { formatFaNumber } from '@/lib/format-fa';
import { formatIsoDateTime } from '@/lib/jalali';
import { cn } from '@/lib/utils';

import { useWalletSummaryQuery } from '@operational-panel/hooks/use-wallet-summary-query';

/** Export card decoration (mirrored on the start side), tinted with the primary token through a mask. */
const PATTERN_STYLE: CSSProperties = {
  maskImage: 'url(/images/operational-panel/wallet-card-pattern.svg)',
  maskSize: '100% 100%',
  maskRepeat: 'no-repeat',
};

function CardPattern({ side }: { side: 'start' | 'end' }) {
  return (
    <span
      aria-hidden
      style={PATTERN_STYLE}
      className={cn(
        'pointer-events-none absolute top-0 hidden h-47.5 w-82 bg-primary opacity-60 md:block',
        side === 'start' ? 'start-0 -scale-x-100' : 'end-0'
      )}
    />
  );
}

function SummaryItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <dt className="text-body-large text-on-surface-variant after:content-['_:']">{label}</dt>
      <dd className="flex items-baseline gap-1.5 text-headline-small font-bold text-on-surface">{children}</dd>
    </div>
  );
}

/** «کیف پول» card: balance, total spent and last update (export «Operational Panel۳»). Amounts in toman. */
export function WalletSummaryCard() {
  const t = useTranslations('operationalPanel.wallet.summary');
  const query = useWalletSummaryQuery();
  const titleId = useId();

  let body: ReactNode;
  if (query.isPending) {
    body = (
      <div role="status" className="flex min-h-24 items-center justify-center">
        <Spinner className="size-8 text-primary" aria-label={t('loading')} />
      </div>
    );
  } else if (query.isError) {
    body = (
      <ErrorState
        message={t('error')}
        retryLabel={t('retry')}
        onRetry={() => void query.refetch()}
        className="min-h-0 bg-transparent py-4"
      />
    );
  } else {
    const updated = formatIsoDateTime(query.data.updatedAt);
    const amount = (value: number) => (
      <>
        <span>{formatFaNumber(value)}</span>
        <span className="text-body-medium font-normal text-on-surface-variant">{t('unit')}</span>
      </>
    );
    body = (
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
        <SummaryItem label={t('balance')}>{amount(query.data.balance)}</SummaryItem>
        <SummaryItem label={t('totalSpent')}>{amount(query.data.totalSpent)}</SummaryItem>
        <SummaryItem label={t('updatedAt')}>
          {updated ? (
            <span className="inline-flex gap-x-2 whitespace-nowrap">
              <span>{updated.time}</span>
              <span>{updated.date}</span>
            </span>
          ) : (
            '—'
          )}
        </SummaryItem>
      </dl>
    );
  }

  return (
    <section
      aria-labelledby={titleId}
      className="relative flex flex-col gap-6 overflow-hidden rounded-large bg-surface-container-low px-4 py-6 shadow-app-elevation-1 md:px-8"
    >
      <CardPattern side="start" />
      <CardPattern side="end" />
      <h2 id={titleId} className="relative text-center text-title-large font-bold text-primary">
        {t('title')}
      </h2>
      <div className="relative">{body}</div>
    </section>
  );
}
