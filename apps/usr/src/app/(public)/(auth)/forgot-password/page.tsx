'use client';

import { useTranslations } from 'next-intl';

import {
  AuthLinkRow,
  AuthTextLink,
  IdentifierForm,
} from '@auth/components/auth-forms';

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword');

  return (
    <IdentifierForm
      purpose="forgot-password"
      greeting={t('greeting')}
      footer={
        <AuthLinkRow>
          <AuthTextLink href="/login">{t('backToLogin')}</AuthTextLink>
        </AuthLinkRow>
      }
    />
  );
}
