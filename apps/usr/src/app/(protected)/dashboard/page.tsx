import { getSession } from '@daneshjoam/auth';
import { getTranslations } from 'next-intl/server';

import { ChangePasswordForm } from '@auth/components/auth-forms';

export default async function DashboardPage() {
  const session = await getSession();
  const t = await getTranslations('auth');

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{t('dashboardTitle')}</h1>
        <p className="text-muted-foreground">{t('dashboardDescription')}</p>
      </div>

      {session?.accessToken ? <ChangePasswordForm accessToken={session.accessToken} /> : null}
    </div>
  );
}
