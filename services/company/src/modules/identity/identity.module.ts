import { Module } from '@nestjs/common';
import { TModuleControllers, TModuleProviders } from '@repo/common/types';

import { UNIT_OF_WORK } from './application/ports';
import { CompanyUseCase } from './application/use-cases';
import { UnitOfWorkAdapter } from './infrastructure/adapters';
import { CompanyController } from './presentation/controllers';

const controllers: TModuleControllers = [CompanyController];
const useCases: TModuleProviders = [CompanyUseCase];
const adapters: TModuleProviders = [
  { provide: UNIT_OF_WORK, useClass: UnitOfWorkAdapter },
];

@Module({
  controllers: [...controllers],
  providers: [...useCases, ...adapters],
})
export class IdentityModule {}
