import { PORT_KEYS } from '@repo/common/constants';

import { CreateCompanyCommand } from '../commands';

export interface ICompanyServicePort {
  createCompany(command: CreateCompanyCommand): Promise<void>;
}

export const COMPANY_SERVICE: unique symbol = Symbol(PORT_KEYS.SERVICE.COMPANY);
export type COMPANY_SERVICE = typeof COMPANY_SERVICE;
