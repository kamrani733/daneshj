import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getSession } from '@daneshjoam/auth';
import { Spinner } from '@/components/ui/spinner';

import { OperationalStatsView } from '@operational-panel/components/stats-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('operationalPanel');
  return { title: `${t('nav.stats')} — ${t('title')}` };
}

/**
 * `/operational-panel/stats` — KPI cards per section (Figma «پنل عملیاتی» › «آمار»). Session required.
 * «اعلانات» uses the Notification MS statistics report; the other sections are mocked.
 * `useSearchParams` (filter URL state) needs a Suspense boundary.
 */
export default async function OperationalStatsPage() {
  const session = await getSession();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OperationalStatsView
        displayName={session?.user?.name?.trim() || undefined}
        accessToken={session?.accessToken}
        sessionUserId={session?.user?.id}
      />
    </Suspense>
  );
}
