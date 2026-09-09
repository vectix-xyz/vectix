import { Email } from '../../value-objects';

export interface IUserProps {
  id: string;
  email: Email;
  name: string;
  emailVerified: boolean;
  role?: string;
  phone?: string | null;
  phoneVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
