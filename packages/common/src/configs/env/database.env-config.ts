import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import { REGISTER_ENV_KEYS } from '../../constants';

const databaseEnvSchema = z.object({
  postgres: z.object({
    url: z.url(),
  }),
});

export type TDatabaseEnvConfig = z.infer<typeof databaseEnvSchema>;

export const databaseEnvConfig = registerAs(REGISTER_ENV_KEYS[3], () => {
  return databaseEnvSchema.parse({
    postgres: {
      url: process.env.DATABASE_URL,
    },
  });
});
