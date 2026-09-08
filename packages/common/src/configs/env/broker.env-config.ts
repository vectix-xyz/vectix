import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import { REGISTER_ENV_KEYS } from '../../constants';

const brokerEnvSchema = z.object({
  queue: z.object({
    rabbitMq: z.object({
      url: z.url(),
    }),
  }),

  cache: z.object({
    redis: z.object({
      user: z.string(),
      password: z.string(),
      host: z.string(),
      port: z.coerce.number(),
    }),
  }),
});

export type TBrokerEnvConfig = z.infer<typeof brokerEnvSchema>;

export const brokerEnvConfig = registerAs(REGISTER_ENV_KEYS[1], () => {
  return brokerEnvSchema.parse({
    queue: {
      rabbitMq: {
        url: process.env.RABBITMQ_URL,
      },
    },

    cache: {
      redis: {
        user: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    },
  });
});
