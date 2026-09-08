import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { notificationEnvConfig } from '@repo/common/configs';
import type { ISmsProviderPort } from '@sms/application/ports';
import twilio from 'twilio';

@Injectable()
export class SmsProviderAdapter implements ISmsProviderPort {
  private client: twilio.Twilio;
  private fromNumber: string;
  private readonly logger = new Logger(SmsProviderAdapter.name + ' | Twilio');

  constructor(
    @Inject(notificationEnvConfig.KEY)
    private readonly env: ConfigType<typeof notificationEnvConfig>,
  ) {
    const accountSid = this.env.twilio.accountSid;
    const authToken = this.env.twilio.authToken;
    this.fromNumber = this.env.twilio.phoneNumber;

    this.client = twilio(accountSid, authToken);
  }

  async send({ to, body }: { to: string; body: string }): Promise<void> {
    try {
      const message = await this.client.messages.create({
        body,
        from: this.fromNumber,
        to,
      });
      this.logger.log(
        `Twilio SMS sent to ${to} with body: ${body}. Message SID: ${message.sid}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to send SMS to ${to} with body: ${body}. Error: ${errorMessage}`,
      );
      throw new InternalServerErrorException(
        `Failed to send SMS: ${errorMessage}`,
      );
    }
  }
}
