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
import {
  DEFAULT_DEMO_PERSONA,
  type DemoPersonaId,
} from '@/lib/demo-mode/persona';
import {
  readDemoPersonaCookieClient,
  writeDemoPersonaCookieClient,
} from '@/lib/demo-mode/persona-cookies.client';

type PublicPanelDemoContextValue = {
  active: boolean;
  persona: DemoPersonaId;
  setDemoMode: (next: boolean) => void;
  setPersona: (next: DemoPersonaId) => void;
};

const PublicPanelDemoContext = createContext<PublicPanelDemoContextValue>({
  active: false,
  persona: DEFAULT_DEMO_PERSONA,
  setDemoMode: () => undefined,
  setPersona: () => undefined,
});

type PublicPanelDemoProviderProps = {
  initialActive: boolean;
  initialPersona: DemoPersonaId;
  children: ReactNode;
};

export function PublicPanelDemoProvider({
  initialActive,
  initialPersona,
  children,
}: PublicPanelDemoProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [active, setActive] = useState(initialActive);
  const [persona, setPersonaState] = useState(initialPersona);

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  useEffect(() => {
    setPersonaState(initialPersona);
  }, [initialPersona]);

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

  const setPersona = useCallback(
    (next: DemoPersonaId) => {
      if (!isDemoModeGateEnabled() || !active) return;
      writeDemoPersonaCookieClient(next);
      setPersonaState(next);
      void queryClient.invalidateQueries();
    },
    [active, queryClient]
  );

  const value = useMemo(
    () => ({
      active: isDemoModeGateEnabled() ? active : false,
      persona: isDemoModeGateEnabled() ? persona : DEFAULT_DEMO_PERSONA,
      setDemoMode,
      setPersona,
    }),
    [active, persona, setDemoMode, setPersona]
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

export function usePublicPanelDemoPersona(): DemoPersonaId {
  const ctx = useContext(PublicPanelDemoContext);
  if (!isDemoModeGateEnabled()) return DEFAULT_DEMO_PERSONA;
  if (ctx.active) return ctx.persona;
  return readDemoPersonaCookieClient();
}

export function usePublicPanelDemoModeActions() {
  return useContext(PublicPanelDemoContext);
}
