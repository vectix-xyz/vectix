import { Role } from '@repo/common/enums';
import { Email, Phone } from '../../value-objects';

export interface IUserBanProps {
  isBanned: boolean;
  reason?: string | null;
  expiresAt?: Date | null;
}

export interface IUserProps {
  id: string;
  name: string;
  email: Email;
  emailVerified: boolean;
  phone?: Phone | null;
  phoneVerified: boolean;
  image?: string | null;
  role: Role;
  twoFactorEnabled: boolean;
  ban: IUserBanProps;
  createdAt: Date;
  updatedAt: Date;
}
