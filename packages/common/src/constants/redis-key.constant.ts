export const REDIS_KEYS = {
  OTP: {
    BASE: (email: string) => `otp:${email}`,
    ATTEMPTS: (email: string) => `otp_attempts:${email}`,
  },
  BETTER_AUTH: {
    SESSION: (sessionToken: string) => `session:${sessionToken}`,
  },
} as const;
