'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import {
  readDemoModeCookieClient,
  writeDemoModeCookieClient,
} from '@/lib/demo-mode/cookies.client';
import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';

type PublicPanelDemoContextValue = {
  active: boolean;
  setDemoMode: (next: boolean) => void;
};

const PublicPanelDemoContext = createContext<PublicPanelDemoContextValue>({
  active: false,
  setDemoMode: () => undefined,
});

type PublicPanelDemoProviderProps = {
  initialActive: boolean;
  children: ReactNode;
};

export function PublicPanelDemoProvider({
  initialActive,
  children,
}: PublicPanelDemoProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  const setDemoMode = useCallback(
    (next: boolean) => {
      if (!isDemoModeGateEnabled()) return;
      writeDemoModeCookieClient(next);
      setActive(next);
      if (next) {
        void import('@public-panel/mock/interactive-ops-demo').then((mod) => {
          mod.resetDemoInteractiveOpsState();
        });
      }
      void queryClient.invalidateQueries();
      router.refresh();
    },
    [queryClient, router]
  );

  const value = useMemo(
    () => ({
      active: isDemoModeGateEnabled() ? active : false,
      setDemoMode,
    }),
    [active, setDemoMode]
  );

  return (
    <PublicPanelDemoContext.Provider value={value}>
      {children}
    </PublicPanelDemoContext.Provider>
  );
}

export function usePublicPanelDemoMode(): boolean {
  const ctx = useContext(PublicPanelDemoContext);
  if (ctx.active) return true;
  if (!isDemoModeGateEnabled()) return false;
  return readDemoModeCookieClient();
}

export function usePublicPanelDemoModeActions() {
  return useContext(PublicPanelDemoContext);
}
