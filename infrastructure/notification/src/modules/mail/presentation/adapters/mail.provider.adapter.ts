import { IMailProviderPort } from '@mail/application/ports';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { commonEnvConfig, notificationEnvConfig } from '@repo/common/configs';
import { ENodesEnv } from '@repo/common/enums';
import { Resend } from 'resend';
import { MailAttachmentCommand } from '@mail/application/commands/mail-attachment.command';

@Injectable()
export class MailProviderAdapter implements IMailProviderPort {
  private readonly resend: Resend;
  private readonly fromEmail: string;
  private readonly logger = new Logger(MailProviderAdapter.name + ' | Resend');

  constructor(
    @Inject(notificationEnvConfig.KEY)
    private readonly notificationEnv: ConfigType<typeof notificationEnvConfig>,
    @Inject(commonEnvConfig.KEY)
    private readonly commonEnv: ConfigType<typeof commonEnvConfig>,
  ) {
    this.resend = new Resend(this.notificationEnv.resend.apiKey);
    this.fromEmail = this.notificationEnv.resend.mailFrom;
  }

  async send({
    to,
    subject,
    html,
    attachments
  }: {
    to: string;
    subject: string;
    html: string;
    attachments?: MailAttachmentCommand[];
  }): Promise<void> {
    const mailTo =
      this.commonEnv.nodeEnv === ENodesEnv.DEVELOPMENT
        ? 'yanbellq@gmail.com'
        : to;
    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: [mailTo],
      subject,
      html,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        content_id: att.cid,
        content_type: att.contentType,
      })),
    });

    if (error) {
      this.logger.error(`Resend SDK Error: ${JSON.stringify(error)}`);
      throw new Error(`Failed to send email via Resend`);
    }
  }
}
