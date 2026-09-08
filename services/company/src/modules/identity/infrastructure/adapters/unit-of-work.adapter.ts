import { PrismaService } from '@infrastructure/prisma';
import { Prisma } from '@infrastructure/prisma/client';
import { Inject, Injectable } from '@nestjs/common';

import type {
  ICompanyRepositoryPort,
  IUnitOfWorkPort,
} from '../../application/ports';

import { CompanyRepositoryAdapter } from './company.repository.adapter';

@Injectable()
export class UnitOfWorkAdapter implements IUnitOfWorkPort {
  public companyRepository: ICompanyRepositoryPort;

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService | Prisma.TransactionClient,
  ) {
    this.companyRepository = new CompanyRepositoryAdapter(this.prisma);
  }

  async executeTx<T>(work: (uow: IUnitOfWorkPort) => Promise<T>): Promise<T> {
    if ('$transaction' in this.prisma) {
      return this.prisma.$transaction(async tx => {
        const txUow = new UnitOfWorkAdapter(tx);
        return work(txUow);
      });
    }

    return work(this);
  }
}
