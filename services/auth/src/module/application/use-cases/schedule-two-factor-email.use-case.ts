import {
  type IOutboxRepositoryPort,
  OUTBOX_REPOSITORY,
} from '@module/application/ports';
import { Inject, Injectable } from '@nestjs/common';
import { EVENTS, EVENT_TYPES, NOTIFICATION_SERVICE } from '@repo/common/constants';

import { SendTwoFactorQrCommand, SendTwoFactorTotpCommand } from '../commands';

@Injectable()
export class ScheduleTwoFactorEmailUseCase {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepository: IOutboxRepositoryPort,
  ) {}

  async scheduleQr(command: SendTwoFactorQrCommand): Promise<void> {
    await this.outboxRepository.create({
      pattern: EVENTS.EMAIL.SEND_2FA_QR,
      serviceTarget: String(NOTIFICATION_SERVICE),
      type: EVENT_TYPES.EMIT,
      payload: {
        userId: command.userId,
        email: command.email,
        totpUri: command.totpUri,
        backupCodes: command.backupCodes ?? [],
      },
      headers: {
        timestamp: Date.now(),
      },
    });
  }

  async scheduleTotp(command: SendTwoFactorTotpCommand): Promise<void> {
    await this.outboxRepository.create({
      pattern: EVENTS.EMAIL.SEND_2FA_TOTP,
      serviceTarget: String(NOTIFICATION_SERVICE),
      type: EVENT_TYPES.EMIT,
      payload: {
        userId: command.userId,
        email: command.email,
        totp: command.totp,
      },
      headers: {
        timestamp: Date.now(),
      },
    });
  }
}
