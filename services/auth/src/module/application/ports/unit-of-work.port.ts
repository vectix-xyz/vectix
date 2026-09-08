import { PORT_KEYS } from '@repo/common/constants';

import { IOutboxRepositoryPort } from './outbox.repository.port';
import { IUserRepositoryPort } from './user.repository.port';

export interface IUnitOfWorkRepositories {
  readonly outboxRepository: IOutboxRepositoryPort;
  readonly userRepository: IUserRepositoryPort;
}

export interface IUnitOfWorkPort {
  /**
   * Виконує callback всередині атомарної транзакції БД.
   * Якщо всередині виникає помилка — транзакція автоматично відкочується.
   */
  runInTransaction<T>(
    work: (repos: IUnitOfWorkRepositories) => Promise<T>,
  ): Promise<T>;
}

export const UNIT_OF_WORK: unique symbol = Symbol(PORT_KEYS.UNIT_OF_WORK);
export type UNIT_OF_WORK = typeof UNIT_OF_WORK;
