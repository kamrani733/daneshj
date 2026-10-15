import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getSession } from '@daneshjoam/auth';
import { Spinner } from '@/components/ui/spinner';

import { OperationalUsedServicesView } from '@operational-panel/components/used-services-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('operationalPanel');
  return { title: `${t('nav.usedServices')} — ${t('title')}` };
}

/**
 * `/operational-panel/used-services` — services the user has used (export «Operational Panel»).
 * Session required (middleware). Data is mocked. `useSearchParams` (URL state)
 * needs a Suspense boundary.
 */
export default async function OperationalUsedServicesPage() {
  const session = await getSession();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OperationalUsedServicesView displayName={session?.user?.name?.trim() || undefined} />
    </Suspense>
  );
}
