import { Module } from '@nestjs/common';
import { TModuleProviders } from '@repo/common/types';

import {
  ADMIN_REPOSITORY,
  COMPANY_SERVICE,
  OTP_SERVICE,
  OUTBOX_REPOSITORY,
  TWO_FACTOR_NOTIFICATION,
  UNIT_OF_WORK,
  USER_REPOSITORY,
} from './application/ports';
import { CompanyRegistrationSaga } from './application/sagas';
import {
  CheckCanVerifyTwoFactorUseCase,
  EnsureAdminProfileUseCase,
  NotifyExistingUserSignUpAttemptUseCase,
  RegisterUseCase,
  ScheduleTwoFactorEmailUseCase,
  SendOtpUseCase,
} from './application/use-cases';
import {
  AdminRepositoryAdapter,
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
import {
  RegisterHook,
  TwoFactorHook,
  UserCreateDatabaseHook,
} from './presentation/hooks';

const hooks: TModuleProviders = [
  UserCreateDatabaseHook,
  RegisterHook,
  TwoFactorHook,
];
const useCases: TModuleProviders = [
  RegisterUseCase,
  SendOtpUseCase,
  ScheduleTwoFactorEmailUseCase,
  CheckCanVerifyTwoFactorUseCase,
  EnsureAdminProfileUseCase,
  NotifyExistingUserSignUpAttemptUseCase,
];
const sagas: TModuleProviders = [CompanyRegistrationSaga];
const listeners: TModuleProviders = [UserRegisteredListener];
const processors: TModuleProviders = [OutboxProcessor];
const dispatcher: TModuleProviders = [OutboxMessageDispatcher];

const repositories: TModuleProviders = [
  { provide: USER_REPOSITORY, useClass: UserRepositoryAdapter },
  { provide: ADMIN_REPOSITORY, useClass: AdminRepositoryAdapter },
  { provide: OUTBOX_REPOSITORY, useClass: OutboxRepositoryAdapter },
];
const services: TModuleProviders = [
  { provide: OTP_SERVICE, useClass: OtpServiceAdapter },
  { provide: COMPANY_SERVICE, useClass: CompanyServiceAdapter },
];
const adapters: TModuleProviders = [
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
    ...repositories,
    ...services,
    ...adapters,
  ],
  exports: [...hooks, ...useCases],
})
export class AuthModule {}
