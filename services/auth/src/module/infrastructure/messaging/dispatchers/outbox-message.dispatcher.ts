import {
  IOutboxMessage,
  type IOutboxRepositoryPort,
  OUTBOX_REPOSITORY,
} from '@module/application/ports';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientRMQ,
  RmqRecordBuilder,
} from '@nestjs/microservices';
import {
  COMPANY_SERVICE,
  EVENT_TYPES,
  MESSAGES,
  NOTIFICATION_SERVICE,
} from '@repo/common/constants';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class OutboxMessageDispatcher {
  private readonly logger = new Logger(OutboxMessageDispatcher.name);

  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepository: IOutboxRepositoryPort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
    @Inject(COMPANY_SERVICE)
    private readonly companyClient: ClientProxy,
  ) {}

  async dispatch(message: IOutboxMessage): Promise<void> {
    const client = this.resolveClient(message.serviceTarget) as ClientRMQ;

    if (!client) {
      this.logger.error(`Unknown service target: ${message.serviceTarget}`);
      await this.outboxRepository.markAsFailed(
        message.id,
        MESSAGES.UNKNOWN_SERVICE_TARGET(message.serviceTarget),
        message.retryCount + 1,
        true,
      );
      return;
    }

    try {
      await client.connect();

      const record = new RmqRecordBuilder(message.payload)
        .setOptions({ headers: message.headers ?? {} })
        .build();

      if (message.type === EVENT_TYPES.SEND) {
        await lastValueFrom(
          client.send(message.pattern, record).pipe(timeout(4000)),
        );
      } else if (message.type === EVENT_TYPES.EMIT) {
        await lastValueFrom(
          client.emit(message.pattern, record).pipe(timeout(4000)),
        );
      } else {
        throw new Error(MESSAGES.UNKNOWN_MESSAGE_TYPE(message.type));
      }

      await this.outboxRepository.markAsPublished(message.id);
      this.logger.log(
        `[Outbox] Successfully published [${message.id}] -> Pattern: ${message.pattern} (${message.type})`,
      );
    } catch (error: any) {
      const nextRetry = message.retryCount + 1;
      const isFailed = nextRetry >= message.maxRetries;

      this.logger.error(
        `[Outbox] Delivery failed for message [${message.id}]. Attempt ${nextRetry}/${message.maxRetries}`,
        error?.stack,
      );

      await this.outboxRepository.markAsFailed(
        message.id,
        error?.message || String(error),
        nextRetry,
        isFailed,
      );
    }
  }

  private resolveClient(target: string): ClientProxy | null {
    switch (target) {
      case String(NOTIFICATION_SERVICE):
        return this.notificationClient;
      case String(COMPANY_SERVICE):
        return this.companyClient;
      default:
        return null;
    }
  }
}
