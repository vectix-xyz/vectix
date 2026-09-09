import { Global, Module } from '@nestjs/common';
import { TModuleProviders } from '@repo/common/types';

import { AdminAccessService } from './admin-access.service';
import { RedisStorage } from './redis.storage';

const services: TModuleProviders = [AdminAccessService, RedisStorage];

@Global()
@Module({
  imports: [],
  providers: [...services],
  exports: [...services],
})
export class BetterAuthAdditionalModule {}
