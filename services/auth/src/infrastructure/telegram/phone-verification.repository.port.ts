import { PORT_KEYS } from '@repo/common/constants';

export interface IPhoneVerificationRepositoryPort {
  updateUserPhone(userId: string, phone: string): Promise<void>;
  isPhoneTaken(phone: string, excludeUserId?: string): Promise<boolean>;
}

export const PHONE_VERIFICATION_REPOSITORY: unique symbol = Symbol(
  PORT_KEYS.REPOSITORY.PHONE_VERIFICATION,
);
export type PHONE_VERIFICATION_REPOSITORY =
  typeof PHONE_VERIFICATION_REPOSITORY;
