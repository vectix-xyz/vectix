import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  EVENT_TYPES,
  EVENTS,
  METADATA,
  NOTIFICATION_SERVICE,
  OTP_PURPOSE_KEYS,
} from '@repo/common/constants';
import type {
  ISendEmailOtpPayload,
  ISendSmsOtpPayload,
} from '@repo/common/types';

import { SendOtpCommand } from '../commands';
import {
  type IOtpServicePort,
  type IUnitOfWorkPort,
  type IUserRepositoryPort,
  OTP_SERVICE,
  UNIT_OF_WORK,
  USER_REPOSITORY,
} from '../ports';

@Injectable()
export class SendOtpUseCase {
  private readonly logger = new Logger(SendOtpUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @Inject(OTP_SERVICE)
    private readonly otpService: IOtpServicePort,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWorkPort,
  ) {}

  async execute(command: SendOtpCommand): Promise<void> {
    const { email, correlationId } = command;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.logger.warn(
        `OTP dispatch requested for non-existing email: ${email}`,
      );
      return;
    }

    if (user.emailVerified) {
      this.logger.warn(
        `User ${user.id} already verified email: ${email}. Skipping OTP.`,
      );
      return;
    }

    try {
      this.logger.log(`Generating and scheduling OTP for user: ${user.id}`);

      const { code } = await this.otpService.getCode(
        user.email.raw,
        user.id,
        OTP_PURPOSE_KEYS.REGISTRATION,
      );
      const headers = { [METADATA.CORRELATION_ID]: correlationId };

      await this.uow.runInTransaction(async ({ outboxRepository }) => {
        await outboxRepository.create({
          serviceTarget: String(NOTIFICATION_SERVICE),
          pattern: EVENTS.EMAIL.SEND_OTP,
          type: EVENT_TYPES.EMIT,
          payload: {
            email: user.email.raw,
            otpCode: code,
          } as ISendEmailOtpPayload,
          headers,
        });

        await outboxRepository.create({
          serviceTarget: String(NOTIFICATION_SERVICE),
          pattern: EVENTS.SMS.SEND_OTP,
          type: EVENT_TYPES.EMIT,
          payload: {
            number: command.phone || user.phoneNumber || '+380976251837',
            otpCode: code,
          } as ISendSmsOtpPayload,
          headers,
        });
      });

      this.logger.log(
        `OTP entries successfully stored in Outbox for user: ${user.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to store OTP outbox messages for user ${user.id}`,
        (error as Error)?.stack,
      );
      throw error;
    }
  }
}
