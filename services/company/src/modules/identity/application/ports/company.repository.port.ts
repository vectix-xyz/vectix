import { PORT_KEYS } from '@repo/common/constants';
import { CompanyMemberRole } from '@repo/common/enums';

import { CompanyEntity } from '../../domain/entities';

export const COMPANY_REPOSITORY = Symbol(PORT_KEYS.REPOSITORY.COMPANY);

// export interface ICompanyRepositoryPort {
//   createCompanyWithOwner(company: CompanyEntity, ownerId: string): Promise<string>;
//   findByTaxCode(taxCode: string): Promise<CompanyEntity | null>;
// }

export interface ICompanyRepositoryPort {
  save(company: CompanyEntity): Promise<CompanyEntity>;
  addMember(
    companyId: string,
    userId: string,
    role: CompanyMemberRole,
  ): Promise<void>;
  existsByTaxCode(taxCode: string): Promise<boolean>;
}
