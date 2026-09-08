import { PORT_KEYS } from '@repo/common/constants';

import { MailAttachmentCommand } from './../commands/mail-attachment.command';

export interface IMailProviderPort {
  send(options: {
    to: string;
    subject: string;
    html: string;
    attachments?: MailAttachmentCommand[];
  }): Promise<void>;
}

export const MAIL_PROVIDER: unique symbol = Symbol(PORT_KEYS.PROVIDER.MAIL);
export type MAIL_PROVIDER = typeof MAIL_PROVIDER;
