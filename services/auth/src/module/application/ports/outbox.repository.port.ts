import { PORT_KEYS } from '@repo/common/constants';
import { OutboxStatus, OutboxTransportType } from '@repo/common/enums';

export interface IOutboxMessage {
  id: string;
  pattern: string;
  serviceTarget: string;
  type: OutboxTransportType;
  payload: Record<string, any>;
  headers?: Record<string, any> | null;
  status: OutboxStatus;
  retryCount: number;
  maxRetries: number;
  lastError?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOutboxRecordDto {
  pattern: string;
  serviceTarget: string;
  type?: OutboxTransportType;
  payload: Record<string, any>;
  headers?: Record<string, any>;
}

export interface IOutboxRepositoryPort {
  create(data: ICreateOutboxRecordDto): Promise<void>;
  findPendingMessages(
    limit?: number,
    maxRetries?: number,
  ): Promise<IOutboxMessage[]>;
  markAsProcessing(id: string): Promise<void>;
  markAsPublished(id: string): Promise<void>;
  markAsFailed(
    id: string,
    error: string,
    nextRetryCount: number,
    isFinalFailure: boolean,
  ): Promise<void>;
}

export const OUTBOX_REPOSITORY: unique symbol = Symbol(
  PORT_KEYS.REPOSITORY.OUTBOX,
);
export type OUTBOX_REPOSITORY = typeof OUTBOX_REPOSITORY;
