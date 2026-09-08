import { PrismaService } from '@infrastructure/prisma';
import {
  IUnitOfWorkPort,
  IUnitOfWorkRepositories,
} from '@module/application/ports';
import { Injectable } from '@nestjs/common';

import { OutboxRepositoryAdapter } from './outbox.repository.adapter';
import { UserRepositoryAdapter } from './user.repository.adapter';

@Injectable()
export class UnitOfWorkAdapter implements IUnitOfWorkPort {
  constructor(private readonly prisma: PrismaService) {}

  async runInTransaction<T>(
    work: (repos: IUnitOfWorkRepositories) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async tx => {
      const transactionalRepositories: IUnitOfWorkRepositories = {
        outboxRepository: OutboxRepositoryAdapter.withTransaction(tx),
        userRepository: UserRepositoryAdapter.withTransaction(tx),
      };

      return work(transactionalRepositories);
    });
  }
}
