'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  continueAfterSessionLimitAction,
  getSessionsForLimitReachedAction,
  loginByIdentityAndPasswordAction,
  resetPasswordAction,
  sendVerifyCodeAction,
  verifyCodeAction,
  verifyPasswordAction,
} from '@auth/lib/auth-flow-actions';
import {
  changePassword,
  deleteSession,
  deleteSessionForLimitReached,
  getPublicSecurityQuestions,
  getSessions,
  refreshToken,
  sendOtpForLogin,
} from '@auth/api/auth';
import { authQueryKeys } from '@auth/api/query-keys';
import type {
  ChangePasswordPayload,
  DeleteSessionForLimitReachedPayload,
  DeleteSessionPayload,
  GetSessionsPayload,
  InactiveSessionThenGetTokenPayload,
  LoginByIdentityPasswordPayload,
  RefreshTokenPayload,
  ResetPasswordPayload,
  SendOtpForLoginPayload,
  SendVerifyCodePayload,
  VerifyCodePayload,
  VerifyPasswordPayload,
} from '@auth/api/types';

export function useSendVerifyCodeMutation() {
  return useMutation({
    mutationFn: (payload: SendVerifyCodePayload) =>
      sendVerifyCodeAction(payload),
  });
}

export function useVerifyCodeMutation() {
  return useMutation({
    mutationFn: (payload: VerifyCodePayload) => verifyCodeAction(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: { password: string; confirmPassword: string }) =>
      resetPasswordAction(payload),
  });
}

export function usePublicSecurityQuestionsQuery(
  accessToken: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: authQueryKeys.securityQuestions(),
    queryFn: () => getPublicSecurityQuestions(accessToken!),
    enabled: enabled && !!accessToken,
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
}

export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: (payload: RefreshTokenPayload) => refreshToken(payload),
  });
}

export function useSendOtpForLoginMutation() {
  return useMutation({
    mutationFn: (payload: SendOtpForLoginPayload) => sendOtpForLogin(payload),
  });
}

export function useVerifyPasswordMutation() {
  return useMutation({
    mutationFn: (payload: {
      identity: string;
      password: string;
      recaptchaResponse: string;
    }) => verifyPasswordAction(payload),
  });
}

export function useLoginByIdentityAndPasswordMutation() {
  return useMutation({
    mutationFn: (payload: LoginByIdentityPasswordPayload) =>
      loginByIdentityAndPasswordAction(payload),
  });
}

export function useGetSessionsQuery(
  payload: GetSessionsPayload | null,
  enabled = true
) {
  return useQuery({
    queryKey: payload
      ? authQueryKeys.sessions(payload.sessionKey)
      : authQueryKeys.all,
    queryFn: () => getSessions(payload!),
    enabled: enabled && !!payload,
  });
}

export function useGetSessionsForLimitReachedQuery(enabled = true) {
  return useQuery({
    queryKey: authQueryKeys.sessionsForLimitReached(),
    queryFn: () => getSessionsForLimitReachedAction(),
    enabled,
  });
}

export function useDeleteSessionForLimitReachedMutation() {
  return useMutation({
    mutationFn: (payload: DeleteSessionForLimitReachedPayload) =>
      deleteSessionForLimitReached(payload),
  });
}

export function useDeleteSessionMutation() {
  return useMutation({
    mutationFn: (payload: DeleteSessionPayload) => deleteSession(payload),
  });
}

export function useInactiveSessionThenGetTokenMutation() {
  return useMutation({
    mutationFn: (sessionIds: number[]) => continueAfterSessionLimitAction(sessionIds),
  });
}

/** @deprecated Use useSendVerifyCodeMutation */
export const useSendOtpMutation = useSendVerifyCodeMutation;

/** @deprecated Use useVerifyCodeMutation */
export const useVerifyOtpMutation = useVerifyCodeMutation;

export type {
  ChangePasswordPayload,
  DeleteSessionForLimitReachedPayload,
  DeleteSessionPayload,
  GetSessionsPayload,
  InactiveSessionThenGetTokenPayload,
  LoginByIdentityPasswordPayload,
  RefreshTokenPayload,
  ResetPasswordPayload,
  SendOtpForLoginPayload,
  SendVerifyCodePayload,
  VerifyCodePayload,
  VerifyPasswordPayload,
};
