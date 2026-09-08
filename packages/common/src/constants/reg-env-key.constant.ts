export const REGISTER_ENV_KEYS = [
  'auth-env',
  'broker-env',
  'common-env',
  'database-env',
  'http-env',
  'notification-env',
] as const;

export type TRegisterEnvKeys = (typeof REGISTER_ENV_KEYS)[number];
