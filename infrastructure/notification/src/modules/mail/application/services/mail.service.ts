import { type IMailProviderPort, MAIL_PROVIDER } from '@mail/application/ports';
import { Inject, Injectable } from '@nestjs/common';

import { twoFactorQrTemplate, verifyEmailOtpTemplate } from '../templates';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: IMailProviderPort,
  ) {}

  async sendVerifyEmailOtp(email: string, otpCode: string): Promise<void> {
    const { subject, html } = verifyEmailOtpTemplate({ code: otpCode, email });
    await this.mailProvider.send({ to: email, subject, html });
  }

  async sendTwoFactorQr(
    email: string,
    totpUri: string,
    backupCodes: string[] = [],
  ): Promise<void> {
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
}
