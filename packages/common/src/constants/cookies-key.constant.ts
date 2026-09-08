export const COOKIE_PREFIX = 'vectix';
export const BETTER_AUTH_COOKIE_PREFIX = 'better-auth';
export const SECURE_BETTER_AUTH_COOKIE_PREFIX = '__Secure-better-auth';

export const COOKIES_KEYS = {
  SESSION_TOKEN: 'session_token',
  BETTER_AUTH: {
    SESSION_TOKEN: `${BETTER_AUTH_COOKIE_PREFIX}.session_token`,
    SECURE_SESSION_TOKEN: `${SECURE_BETTER_AUTH_COOKIE_PREFIX}.session_token`,
  },
} as const;
