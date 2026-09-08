import { HealthController } from '@core/controllers';
import { HealthService } from '@core/services';
import { Module } from '@nestjs/common';
import { TModuleControllers, TModuleProviders } from '@repo/common/types';

const controllers: TModuleControllers = [HealthController];
const services: TModuleProviders = [HealthService];

@Module({
  imports: [],
  controllers: [...controllers],
  providers: [...services],
  exports: [],
})
export class CoreModule {}
