import type { AuthOperation, AuthPurpose } from './types';

export const USR_ACTOR_TYPE = 'User' as const;
export const USR_LOGIN_SOURCE = 'Web' as const;

/**
 * Send-code always uses LOGIN for identity entry.
 * Backend returns LOGIN or REGISTER in the response operation.
 */
export const PURPOSE_TO_SEND_OPERATION: Record<AuthPurpose, AuthOperation> = {
  login: 'LOGIN',
  'forgot-password': 'RESET_PASSWORD',
};

/** Referral codes are 6-digit per SRS */
export const REFERRAL_CODE_LENGTH = 6;

export const MAX_ACTIVE_SESSIONS = 5;
