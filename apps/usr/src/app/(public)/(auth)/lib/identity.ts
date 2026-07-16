import type { LoginIdentityType } from '@auth/api';

const MOBILE_PATTERN = /^(?:09|9|\+989|989)\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFERRAL_PATTERN = /^\d{6}$/;

export function normalizeIdentity(value: string) {
  return value.trim().replace(/\s/g, '');
}

export function detectLoginIdentityType(identity: string): LoginIdentityType {
  const value = normalizeIdentity(identity);

  if (MOBILE_PATTERN.test(value)) {
    return 'mobile';
  }

  if (value.includes('@')) {
    return 'email';
  }

  return 'username';
}

export function isValidLoginIdentity(identity: string) {
  const value = normalizeIdentity(identity);
  if (!value) return false;

  const kind = detectLoginIdentityType(value);
  if (kind === 'email') return EMAIL_PATTERN.test(value);
  if (kind === 'mobile') return MOBILE_PATTERN.test(value);
  return value.length >= 2;
}

export function isValidReferralCode(code: string) {
  return REFERRAL_PATTERN.test(code);
}

export function isValidResetPasswordIdentity(identity: string) {
  const kind = detectLoginIdentityType(identity);
  if (kind === 'username') return false;
  return isValidLoginIdentity(identity);
}
