import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getSession } from '@daneshjoam/auth';
import { Spinner } from '@/components/ui/spinner';

import { OperationalReportsView } from '@operational-panel/components/reports-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('operationalPanel');
  return { title: `${t('nav.reports')} — ${t('title')}` };
}

/**
 * `/operational-panel/reports` — 15 report sections (Figma «پنل عملیاتی»). Session required (middleware).
 * SRS: Usr-Rfl-2N1 (referral links report); the other reports have no SRS in `docs/srs/`.
 * `useSearchParams` (per-report URL state) needs a Suspense boundary.
 */
export default async function OperationalReportsPage() {
  const session = await getSession();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OperationalReportsView
        displayName={session?.user?.name?.trim() || undefined}
        accessToken={session?.accessToken}
      />
    </Suspense>
  );
}
