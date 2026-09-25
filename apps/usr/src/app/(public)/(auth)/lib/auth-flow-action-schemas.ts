import { ApiError } from '@daneshjoam/api-client';
import { z } from 'zod';

export const AUTH_ACTION_INVALID_PAYLOAD_MESSAGE =
  'اطلاعات ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.';

export function parseAuthActionPayload<TSchema extends z.ZodType>(
  schema: TSchema,
  payload: unknown
): z.infer<TSchema> {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ApiError(AUTH_ACTION_INVALID_PAYLOAD_MESSAGE, 400);
  }
  return result.data;
}

const authPurposeSchema = z.enum(['login', 'forgot-password']);

const authOperationSchema = z.enum(['LOGIN', 'REGISTER', 'RESET_PASSWORD']);

const codeTypeSchema = z.enum(['OTP', 'TOTP']);

const loginIdentityTypeSchema = z.enum(['email', 'mobile', 'username']);

const pageTypeSchema = z.enum(['login_by_username', 'two_step_login']);

export const sendVerifyCodePayloadSchema = z.object({
  identity: z.string().min(1),
  purpose: authPurposeSchema,
  referralCode: z.optional(z.string()),
  loginIdentityType: z.optional(loginIdentityTypeSchema),
  pageType: z.optional(pageTypeSchema),
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
