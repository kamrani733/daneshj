import { pickForwardHeaders } from '../src/app/(public)/(auth)/lib/forward-headers';
import {
  decodeAuthFlowStep,
  encodeAuthFlowStep,
  splitAuthStep,
  stripProductionOtp,
} from '../src/app/(public)/(auth)/lib/auth-flow-step';
import { toPersistedAuthFlow, useAuthFlowStore } from '../src/app/(public)/(auth)/lib/auth-flow';
import type { VerifyCodeResponse } from '../src/app/(public)/(auth)/api/types';

jest.mock('../src/app/(public)/(auth)/lib/auth-flow-actions', () => ({
  clearAuthFlowStep: async () => undefined,
}));

describe('splitAuthStep', () => {
  const identityInfo = {
    identity_type: 'mobile' as const,
    mobile: '09120000000',
    email: null,
    operation: 'LOGIN' as const,
    redirect_verify_password: true,
    is_two_step_login: true,
  };

  it('keeps a verify-password token out of the client result', () => {
    const result: VerifyCodeResponse = {
      identityInfo,
      redirectVerifyPassword: true,
      verifyPasswordAccessToken: 'step-token',
    };
    const split = splitAuthStep(result);
    expect(split.secret).toEqual({ step: 'verify-password', accessToken: 'step-token' });
    expect(split.client.step).toBe('verify-password');
    expect(split.client).not.toHaveProperty('verifyPasswordAccessToken');
    expect(JSON.stringify(split.client)).not.toContain('step-token');
  });

  it('keeps a reset token out of the client result', () => {
    const split = splitAuthStep({
      identityInfo,
      redirectVerifyPassword: true,
      resetAccessToken: 'reset-token',
    });
    expect(split.secret?.step).toBe('reset-password');
    expect(split.secret?.accessToken).toBe('reset-token');
    expect(JSON.stringify(split.client)).not.toContain('reset-token');
  });

  it('keeps a session-limit token out of the client result', () => {
    const split = splitAuthStep({
      identityInfo,
      sessionLimitReached: true,
      pendingAccessToken: 'limit-token',
      loginType: 4,
    });
    expect(split.secret).toMatchObject({
      step: 'session-limit',
      accessToken: 'limit-token',
      loginType: 4,
    });
    expect(JSON.stringify(split.client)).not.toContain('limit-token');
  });
});

describe('auth flow step cookie codec', () => {
  it('round-trips the secret without putting it in a client field', () => {
    const encoded = encodeAuthFlowStep({
      step: 'reset-password',
      accessToken: 'reset-token',
    });
    expect(decodeAuthFlowStep(encoded)).toEqual({
      step: 'reset-password',
      accessToken: 'reset-token',
    });
    expect(decodeAuthFlowStep('not-a-token')).toBeNull();
  });
});

describe('stripProductionOtp', () => {
  it('removes code in production and keeps it otherwise', () => {
    expect(stripProductionOtp({ code: '123456', message: 'ok' }, 'production')).toEqual({
      message: 'ok',
    });
    expect(stripProductionOtp({ code: '123456', message: 'ok' }, 'development').code).toBe(
      '123456'
    );
  });
});

describe('pickForwardHeaders', () => {
  it('prefers x-forwarded-for and falls back to x-real-ip', () => {
    expect(
      pickForwardHeaders({
        get: (name) =>
          name === 'x-forwarded-for'
            ? '203.0.113.5'
            : name === 'user-agent'
              ? 'TestAgent'
              : null,
      })
    ).toEqual({
      'X-Forwarded-For': '203.0.113.5',
      'User-Agent': 'TestAgent',
    });

    expect(
      pickForwardHeaders({
        get: (name) => (name === 'x-real-ip' ? '203.0.113.8' : null),
      })
    ).toEqual({ 'X-Forwarded-For': '203.0.113.8' });
  });
});

describe('toPersistedAuthFlow', () => {
  it('drops the dev OTP and never includes a bearer token', () => {
    const persisted = toPersistedAuthFlow({
      kind: 'login',
      identifier: '09120000000',
      sendVerifyContext: {
        operation: 'LOGIN',
        codeType: 'OTP',
        identityType: 'mobile',
        devOtpCode: '123456',
      },
      resendAvailableAt: 1,
      otpVerified: false,
      hasVerifyPasswordToken: true,
      hasResetToken: false,
      hasSessionLimit: false,
    });
    expect(persisted.sendVerifyContext?.devOtpCode).toBeUndefined();
    const json = JSON.stringify(persisted);
    expect(json).not.toContain('123456');
    expect(json).not.toContain('accessToken');
  });

  it('removes the legacy localStorage key when the wizard store writes', () => {
    localStorage.setItem('auth-flow', '{"verifyPasswordAccessToken":"secret-token"}');
    useAuthFlowStore.getState().startFlow('login', '09120000000');
    expect(localStorage.getItem('auth-flow')).toBeNull();
    const wizard = sessionStorage.getItem('auth-flow-wizard');
    expect(wizard).not.toContain('secret-token');
    expect(wizard).not.toContain('accessToken');
  });
});
