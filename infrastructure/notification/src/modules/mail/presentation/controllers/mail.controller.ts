import { MailService } from '@mail/application/services';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { EVENTS, METADATA } from '@repo/common/constants';
import { EventPattern } from '@repo/common/decorators';
import type {
  ISendEmailOtpPayload,
  ISendTwoFactorQrPayload,
} from '@repo/common/types';

@Controller()
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern(EVENTS.EMAIL.SEND_OTP)
  async handleSendOtp(
    @Payload() data: ISendEmailOtpPayload,
    @Ctx() context: RmqContext,
  ) {
    const message = context.getMessage();
    const correlationId =
      message.properties.headers?.[METADATA.CORRELATION_ID] || 'unknown';

    this.logger.log(
      `[Notification Service] [CID: ${correlationId}] Processing OTP email for: ${data.email}`,
    );

    try {
      await this.mailService.sendVerifyEmailOtp(data.email, data.otpCode);

      this.logger.log(
        `[Notification Service] [CID: ${correlationId}] OTP email successfully sent to: ${data.email}`,
      );
    } catch (error: any) {
      this.logger.error(
        `[Notification Service] [CID: ${correlationId}] Failed to send OTP to ${data.email}. Error: ${error.message}`,
      );
    }
  }

  @EventPattern(EVENTS.EMAIL.SEND_2FA_QR)
  async handleSendTwoFactorQr(
    @Payload() data: ISendTwoFactorQrPayload,
    @Ctx() context: RmqContext,
  ) {
    const message = context.getMessage();
    const correlationId =
      message.properties.headers?.[METADATA.CORRELATION_ID] || 'unknown';

    this.logger.log(
      `[Notification Service] [CID: ${correlationId}] Processing 2FA QR email for: ${data.email}`,
    );

    try {
      await this.mailService.sendTwoFactorQr(
        data.email,
        data.totpUri,
        data.backupCodes ?? [],
      );

      this.logger.log(
        `[Notification Service] [CID: ${correlationId}] 2FA QR email successfully sent to: ${data.email}`,
      );
    } catch (error: any) {
      this.logger.error(
        `[Notification Service] [CID: ${correlationId}] Failed to send 2FA QR to ${data.email}. Error: ${error.message}`,
      );
    }
  }
}
