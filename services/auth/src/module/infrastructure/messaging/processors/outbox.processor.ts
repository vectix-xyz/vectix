import {
  type IOutboxRepositoryPort,
  OUTBOX_REPOSITORY,
} from '@module/application/ports';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OutboxMessageDispatcher } from '../dispatchers';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepository: IOutboxRepositoryPort,
    private readonly dispatcher: OutboxMessageDispatcher,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleOutboxMessages(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingMessages = await this.outboxRepository.findPendingMessages(
        50,
        3,
      );

      if (pendingMessages.length === 0) return;

      this.logger.log(
        `Found ${pendingMessages.length} pending outbox message(s) to publish`,
      );

      for (const message of pendingMessages) {
        await this.dispatcher.dispatch(message);
      }
    } catch (error) {
      this.logger.error(
        'Error during Outbox polling loop',
        (error as Error)?.stack,
      );
    } finally {
      this.isProcessing = false;
    }
  }
}
