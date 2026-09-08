import { CompanyType, EmployeeCount, TransportRange } from '@repo/common/enums';

import { TaxCode } from '../value-objects';

export class CompanyEntity {
  constructor(
    public readonly id: string | null,
    public readonly name: string,
    public readonly taxCode: TaxCode,
    public readonly companyType: CompanyType,
    public readonly foundingYear: number,
    public readonly employeeCount: EmployeeCount,
    public readonly transportCount: TransportRange,
    public readonly routesCount: TransportRange,
    public readonly joinCode: string,
  ) {}

  static createNew(name: string, rawTaxCode: string): CompanyEntity {
    return new CompanyEntity(
      null,
      name,
      new TaxCode(rawTaxCode),
      CompanyType.OTHER,
      new Date().getFullYear(),
      EmployeeCount.UP_TO_10,
      TransportRange.FROM_1_TO_5,
      TransportRange.FROM_1_TO_5,
      Math.random().toString(36).substring(2, 8).toUpperCase(),
    );
  }
}
