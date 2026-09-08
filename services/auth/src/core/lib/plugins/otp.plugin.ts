import { PrismaService } from '@infrastructure/prisma';
import { SendOtpUseCase } from '@module/application/use-cases';
import {
  ResendOtpRequest,
  VerifyOtpRequest,
} from '@module/presentation/dto/requests';
import { ModuleRef } from '@nestjs/core';
import {
  AUTH_API_ROUTES,
  MESSAGES,
  METADATA,
  METHODS,
  REGISTER_PLUGIN_KEYS,
  STATUSES,
} from '@repo/common/constants';
import { IOtpSessionData } from '@repo/common/types';
import { OtpInvalidCodeError, OtpLimitError, OtpService, OtpThrottleError } from '@repo/infra/otp';
import { APIError } from 'better-auth';
import { createAuthEndpoint } from 'better-auth/api';
import { setSessionCookie } from 'better-auth/cookies';
import type { BetterAuthPlugin } from 'better-auth/types';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const otpPlugin = (moduleRef: ModuleRef): BetterAuthPlugin => {
  return {
    id: REGISTER_PLUGIN_KEYS[1],
    endpoints: {
      verifyOtp: createAuthEndpoint(
        AUTH_API_ROUTES.OTP.VERIFY,
        { method: METHODS.POST },
        async ctx => {
          const body = (ctx.body ?? {}) as Record<string, any>;

          const dto = plainToInstance(VerifyOtpRequest, body);
          const errors = await validate(dto);

          if (errors.length > 0) {
            const messages = errors
              .map(err => Object.values(err.constraints ?? {}))
              .flat();

            throw new APIError(STATUSES.BAD_REQUEST, {
              message: messages.join(', ') || MESSAGES.VALIDATION_FAILED,
            });
          }

          const { email, code } = dto;
          const normalizedEmail = email.trim().toLowerCase();

          const prisma = moduleRef.get(PrismaService, { strict: false });
          const otpService = moduleRef.get(OtpService, { strict: false });

          let sessionData: IOtpSessionData;
          try {
            sessionData = await otpService.verify(normalizedEmail, code);
          } catch {
            throw new APIError(STATUSES.BAD_REQUEST, {
              message: MESSAGES.OTP_INVALID,
            });
          }

          const user = await prisma.user.update({
            where: sessionData.userId
              ? { id: sessionData.userId }
              : { email: normalizedEmail },
            data: { emailVerified: true },
          });

          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            false,
          );

          await setSessionCookie(ctx, { session, user });

          return ctx.json({
            success: true,
            user,
            session,
          });
        },
      ),
      resendOtp: createAuthEndpoint(
        AUTH_API_ROUTES.OTP.RESEND,
        { method: METHODS.POST },
        async ctx => {
          const body = (ctx.body ?? {}) as Record<string, any>;

          const dto = plainToInstance(ResendOtpRequest, body);
          const errors = await validate(dto);

          if (errors.length > 0) {
            const messages = errors
              .map(err => Object.values(err.constraints ?? {}))
              .flat();

            throw new APIError(STATUSES.BAD_REQUEST, {
              message: messages.join(', ') || MESSAGES.VALIDATION_FAILED,
            });
          }

          const correlationId = String(
            ctx.headers?.get(METADATA.CORRELATION_ID) ?? '',
          );

          const sendOtpUseCase = moduleRef.get(SendOtpUseCase, {
            strict: false,
          });

          try {
            await sendOtpUseCase.execute({
              email: dto.email,
              correlationId,
            });

            return ctx.json({
              success: true,
              message: MESSAGES.OTP_RESENT,
            });
          } catch (error: any) {
            if (error instanceof OtpThrottleError) {
              throw new APIError(STATUSES.TOO_MANY_REQUESTS, {
                message:
                  error.message || 'Please, wait a minute before next request.',
              });
            }

            if (error instanceof OtpLimitError) {
              throw new APIError(STATUSES.TOO_MANY_REQUESTS, {
                message:
                  error.message ||
                  'Maximum OTP attempts exceeded. Request a new code.',
              });
            }

            if (error instanceof OtpInvalidCodeError) {
              throw new APIError(STATUSES.BAD_REQUEST, {
                message: error.message || 'Invalid or expired OTP code.',
              });
            }

            if (error instanceof APIError) {
              throw error;
            }

            throw new APIError(STATUSES.BAD_REQUEST, {
              message: error.message || 'Failed to process OTP request.',
            });
          }
        },
      ),
    },
  };
};
