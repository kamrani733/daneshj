'use client';

import { Monitor, Smartphone, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  MAX_ACTIVE_SESSIONS,
  useDeleteSessionForLimitReachedMutation,
  useGetSessionsForLimitReachedQuery,
  useInactiveSessionThenGetTokenMutation,
  type AuthPurpose,
  type SessionData,
} from '@auth/api';
import { finishAuthAndRedirect } from '@auth/lib/auth-redirect';
import { useAuthFlowStore, useSessionLimitGuard } from '@auth/lib/auth-flow';
import { AUTH_ROUTES, authFallback } from '@auth/lib/auth-routes';

const submitBtn =
  'h-12 w-full rounded-full bg-primary-500 text-base font-medium text-white hover:bg-primary-600 disabled:bg-on-surface/10 disabled:text-on-surface/40 disabled:opacity-100 dark:bg-primary-200 dark:text-black';

function formatSessionDate(value: string) {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function SessionDeviceIcon({ device }: { device: string }) {
  const isMobile = /iphone|android|mobile|phone/i.test(device);
  const Icon = isMobile ? Smartphone : Monitor;
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-200">
      <Icon className="size-5" aria-hidden />
    </div>
  );
}

function SessionRow({
  session,
  onDelete,
  deleting,
}: {
  session: SessionData;
  onDelete: (id: number) => void;
  deleting: boolean;
}) {
  const t = useTranslations('sessions');

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <SessionDeviceIcon device={session.device} />

      <div className="min-w-0 flex-1 text-right">
        <p className="truncate text-sm font-medium text-green-850 dark:text-foreground">
          {session.browser} · {session.os}
        </p>
        <p className="truncate text-xs text-green-700/70 dark:text-muted-foreground">
          {session.device} · {session.ip_address}
        </p>
        <p className="mt-0.5 text-[11px] text-green-700/60 dark:text-muted-foreground">
          {formatSessionDate(session.create_time)}
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={deleting}
        onClick={() => onDelete(session.id)}
        className="size-10 shrink-0 rounded-full text-error hover:bg-error/10 hover:text-error"
        aria-label={t('deleteSession')}
      >
        <Trash2 className="size-5" />
      </Button>
    </div>
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

  const { ready, pendingSessionLimit } = useSessionLimitGuard(
    purpose,
    authFallback(purpose)
  );

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: sessions = [], isLoading, refetch } =
    useGetSessionsForLimitReachedQuery(
      pendingSessionLimit?.accessToken ?? null,
      ready
    );

  const deleteMutation = useDeleteSessionForLimitReachedMutation();
  const continueMutation = useInactiveSessionThenGetTokenMutation();

  const canContinue = useMemo(
    () => sessions.length < MAX_ACTIVE_SESSIONS,
    [sessions.length]
  );

  if (!ready || !pendingSessionLimit) return null;

  const pending = pendingSessionLimit;

  async function onDeleteSession(sessionId: number) {
    setError(null);
    setDeletingId(sessionId);
    try {
      await deleteMutation.mutateAsync({
        accessToken: pending.accessToken,
        sessionIds: [sessionId],
      });
      await refetch();
    } catch {
      setError(t('removeFailed'));
    } finally {
      setDeletingId(null);
    }
  }

  async function onContinue() {
    if (!canContinue) return;

    setError(null);
    try {
      const result = await continueMutation.mutateAsync({
        accessToken: pending.accessToken,
        sessionIds: [],
        loginType: pending.loginType,
        identityInfo: pending.identityInfo,
      });

      if (!result.session) {
        setError(t('continueFailed'));
        return;
      }

      setPendingSessionLimit(null);
      await finishAuthAndRedirect(result.session, successPath, clearFlow);
    } catch {
      setError(t('continueFailed'));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2 text-right">
        <h1 className="text-base font-medium leading-7 text-green-850 dark:text-foreground">
          {t('pageTitle')}
        </h1>
        <p className="text-sm leading-6 text-green-700/80 dark:text-muted-foreground">
          {t('pageDescription', { max: MAX_ACTIVE_SESSIONS })}
        </p>
        <p className="text-xs text-green-700/60 dark:text-muted-foreground">
          {t('activeCount', { count: sessions.length, max: MAX_ACTIVE_SESSIONS })}
        </p>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <p className="text-right text-sm text-muted-foreground">{t('loading')}</p>
        )}
        {!isLoading && sessions.length === 0 && (
          <p className="text-right text-sm text-muted-foreground">{t('empty')}</p>
        )}
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            deleting={deletingId === session.id}
            onDelete={onDeleteSession}
          />
        ))}
      </div>

      {error && <p className="text-right text-sm text-error">{error}</p>}

      <Button
        type="button"
        disabled={!canContinue || continueMutation.isPending}
        onClick={onContinue}
        className={submitBtn}
      >
        {t('continueToDashboard')}
      </Button>
    </div>
  );
}
