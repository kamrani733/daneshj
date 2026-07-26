'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { MAZE_LINES } from '@/components/auth/auth-scene-assets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
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
} from '@auth/lib/auth-flow';
import { AUTH_ROUTES, authFallback } from '@auth/lib/auth-routes';

const SESSION_BG = '/images/register/session-bg.png';
const SESSION_TITLE = '/images/register/session-title.png';
const SESSION_LIMIT_WINDOW_SECONDS = 5 * 60;

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

function SessionFieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-green-700/80 dark:text-muted-foreground">
        {label}
      </span>
      <span className="text-start text-sm font-medium text-green-850 dark:text-foreground" dir="ltr">
        {value}
      </span>
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
      <Badge
        variant="outline"
        className="h-auto rounded-full border-neutral-300 px-4 py-1.5 text-xs font-medium text-neutral-600"
      >
        {t('currentSession')}
      </Badge>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      loading={disabled}
      onClick={() => onLogout(session.id)}
      className="h-auto rounded-full bg-warning px-7 py-1.5 text-xs font-medium text-white hover:bg-warning-500"
    >
      {t('logout')}
    </Button>
  );
}

function SessionMobileCard({
  session,
  disabled,
  onLogout,
}: {
  session: SessionData;
  disabled: boolean;
  onLogout: (id: number) => void;
}) {
  const t = useTranslations('sessions');

  const fields = [
    { label: t('colDevice'), value: session.device },
    { label: t('colBrowser'), value: session.browser },
    { label: t('colIp'), value: session.ip_address },
    { label: t('colOs'), value: session.os },
    { label: t('colAppVersion'), value: session.app_version },
    { label: t('colLoginTime'), value: formatSessionDate(session.create_time) },
  ];

  return (
    <Card className="border border-green-200 bg-surface py-0 ring-0 dark:border-white/10 dark:bg-white/5">
      <CardContent className="divide-y divide-green-100 px-4 py-1 dark:divide-white/10">
        {fields.map((field) => (
          <SessionFieldRow key={field.label} label={field.label} value={field.value} />
        ))}
      </CardContent>

      <CardFooter className="border-0 bg-transparent px-4 pb-4 pt-2">
        {session.is_current_session ? (
          <Badge
            variant="outline"
            className="h-11 w-full justify-center rounded-xl border-neutral-300 text-sm font-medium text-neutral-600"
          >
            {t('currentSession')}
          </Badge>
        ) : (
          <Button
            type="button"
            loading={disabled}
            onClick={() => onLogout(session.id)}
            className="h-11 w-full rounded-xl bg-warning text-sm font-medium text-white hover:bg-warning-500"
          >
            {t('deleteSession')}
            <Trash2 className="size-4" aria-hidden />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function SessionsStatusMessage({
  loading,
  error,
  empty,
}: {
  loading: boolean;
  error: boolean;
  empty: boolean;
}) {
  const t = useTranslations('sessions');

  if (loading) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{t('loading')}</p>;
  }
  if (error) {
    return <p className="py-6 text-center text-sm text-error">{t('loadFailed')}</p>;
  }
  if (empty) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{t('empty')}</p>;
  }
  return null;
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

  const { ready, pendingSessionLimit } = useSessionLimitGuard(
    purpose,
    authFallback(purpose)
  );

  const [deadline] = useState(() => Date.now() + SESSION_LIMIT_WINDOW_SECONDS * 1000);
  const { secondsLeft } = useOtpCountdown(deadline);

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: sessions = [],
    isLoading,
    isError,
  } = useGetSessionsForLimitReachedQuery(
    pendingSessionLimit?.accessToken ?? null,
    ready
  );

  const continueMutation = useInactiveSessionThenGetTokenMutation();

  useEffect(() => {
    if (ready && secondsLeft <= 0) {
      setPendingSessionLimit(null);
    }
  }, [ready, secondsLeft, setPendingSessionLimit]);

  if (!ready || !pendingSessionLimit) return null;

  const pending = pendingSessionLimit;
  const showEmpty = !isLoading && !isError && sessions.length === 0;

  async function onConfirmLogout() {
    if (confirmId === null) return;
    const sessionId = confirmId;

    setError(null);
    setBusyId(sessionId);
    try {
      const result = await continueMutation.mutateAsync({
        accessToken: pending.accessToken,
        sessionIds: [sessionId],
        loginType: pending.loginType,
        identityInfo: pending.identityInfo,
      });

      if (!result.session) {
        setError(t('continueFailed'));
        return;
      }

      setConfirmId(null);
      setPendingSessionLimit(null);
      await finishAuthAndRedirect(result.session, successPath, clearFlow);
    } catch {
      setError(t('continueFailed'));
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
        className="auth-form-pattern pointer-events-none absolute inset-x-0 top-32 bottom-14 z-0 md:top-44"
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
        className="h-20 w-full shrink-0 select-none object-cover object-top md:h-28"
      />

      <main className="relative z-10 mx-auto w-full max-w-[900px] flex-1 px-4 py-6 md:px-6 md:py-10">
        <header className="flex justify-start">
          <div className="relative h-[72px] w-full max-w-[384px] md:h-[89px]">
            <img
              src={SESSION_TITLE}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-contain object-right"
            />
            <h1 className="absolute right-[88px] top-0 flex h-14 items-center text-base font-bold text-primary-500 md:right-[104px] md:h-16 md:text-lg dark:text-primary-100">
              {t('pageTitle')}
            </h1>
          </div>
        </header>

        <ul className="mt-4 space-y-2 text-sm text-green-700 md:mt-6 dark:text-muted-foreground">
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

        <section className="mt-6 md:mt-8">
          <SessionsStatusMessage
            loading={isLoading}
            error={isError}
            empty={showEmpty}
          />

          {/* Mobile: stacked session cards */}
          {!isLoading && !isError && sessions.length > 0 && (
            <div className="space-y-3 md:hidden">
              {sessions.map((session) => (
                <SessionMobileCard
                  key={session.id}
                  session={session}
                  disabled={busyId === session.id}
                  onLogout={setConfirmId}
                />
              ))}
            </div>
          )}

          {/* Desktop: table layout */}
          {!isLoading && !isError && sessions.length > 0 && (
            <Table className="hidden border-separate border-spacing-y-3 md:table">
              <TableHeader>
                <TableRow className="border-0 bg-[#E3E0DA] hover:bg-[#E3E0DA] dark:bg-white/5">
                  {columns.map((label, index) => (
                    <TableHead
                      key={label}
                      className={`h-auto px-6 py-3 text-start text-xs font-medium text-green-700 dark:text-muted-foreground ${
                        index === 0 ? 'rounded-s-xl' : ''
                      } ${index === columns.length - 1 ? 'rounded-e-xl' : ''}`}
                    >
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {sessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="border border-green-400 bg-surface hover:bg-surface dark:border-white/10 dark:bg-white/5"
                  >
                    <TableCell className="rounded-s-xl px-6 py-4 text-start" dir="ltr">
                      {session.device}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-start" dir="ltr">
                      {session.browser}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-start" dir="ltr">
                      {session.ip_address}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-start">{session.os}</TableCell>
                    <TableCell className="px-6 py-4 text-start">
                      {formatSessionDate(session.create_time)}
                    </TableCell>
                    <TableCell className="rounded-e-xl px-6 py-4 text-start">
                      <SessionActionCell
                        session={session}
                        disabled={busyId === session.id}
                        onLogout={setConfirmId}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {error && <p className="mt-4 text-center text-sm text-error">{error}</p>}
        </section>
      </main>

      <img
        src={SESSION_BG}
        alt=""
        aria-hidden
        draggable={false}
        className="h-10 w-full shrink-0 select-none object-cover object-bottom md:h-14"
      />

      <AlertDialog
        open={confirmId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmId(null);
        }}
      >
        <AlertDialogContent
          dir="rtl"
          className="max-w-sm rounded-2xl border-0 bg-[#E3E0DA] p-6 text-right shadow-xl ring-0 dark:bg-primary-900"
        >
          <AlertDialogHeader className="place-items-start text-right sm:text-right">
            <AlertDialogTitle className="text-sm font-medium text-green-850 dark:text-primary-50">
              {t('confirmTitle')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 flex-row justify-start gap-3 border-0 bg-transparent p-0 sm:justify-start">
            <AlertDialogCancel
              variant="ghost"
              className="h-auto border-0 bg-transparent px-4 py-2 text-sm font-medium text-green-700 shadow-none hover:bg-transparent hover:text-green-850 dark:text-primary-100"
            >
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={busyId !== null}
              className="h-auto min-w-[5.5rem] rounded-full bg-primary-500 px-7 py-2 text-sm font-medium hover:bg-primary-600"
              onClick={(event) => {
                event.preventDefault();
                void onConfirmLogout();
              }}
            >
              {busyId !== null ? (
                <Spinner className="size-5" aria-label={t('confirm')} />
              ) : (
                t('confirm')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
