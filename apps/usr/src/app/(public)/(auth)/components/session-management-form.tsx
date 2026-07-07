'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { MAZE_LINES } from '@/components/auth/auth-scene-assets';

const SESSION_BG = '/images/register/session-bg.png';
const SESSION_TITLE = '/images/register/session-title.png';
import {
  PREVIEW_ACCESS_TOKEN,
  useDeleteSessionForLimitReachedMutation,
  useGetSessionsForLimitReachedQuery,
  useInactiveSessionThenGetTokenMutation,
  type AuthPurpose,
  type SessionData,
} from '@auth/api';
import { finishAuthAndRedirect } from '@auth/lib/auth-redirect';
import {
  useAuthFlowStore,
  useOtpCountdown,
  useSessionLimitGuard,
  type PendingSessionLimit,
} from '@auth/lib/auth-flow';
import { AUTH_ROUTES, authFallback } from '@auth/lib/auth-routes';

const SESSION_LIMIT_WINDOW_SECONDS = 5 * 60;

/** RTL grid template shared by the table header and each session row. */
const GRID_COLS =
  'grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,0.9fr)] items-center gap-4';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
function toFaDigits(value: string) {
  return value.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return toFaDigits(`${minutes}:${String(seconds).padStart(2, '0')}`);
}

function formatSessionDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  try {
    const day = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
    const time = new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    return `${day}  ${time}`;
  } catch {
    return value;
  }
}

function ConfirmLogoutDialog({
  open,
  pending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations('sessions');
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        dir="rtl"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[#E3E0DA] p-6 text-right shadow-xl dark:bg-primary-900"
      >
        <p className="text-sm font-medium text-green-850 dark:text-primary-50">
          {t('confirmTitle')}
        </p>
        <div className="mt-6 flex items-center gap-3">
         
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:text-green-850 disabled:opacity-60 dark:text-primary-100"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="rounded-full bg-primary-500 px-7 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionActionCell({
  session,
  disabled,
  onLogout,
}: {
  session: SessionData;
  disabled: boolean;
  onLogout: (id: number) => void;
}) {
  const t = useTranslations('sessions');

  if (session.is_current_session) {
    return (
      <span className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/20 dark:text-muted-foreground">
        {t('currentSession')}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onLogout(session.id)}
      className="inline-flex items-center justify-center rounded-full bg-warning px-7 py-1.5 text-xs font-medium text-white transition-colors hover:bg-warning-500 disabled:opacity-60"
    >
      {t('logout')}
    </button>
  );
}

type SessionManagementFormProps = {
  purpose: AuthPurpose;
  successPath?: string;
};

export function SessionManagementForm({
  purpose,
  successPath = AUTH_ROUTES.dashboard,
}: SessionManagementFormProps) {
  const t = useTranslations('sessions');
  const clearFlow = useAuthFlowStore((s) => s.clear);
  const setPendingSessionLimit = useAuthFlowStore((s) => s.setPendingSessionLimit);

  const { ready, preview, pendingSessionLimit } = useSessionLimitGuard(
    purpose,
    authFallback(purpose)
  );

  const previewPending: PendingSessionLimit = {
    accessToken: PREVIEW_ACCESS_TOKEN,
    loginType: 1,
    identityInfo: {
      identity_type: 'email',
      mobile: null,
      email: 'preview@local',
      operation: 'LOGIN',
      redirect_verify_password: false,
      is_two_step_login: false,
    },
  };
  const pending = pendingSessionLimit ?? (preview ? previewPending : null);

  const [deadline] = useState(() => Date.now() + SESSION_LIMIT_WINDOW_SECONDS * 1000);
  const { secondsLeft } = useOtpCountdown(deadline);

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: sessions = [],
    isLoading,
    isError,
    refetch,
  } = useGetSessionsForLimitReachedQuery(pending?.accessToken ?? null, ready);

  const deleteMutation = useDeleteSessionForLimitReachedMutation();
  const continueMutation = useInactiveSessionThenGetTokenMutation();

  useEffect(() => {
    if (ready && secondsLeft <= 0) {
      setPendingSessionLimit(null);
    }
  }, [ready, secondsLeft, setPendingSessionLimit]);

  if (!ready || !pending) return null;

  const activePending = pending;
  const isPreview = activePending.accessToken === PREVIEW_ACCESS_TOKEN;

  async function onConfirmLogout() {
    if (confirmId === null) return;
    const sessionId = confirmId;

    setError(null);
    setBusyId(sessionId);
    try {
      if (isPreview) {
        await deleteMutation.mutateAsync({
          accessToken: activePending.accessToken,
          sessionIds: [sessionId],
        });
        await refetch();
        setConfirmId(null);
        return;
      }

      const result = await continueMutation.mutateAsync({
        accessToken: activePending.accessToken,
        sessionIds: [sessionId],
        loginType: activePending.loginType,
        identityInfo: activePending.identityInfo,
      });

      if (!result.session) {
        setError(t('continueFailed'));
        return;
      }

      setConfirmId(null);
      setPendingSessionLimit(null);
      await finishAuthAndRedirect(result.session, successPath, clearFlow);
    } catch {
      setError(isPreview ? t('removeFailed') : t('continueFailed'));
    } finally {
      setBusyId(null);
    }
  }

  const columns = [
    t('colDevice'),
    t('colBrowser'),
    t('colIp'),
    t('colOs'),
    t('colLoginTime'),
    t('colActions'),
  ];

  return (
    <div dir="rtl" className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="auth-form-pattern pointer-events-none absolute inset-x-0 top-44 bottom-14 z-0"
        style={{
          backgroundImage: MAZE_LINES,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <img
        src={SESSION_BG}
        alt=""
        aria-hidden
        draggable={false}
        className="h-28 w-full shrink-0 select-none object-cover object-top"
      />

      <main className="relative z-10 mx-auto w-full max-w-[900px] flex-1 px-6 py-10">
        <header className="flex justify-start">
          <div className="relative h-[89px] w-[384px] max-w-full">
            <img
              src={SESSION_TITLE}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-contain object-right"
            />
            <h1 className="absolute right-[104px] top-0 flex h-16 items-center text-lg font-bold text-primary-500 dark:text-primary-100">
              {t('pageTitle')}
            </h1>
          </div>
        </header>

        <ul className="mt-6 space-y-2 text-sm text-green-700 dark:text-muted-foreground">
          <li className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-green-500" aria-hidden />
            <span className="leading-6">{t('bulletLimit')}</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-green-500" aria-hidden />
            <span className="leading-6">
              {t('bulletCountdown', { time: formatCountdown(secondsLeft) })}
            </span>
          </li>
        </ul>

        <section className="mt-8">
          <div
            className={`${GRID_COLS} rounded-xl bg-[#E3E0DA] px-6 py-3 text-xs font-medium text-green-700 dark:bg-white/5 dark:text-muted-foreground`}
          >
            {columns.map((label) => (
              <span key={label} className="truncate text-start">
                {label}
              </span>
            ))}
          </div>

          <div className="mt-3 space-y-3">
            {isLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t('loading')}
              </p>
            )}

            {isError && (
              <p className="py-6 text-center text-sm text-error">{t('loadFailed')}</p>
            )}

            {!isLoading && !isError && sessions.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t('empty')}
              </p>
            )}

            {sessions.map((session) => (
              <div
                key={session.id}
                className={`${GRID_COLS} rounded-xl border border-green-400 bg-surface px-6 py-4 text-sm text-green-850 dark:border-white/10 dark:bg-white/5 dark:text-foreground`}
              >
                <span className="truncate text-start" dir="ltr">
                  {session.device}
                </span>
                <span className="truncate text-start" dir="ltr">
                  {session.browser}
                </span>
                <span className="truncate text-start" dir="ltr">
                  {session.ip_address}
                </span>
                <span className="truncate text-start">{session.os}</span>
                <span className="truncate text-start">
                  {formatSessionDate(session.create_time)}
                </span>
                <span className="text-start">
                  <SessionActionCell
                    session={session}
                    disabled={busyId === session.id}
                    onLogout={setConfirmId}
                  />
                </span>
              </div>
            ))}
          </div>

          {error && <p className="mt-4 text-center text-sm text-error">{error}</p>}
        </section>
      </main>

      <img
        src={SESSION_BG}
        alt=""
        aria-hidden
        draggable={false}
        className="h-14 w-full shrink-0 select-none object-cover object-bottom"
      />

      <ConfirmLogoutDialog
        open={confirmId !== null}
        pending={busyId !== null}
        onConfirm={onConfirmLogout}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
