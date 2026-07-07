'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  useGetSessionsForLimitReachedQuery,
  useInactiveSessionThenGetTokenMutation,
} from '@auth/api';
import { establishSession } from '@auth/lib/auth-actions';
import { useAuthFlowStore } from '@auth/lib/auth-flow';

type SessionLimitPanelProps = {
  successPath: string;
  onClose: () => void;
};

export function SessionLimitPanel({ successPath, onClose }: SessionLimitPanelProps) {
  const t = useTranslations('sessions');
  const pending = useAuthFlowStore((s) => s.pendingSessionLimit);
  const clearFlow = useAuthFlowStore((s) => s.clear);
  const setPendingSessionLimit = useAuthFlowStore((s) => s.setPendingSessionLimit);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: sessions = [], isLoading } = useGetSessionsForLimitReachedQuery(
    pending?.accessToken ?? null,
    !!pending
  );
  const inactiveMutation = useInactiveSessionThenGetTokenMutation();

  if (!pending) return null;

  async function onConfirm() {
    if (!pending || selectedId == null) return;

    setError(null);
    try {
      const result = await inactiveMutation.mutateAsync({
        accessToken: pending.accessToken,
        sessionIds: [selectedId],
        loginType: pending.loginType,
        identityInfo: pending.identityInfo,
      });

      if (!result.session) {
        setError(t('removeFailed'));
        return;
      }

      await establishSession(result.session);
      setPendingSessionLimit(null);
      clearFlow();
      onClose();
      window.location.assign(successPath);
    } catch {
      setError(t('removeFailed'));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-lg">
        <h2 className="text-right text-lg font-medium text-foreground">{t('limitTitle')}</h2>
        <p className="mt-2 text-right text-sm text-muted-foreground">{t('limitDescription')}</p>

        <div className="mt-4 space-y-2">
          {isLoading && (
            <p className="text-right text-sm text-muted-foreground">{t('loading')}</p>
          )}
          {sessions.map((session) => (
            <label
              key={session.id}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border p-3 text-right"
            >
              <input
                type="radio"
                name="session"
                value={session.id}
                checked={selectedId === session.id}
                onChange={() => setSelectedId(session.id)}
                className="size-4"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {session.browser} · {session.os}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.device} · {session.ip_address}
                </p>
              </div>
            </label>
          ))}
        </div>

        {error && <p className="mt-3 text-right text-sm text-error">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            type="button"
            disabled={selectedId == null || inactiveMutation.isPending}
            onClick={onConfirm}
          >
            {t('removeAndContinue')}
          </Button>
        </div>
      </div>
    </div>
  );
}
