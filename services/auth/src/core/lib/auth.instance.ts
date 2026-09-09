import { AdminAccessService } from '@infrastructure/better-auth-additional';
import { PrismaService } from '@infrastructure/prisma';
import {
  NotifyExistingUserSignUpAttemptUseCase,
  ScheduleTwoFactorEmailUseCase,
} from '@module/application/use-cases';
import { ConfigType } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import {
  authEnvConfig,
  commonEnvConfig,
  httpEnvConfig,
} from '@repo/common/configs';
import { AUTH_LIMITS } from '@repo/common/constants';
import { ENodesEnv, Role } from '@repo/common/enums';
import { IAdminCandidate } from '@repo/common/types';
import { betterAuth, SecondaryStorage, User } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, openAPI, twoFactor } from 'better-auth/plugins';

import { correlationIdPlugin, otpPlugin, telegramPhonePlugin } from './plugins';

export const createAuth = (
  prismaService: PrismaService,
  secondaryStorage: SecondaryStorage,
  adminAccessService: AdminAccessService,
  moduleRef: ModuleRef,
  commonEnv: ConfigType<typeof commonEnvConfig>,
  httpEnv: ConfigType<typeof httpEnvConfig>,
  authEnv: ConfigType<typeof authEnvConfig>,
) => {
  return betterAuth({
    database: prismaAdapter(prismaService, { provider: 'postgresql' }),
    appName: 'Vectix',

    secondaryStorage,

    baseURL: authEnv.betterAuth.url,
    basePath: authEnv.betterAuth.path,
    trustedOrigins: [httpEnv.frontendUrl],
    trustedProxies: true,
    hooks: {},
    databaseHooks: {},
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
          enum: Object.values(Role),
          required: true,
          input: false,
          defaultValue: Role.PASSENGER,
        },
      },
    },
    plugins: [
      twoFactor({
        issuer: 'Vectix',
        otpOptions: {
          async sendOTP({ user, otp }, request) {
            const scheduleTwoFactorUseCase = moduleRef.get(
              ScheduleTwoFactorEmailUseCase,
              { strict: false },
            );

            if (scheduleTwoFactorUseCase) {
              await scheduleTwoFactorUseCase.scheduleTotp({
                userId: user.id,
                email: user.email,
                totp: otp,
              });
            }
          },
        },
      }),
      admin({
        isDefaultAdmin: (user: IAdminCandidate) =>
          adminAccessService.isDefaultAdmin(user),
        defaultRole: Role.PASSENGER,
      }),
      correlationIdPlugin(moduleRef),
      otpPlugin(moduleRef),
      telegramPhonePlugin(moduleRef, authEnv.telegram.botUsername),
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
      revokeSessionsOnPasswordReset: true,
      minPasswordLength: AUTH_LIMITS.MIN_PASSWORD_LENGTH,
      maxPasswordLength: AUTH_LIMITS.MAX_PASSWORD_LENGTH,
      // sendResetPassword: async ({ user, url }) => {
      //   await mailService.sendResetPassword(user.email, url);
      // },
      onExistingUserSignUp: async ({ user }) => {
        const notifyExistingUserSignUpUseCase = moduleRef.get(
          NotifyExistingUserSignUpAttemptUseCase,
          { strict: false },
        );

        if (notifyExistingUserSignUpUseCase) {
          await notifyExistingUserSignUpUseCase.execute({
            userId: user.id,
            email: user.email,
          });
        }
      },
    },
    advanced: {
      disableOriginCheck: commonEnv.nodeEnv === ENodesEnv.DEVELOPMENT,
      disableCSRFCheck: commonEnv.nodeEnv === ENodesEnv.DEVELOPMENT,
    },
    allowDangerousConnections: commonEnv.nodeEnv === ENodesEnv.DEVELOPMENT,
  });
};

export type TBA_Auth = ReturnType<typeof createAuth>;
