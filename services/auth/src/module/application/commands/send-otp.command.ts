export class SendOtpCommand {
  constructor(
    public readonly email: string,
    public readonly correlationId: string,
    public readonly phone?: string,
  ) {}
}
