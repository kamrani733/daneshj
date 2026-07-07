import type { AuthOperation, AuthPurpose } from './types';

export const USR_ACTOR_TYPE = 'User' as const;
export const USR_LOGIN_SOURCE = 'Web' as const;

/** User login/register always sends LOGIN; backend returns REGISTER or LOGIN in response. */
export const SEND_VERIFY_OPERATION: AuthOperation = 'LOGIN';

export const PURPOSE_TO_SEND_OPERATION: Record<AuthPurpose, AuthOperation> = {
  register: SEND_VERIFY_OPERATION,
  login: SEND_VERIFY_OPERATION,
  'forgot-password': 'RESET_PASSWORD',
};

/** Referral codes are 6-digit per SRS */
export const REFERRAL_CODE_LENGTH = 6;

export const MAX_ACTIVE_SESSIONS = 5;
