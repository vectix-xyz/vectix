import {
  type IOutboxRepositoryPort,
  OUTBOX_REPOSITORY,
} from '@module/application/ports';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  EVENT_TYPES,
  EVENTS,
  NOTIFICATION_SERVICE,
} from '@repo/common/constants';

import { NotifyExistingUserSignUpAttemptCommand } from '../commands';

@Injectable()
export class NotifyExistingUserSignUpAttemptUseCase {
  private readonly logger = new Logger(
    NotifyExistingUserSignUpAttemptUseCase.name,
  );

  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepository: IOutboxRepositoryPort,
  ) {}

  async execute(
    command: NotifyExistingUserSignUpAttemptCommand,
  ): Promise<void> {
    this.logger.warn(
      `Sign-up attempt detected for already registered email: ${command.email}`,
    );

    await this.outboxRepository.create({
      pattern: EVENTS.EMAIL.SEND_EXISTING_USER_SIGNUP_ALERT,
      serviceTarget: String(NOTIFICATION_SERVICE),
      type: EVENT_TYPES.EMIT,
      payload: {
        userId: command.userId,
        email: command.email,
        attemptedAt: new Date().toISOString(),
      },
      headers: {
        timestamp: Date.now(),
      },
    });
  }
}
