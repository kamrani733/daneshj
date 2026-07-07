'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  AuthOperation,
  AuthPurpose,
  CodeType,
  IdentityInfo,
  IdentityType,
  LoginIdentityType,
  PageType,
} from '@auth/api';

export type { AuthPurpose } from '@auth/api';

export const RESEND_COOLDOWN_SECONDS = 144;

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

export type PendingSessionLimit = {
  accessToken: string;
  loginType: number;
  identityInfo: IdentityInfo;
};

type AuthFlowState = {
  kind: AuthFlowKind | null;
  identifier: string | null;
  sendVerifyContext: SendVerifyCodeContext | null;
  pendingSessionLimit: PendingSessionLimit | null;
  resetAccessToken: string | null;
  resendAvailableAt: number | null;
  otpVerified: boolean;
  startFlow: (kind: AuthFlowKind, identifier: string) => void;
  setSendVerifyContext: (context: SendVerifyCodeContext) => void;
  setPendingSessionLimit: (pending: PendingSessionLimit | null) => void;
  setResetAccessToken: (token: string) => void;
  markOtpSent: () => void;
  markOtpVerified: () => void;
  clear: () => void;
};

export const useAuthFlowStore = create<AuthFlowState>()(
  persist(
    (set, get) => ({
      kind: null,
      identifier: null,
      sendVerifyContext: null,
      pendingSessionLimit: null,
      resetAccessToken: null,
      resendAvailableAt: null,
      otpVerified: false,
      startFlow: (kind, identifier) => {
        const prev = get();
        const sameFlow = prev.kind === kind && prev.identifier === identifier;
        set({
          kind,
          identifier,
          sendVerifyContext: sameFlow ? prev.sendVerifyContext : null,
          pendingSessionLimit: null,
          otpVerified: false,
          resetAccessToken: null,
          resendAvailableAt: sameFlow ? prev.resendAvailableAt : null,
        });
      },
      setSendVerifyContext: (context) => set({ sendVerifyContext: context }),
      setPendingSessionLimit: (pending) => set({ pendingSessionLimit: pending }),
      setResetAccessToken: (token) => set({ resetAccessToken: token }),
      markOtpSent: () =>
        set({
          resendAvailableAt: Date.now() + RESEND_COOLDOWN_SECONDS * 1000,
        }),
      markOtpVerified: () => set({ otpVerified: true }),
      clear: () =>
        set({
          kind: null,
          identifier: null,
          sendVerifyContext: null,
          pendingSessionLimit: null,
          resetAccessToken: null,
          resendAvailableAt: null,
          otpVerified: false,
        }),
    }),
    { name: 'auth-flow' }
  )
);

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

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
  const pendingSessionLimit = useAuthFlowStore((s) => s.pendingSessionLimit);
  const [hydrated, setHydrated] = useState(false);
  // Dev-only design preview: /login/sessions?preview=1 skips the flow guard.
  const [preview] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('preview') === '1'
  );

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated || preview) return;
    const invalid =
      !identifier || flowKind !== kind || !pendingSessionLimit;
    if (invalid) router.replace(fallback);
  }, [hydrated, preview, identifier, flowKind, pendingSessionLimit, kind, fallback, router]);

  const ready =
    hydrated &&
    (preview || (!!identifier && flowKind === kind && !!pendingSessionLimit));

  return {
    ready,
    preview,
    identifier: identifier ?? '',
    pendingSessionLimit,
  };
}
