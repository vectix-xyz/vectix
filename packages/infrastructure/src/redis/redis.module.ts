import { Global, Module } from '@nestjs/common';
import { TModuleProviders } from '@repo/common/types';

import { RedisService } from './redis.service';

const services: TModuleProviders = [RedisService];

@Global()
@Module({
  providers: [...services],
  exports: [...services],
})
export class RedisModule {}
