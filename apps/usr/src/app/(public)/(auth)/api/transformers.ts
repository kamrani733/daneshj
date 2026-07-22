import type { Session } from '@daneshjoam/shared-types';
import { toRequestQuery } from '@daneshjoam/api-client';

import {
  PURPOSE_TO_SEND_OPERATION,
  USR_ACTOR_TYPE,
  USR_LOGIN_SOURCE,
} from './constants';
import type {
  ActorSendCodeBody,
  ActorSendCodeQuery,
  ActorVerifyCodeBody,
  ActorVerifyCodeQuery,
  AuthPurpose,
  IdentityInfo,
  SendCodeData,
  SendVerifyCodePayload,
  SendVerifyCodeResponse,
  VerifyCodeData,
  VerifyCodePayload,
  VerifyCodeResponse,
} from './types';

export function toSendCodeQuery(payload: SendVerifyCodePayload): ActorSendCodeQuery {
  const query: ActorSendCodeQuery = {
    actor_type: USR_ACTOR_TYPE,
    operation: PURPOSE_TO_SEND_OPERATION[payload.purpose],
  };

  if (payload.purpose === 'forgot-password') {
    if (payload.loginIdentityType) {
      query.login_identity_type = payload.loginIdentityType;
    }
    if (payload.pageType) {
      query.page_type = payload.pageType;
    }
  }

  return query;
}

export function toSendCodeBody(payload: SendVerifyCodePayload): ActorSendCodeBody {
  return toRequestQuery({
    identity: payload.identity,
    referral_code: payload.referralCode ?? null,
    ticket_code: null,
  }) as ActorSendCodeBody;
}

export function toVerifyCodeQuery(payload: VerifyCodePayload): ActorVerifyCodeQuery {
  return {
    actor_type: USR_ACTOR_TYPE,
    code_type: payload.codeType,
    login_source: USR_LOGIN_SOURCE,
    operation: payload.operation,
  };
}

export function toVerifyCodeBody(payload: VerifyCodePayload): ActorVerifyCodeBody {
  return {
    identity: payload.identity,
    code: payload.code,
    user_agent:
      typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };
}

export function mapSendCodeResponse(
  data: SendCodeData,
  message: string | null
): SendVerifyCodeResponse {
  return {
    identityType: data.identity_type,
    codeType: data.redirect_code_type,
    operation: data.operation,
    // TODO: Stop exposing OTP from API response once SMS/email delivery is enabled.
    code: data.code ?? undefined,
    message: message ?? '',
  };
}

export function mapVerifyCodeResponse(
  data: VerifyCodeData,
  purpose: AuthPurpose
): VerifyCodeResponse {
  const { identity_info: info, session_info: sessionInfo } = data;

  if (purpose === 'forgot-password' || info.operation === 'RESET_PASSWORD') {
    return {
      identityInfo: info,
      redirectVerifyPassword: true,
      resetAccessToken: data.access_token,
    };
  }

  if (
    sessionInfo?.session_limit_reached &&
    !sessionInfo.session_key &&
    data.access_token
  ) {
    return {
      identityInfo: info,
      sessionLimitReached: true,
      pendingAccessToken: data.access_token,
      loginType: sessionInfo.login_type,
    };
  }

  // Two-step OTP login → password (YAML: verify for 2-step-login)
  if (
    purpose === 'login' &&
    info.is_two_step_login &&
    info.redirect_verify_password &&
    data.access_token
  ) {
    return {
      identityInfo: info,
      redirectVerifyPassword: true,
      verifyPasswordAccessToken: data.access_token,
    };
  }

  if (data.access_token && sessionInfo?.session_key) {
    return {
      session: mapToSession(data),
      identityInfo: info,
    };
  }

  return { identityInfo: info };
}

export function mapToSession(data: VerifyCodeData): Session {
  const { identity_info: info, session_info: sessionInfo } = data;
  const displayName =
    info.email ?? info.mobile ?? info.identity_type ?? 'User';

  return {
    user: {
      id: sessionInfo?.session_key ?? displayName,
      email: info.email ?? '',
      name: displayName,
    },
    accessToken: data.access_token!,
    refreshToken: data.refresh_token ?? undefined,
    sessionKey: sessionInfo?.session_key ?? undefined,
    loginType: sessionInfo?.login_type,
    identityInfo: mapIdentityInfo(info),
  };
}

export function mapIdentityInfo(info: IdentityInfo) {
  return {
    identityType: info.identity_type,
    mobile: info.mobile,
    email: info.email,
    operation: info.operation,
    redirectVerifyPassword: info.redirect_verify_password,
    isTwoStepLogin: info.is_two_step_login,
  };
}

export function toIdentityInfoRequest(info: IdentityInfo) {
  return {
    identity_type: info.identity_type,
    mobile: info.mobile,
    email: info.email,
    operation: info.operation,
    redirect_verify_password: info.redirect_verify_password,
    is_two_step_login: info.is_two_step_login,
  };
}
