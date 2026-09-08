export const GATEWAY_TRPC_API_PREFIX = '/api/v1/trpc';
export const AUTH_API_PREFIX = '/api/v1/auth';
export const AUTH_API_OTP_PREFIX = '/otp';

export const EXCLUDED_ROUTES = [
  '/api/v1/auth',
  '/api/auth',
  '/docs',
  '/health',
  '/api/v1/health',
];

export const AUTH_API_ROUTES = {
  OTP: {
    VERIFY: `${AUTH_API_OTP_PREFIX}/verify`,
    RESEND: `${AUTH_API_OTP_PREFIX}/resend`,
  },
} as const;
