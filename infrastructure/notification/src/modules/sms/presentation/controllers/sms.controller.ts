import { Controller, Logger } from '@nestjs/common';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { EVENTS } from '@repo/common/constants';
import { EventPattern } from '@repo/common/decorators';
import type { ISendSmsOtpPayload } from '@repo/common/types';
import { SmsService } from '@sms/application/services';

@Controller('sms')
export class SmsController {
  private readonly logger = new Logger(SmsController.name);

  constructor(private readonly smsService: SmsService) {}

  @EventPattern(EVENTS.SMS.SEND_OTP)
  async handleSendSms(
    @Payload() data: ISendSmsOtpPayload,
    @Ctx() context: RmqContext,
  ) {
    const message = context.getMessage();
    const correlationId =
      message.properties.headers?.['x-correlation-id'] || 'unknown';

    this.logger.log(
      `[Notification Service] [CID: ${correlationId}] Processing OTP sms for: ${data.number}`,
    );

    try {
      await this.smsService.sendVerifyEmailOtp(data.number, data.otpCode);

      this.logger.log(
        `[Notification Service] [CID: ${correlationId}] OTP sms successfully sent to: ${data.number}`,
      );
    } catch (error: any) {
      this.logger.error(
        `[Notification Service] [CID: ${correlationId}] Failed to send OTP via sms to ${data.number}. Error: ${error.message}`,
      );
    }
  }
}
