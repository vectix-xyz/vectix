import { Global, Module } from '@nestjs/common';
import { TModuleProviders } from '@repo/common/types';

import { ContextService } from './context.service';

const services: TModuleProviders = [ContextService];

@Global()
@Module({
  providers: [...services],
  exports: [...services],
})
export class ContextModule {}
