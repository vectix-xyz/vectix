import { PrismaService } from '@infrastructure/prisma';
import { OutboxMessage, Prisma } from '@infrastructure/prisma/client';
import {
  ICreateOutboxRecordDto,
  IOutboxMessage,
  IOutboxRepositoryPort,
} from '@module/application/ports';
import { Injectable, Optional } from '@nestjs/common';
import { EVENT_TYPES } from '@repo/common/constants';
import { OutboxStatus } from '@repo/common/enums';

import { OutboxMapper } from '../mappers';

type PrismaClientType = PrismaService | Prisma.TransactionClient;

@Injectable()
export class OutboxRepositoryAdapter implements IOutboxRepositoryPort {
  private readonly client!: PrismaClientType;

  constructor(@Optional() prisma?: PrismaService) {
    if (prisma) {
      this.client = prisma;
    }
  }

  static withTransaction(
    tx: Prisma.TransactionClient,
  ): OutboxRepositoryAdapter {
    const adapter = new OutboxRepositoryAdapter();
    (adapter as any).client = tx;
    return adapter;
  }

  async create(data: ICreateOutboxRecordDto): Promise<void> {
    await this.client.outboxMessage.create({
      data: {
        pattern: data.pattern,
        serviceTarget: data.serviceTarget,
        type: data.type ?? EVENT_TYPES.EMIT,
        payload: data.payload,
        headers: data.headers ?? {},
      },
    });
  }

  async findPendingMessages(
    limit: number = 50,
    maxRetries: number = 3,
  ): Promise<IOutboxMessage[]> {
    const rawMessages = await this.client.$queryRaw<OutboxMessage[]>
    `
      UPDATE "outbox_messages"
      SET "status" = ${OutboxStatus.PROCESSING}::"OutboxStatus", "updated_at" = NOW()
      WHERE "id" IN (
        SELECT "id" FROM "outbox_messages"
        WHERE "status" = ${OutboxStatus.PENDING}::"OutboxStatus" AND "retry_count" < ${maxRetries}
        ORDER BY "created_at" ASC
        LIMIT ${limit}
        FOR UPDATE SKIP LOCKED
      )
      RETURNING
        "id",
        "pattern",
        "service_target" AS "serviceTarget",
        "type",
        "payload",
        "headers",
        "status",
        "retry_count" AS "retryCount",
        "max_retries" AS "maxRetries",
        "last_error" AS "lastError",
        "created_at" AS "createdAt",
        "updated_at" AS "updatedAt";
    `;

    return rawMessages.map(OutboxMapper.toDomain);
  }

  async markAsProcessing(id: string): Promise<void> {
    await this.client.outboxMessage.update({
      where: { id },
      data: { status: OutboxStatus.PROCESSING },
    });
  }

  async markAsPublished(id: string): Promise<void> {
    await this.client.outboxMessage.update({
      where: { id },
      data: {
        status: OutboxStatus.PUBLISHED,
        lastError: null,
      },
    });
  }

  async markAsFailed(
    id: string,
    error: string,
    nextRetryCount: number,
    isFinalFailure: boolean,
  ): Promise<void> {
    await this.client.outboxMessage.update({
      where: { id },
      data: {
        status: isFinalFailure ? OutboxStatus.FAILED : OutboxStatus.PENDING,
        retryCount: nextRetryCount,
        lastError: error,
      },
    });
  }
}
