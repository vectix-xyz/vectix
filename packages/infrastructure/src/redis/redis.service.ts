import {
  Inject,
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { brokerEnvConfig } from '@repo/common/configs';
import Redis from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(brokerEnvConfig.KEY)
    env: ConfigType<typeof brokerEnvConfig>,
  ) {
    super({
      username: env.cache.redis.user,
      password: env.cache.redis.password,
      host: env.cache.redis.host,
      port: env.cache.redis.port,
      maxRetriesPerRequest: 5,
      enableOfflineQueue: true,
    });
  }

  onModuleInit() {
    const start = Date.now();

    this.logger.log('\x1b[41mInitializing Redis connection...\x1b[0m');

    this.on('connect', () => {
      this.logger.log('\x1b[41mRedis connecting...\x1b[0m');
    });

    this.on('ready', () => {
      const ms = Date.now() - start;
      this.logger.log(`\x1b[41mRedis connected (time=${ms}ms)\x1b[0m`);
    });

    this.on('error', (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error('\x1b[41mRedis error\x1b[0m', {
        error: errorMessage,
      });
    });

    this.on('close', () => {
      this.logger.warn('\x1b[41mRedis connection closed\x1b[0m');
    });

    this.on('reconnecting', () => {
      this.logger.log('\x1b[41mRedis reconnecting...\x1b[0m');
    });
  }

  async onModuleDestroy() {
    this.logger.log('\x1b[41mClosing redis connection...\x1b[0m');

    try {
      await this.quit();

      this.logger.log('\x1b[41mRedis connection closed\x1b[0m');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error('\x1b[41mError closing Redis connection: \x1b[0m', {
        error: errorMessage,
      });
    }
  }
}
