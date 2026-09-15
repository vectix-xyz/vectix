import { Injectable, Logger } from '@nestjs/common';
import {
  DatabaseHook,
  BeforeCreate,
} from '@thallesp/nestjs-better-auth';
import { APIError } from 'better-auth/api';
import { PrismaService } from '@infrastructure/prisma';
import { METADATA } from '@repo/common/constants';
import { TAppPortalKeysValues } from '@repo/common/types';

@DatabaseHook()
@Injectable()
export class SessionRoleValidationDatabaseHook {
  private readonly logger = new Logger(SessionRoleValidationDatabaseHook.name);

  constructor(private readonly prisma: PrismaService) {}

  @BeforeCreate('session')
  async validateSessionBeforeCreate(session: any, ctx: any) {
    const appType = ctx?.headers?.get(METADATA.APP_TYPE) as TAppPortalKeysValues | undefined;

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, role: true, banned: true },
    });

    if (!user) {
      throw new APIError('UNAUTHORIZED', {
        message: 'User not found or deleted',
      });
    }

    if (user.banned) {
      throw new APIError('FORBIDDEN', {
        message: 'Your account has been suspended',
      });
    }

    // Правила доступу за заголовком x-app-type
    if (appType === AppType.COMPANY_PORTAL && user.role !== UserRole.COMPANY_ADMIN) {
      this.logger.warn(
        `[Auth Breach Attempt] User ${user.email} with role ${user.role} tried to login to Company Portal`,
      );
      throw new APIError('FORBIDDEN', {
        message: 'Access restricted: Only Company Admins are allowed to sign in here.',
      });
    }

    if (appType === AppType.DRIVER_APP && user.role !== UserRole.DRIVER) {
      this.logger.warn(
        `[Auth Breach Attempt] User ${user.email} with role ${user.role} tried to login to Driver App`,
      );
      throw new APIError('FORBIDDEN', {
        message: 'Access restricted: Driver account required.',
      });
    }

    if (appType === AppType.PASSENGER_WEB && user.role !== UserRole.PASSENGER) {
      // Якщо не хочеш пускати адмінів як пасажирів (або дозволити, якщо роль не лімітується)
    }

    return { data: session };
  }
}