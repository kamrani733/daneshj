'use client';

import { useTranslations } from 'next-intl';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';
import { AppDialog } from '@/components/ui/app-dialog';

import type { ActionAccess } from '@public-panel/capabilities';

type GuestAccessContextValue = {
  /** Opens message m21 (Expectation, Appendix 5). */
  showGuestMessage: () => void;
};

const GuestAccessContext = createContext<GuestAccessContextValue>({
  showGuestMessage: () => undefined,
});

/** One m21 dialog per page; any guest action («M» access) opens it. */
export function GuestAccessProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('publicPanel.guestAccess');
  const [open, setOpen] = useState(false);
  const showGuestMessage = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ showGuestMessage }), [showGuestMessage]);

  return (
    <GuestAccessContext.Provider value={value}>
      {children}
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        variant="confirm"
        title={t('m21')}
        actionsStyle="text"
        primaryAction={{ label: t('register'), href: AUTH_ROUTES.login }}
        secondaryAction={{
          label: t('close'),
          tone: 'muted',
          onClick: () => setOpen(false),
        }}
      />
    </GuestAccessContext.Provider>
  );
}

/**
 * Wraps an action handler by access code: `guestMessage` opens m21,
 * `enabled` runs the handler, anything else does nothing.
 */
export function useGuardedAction() {
  const { showGuestMessage } = useContext(GuestAccessContext);
  return useCallback(
    (access: ActionAccess, run: () => void) => {
      if (access === 'guestMessage') {
        showGuestMessage();
        return;
      }
      if (access === 'enabled') run();
    },
    [showGuestMessage]
  );
}
