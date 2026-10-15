import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getSession } from '@daneshjoam/auth';
import { Spinner } from '@/components/ui/spinner';

import { OperationalManageServicesView } from '@operational-panel/components/manage-services-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('operationalPanel');
  return { title: `${t('nav.manageServices')} — ${t('title')}` };
}

/**
 * `/operational-panel/manage-services` — the actor's services with product counts (Figma 890:65383).
 * Session required (middleware). Data is mocked.
 */
export default async function OperationalManageServicesPage() {
  const session = await getSession();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OperationalManageServicesView displayName={session?.user?.name?.trim() || undefined} />
    </Suspense>
  );
}
