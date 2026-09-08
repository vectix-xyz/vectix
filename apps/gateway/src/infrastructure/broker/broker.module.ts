import { Global, Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { brokerEnvConfig } from '@repo/common/configs';
import {
  COMPANY_SERVICE,
  NOTIFICATION_SERVICE,
  QUEUES,
} from '@repo/common/constants';
import { TModuleDynamic, TModuleProviders } from '@repo/common/types';

import { BrokerService } from './broker.service';

const brokers: TModuleDynamic = [
  ClientsModule.registerAsync([
    {
      name: COMPANY_SERVICE,
      inject: [brokerEnvConfig.KEY],
      useFactory: (config: ConfigType<typeof brokerEnvConfig>) => ({
        transport: Transport.RMQ,
        options: {
          urls: [config.queue.rabbitMq.url],
          queue: QUEUES.COMPANY,
          queueOptions: {
            durable: true,
          },
        },
      }),
    },
  ]),
  ClientsModule.registerAsync([
    {
      name: NOTIFICATION_SERVICE,
      inject: [brokerEnvConfig.KEY],
      useFactory: (config: ConfigType<typeof brokerEnvConfig>) => ({
        transport: Transport.RMQ,
        options: {
          urls: [config.queue.rabbitMq.url],
          queue: QUEUES.NOTIFICATION,
          queueOptions: {
            durable: true,
          },
        },
      }),
    },
  ]),
];
const services: TModuleProviders = [BrokerService];

@Global()
@Module({
  imports: [...brokers],
  providers: [...services],
  exports: [...brokers, ...services],
})
export class BrokerModule {}
