import { Module } from '@nestjs/common';
import { TModuleControllers, TModuleProviders } from '@repo/common/types';

import { MAIL_PROVIDER } from './application/ports';
import { MailService } from './application/services';
import { MailProviderAdapter } from './presentation/adapters';
import { MailController } from './presentation/controllers';

const controllers: TModuleControllers = [MailController];
const services: TModuleProviders = [MailService];
const providers: TModuleProviders = [
  { provide: MAIL_PROVIDER, useClass: MailProviderAdapter },
];

@Module({
  controllers: [...controllers],
  providers: [...providers, ...services],
  exports: [...providers, ...services],
})
export class MailModule {}
