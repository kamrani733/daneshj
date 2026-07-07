import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('auth');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">{t('dashboardTitle')}</h1>
      <p className="text-muted-foreground">{t('dashboardDescription')}</p>
    </div>
  );
}
