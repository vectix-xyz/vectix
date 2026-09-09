import { Global, Module } from '@nestjs/common';
import { TModuleProviders } from '@repo/common/types';

import { PhoneVerificationRepositoryAdapter } from './phone-verification.repository.adapter';
import { PHONE_VERIFICATION_REPOSITORY } from './phone-verification.repository.port';
import { PhoneVerificationStorage } from './phone-verification.storage';
import { TelegramAuthBotService } from './telegram-auth-bot.service';
import { VerifyPhoneTelegramUseCase } from './verify-phone-telegram.use-case';

const services: TModuleProviders = [
  PhoneVerificationStorage,
  TelegramAuthBotService,
  VerifyPhoneTelegramUseCase,
  {
    provide: PHONE_VERIFICATION_REPOSITORY,
    useClass: PhoneVerificationRepositoryAdapter,
  },
];

@Global()
@Module({
  imports: [],
  providers: [...services],
  exports: [...services],
})
export class TelegramModule {}
