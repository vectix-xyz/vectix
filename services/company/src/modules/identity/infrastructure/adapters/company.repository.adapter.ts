// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '@infrastructure/prisma';
// import { CompanyMemberRole } from '@repo/common/enums';
// import { ICompanyRepositoryPort } from '../../application/ports';
// import { CompanyEntity } from '../../domain/entities';
// @Injectable()
// export class CompanyRepositoryAdapter implements ICompanyRepositoryPort {
//   constructor(private readonly prisma: PrismaService) {}
//   async createCompanyWithOwner(company: CompanyEntity, ownerId: string): Promise<string> {
//     return this.prisma.$transaction(async (tx) => {
//       const createdCompany = await tx.company.create({
//         data: {
//           name: company.name,
//           taxCode: company.taxCode,
//           companyType: company.companyType,
//           foundingYear: company.foundingYear,
//           employeeCount: company.employeeCount,
//           transportCount: company.transportCount,
//           routesCount: company.routesCount,
//           joinCode: company.joinCode,
//         },
//       });
//       await tx.companyMember.create({
//         data: {
//           userId: ownerId,
//           companyId: createdCompany.id,
//           role: CompanyMemberRole.OWNER,
//         },
//       });
//       return createdCompany.id;
//     });
//   }
//   async findByTaxCode(taxCode: string): Promise<CompanyEntity | null> {
//     return null;
//   }
// }
import { PrismaService } from '@infrastructure/prisma';
import { Prisma } from '@infrastructure/prisma/client';
import { CompanyMemberRole } from '@repo/common/enums';

import { ICompanyRepositoryPort } from '../../application/ports';
import { CompanyEntity } from '../../domain/entities';
import { CompanyMapper } from '../mappers';

export class CompanyRepositoryAdapter implements ICompanyRepositoryPort {
  constructor(
    private readonly prismaClient: Prisma.TransactionClient | PrismaService,
  ) {}

  async save(company: CompanyEntity): Promise<CompanyEntity> {
    const data = CompanyMapper.toPersistence(company);
    const saved = await this.prismaClient.company.create({ data });
    return CompanyMapper.toDomain(saved);
  }

  async addMember(
    companyId: string,
    userId: string,
    role: CompanyMemberRole,
  ): Promise<void> {
    await this.prismaClient.companyMember.create({
      data: { companyId, userId, role },
    });
  }

  async existsByTaxCode(taxCode: string): Promise<boolean> {
    const count = await this.prismaClient.company.count({
      where: { taxCode },
    });
    return count > 0;
  }
}
