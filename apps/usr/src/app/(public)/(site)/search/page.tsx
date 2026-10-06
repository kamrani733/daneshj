import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { Spinner } from '@/components/ui/spinner';

import { SearchPage } from '@search/search-page';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('search');
  return { title: t('title') };
}

/** `/search` — global search results. `useSearchParams` needs a Suspense boundary. */
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-96 items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
