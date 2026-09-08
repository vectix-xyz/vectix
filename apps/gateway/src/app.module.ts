import { CoreModule } from '@core/core.module';
import { GatewaySessionGuard } from '@core/guards';
import { BrokerModule } from '@infrastructure/broker';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import {
  brokerEnvConfig,
  commonEnvConfig,
  databaseEnvConfig,
} from '@repo/common/configs';
import {
  ENV_KEYS,
  GATEWAY_TRPC_API_PREFIX,
  JWT_KEYS,
} from '@repo/common/constants';
import { TModuleImports, TModuleProviders } from '@repo/common/types';
import { loadKeyFile } from '@repo/common/utils';
import { ContextModule } from '@repo/infrastructure/context';
import { OtpModule } from '@repo/infrastructure/otp';
import { RedisModule } from '@repo/infrastructure/redis';
import { TRPCModule } from 'nestjs-trpc';

const imports: TModuleImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [commonEnvConfig, databaseEnvConfig, brokerEnvConfig],
  }),
  JwtModule.registerAsync({
    global: true,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const keyPath =
        config.get<string>(ENV_KEYS.GATEWAY.PRIVATE) ||
        'certs/gateway_private.pem';
      const privateKey = loadKeyFile(keyPath);

      return {
        privateKey,
        signOptions: {
          algorithm: JWT_KEYS.ALGORITHMS.RS256,
          expiresIn: JWT_KEYS.EXPIRES_IN.TEN_SECONDS,
          issuer: JWT_KEYS.ISSUERS.GATEWAY,
          audience: JWT_KEYS.AUDIENCES.INTERNAL_SERVICES,
        },
      };
    },
  }),
  TRPCModule.forRoot({ basePath: GATEWAY_TRPC_API_PREFIX }),
];
const infrastructure: TModuleImports = [
  ContextModule,
  RedisModule,
  BrokerModule,
  OtpModule,
];
const lib: TModuleImports = [];
const modules: TModuleImports = [CoreModule];
const guards: TModuleProviders = [
  { provide: APP_GUARD, useClass: GatewaySessionGuard },
];

@Module({
  imports: [...imports, ...infrastructure, ...lib, ...modules],
  providers: [...guards],
})
export class AppModule {}
