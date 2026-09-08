import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import { REGISTER_ENV_KEYS } from '../../constants';
import { ENodesEnv } from '../../enums';

const commonEnvSchema = z.object({
  nodeEnv: z.enum(ENodesEnv).default(ENodesEnv.DEVELOPMENT),
  enableLogs: z.coerce.boolean().default(false),
});

export type TCommonEnvConfig = z.infer<typeof commonEnvSchema>;

export const commonEnvConfig = registerAs(REGISTER_ENV_KEYS[2], () => {
  return commonEnvSchema.parse({
    nodeEnv: process.env.NODE_ENV,
    enableLogs: process.env.ENABLE_LOGS,
  });
});
