import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import { REGISTER_ENV_KEYS } from '../../constants';

const authEnvSchema = z.object({
  betterAuth: z.object({
    secret: z.string().min(1),
    url: z.url(),
    path: z.string(),
    authServiceUrl: z.url(),
  }),

  google: z.object({
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
  }),
});

export type TAuthEnvConfig = z.infer<typeof authEnvSchema>;

export const authEnvConfig = registerAs(REGISTER_ENV_KEYS[0], () => {
  return authEnvSchema.parse({
    betterAuth: {
      secret: process.env.BETTER_AUTH_SECRET,
      url: process.env.BETTER_AUTH_URL,
      path: process.env.BETTER_AUTH_PATH,
      authServiceUrl: process.env.AUTH_SERVICE_URL,
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  });
});
