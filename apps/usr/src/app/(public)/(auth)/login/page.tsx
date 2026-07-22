'use client';

import { useTranslations } from 'next-intl';

import {
  AuthLinkRow,
  AuthTextLink,
  IdentifierForm,
} from '@auth/components/auth-forms';

export default function LoginPage() {
  const t = useTranslations('login');

  return (
    <IdentifierForm
      purpose="login"
      greeting={
        <>
          {t('greeting')} <br /> {t('welcome')}
        </>
      }
      footer={
        <div className="flex flex-col gap-3">
          
        </div>
      }
    />
  );
}
