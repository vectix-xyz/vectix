import { Module } from '@nestjs/common';
import { TModuleControllers, TModuleProviders } from '@repo/common/types';

const controllers: TModuleControllers = [];
const services: TModuleProviders = [];

@Module({
  controllers: [...controllers],
  providers: [...services],
})
export class CoreModule {}
