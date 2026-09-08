export class MailAttachmentCommand {
  constructor(
    public readonly filename: string,
    public readonly content: Buffer | string,
    public readonly cid?: string,
    public readonly contentType?: string,
  ) {}
}