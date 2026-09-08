export class CreateCompanyCommand {
  constructor(
    public readonly userId: string,
    public readonly companyName: string,
    public readonly taxCode: string,
  ) {}
}
