import { Injectable } from '@nestjs/common';
import { OTP_PURPOSE_KEYS, REDIS_KEYS } from '@repo/common/constants';
import { createHash } from 'node:crypto';
import { generateCode } from 'patcode';

import { RedisService } from '../redis';

import {
  OtpInvalidCodeError,
  OtpLimitError,
  OtpThrottleError,
} from './otp.exception';
import { IOtpSessionData, TOtpPurpose } from '@repo/common/types';

@Injectable()
export class OtpService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly OTP_TTL = 300;
  private readonly RESEND_COOLDOWN = 60;

  constructor(private readonly redisService: RedisService) {}

  async getCode(
    email: string,
    userId?: string,
    purpose: TOtpPurpose = OTP_PURPOSE_KEYS.REGISTRATION,
  ): Promise<{ code: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    const otpKey = REDIS_KEYS.OTP.BASE(normalizedEmail);
    const attemptsKey = REDIS_KEYS.OTP.ATTEMPTS(normalizedEmail);

    const ttl = await this.redisService.ttl(otpKey);
    if (ttl > this.OTP_TTL - this.RESEND_COOLDOWN) {
      throw new OtpThrottleError();
    }

    const { code, hash } = this.generateCode();

    const payload: IOtpSessionData = {
      hash,
      userId,
      purpose,
      createdAt: Date.now(),
    };

    await this.redisService.set(otpKey, JSON.stringify(payload), 'EX', this.OTP_TTL);
    await this.redisService.del(attemptsKey);

    return { code };
  }

  async verify(email: string, code: string | number): Promise<IOtpSessionData> {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = String(code).trim();

    const otpKey = REDIS_KEYS.OTP.BASE(email);
    const attemptsKey = REDIS_KEYS.OTP.ATTEMPTS(email);

    const attempts = await this.redisService.get(attemptsKey);
    if (attempts && parseInt(attempts) >= this.MAX_ATTEMPTS) {
      throw new OtpLimitError();
    }

    const rawData = await this.redisService.get(otpKey);
    if (!rawData) {
      throw new OtpInvalidCodeError();
    }

    let sessionData: IOtpSessionData;
    try {
      sessionData = rawData.startsWith('{')
        ? (JSON.parse(rawData) as IOtpSessionData)
        : { hash: rawData, purpose: OTP_PURPOSE_KEYS.REGISTRATION, createdAt: Date.now() };
    } catch {
      throw new OtpInvalidCodeError();
    }

    const incomingHash = createHash('sha256').update(normalizedCode).digest('hex');

    if (sessionData.hash !== incomingHash) {
      const currentAttempts = await this.redisService.incr(attemptsKey);
      if (currentAttempts === 1) {
        await this.redisService.expire(attemptsKey, this.OTP_TTL);
      }

      const attemptsLeft = this.MAX_ATTEMPTS - currentAttempts;
      if (attemptsLeft === 0) {
        await this.redisService.del(otpKey);
        throw new OtpLimitError();
      }

      throw new OtpInvalidCodeError();
    }

    await this.redisService.del(otpKey);
    await this.redisService.del(attemptsKey);

    return sessionData;
  }

  private generateCode() {
    const code = generateCode();
    const hash = createHash('sha256').update(code).digest('hex');

    return { code, hash };
  }
}
