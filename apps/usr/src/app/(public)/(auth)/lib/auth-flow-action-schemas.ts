import { z } from 'zod';

const authPurposeSchema = z.enum(['login', 'forgot-password']);

const authOperationSchema = z.enum(['LOGIN', 'REGISTER', 'RESET_PASSWORD']);

const codeTypeSchema = z.enum(['OTP', 'TOTP']);

const loginIdentityTypeSchema = z.enum(['email', 'mobile', 'username']);

const pageTypeSchema = z.enum(['login_by_username', 'two_step_login']);

export const sendVerifyCodePayloadSchema = z.object({
  identity: z.string().min(1),
  purpose: authPurposeSchema,
  referralCode: z.string().optional(),
  loginIdentityType: loginIdentityTypeSchema.optional(),
  pageType: pageTypeSchema.optional(),
});

export const verifyCodePayloadSchema = z.object({
  identity: z.string().min(1),
  code: z.string().min(1),
  operation: authOperationSchema,
  codeType: codeTypeSchema,
  purpose: authPurposeSchema,
});

export const verifyPasswordPayloadSchema = z.object({
  identity: z.string().min(1),
  password: z.string().min(1),
  recaptchaResponse: z.string(),
});

export const loginByIdentityPasswordPayloadSchema = z.object({
  identity: z.string().min(1),
  password: z.string().min(1),
  recaptchaResponse: z.string(),
});

export const resetPasswordPayloadSchema = z.object({
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
});

export const sessionIdsSchema = z.array(z.number().int());
