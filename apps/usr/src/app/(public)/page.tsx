'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AuthPageBackground, FormPattern } from '@/components/auth/auth-background';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES } from '@auth/lib/auth-routes';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AuthPageBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div
          dir="rtl"
          className="relative flex w-full max-w-[363px] min-h-[635px] flex-col overflow-hidden rounded-[28px] bg-auth-panel px-6 py-10 text-center shadow-auth-panel sm:px-10"
        >
          <FormPattern />

          <div className="relative z-10 mb-4 flex w-full justify-end">
            <ThemeToggle />
          </div>

          <Link
            href={AUTH_ROUTES.home}
            className="relative z-10 mb-8 block w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Image
              src="/logo.svg"
              alt={t('title')}
              width={182}
              height={72}
              priority
              draggable={false}
              className="h-16 w-auto select-none"
            />
          </Link>

          <div className="relative z-10 flex w-full max-w-[320px] flex-col gap-3">
            <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
            <p className="mb-2 text-base text-muted-foreground">{t('subtitle')}</p>

            <Button asChild size="lg" className="w-full">
              <Link href={AUTH_ROUTES.register}>{t('register')}</Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href={AUTH_ROUTES.login}>{t('login')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
