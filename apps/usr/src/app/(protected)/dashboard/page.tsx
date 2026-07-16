import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('auth');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">{t('dashboardTitle')}</h1>
      <p className="text-muted-foreground">{t('dashboardDescription')}</p>
    </div>
  );
}
