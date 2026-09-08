import { Global, Module } from '@nestjs/common';
import { TModuleProviders } from '@repo/common/types';

import { PrismaService } from './prisma.service';

const services: TModuleProviders = [PrismaService];

@Global()
@Module({
  providers: [...services],
  exports: [...services],
})
export class PrismaModule {}
