import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getSession } from '@daneshjoam/auth';
import { Spinner } from '@/components/ui/spinner';

import { OperationalWalletView } from '@operational-panel/components/wallet-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('operationalPanel');
  return { title: `${t('nav.wallet')} — ${t('title')}` };
}

/**
 * `/operational-panel/wallet` — wallet intro, balance card and transaction history (export «Operational Panel۳»).
 * Session required (middleware). Data is mocked. `useSearchParams` (URL state)
 * needs a Suspense boundary.
 */
export default async function OperationalWalletPage() {
  const session = await getSession();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OperationalWalletView displayName={session?.user?.name?.trim() || undefined} />
    </Suspense>
  );
}
