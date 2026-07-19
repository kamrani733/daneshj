'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  changePassword,
  deleteSession,
  deleteSessionForLimitReached,
  getPublicSecurityQuestions,
  getSessions,
  getSessionsForLimitReached,
  inactiveSessionThenGetToken,
  loginByIdentityAndPassword,
  refreshToken,
  resetPassword,
  sendOtpForLogin,
  sendVerifyCode,
  verifyCode,
  verifyPassword,
} from './auth';
import { authQueryKeys } from './query-keys';
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
} from './types';

export function useSendVerifyCodeMutation() {
  return useMutation({ mutationFn: sendVerifyCode });
}

export function useVerifyCodeMutation() {
  return useMutation({ mutationFn: verifyCode });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPassword });
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
  return useMutation({ mutationFn: changePassword });
}

export function useRefreshTokenMutation() {
  return useMutation({ mutationFn: refreshToken });
}

export function useSendOtpForLoginMutation() {
  return useMutation({ mutationFn: sendOtpForLogin });
}

export function useVerifyPasswordMutation() {
  return useMutation({ mutationFn: verifyPassword });
}

export function useLoginByIdentityAndPasswordMutation() {
  return useMutation({ mutationFn: loginByIdentityAndPassword });
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

export function useGetSessionsForLimitReachedQuery(
  accessToken: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: authQueryKeys.sessionsForLimitReached(),
    queryFn: () => getSessionsForLimitReached(accessToken!),
    enabled: enabled && !!accessToken,
  });
}

export function useDeleteSessionForLimitReachedMutation() {
  return useMutation({ mutationFn: deleteSessionForLimitReached });
}

export function useDeleteSessionMutation() {
  return useMutation({ mutationFn: deleteSession });
}

export function useInactiveSessionThenGetTokenMutation() {
  return useMutation({ mutationFn: inactiveSessionThenGetToken });
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
