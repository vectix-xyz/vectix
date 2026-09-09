import { PORT_KEYS } from '@repo/common/constants';
import { AdminLevel } from '@repo/common/enums';

export interface IAdminRepositoryPort {
	ensureAdminProfile(userId: string, level: AdminLevel): Promise<void>;
}

export const ADMIN_REPOSITORY: unique symbol = Symbol(PORT_KEYS.REPOSITORY.ADMIN);
export type ADMIN_REPOSITORY = typeof ADMIN_REPOSITORY;