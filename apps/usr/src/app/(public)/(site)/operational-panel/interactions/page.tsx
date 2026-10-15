import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getSession } from '@daneshjoam/auth';
import { Spinner } from '@/components/ui/spinner';

import { OperationalInteractionsView } from '@operational-panel/components/interactions-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('operationalPanel');
  return { title: `${t('nav.interactions')} — ${t('title')}` };
}

/**
 * `/operational-panel/interactions` — interactions by / to the actor in two tabs (export «Notifications»).
 * Session required (middleware). Data is mocked. `useSearchParams` (URL state)
 * needs a Suspense boundary.
 */
export default async function OperationalInteractionsPage() {
  const session = await getSession();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OperationalInteractionsView displayName={session?.user?.name?.trim() || undefined} />
    </Suspense>
  );
}
