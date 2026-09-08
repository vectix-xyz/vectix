import { TRole } from '@repo/common/types';

export interface IRegisterHookPayload {
  name: string;
  email: string;
  password: string;
  companyName: string;
  taxCode: string;
  type: TRole;
}
