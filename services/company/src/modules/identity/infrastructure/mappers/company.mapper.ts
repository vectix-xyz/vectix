import { Company as PrismaCompany } from '@infrastructure/prisma/client';
import { CompanyType, EmployeeCount, TransportRange } from '@repo/common/enums';

import { CompanyEntity } from '../../domain/entities/company.entity';
import { TaxCode } from '../../domain/value-objects/tax-code.value-object';

export class CompanyMapper {
  static toDomain(prismaCompany: PrismaCompany): CompanyEntity {
    return new CompanyEntity(
      prismaCompany.id,
      prismaCompany.name,
      new TaxCode(prismaCompany.taxCode),
      prismaCompany.companyType as CompanyType,
      prismaCompany.foundingYear,
      prismaCompany.employeeCount as EmployeeCount,
      prismaCompany.transportCount as TransportRange,
      prismaCompany.routesCount as TransportRange,
      prismaCompany.joinCode,
    );
  }

  static toPersistence(entity: CompanyEntity) {
    return {
      id: entity.id || undefined,
      name: entity.name,
      taxCode: entity.taxCode.raw,
      companyType: entity.companyType,
      foundingYear: entity.foundingYear,
      employeeCount: entity.employeeCount,
      transportCount: entity.transportCount,
      routesCount: entity.routesCount,
      joinCode: entity.joinCode,
    };
  }
}
