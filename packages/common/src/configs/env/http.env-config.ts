import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import { REGISTER_ENV_KEYS } from '../../constants';

const httpEnvSchema = z.object({
  http: z.object({
    port: z.coerce.number().default(4200),
    host: z.url().default('http://localhost:4200'),
    cors: z
      .array(z.url())
      .default(['http://localhost:3000', 'http://frontend:3000']),
  }),

  backendUrl: z.url(),
  frontendUrl: z.url(),
});

export type THttpEnvConfig = z.infer<typeof httpEnvSchema>;

export const httpEnvConfig = registerAs(REGISTER_ENV_KEYS[4], () => {
  return httpEnvSchema.parse({
    http: {
      host: process.env.HTTP_HOST,
      port: process.env.HTTP_PORT,
      cors: process.env.HTTP_CORS?.split(','),
    },

    backendUrl: process.env.BACKEND_URL,
    frontendUrl: process.env.FRONTEND_URL,
  });
});
