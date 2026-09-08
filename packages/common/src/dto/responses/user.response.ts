import type { TRoleValues } from '../../types';

export class BA_UserResponse {
  id!: string;

  name!: string;
  email!: string;
  emailVerified!: boolean;
  image!: string | null;
  role!: TRoleValues;

  banned!: boolean;
  banReason!: string | null;
  banExpires!: string | null;

  createdAt!: string;
  updatedAt!: string;
}
