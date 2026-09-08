import { Inject, Injectable } from '@nestjs/common';
import { type ISmsProviderPort, SMS_PROVIDER } from '@sms/application/ports';

@Injectable()
export class SmsService {
  constructor(
    @Inject(SMS_PROVIDER)
    private readonly smsProvider: ISmsProviderPort,
  ) {}

  async sendVerifyEmailOtp(number: string, otpCode: string): Promise<void> {
    await this.smsProvider.send({ to: number, body: 'Your code: ' + otpCode });
  }
}
