import { type IMailProviderPort, MAIL_PROVIDER } from '@mail/application/ports';
import { Inject, Injectable } from '@nestjs/common';
import {
  ISendEmailOtpPayload,
  ISendExistingUserSignUpAlertPayload,
  ISendTwoFactorQrPayload,
} from '@repo/common/types';

import {
  existingUserSignUpAlertTemplate,
  twoFactorQrTemplate,
  verifyEmailOtpTemplate,
} from '../templates';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: IMailProviderPort,
  ) {}

  async sendVerifyEmailOtp({
    email,
    otpCode,
  }: ISendEmailOtpPayload): Promise<void> {
    const { subject, html } = verifyEmailOtpTemplate({ code: otpCode, email });
    await this.mailProvider.send({ to: email, subject, html });
  }

  async sendTwoFactorQr({
    userId,
    email,
    totpUri,
    backupCodes = [],
  }: ISendTwoFactorQrPayload): Promise<void> {
    const encodedUri = encodeURIComponent(totpUri);

    const qrImageUrl = `https://quickchart.io/qr?text=${encodedUri}&size=200&ecLevel=M&margin=1`;

    const { subject, html } = twoFactorQrTemplate({
      email,
      qrCodeDataUrl: qrImageUrl,
      backupCodes,
    });

    await this.mailProvider.send({
      to: email,
      subject,
      html,
    });
  }

  async sendExistingUserSignUpAlert({
    email,
    attemptedAt,
  }: ISendExistingUserSignUpAlertPayload): Promise<void> {
    const { subject, html } = existingUserSignUpAlertTemplate({
      email,
      attemptedAt,
    });
    await this.mailProvider.send({ to: email, subject, html });
  }
}
