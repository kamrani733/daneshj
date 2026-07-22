import { getTranslations } from 'next-intl/server';
import { getSession } from '@daneshjoam/auth';

import { HomeHeader } from '@/app/(public)/home/components/home-header';

export default async function CooperationPage() {
  const [session, t] = await Promise.all([
    getSession(),
    getTranslations('cooperation'),
  ]);

  return (
    <div className="relative min-h-screen bg-home-scene" dir="rtl">
      <HomeHeader
        isAuthenticated={!!session}
        userName={session?.user.name?.trim() || undefined}
      />
      <main className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-4 py-10 min-[834px]:px-12">
        <h1 className="text-2xl font-bold text-content">{t('title')}</h1>
        <p className="text-base leading-7 text-content-muted">{t('description')}</p>
      </main>
    </div>
  );
}
