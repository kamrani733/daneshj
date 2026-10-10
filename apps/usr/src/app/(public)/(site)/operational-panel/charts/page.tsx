import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getSession } from '@daneshjoam/auth';
import { Spinner } from '@/components/ui/spinner';

import { OperationalChartsView } from '@operational-panel/components/charts-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('operationalPanel');
  return { title: `${t('nav.charts')} — ${t('title')}` };
}

/**
 * `/operational-panel/charts` — chart sections + comparison tool (Figma «پنل عملیاتی» › «نمودار»). Session required.
 * «اعلانات» uses the Notification MS charts report; the other sections are mocked.
 * `useSearchParams` (filter URL state) needs a Suspense boundary.
 */
export default async function OperationalChartsPage() {
  const session = await getSession();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OperationalChartsView
        displayName={session?.user?.name?.trim() || undefined}
        accessToken={session?.accessToken}
        sessionUserId={session?.user?.id}
      />
    </Suspense>
  );
}
