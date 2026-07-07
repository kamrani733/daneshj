'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import {
  useResetPasswordMutation,
  useSendVerifyCodeMutation,
  useVerifyCodeMutation,
  type AuthPurpose,
} from '@auth/api';
import { SessionLimitPanel } from '@auth/components/session-limit-panel';
import { establishSession } from '@auth/lib/auth-actions';
import {
  AUTH_ROUTES,
  authFallback,
  authNextAfterOtp,
  authOtpPath,
  authTotpPath,
} from '@auth/lib/auth-routes';
import {
  formatCountdown,
  useAuthFlowGuard,
  useAuthFlowStore,
  useOtpCountdown,
} from '@auth/lib/auth-flow';
import {
  detectLoginIdentityType,
  isValidLoginIdentity,
  isValidReferralCode,
} from '@auth/lib/identity';

const submitBtnBase =
  'h-12 w-[120px] rounded-full bg-primary-500 dark:bg-primary-200 dark:text-black text-base font-medium text-white hover:bg-primary-600 disabled:bg-on-surface/10 disabled:text-on-surface/40 disabled:opacity-100';
const submitBtn = `${submitBtnBase} self-end`;
const resendOn =
  'h-12 rounded-full px-4 text-base font-medium dark:text-green-300/50 dark:bg-green-700/30 text-primary hover:bg-primary-subtle hover:text-primary disabled:opacity-100';
const resendOff =
  'h-12 rounded-full bg-on-surface/10 px-4 text-base font-medium text-on-surface/40 disabled:opacity-100';

function digitsOnly(value: string, max = 6) {
  return value.replace(/\D/g, '').slice(0, max);
}

function AuthHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-right text-base font-medium leading-7 text-green-850 dark:text-foreground">
      {children}
    </p>
  );
}

function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="text-right text-sm text-error">{message}</p>;
}

type IdentifierFormProps = {
  greeting: React.ReactNode;
  purpose: AuthPurpose;
  footer?: React.ReactNode;
  referralCode?: string;
};

export function IdentifierForm({
  greeting,
  purpose,
  footer,
  referralCode,
}: IdentifierFormProps) {
  const auth = useTranslations('auth');
  const startFlow = useAuthFlowStore((s) => s.startFlow);
  const setSendVerifyContext = useAuthFlowStore((s) => s.setSendVerifyContext);
  const markOtpSent = useAuthFlowStore((s) => s.markOtpSent);
  const router = useRouter();
  const sendVerifyCodeMutation = useSendVerifyCodeMutation();

  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) {
      setError(auth('identifierRequired'));
      return;
    }
    if (!isValidLoginIdentity(value)) {
      setError(auth('identifierInvalid'));
      return;
    }
    if (referralCode && !isValidReferralCode(referralCode)) {
      setError(auth('referralInvalid'));
      return;
    }

    setError(null);
    try {
      const loginIdentityType =
        purpose === 'forgot-password' ? detectLoginIdentityType(value) : undefined;

      const result = await sendVerifyCodeMutation.mutateAsync({
        identity: value,
        purpose,
        referralCode: purpose === 'register' ? referralCode : undefined,
        loginIdentityType,
        pageType: purpose === 'forgot-password' ? 'login_by_username' : undefined,
      });

      startFlow(purpose, value);
      setSendVerifyContext({
        operation: result.operation,
        codeType: result.codeType,
        identityType: result.identityType,
        // TODO: Remove devOtpCode — users should enter OTP from SMS/email in production.
        devOtpCode: result.code,
        referralCode: purpose === 'register' ? referralCode : undefined,
        loginIdentityType,
        pageType: purpose === 'forgot-password' ? 'login_by_username' : undefined,
      });
      markOtpSent();

      if (purpose === 'login' && result.codeType === 'TOTP') {
        router.push(authTotpPath(purpose));
        return;
      }

      router.push(authOtpPath(purpose));
    } catch {
      setError(auth('sendOtpFailed'));
    }
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <AuthHeading>{greeting}</AuthHeading>

      <div className="space-y-2">
        <FloatingInput
          name="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          label={auth('identifierPlaceholder')}
          autoComplete="username"
        />
        <FieldError message={error} />
      </div>

      <Button
        type="submit"
        disabled={sendVerifyCodeMutation.isPending}
        className={submitBtn}
      >
        {auth('submit')}
      </Button>

      {footer}
    </form>
  );
}

type OtpFormProps = {
  purpose: AuthPurpose;
  successPath?: string;
};

export function OtpForm({
  purpose,
  successPath = AUTH_ROUTES.dashboard,
}: OtpFormProps) {
  const t = useTranslations('otp');
  const auth = useTranslations('auth');
  const router = useRouter();
  const resendAt = useAuthFlowStore((s) => s.resendAvailableAt);
  const sendVerifyContext = useAuthFlowStore((s) => s.sendVerifyContext);
  const setSendVerifyContext = useAuthFlowStore((s) => s.setSendVerifyContext);
  const setPendingSessionLimit = useAuthFlowStore((s) => s.setPendingSessionLimit);
  const markOtpSent = useAuthFlowStore((s) => s.markOtpSent);
  const markOtpVerified = useAuthFlowStore((s) => s.markOtpVerified);
  const setResetAccessToken = useAuthFlowStore((s) => s.setResetAccessToken);
  const clearFlow = useAuthFlowStore((s) => s.clear);
  const { secondsLeft, canResend } = useOtpCountdown(resendAt);
  const { ready, identifier, sendVerifyContext: guardContext } = useAuthFlowGuard(
    purpose,
    authFallback(purpose)
  );
  const verifyCodeMutation = useVerifyCodeMutation();
  const sendVerifyCodeMutation = useSendVerifyCodeMutation();

  const context = sendVerifyContext ?? guardContext;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [showSessionLimit, setShowSessionLimit] = useState(false);

  // TODO: Remove auto-fill — OTP input should stay empty until user receives SMS/email.
  useEffect(() => {
    if (context?.devOtpCode && !code) {
      setCode(context.devOtpCode);
    }
  }, [context?.devOtpCode, code]);

  if (!ready || !context) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!context) return;

    const verifyContext = context;
    const value = code.trim();
    if (!value) {
      setError(t('codeRequired'));
      return;
    }

    setError(null);
    try {
      const result = await verifyCodeMutation.mutateAsync({
        identity: identifier,
        code: value,
        operation: verifyContext.operation,
        codeType: verifyContext.codeType,
        purpose,
      });

      if (result.sessionLimitReached && result.pendingAccessToken && result.identityInfo) {
        setPendingSessionLimit({
          accessToken: result.pendingAccessToken,
          loginType: result.loginType ?? 1,
          identityInfo: result.identityInfo,
        });
        setShowSessionLimit(true);
        return;
      }

      if (purpose === 'login' && result.requiresTotp) {
        markOtpVerified();
        router.push(authNextAfterOtp(purpose));
        return;
      }

      if (purpose === 'forgot-password' && result.redirectVerifyPassword) {
        if (result.resetAccessToken) {
          setResetAccessToken(result.resetAccessToken);
        }
        markOtpVerified();
        router.push(authNextAfterOtp(purpose));
        return;
      }

      if (result.session) {
        await establishSession(result.session);
        clearFlow();
        router.push(successPath);
        return;
      }

      setError(t('verifyFailed'));
    } catch {
      setError(t('verifyFailed'));
    }
  }

  async function onResend() {
    if (!canResend || resending || !context) return;
    setError(null);
    setResending(true);
    try {
      const result = await sendVerifyCodeMutation.mutateAsync({
        identity: identifier,
        purpose,
        referralCode: context.referralCode,
        loginIdentityType: context.loginIdentityType,
        pageType: context.pageType,
      });
      setSendVerifyContext({
        ...context,
        operation: result.operation,
        codeType: result.codeType,
        identityType: result.identityType,
        // TODO: Remove devOtpCode — users should enter OTP from SMS/email in production.
        devOtpCode: result.code,
      });
      markOtpSent();
    } catch {
      setError(auth('sendOtpFailed'));
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <AuthHeading>{t('sentTo', { identifier })}</AuthHeading>

        <div className="space-y-2">
          <FloatingInput
            name="code"
            value={code}
            onChange={(e) => setCode(digitsOnly(e.target.value))}
            label={t('codePlaceholder')}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="tracking-widest"
          />
          <FieldError message={error} />
        </div>

        <div className="flex w-full max-w-[286px] items-center justify-between self-end">
          <Button
            type="button"
            variant="ghost"
            disabled={!canResend || resending}
            onClick={onResend}
            className={canResend ? resendOn : resendOff}
          >
            {t('resend')}
          </Button>
          <Button
            type="submit"
            disabled={verifyCodeMutation.isPending}
            className={submitBtnBase}
          >
            {auth('submit')}
          </Button>
        </div>

        {!canResend && (
          <p className="text-center text-[11px] font-medium leading-6 text-green-850 dark:text-muted-foreground">
            {t('countdown', { time: formatCountdown(secondsLeft) })}
          </p>
        )}
      </form>

      {showSessionLimit && (
        <SessionLimitPanel
          successPath={successPath}
          onClose={() => setShowSessionLimit(false)}
        />
      )}
    </>
  );
}

type TotpFormProps = {
  successPath?: string;
};

export function TotpForm({ successPath = AUTH_ROUTES.dashboard }: TotpFormProps) {
  const t = useTranslations('totp');
  const auth = useTranslations('auth');
  const router = useRouter();
  const clearFlow = useAuthFlowStore((s) => s.clear);
  const { ready, identifier, sendVerifyContext } = useAuthFlowGuard(
    'login',
    AUTH_ROUTES.login,
    true
  );
  const verifyCodeMutation = useVerifyCodeMutation();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!ready || !sendVerifyContext) return null;

  const verifyContext = sendVerifyContext;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = code.trim();
    if (!value) {
      setError(t('codeRequired'));
      return;
    }

    setError(null);
    try {
      const result = await verifyCodeMutation.mutateAsync({
        identity: identifier,
        code: value,
        operation: verifyContext.operation,
        codeType: 'TOTP',
        purpose: 'login',
      });
      if (!result.session) {
        setError(t('verifyFailed'));
        return;
      }
      await establishSession(result.session);
      clearFlow();
      router.push(successPath);
    } catch {
      setError(t('verifyFailed'));
    }
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <AuthHeading>{t('description')}</AuthHeading>

      <div className="space-y-2">
        <FloatingInput
          name="totp"
          value={code}
          onChange={(e) => setCode(digitsOnly(e.target.value))}
          label={t('codePlaceholder')}
          inputMode="numeric"
          autoComplete="one-time-code"
          className="tracking-widest"
        />
        <FieldError message={error} />
      </div>

      <Button
        type="submit"
        disabled={verifyCodeMutation.isPending}
        className={submitBtn}
      >
        {auth('submit')}
      </Button>
    </form>
  );
}

type ResetPasswordFormProps = {
  successPath?: string;
};

export function ResetPasswordForm({
  successPath = AUTH_ROUTES.login,
}: ResetPasswordFormProps) {
  const t = useTranslations('forgotPassword');
  const auth = useTranslations('auth');
  const router = useRouter();
  const clearFlow = useAuthFlowStore((s) => s.clear);
  const resetAccessToken = useAuthFlowStore((s) => s.resetAccessToken);
  const { ready } = useAuthFlowGuard(
    'forgot-password',
    AUTH_ROUTES.forgot,
    true
  );
  const resetPasswordMutation = useResetPasswordMutation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!ready || !resetAccessToken) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < 8) {
      setError(t('passwordTooShort'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setError(null);
    try {
      await resetPasswordMutation.mutateAsync({
        password,
        confirmPassword,
        accessToken: resetAccessToken!,
      });
      clearFlow();
      router.push(successPath);
    } catch {
      setError(t('resetFailed'));
    }
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <AuthHeading>{t('resetDescription')}</AuthHeading>

      <div className="space-y-4">
        <FloatingInput
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label={t('newPassword')}
          autoComplete="new-password"
          showVisibilityToggle
          visibilityLabels={{
            show: t('showPassword'),
            hide: t('hidePassword'),
          }}
        />
        <FloatingInput
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label={t('confirmPassword')}
          autoComplete="new-password"
          showVisibilityToggle
          visibilityLabels={{
            show: t('showPassword'),
            hide: t('hidePassword'),
          }}
        />
        <FieldError message={error} />
      </div>

      <Button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className={submitBtn}
      >
        {auth('submit')}
      </Button>
    </form>
  );
}

export function AuthLinkRow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-right text-sm leading-6 text-green-850 dark:text-muted-foreground">
      {children}
    </p>
  );
}

export function AuthTextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-primary-500 dark:text-primary-200 hover:underline"
    >
      {children}
    </Link>
  );
}
