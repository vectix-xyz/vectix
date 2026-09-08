import {
  CheckCanVerifyTwoFactorUseCase,
  ScheduleTwoFactorEmailUseCase,
} from '@module/application/use-cases';
import { TwoFactorAlreadyEnabledException } from '@module/domain/exceptions';
import { Injectable, Logger } from '@nestjs/common';
import { STATUSES } from '@repo/common/constants';
import {
  AfterHook,
  type AuthHookContext,
  BeforeHook,
  Hook,
} from '@thallesp/nestjs-better-auth';
import { APIError } from 'better-auth';

@Injectable()
@Hook()
export class TwoFactorHook {
  private readonly logger = new Logger(TwoFactorHook.name);

  constructor(
    private readonly scheduleTwoFactorUseCase: ScheduleTwoFactorEmailUseCase,
    private readonly checkCanVerifyTwoFactorUseCase: CheckCanVerifyTwoFactorUseCase,
  ) {}

  @AfterHook('/two-factor/enable')
  async afterEnable(context: AuthHookContext) {
    const responseData = context.context.returned as
      { totpURI?: string; backupCodes?: string[] } | undefined;

    const user =
      (context as any).session?.user ?? (context as any).context?.session?.user;

    if (!responseData?.totpURI || !user) {
      this.logger.warn(
        `[2FA Hook] Skipping QR schedule: missing totpURI or user in context`,
      );
      return;
    }

    this.logger.log(
      `[2FA Hook] Scheduling 2FA QR code email for user: ${user.id}`,
    );

    await this.scheduleTwoFactorUseCase.scheduleQr({
      userId: user.id,
      email: user.email,
      totpUri: responseData.totpURI,
      backupCodes: responseData.backupCodes,
    });
  }

  @BeforeHook('/two-factor/verify-totp')
  async beforeVerifyTotp(context: AuthHookContext): Promise<void> {
    const user =
      (context as any).session?.user ?? (context as any).context?.session?.user;

    if (!user) return;

    try {
      await this.checkCanVerifyTwoFactorUseCase.execute(user.id);
    } catch (error) {
      if (error instanceof TwoFactorAlreadyEnabledException) {
        throw new APIError(STATUSES.BAD_REQUEST, {
          message: error.message,
        });
      }
      throw error;
    }
  }

  @AfterHook('/two-factor/verify-totp')
  async afterVerifyTotp(context: AuthHookContext): Promise<void> {
    const response = (context as any).response;
    if (response && response.user) {
      response.user.twoFactorEnabled = true;
    }
  }
}
