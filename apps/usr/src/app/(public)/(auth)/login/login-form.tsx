'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { IdentifierForm } from '@auth/components/auth-forms';

/**
 * Unified identity entry for login and register.
 * Sends operation=LOGIN; backend returns LOGIN or REGISTER.
 * Optional `referral_code` / `referral` query is included when present.
 */
export function LoginForm() {
  const t = useTranslations('login');
  const searchParams = useSearchParams();
  const referralCode =
    searchParams.get('referral_code') ?? searchParams.get('referral') ?? undefined;

  return (
    <IdentifierForm
      purpose="login"
      referralCode={referralCode}
      greeting={
        <>
          {t('greeting')} <br /> {t('welcome')}
        </>
      }
      footer={
        <p className="text-right text-[11px] leading-6 text-green-850 dark:text-muted-foreground">
          {t.rich('terms', {
            terms: (chunks) => (
              <Link href="/terms" className="text-[#0b57d0] hover:underline dark:text-info-200">
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href="/privacy" className="text-[#0b57d0] hover:underline dark:text-info-200">
                {chunks}
              </Link>
            ),
          })}
        </p>
      }
    />
  );
}
