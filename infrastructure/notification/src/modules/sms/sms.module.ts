import { Module } from '@nestjs/common';
import { TModuleControllers, TModuleProviders } from '@repo/common/types';

import { SMS_PROVIDER } from './application/ports';
import { SmsService } from './application/services';
import { SmsProviderAdapter } from './presentation/adapters';
import { SmsController } from './presentation/controllers';

const controllers: TModuleControllers = [SmsController];
const services: TModuleProviders = [SmsService];
const providers: TModuleProviders = [
  { provide: SMS_PROVIDER, useClass: SmsProviderAdapter },
];

@Module({
  controllers: [...controllers],
  providers: [...providers, ...services],
  exports: [...providers, ...services],
})
export class SmsModule {}
