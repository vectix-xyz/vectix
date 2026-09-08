import { CoreModule } from '@core/core.module';
import { IdentityModule } from '@identity/identity.module';
import { PrismaModule } from '@infrastructure/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { brokerEnvConfig, databaseEnvConfig } from '@repo/common/configs';
import { TModuleImports, TModuleProviders } from '@repo/common/types';
import { RedisModule } from '@repo/infrastructure/redis';

const infrastructure: TModuleImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [brokerEnvConfig, databaseEnvConfig],
  }),
  PrismaModule,
  RedisModule,
];
const lib: TModuleImports = [];
const modules: TModuleImports = [CoreModule, IdentityModule];
const guards: TModuleProviders = [];

@Module({
  imports: [...infrastructure, ...lib, ...modules],
  providers: [...guards],
})
export class AppModule {}
