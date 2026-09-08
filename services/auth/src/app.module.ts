import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import {
  authEnvConfig,
  brokerEnvConfig,
  commonEnvConfig,
  databaseEnvConfig,
  httpEnvConfig,
} from '@repo/common/configs';
import { ENV_KEYS, JWT_KEYS } from '@repo/common/constants';
import { TModuleImports, TModuleProviders } from '@repo/common/types';
import { loadKeyFile } from '@repo/common/utils';
import { OtpModule } from '@repo/infrastructure/otp';
import { RedisModule, RedisService } from '@repo/infrastructure/redis';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { CoreModule } from './core/core.module';
import { createAuth } from './core/lib';
import { BrokerModule } from './infrastructure/broker';
import { DocsModule } from './infrastructure/docs';
import { PrismaModule, PrismaService } from './infrastructure/prisma';
import { AuthModule } from './module/auth.module';
import { InternalGatewayGuard } from './core/guards';

const imports: TModuleImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [
      commonEnvConfig,
      httpEnvConfig,
      brokerEnvConfig,
      databaseEnvConfig,
      authEnvConfig,
    ],
  }),
  JwtModule.registerAsync({
    global: true,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const keyPath =
        config.get<string>(ENV_KEYS.GATEWAY.PUBLIC) ||
        'certs/gateway_public.pem';
      const publicKey = loadKeyFile(keyPath);

      return {
        publicKey,
        verifyOptions: {
          algorithms: [JWT_KEYS.ALGORITHMS.RS256],
          issuer: JWT_KEYS.ISSUERS.GATEWAY,
          audience: JWT_KEYS.AUDIENCES.INTERNAL_SERVICES,
        },
      };
    },
  }),
  EventEmitterModule.forRoot({
    wildcard: false,
    delimiter: '.',
  }),
  ScheduleModule.forRoot(),
];
const infrastructure: TModuleImports = [
  PrismaModule,
  RedisModule,
  BrokerModule,
  OtpModule,
  DocsModule,
];

const lib: TModuleImports = [
  BetterAuthModule.forRootAsync({
    useFactory: (
      prismaService: PrismaService,
      redisService: RedisService,
      moduleRef: ModuleRef,
      commonEnv: ConfigType<typeof commonEnvConfig>,
      httpEnv: ConfigType<typeof httpEnvConfig>,
      authEnv: ConfigType<typeof authEnvConfig>,
    ) => ({
      auth: createAuth(
        prismaService,
        redisService,
        moduleRef,
        commonEnv,
        httpEnv,
        authEnv,
      ),
      disableTrustedOriginsCors: true,
    }),
    inject: [
      PrismaService,
      RedisService,
      ModuleRef,
      commonEnvConfig.KEY,
      httpEnvConfig.KEY,
      authEnvConfig.KEY,
    ],
  }),
];

const modules: TModuleImports = [CoreModule, AuthModule];
const guards: TModuleProviders = [
  // { provide: APP_GUARD, useClass: InternalGatewayGuard },
];
@Module({
  imports: [...imports, ...infrastructure, ...lib, ...modules],
  providers: [...guards],
})
export class AppModule {}
