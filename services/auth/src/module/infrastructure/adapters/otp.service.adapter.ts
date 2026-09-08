import type { IOtpServicePort } from '@module/application/ports';
import { Injectable } from '@nestjs/common';
import { OTP_PURPOSE_KEYS } from '@repo/common/constants';
import { IOtpSessionData, TOtpPurpose } from '@repo/common/types';
import { OtpService } from '@repo/infrastructure/otp';

@Injectable()
export class OtpServiceAdapter implements IOtpServicePort {
  constructor(private readonly otpService: OtpService) {}

  async getCode(
    email: string,
    userId?: string,
    purpose: TOtpPurpose = OTP_PURPOSE_KEYS.REGISTRATION,
  ): Promise<{ code: string }> {
    return await this.otpService.getCode(email, userId, purpose);
  }

  async verify(email: string, code: string): Promise<IOtpSessionData> {
    return await this.otpService.verify(email, code);
  }
}
