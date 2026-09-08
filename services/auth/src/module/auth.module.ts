import { Module } from '@nestjs/common';
import { TModuleProviders } from '@repo/common/types';

import {
  COMPANY_SERVICE,
  OTP_SERVICE,
  OUTBOX_REPOSITORY,
  UNIT_OF_WORK,
  USER_REPOSITORY,
  TWO_FACTOR_NOTIFICATION,
} from './application/ports';
import { CompanyRegistrationSaga } from './application/sagas';
import {
  CheckCanVerifyTwoFactorUseCase,
  RegisterUseCase,
  ScheduleTwoFactorEmailUseCase,
  SendOtpUseCase,
} from './application/use-cases';
import {
  CompanyServiceAdapter,
  OtpServiceAdapter,
  OutboxRepositoryAdapter,
  TwoFactorNotificationAdapter,
  UnitOfWorkAdapter,
  UserRepositoryAdapter,
} from './infrastructure/adapters';
import { OutboxMessageDispatcher } from './infrastructure/messaging/dispatchers';
import { UserRegisteredListener } from './infrastructure/messaging/listeners';
import { OutboxProcessor } from './infrastructure/messaging/processors';
import { AuthHook } from './presentation/hooks';
import { TwoFactorHook } from './presentation/hooks/two-factor.hook';

const hooks: TModuleProviders = [AuthHook, TwoFactorHook];
const useCases: TModuleProviders = [
  RegisterUseCase,
  SendOtpUseCase,
  ScheduleTwoFactorEmailUseCase,
  CheckCanVerifyTwoFactorUseCase
];
const sagas: TModuleProviders = [CompanyRegistrationSaga];
const listeners: TModuleProviders = [UserRegisteredListener];
const processors: TModuleProviders = [OutboxProcessor];
const dispatcher: TModuleProviders = [OutboxMessageDispatcher];

const adapters: TModuleProviders = [
  { provide: USER_REPOSITORY, useClass: UserRepositoryAdapter },
  { provide: OTP_SERVICE, useClass: OtpServiceAdapter },
  { provide: COMPANY_SERVICE, useClass: CompanyServiceAdapter },
  { provide: OUTBOX_REPOSITORY, useClass: OutboxRepositoryAdapter },
  { provide: TWO_FACTOR_NOTIFICATION, useClass: TwoFactorNotificationAdapter },
  { provide: UNIT_OF_WORK, useClass: UnitOfWorkAdapter },
];

@Module({
  imports: [],
  controllers: [],
  providers: [
    ...hooks,
    ...useCases,
    ...sagas,
    ...listeners,
    ...processors,
    ...dispatcher,
    ...adapters,
  ],
  exports: [...hooks, ...useCases],
})
export class AuthModule {}
