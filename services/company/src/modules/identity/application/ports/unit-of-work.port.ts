import { PORT_KEYS } from '@repo/common/constants';

import { ICompanyRepositoryPort } from './company.repository.port';

export const UNIT_OF_WORK = Symbol(PORT_KEYS.UNIT_OF_WORK);

export interface IUnitOfWorkPort {
  readonly companyRepository: ICompanyRepositoryPort;

  executeTx<T>(work: (uow: IUnitOfWorkPort) => Promise<T>): Promise<T>;
}
