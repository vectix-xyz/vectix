import { Injectable } from '@nestjs/common';
import { RedisService } from '@repo/infrastructure/redis';

@Injectable()
export class RedisStorage {
  constructor(private readonly redis: RedisService) {}

  toSecondaryStorage() {
    return {
      get: async (key: string) => { return await this.redis.get(key) },
      set: async (key: string, value: string, ttl?: number) =>
        ttl
          ? await this.redis.set(key, value, 'EX', ttl)
          : await this.redis.set(key, value),
      delete: async (key: string) => { await this.redis.del(key) },
      getAndDelete: async (key: string) => {
        const val = await this.redis.get(key);
        if (val) await this.redis.del(key);
        return val;
      },
			increment: async (key: string, ttl: number) => {
        const postIncrementValue = await this.redis.incr(key);

        if (postIncrementValue === 1) {
          await this.redis.expire(key, ttl);
        }

        return postIncrementValue;
      },
    };
  }
}
