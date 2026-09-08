import { PrismaService } from '@infrastructure/prisma';
import { ScheduleTwoFactorEmailUseCase } from '@module/application/use-cases';
import { ConfigType } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import {
  authEnvConfig,
  commonEnvConfig,
  httpEnvConfig,
} from '@repo/common/configs';
import { AUTH_LIMITS, MESSAGES, ROLES, STATUSES } from '@repo/common/constants';
import { ENodesEnv, Role } from '@repo/common/enums';
import { RedisService } from '@repo/infrastructure/redis';
import { APIError, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, openAPI, twoFactor } from 'better-auth/plugins';

import { correlationIdPlugin, otpPlugin } from './plugins';

export const createAuth = (
  prismaService: PrismaService,
  redisService: RedisService,
  moduleRef: ModuleRef,
  commonEnv: ConfigType<typeof commonEnvConfig>,
  httpEnv: ConfigType<typeof httpEnvConfig>,
  authEnv: ConfigType<typeof authEnvConfig>,
) => {
  return betterAuth({
    database: prismaAdapter(prismaService, { provider: 'postgresql' }),
    appName: 'Vectix',

    secondaryStorage: {
      get: async key => {
        return await redisService.get(key);
      },
      set: async (key, value, ttl) => {
        if (ttl) {
          await redisService.set(key, value, 'EX', ttl);
        } else {
          await redisService.set(key, value);
        }
      },
      delete: async key => {
        await redisService.del(key);
      },
      getAndDelete: async (key: string) => {
        const val = await redisService.get(key);
        if (val) await redisService.del(key);
        return val;
      },
      increment: async (key: string, value: number) => {
        return await redisService.incrby(key, value);
      },
    },

    baseURL: authEnv.betterAuth.url,
    basePath: authEnv.betterAuth.path,
    trustedOrigins: [httpEnv.frontendUrl],
    trustedProxies: true,
    hooks: {},
    databaseHooks: {
      user: {
        create: {
          before: (userData, ctx) => {
            const body = ctx?.body;

            const isOAuthRegistration =
              userData.emailVerified === true && !body?.password;

            if (isOAuthRegistration) {
              throw new APIError(STATUSES.FORBIDDEN, {
                message: MESSAGES.SOCIAL_REGISTRATION_NOT_ALLOWED,
                code: STATUSES.SOCIAL_REGISTRATION_NOT_ALLOWED,
              });
            }

            const role = body?.type;

            if (role) {
              return Promise.resolve({ data: { ...userData, role } });
            }

            return Promise.resolve({ data: userData });
          },
        },
      },
    },
    user: {
      changeEmail: {
        enabled: true,
        // sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        //   await mailService.sendChangeEmailVerification(user.email, newEmail, url);
        // },
      },
      additionalFields: {
        role: {
          type: 'string',
          enum: Object.values(ROLES),
          required: true,
          input: false,
          defaultValue: ROLES.PASSENGER,
        },
      },
    },
    plugins: [
      twoFactor({
        issuer: 'Vectix',
        otpOptions: {
          async sendOTP({ user, otp }, request) {
            const schedule2FaUseCase = moduleRef.get(
              ScheduleTwoFactorEmailUseCase,
              {
                strict: false,
              },
            );

            if (schedule2FaUseCase) {
              await schedule2FaUseCase.scheduleTotp({
                userId: user.id,
                email: user.email,
                totp: otp,
              });
            }
          },
        },
      }),
      admin({
        isDefaultAdmin: (user: { role?: string }) => user.role === Role.ADMIN,
        defaultRole: ROLES.PASSENGER,
      }),
      correlationIdPlugin(moduleRef),
      otpPlugin(moduleRef),
      openAPI(),
    ],
    socialProviders: {
      google: {
        clientId: authEnv.google.clientId,
        clientSecret: authEnv.google.clientSecret,
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: AUTH_LIMITS.MIN_PASSWORD_LENGTH,
      maxPasswordLength: AUTH_LIMITS.MAX_PASSWORD_LENGTH,
      // sendResetPassword: async ({ user, url }) => {
      //   await mailService.sendResetPassword(user.email, url);
      // },
    },
    advanced: {
      disableOriginCheck: commonEnv.nodeEnv === ENodesEnv.DEVELOPMENT,
      disableCSRFCheck: commonEnv.nodeEnv === ENodesEnv.DEVELOPMENT,
    },
    allowDangerousConnections: commonEnv.nodeEnv === ENodesEnv.DEVELOPMENT,
  });
};

export type TBA_Auth = ReturnType<typeof createAuth>;
