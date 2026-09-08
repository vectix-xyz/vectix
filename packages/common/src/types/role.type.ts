import { ROLES } from '../constants';

export type TRole = Omit<typeof ROLES, 'ADMIN'>;
export type TRoleKeys = keyof TRole;
export type TRoleValues = (TRole)[TRoleKeys];
