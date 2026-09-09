import { PhoneVerificationStorage } from '@infrastructure/telegram';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { MESSAGES, PHONE_VERIFICATION_STATUS } from '@repo/common/constants';

import {
  type IPhoneVerificationRepositoryPort,
  PHONE_VERIFICATION_REPOSITORY,
} from './phone-verification.repository.port';
import { VerifyPhoneTelegramCommand } from './verify-phone-telegram.command';

@Injectable()
export class VerifyPhoneTelegramUseCase {
  private readonly logger = new Logger(VerifyPhoneTelegramUseCase.name);

  constructor(
    private readonly phoneVerificationStorage: PhoneVerificationStorage,
    @Inject(PHONE_VERIFICATION_REPOSITORY)
    private readonly phoneVerificationRepository: IPhoneVerificationRepositoryPort,
  ) {}

  async execute(command: VerifyPhoneTelegramCommand): Promise<boolean> {
    if (command.telegramUserId !== command.contactUserId) {
      this.logger.warn(
        `Security check failed: contact owner != message author`,
      );
      throw new BadRequestException(
        MESSAGES.TELEGRAM.CONTACT_MUST_BELONG_TO_YOUR_ACCOUNT,
      );
    }

    const session = await this.phoneVerificationStorage.getSession(
      command.token,
    );
    if (!session || session.status !== PHONE_VERIFICATION_STATUS.PENDING) {
      throw new BadRequestException(MESSAGES.TELEGRAM.SESSION_EXPIRED);
    }

    const cleanInput = command.phoneNumber.replace(/\D/g, '');
    const cleanTarget = session.targetPhone.replace(/\D/g, '');

    if (cleanInput !== cleanTarget) {
      this.logger.warn(
        `Phone mismatch: expected ${cleanTarget}, got ${cleanInput}`,
      );
      throw new BadRequestException(
        MESSAGES.TELEGRAM.PHONE_NUMBER_MISMATCH,
      );
    }

    const isTaken = await this.phoneVerificationRepository.isPhoneTaken(
      cleanTarget,
      session.userId,
    );
    if (isTaken) {
      throw new ConflictException(
        MESSAGES.TELEGRAM.PHONE_NUMBER_ALREADY_TAKEN,
      );
    }

    await this.phoneVerificationRepository.updateUserPhone(
      session.userId,
      cleanTarget,
    );
    await this.phoneVerificationStorage.markVerified(command.token, command.telegramUserId);

    this.logger.log(`Phone verified successfully for user: ${session.userId}`);
    return true;
  }
}
