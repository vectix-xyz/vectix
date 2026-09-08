import {
  Inject,
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { databaseEnvConfig } from '@repo/common/configs';
import { ENV_KEYS } from '@repo/common/constants';

import { PrismaClient } from './client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(
    @Inject(databaseEnvConfig.KEY)
    env: ConfigType<typeof databaseEnvConfig>,
  ) {
    const DB_URL = env.postgres.url;
    const adapter = new PrismaPg(DB_URL);

    super({ adapter });
  }

  async onModuleInit() {
    const start = Date.now();

    this.logger.log('Connecting to database...');

    try {
      await this.$connect();
      const ms = Date.now() - start;

      this.logger.log(`Database connection established (time=${ms}ms)`);
    } catch (error) {
      this.logger.error('Failed to connect to database: ', error);

      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');

    try {
      await this.$disconnect();
      this.logger.log('Database connection closed');
    } catch (error) {
      this.logger.error('Failed to disconnect from database: ', error);

      throw error;
    }
  }
}
