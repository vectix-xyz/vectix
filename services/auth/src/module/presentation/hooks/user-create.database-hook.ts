import { AdminAccessService } from '@infrastructure/better-auth-additional';
import { EnsureAdminProfileUseCase } from '@module/application/use-cases';
import { Injectable, Logger } from '@nestjs/common';
import { MESSAGES, STATUSES } from '@repo/common/constants';
import { Role } from '@repo/common/enums';
import {
  AfterCreate,
  BeforeCreate,
  DatabaseHook,
} from '@thallesp/nestjs-better-auth';
import { APIError } from 'better-auth';

@DatabaseHook()
@Injectable()
export class UserCreateDatabaseHook {
  private readonly logger = new Logger(UserCreateDatabaseHook.name);

  constructor(
    private readonly adminAccessService: AdminAccessService,
    private readonly ensureAdminProfileUseCase: EnsureAdminProfileUseCase,
  ) {}

  @BeforeCreate('user')
  async beforeUserCreate(user: Record<string, any>, context?: any) {
    const body = context?.body;

    const isOAuthRegistration = user.emailVerified === true && !body?.password;

    if (isOAuthRegistration) {
      throw new APIError(STATUSES.FORBIDDEN, {
        message: MESSAGES.SOCIAL_REGISTRATION_NOT_ALLOWED,
        code: STATUSES.SOCIAL_REGISTRATION_NOT_ALLOWED,
      });
    }

    const isSuperAdmin = this.adminAccessService.isDefaultAdmin({
      email: user.email,
    });

    if (isSuperAdmin) {
      this.logger.log(
        `👑 Whitelist match! Elevating user ${user.email} to ADMIN`,
      );
      return {
        data: {
          ...user,
          role: Role.ADMIN,
        },
      };
    }

    const role = body?.type;

    if (role) {
      return {
        data: {
          ...user,
          role,
        },
      };
    }

    return {
      data: user,
    };
  }

  @AfterCreate('user')
  async afterUserCreate(createdUser: Record<string, any>) {
    if (createdUser.role === Role.ADMIN) {
      const level = this.adminAccessService.resolveAdminLevel(
        createdUser.email,
      );
      await this.ensureAdminProfileUseCase.execute({
        userId: createdUser.id,
        level,
      });
    }
  }
}
