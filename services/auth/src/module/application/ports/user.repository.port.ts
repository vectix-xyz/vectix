import { UserEntity } from '@module/domain/entities';
import { PORT_KEYS } from '@repo/common/constants';

export interface IUserRepositoryPort {
  findByEmail(email: string): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<void>;
  isTwoFactorEnabled(userId: string): Promise<boolean>;
}

export const USER_REPOSITORY: unique symbol = Symbol(PORT_KEYS.REPOSITORY.USER);
export type USER_REPOSITORY = typeof USER_REPOSITORY;
