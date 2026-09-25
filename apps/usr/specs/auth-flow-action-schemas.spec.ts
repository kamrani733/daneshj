import { ApiError } from '@daneshjoam/api-client';

import {
  AUTH_ACTION_INVALID_PAYLOAD_MESSAGE,
  parseAuthActionPayload,
  sendVerifyCodePayloadSchema,
} from '../src/app/(public)/(auth)/lib/auth-flow-action-schemas';

describe('auth-flow-action-schemas', () => {
  it('accepts send-verify payloads with omitted or undefined optional fields', () => {
    expect(
      sendVerifyCodePayloadSchema.parse({
        identity: 'tina@gmail.com',
        purpose: 'login',
      })
    ).toEqual({
      identity: 'tina@gmail.com',
      purpose: 'login',
    });

    expect(
      sendVerifyCodePayloadSchema.parse({
        identity: 'tina@gmail.com',
        purpose: 'login',
        referralCode: undefined,
        loginIdentityType: undefined,
        pageType: undefined,
      })
    ).toEqual({
      identity: 'tina@gmail.com',
      purpose: 'login',
    });
  });

  it('rejects invalid payloads with a Persian ApiError (no zod internals)', () => {
    expect(() =>
      parseAuthActionPayload(sendVerifyCodePayloadSchema, {
        identity: '',
        purpose: 'login',
      })
    ).toThrow(ApiError);

    try {
      parseAuthActionPayload(sendVerifyCodePayloadSchema, {
        identity: '',
        purpose: 'login',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe(AUTH_ACTION_INVALID_PAYLOAD_MESSAGE);
      expect((error as ApiError).message).not.toMatch(/zod/i);
    }
  });
});
