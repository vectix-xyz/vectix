import { Injectable } from '@nestjs/common';
import {
  PHONE_VERIFICATION_STATUS,
  PHONE_VERIFY_REDIS_PREFIX,
} from '@repo/common/constants';
import { RedisService } from '@repo/infrastructure/redis';

export type TPhoneVerificationStatus =
  (typeof PHONE_VERIFICATION_STATUS)[keyof typeof PHONE_VERIFICATION_STATUS];
export interface IPhoneVerificationSession {
  userId: string;
  targetPhone: string;
  status: Exclude<TPhoneVerificationStatus, typeof PHONE_VERIFICATION_STATUS.EXPIRED>;
  verifiedAt?: string;
}

@Injectable()
export class PhoneVerificationStorage {
  private readonly PREFIX_TOKEN = `${PHONE_VERIFY_REDIS_PREFIX}tk:`;
  private readonly PREFIX_TG_MAP = `${PHONE_VERIFY_REDIS_PREFIX}tg:`;
  private readonly TTL_SECONDS = 600;
  private readonly VERIFIED_GRACE_TTL_SECONDS = 60;

  constructor(private readonly redis: RedisService) {}

  async createSession(
    token: string,
    data: { userId: string; targetPhone: string },
  ): Promise<void> {
    const session: IPhoneVerificationSession = {
      userId: data.userId,
      targetPhone: data.targetPhone,
      status: PHONE_VERIFICATION_STATUS.PENDING,
    };
    await this.redis.set(
      this.PREFIX_TOKEN + token,
      JSON.stringify(session),
      'EX',
      this.TTL_SECONDS,
    );
  }

  async getSession(token: string): Promise<IPhoneVerificationSession | null> {
    const raw = await this.redis.get(this.PREFIX_TOKEN + token);
    return raw ? JSON.parse(raw) : null;
  }

	async bindTelegramUserToToken(tgUserId: number, token: string): Promise<void> {
    await this.redis.set(
      this.PREFIX_TG_MAP + tgUserId,
      token,
      'EX',
      this.TTL_SECONDS,
    );
  }

  async getTokenByTelegramUser(tgUserId: number): Promise<string | null> {
    return await this.redis.get(this.PREFIX_TG_MAP + tgUserId);
  }

  async markVerified(token: string, tgUserId?: number): Promise<void> {
    const session = await this.getSession(token);
    if (!session) return;

    session.status = PHONE_VERIFICATION_STATUS.VERIFIED;
    session.verifiedAt = new Date().toISOString();

    await this.redis.set(
      this.PREFIX_TOKEN + token,
      JSON.stringify(session),
      'EX',
      180,
    );

    if (tgUserId) {
      await this.deleteTelegramUserMapping(tgUserId);
    }
  }

  async deleteTelegramUserMapping(tgUserId: number): Promise<void> {
    await this.redis.del(this.PREFIX_TG_MAP + tgUserId);
  }

  async deleteSession(token: string): Promise<void> {
    await this.redis.del(this.PREFIX_TOKEN + token);
  }
}
