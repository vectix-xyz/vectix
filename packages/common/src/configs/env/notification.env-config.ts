import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import { REGISTER_ENV_KEYS } from '../../constants';

const notificationEnvSchema = z.object({
  twilio: z.object({
    accountSid: z.string().min(1),
    serviceSid: z.string().min(1),
    authToken: z.string().min(1),
    phoneNumber: z.string().min(1),
  }),

  resend: z.object({
    apiKey: z.string().min(1),
    mailFrom: z.email(),
  }),
});

export type TNotificationEnvConfig = z.infer<typeof notificationEnvSchema>;

export const notificationEnvConfig = registerAs(REGISTER_ENV_KEYS[5], () => {
  return notificationEnvSchema.parse({
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      serviceSid: process.env.TWILIO_SERVICE_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },

    resend: {
      apiKey: process.env.RESEND_API_KEY,
      mailFrom: process.env.RESEND_MAIL_FROM,
    },
  });
});
