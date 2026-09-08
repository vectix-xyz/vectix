import { Inject, Injectable } from '@nestjs/common';
import { CompanyMemberRole } from '@repo/common/enums';

import { CompanyEntity } from '../../domain/entities';
import { CreateCompanyCommand } from '../commands';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepositoryPort,
  type IUnitOfWorkPort,
  UNIT_OF_WORK,
} from '../ports';

@Injectable()
export class CompanyUseCase {
  // constructor(
  //   @Inject(COMPANY_REPOSITORY)
  //   private readonly companyRepository: ICompanyRepositoryPort,
  // ) {}

  // async createCompanyWithOwner(data: {
  //   userId: string;
  //   companyName: string;
  //   taxCode: string;
  // }): Promise<{ success: boolean; companyId: string }> {
  //   const newCompany = CompanyEntity.createNew(data.companyName, data.taxCode);

  //   const companyId = await this.companyRepository.createCompanyWithOwner(
  //     newCompany,
  //     data.userId,
  //   );

  //   return { success: true, companyId };
  // }

  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWorkPort,
  ) {}

  async createCompanyWithOwner(command: CreateCompanyCommand): Promise<string> {
    const newCompany = CompanyEntity.createNew(
      command.companyName,
      command.taxCode,
    );

    return this.uow.executeTx(async txUow => {
      const exists = await txUow.companyRepository.existsByTaxCode(
        newCompany.taxCode.raw,
      );
      if (exists) {
        throw new Error('Company with this tax code already exists');
      }

      const savedCompany = await txUow.companyRepository.save(newCompany);

      await txUow.companyRepository.addMember(
        savedCompany.id as string,
        command.userId,
        CompanyMemberRole.OWNER,
      );

      return savedCompany.id as string;
    });
  }
}
