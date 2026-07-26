import { getTranslations } from 'next-intl/server';

export default async function CooperationPage() {
  const t = await getTranslations('cooperation');

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-4 py-10 min-[834px]:px-12">
      <h1 className="text-2xl font-bold text-content">{t('title')}</h1>
      <p className="text-base leading-7 text-content-muted">{t('description')}</p>
    </main>
  );
}
