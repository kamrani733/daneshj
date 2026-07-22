'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  AuthLinkRow,
  AuthTextLink,
  IdentifierForm,
} from '@auth/components/auth-forms';

export function RegisterForm() {
  const t = useTranslations('register');
  const searchParams = useSearchParams();
  const referralCode =
    searchParams.get('referral_code') ?? searchParams.get('referral') ?? undefined;

  return (
    <IdentifierForm
      purpose="register"
      referralCode={referralCode}
      greeting={
        <>
          {t('greeting')} <br /> {t('welcome')}
        </>
      }
      footer={
        <div className="flex flex-col gap-3">
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
        </div>
      }
    />
  );
}
