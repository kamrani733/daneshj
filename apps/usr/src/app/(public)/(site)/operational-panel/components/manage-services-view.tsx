'use client';

import { useTranslations } from 'next-intl';

import { EmptyState } from '@/components/panel';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';

import { ManagedServiceCard } from '@operational-panel/components/managed-service-card';
import { OperationalShell } from '@operational-panel/components/operational-shell';
import { useManagedServicesQuery } from '@operational-panel/hooks/use-managed-services-query';

/** `/operational-panel/manage-services` — Figma «پنل عملیاتی» › «مدیریت سرویس‌ها»: service cards, three per row. */
export function OperationalManageServicesView({ displayName }: { displayName?: string }) {
  const t = useTranslations('operationalPanel.manageServices');
  const query = useManagedServicesQuery();

  let body;
  if (query.isPending) {
    body = (
      <div role="status" className="flex min-h-60 items-center justify-center">
        <Spinner className="size-9 text-primary" aria-label={t('loading')} />
      </div>
    );
  } else if (query.isError) {
    body = <ErrorState message={t('error')} retryLabel={t('retry')} onRetry={() => void query.refetch()} />;
  } else if (query.data.length === 0) {
    body = <EmptyState message={t('empty')} />;
  } else {
    body = (
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-y-[86px]">
        {query.data.map((service) => (
          <li key={service.key}>
            <ManagedServiceCard service={service} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <OperationalShell section="manageServices" displayName={displayName}>
      {body}
    </OperationalShell>
  );
}
