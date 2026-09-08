export class CreateCompanyCommand {
  constructor(
    public readonly userId: string,
    public readonly companyName: string,
    public readonly correlationId: string,
    public readonly taxCode?: string,
  ) {}
}
