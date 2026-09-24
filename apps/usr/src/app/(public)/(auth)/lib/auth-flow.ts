'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type {
  AuthOperation,
  AuthPurpose,
  CodeType,
  IdentityType,
  LoginIdentityType,
  PageType,
} from '@auth/api';

import { clearAuthFlowStep } from './auth-flow-actions';

export type { AuthPurpose } from '@auth/api';

export const RESEND_COOLDOWN_SECONDS = 144;

const LEGACY_AUTH_FLOW_KEY = 'auth-flow';
const WIZARD_STORAGE_KEY = 'auth-flow-wizard';

export type AuthFlowKind = AuthPurpose;

/** Values from send-verify-code response, required for verify step */
export type SendVerifyCodeContext = {
  operation: AuthOperation;
  codeType: CodeType;
  identityType: IdentityType;
  /** TODO: Remove when Kavenegar/SendGrid are live — OTP must not be stored client-side in production. */
  devOtpCode?: string;
  referralCode?: string;
  loginIdentityType?: LoginIdentityType;
  pageType?: PageType;
};

export type PersistedAuthFlow = {
  kind: AuthFlowKind | null;
  identifier: string | null;
  sendVerifyContext: SendVerifyCodeContext | null;
  resendAvailableAt: number | null;
  otpVerified: boolean;
  hasVerifyPasswordToken: boolean;
  hasResetToken: boolean;
  hasSessionLimit: boolean;
};

type AuthFlowState = PersistedAuthFlow & {
  startFlow: (kind: AuthFlowKind, identifier: string) => void;
  setSendVerifyContext: (context: SendVerifyCodeContext) => void;
  setHasVerifyPasswordToken: (value: boolean) => void;
  setHasResetToken: (value: boolean) => void;
  setHasSessionLimit: (value: boolean) => void;
  markOtpSent: () => void;
  markOtpVerified: () => void;
  clear: () => void;
};

export function toPersistedAuthFlow(state: PersistedAuthFlow): PersistedAuthFlow {
  const sendVerifyContext = state.sendVerifyContext
    ? { ...state.sendVerifyContext, devOtpCode: undefined }
    : null;
  return {
    kind: state.kind,
    identifier: state.identifier,
    sendVerifyContext,
    resendAvailableAt: state.resendAvailableAt,
    otpVerified: state.otpVerified,
    hasVerifyPasswordToken: state.hasVerifyPasswordToken,
    hasResetToken: state.hasResetToken,
    hasSessionLimit: state.hasSessionLimit,
  };
}

const emptyWizard: PersistedAuthFlow = {
  kind: null,
  identifier: null,
  sendVerifyContext: null,
  resendAvailableAt: null,
  otpVerified: false,
  hasVerifyPasswordToken: false,
  hasResetToken: false,
  hasSessionLimit: false,
};

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

function wizardStorage(): StateStorage {
  if (typeof window === 'undefined') return memoryStorage;
  const storage = window.sessionStorage;
  const dropLegacyToken = () => {
    window.localStorage.removeItem(LEGACY_AUTH_FLOW_KEY);
  };
  return {
    getItem: (name) => {
      dropLegacyToken();
      return storage.getItem(name);
    },
    setItem: (name, value) => {
      dropLegacyToken();
      storage.setItem(name, value);
    },
    removeItem: (name) => {
      dropLegacyToken();
      storage.removeItem(name);
    },
  };
}

export const useAuthFlowStore = create<AuthFlowState>()(
  persist(
    (set, get) => ({
      ...emptyWizard,
      startFlow: (kind, identifier) => {
        const prev = get();
        const sameFlow = prev.kind === kind && prev.identifier === identifier;
        set({
          kind,
          identifier,
          sendVerifyContext: sameFlow ? prev.sendVerifyContext : null,
          otpVerified: false,
          hasResetToken: false,
          hasSessionLimit: false,
          hasVerifyPasswordToken: sameFlow ? prev.hasVerifyPasswordToken : false,
          resendAvailableAt: sameFlow ? prev.resendAvailableAt : null,
        });
      },
      setSendVerifyContext: (context) => set({ sendVerifyContext: context }),
      setHasVerifyPasswordToken: (value) => set({ hasVerifyPasswordToken: value }),
      setHasResetToken: (value) => set({ hasResetToken: value }),
      setHasSessionLimit: (value) => set({ hasSessionLimit: value }),
      markOtpSent: () =>
        set({
          resendAvailableAt: Date.now() + RESEND_COOLDOWN_SECONDS * 1000,
        }),
      markOtpVerified: () => set({ otpVerified: true }),
      clear: () => set(emptyWizard),
    }),
    {
      name: WIZARD_STORAGE_KEY,
      storage: createJSONStorage(wizardStorage),
      partialize: (state) => toPersistedAuthFlow(state),
    }
  )
);

export function useClearAuthFlow() {
  const clear = useAuthFlowStore((s) => s.clear);
  return async () => {
    clear();
    await clearAuthFlowStep();
  };
}

function useAuthFlowHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persistApi = useAuthFlowStore.persist;
    if (persistApi.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return persistApi.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}

function secondsLeft(until: number | null) {
  if (!until) return 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

export function useOtpCountdown(until: number | null) {
  const [seconds, setSeconds] = useState(() => secondsLeft(until));

  useEffect(() => {
    setSeconds(secondsLeft(until));
    if (!until) return;

    const id = window.setInterval(() => {
      const next = secondsLeft(until);
      setSeconds(next);
      if (next <= 0) window.clearInterval(id);
    }, 1000);

    return () => window.clearInterval(id);
  }, [until]);

  return { secondsLeft: seconds, canResend: seconds <= 0 };
}

export function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function useAuthFlowGuard(
  kind: AuthFlowKind,
  fallback: string,
  requireOtpVerified = false
) {
  const router = useRouter();
  const flowKind = useAuthFlowStore((s) => s.kind);
  const identifier = useAuthFlowStore((s) => s.identifier);
  const sendVerifyContext = useAuthFlowStore((s) => s.sendVerifyContext);
  const otpVerified = useAuthFlowStore((s) => s.otpVerified);
  const hydrated = useAuthFlowHydrated();

  useEffect(() => {
    if (!hydrated) return;
    const invalid =
      !identifier ||
      flowKind !== kind ||
      (requireOtpVerified && !otpVerified);
    if (invalid) router.replace(fallback);
  }, [hydrated, identifier, flowKind, otpVerified, kind, fallback, requireOtpVerified, router]);

  const ready =
    hydrated &&
    !!identifier &&
    flowKind === kind &&
    (!requireOtpVerified || otpVerified);

  return {
    ready,
    identifier: identifier ?? '',
    sendVerifyContext,
  };
}

export function useSessionLimitGuard(kind: AuthFlowKind, fallback: string) {
  const router = useRouter();
  const flowKind = useAuthFlowStore((s) => s.kind);
  const identifier = useAuthFlowStore((s) => s.identifier);
  const hasSessionLimit = useAuthFlowStore((s) => s.hasSessionLimit);
  const hydrated = useAuthFlowHydrated();

  useEffect(() => {
    if (!hydrated) return;
    const invalid = !identifier || flowKind !== kind || !hasSessionLimit;
    if (invalid) router.replace(fallback);
  }, [hydrated, identifier, flowKind, hasSessionLimit, kind, fallback, router]);

  const ready = hydrated && !!identifier && flowKind === kind && hasSessionLimit;

  return {
    ready,
    identifier: identifier ?? '',
  };
}
