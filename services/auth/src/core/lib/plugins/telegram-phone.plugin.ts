import { PhoneVerificationStorage } from '@infrastructure/telegram';
import { ModuleRef } from '@nestjs/core';
import {
  MESSAGES,
  PHONE_VERIFICATION_STATUS,
  REGISTER_PLUGIN_KEYS,
  STATUSES,
} from '@repo/common/constants';
import {
  APIError,
  createAuthEndpoint,
  sessionMiddleware,
} from 'better-auth/api';
import type { BetterAuthPlugin } from 'better-auth/types';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 16);

export const telegramPhonePlugin = (
  moduleRef: ModuleRef,
  botUsername: string,
): BetterAuthPlugin => {
  return {
    id: REGISTER_PLUGIN_KEYS[2],
    endpoints: {
      initiatePhoneVerification: createAuthEndpoint(
        '/phone/initiate',
        {
          method: 'POST',
          use: [sessionMiddleware],
        },
        async ctx => {
          const session = ctx.context.session;
          const body = (ctx.body ?? {}) as { phone?: string };

          if (!session?.user) {
            console.log('here I');
            console.log(JSON.stringify(session));
            throw new APIError(STATUSES.UNAUTHORIZED, {
              message: MESSAGES.PHONE.AUTHENTICATION_REQUIRED,
            });
          }

          console.log('here no I');

          if (!body.phone) {
            throw new APIError(STATUSES.BAD_REQUEST, {
              message: MESSAGES.PHONE.REQUIRED,
            });
          }

          const storage = moduleRef.get(PhoneVerificationStorage, {
            strict: false,
          });

          const token = `tk_${nanoid()}`;
          await storage.createSession(token, {
            userId: session.user.id,
            targetPhone: body.phone,
          });

          return ctx.json({
            success: true,
            token,
            telegramUrl: `https://t.me/${botUsername}?start=${token}`,
            expiresIn: 600,
          });
        },
      ),

      getPhoneVerificationStatus: createAuthEndpoint(
        '/phone/status',
        {
          method: 'GET',
        },
        async ctx => {
          const token = ctx.query?.token as string | undefined;

          if (!token) {
            throw new APIError(STATUSES.BAD_REQUEST, {
              message: MESSAGES.VERIFICATION_TOKEN_REQUIRED,
            });
          }

          const storage = moduleRef.get(PhoneVerificationStorage, {
            strict: false,
          });

          const session = await storage.getSession(token);

          if (!session) {
            return ctx.json({
              status: PHONE_VERIFICATION_STATUS.EXPIRED,
            });
          }

          if (session.status === PHONE_VERIFICATION_STATUS.VERIFIED) {
            await storage.deleteSession(token);
          }

          return ctx.json({
            status: session.status,
            verifiedAt: session.verifiedAt ?? null,
          });
        },
      ),
    },
  };
};
