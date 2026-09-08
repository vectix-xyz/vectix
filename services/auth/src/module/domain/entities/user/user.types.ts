import { Email } from '../../value-objects';

export interface IUserProps {
  id: string;
  email: Email;
  name: string;
  emailVerified: boolean;
  role?: string;
  phoneNumber?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
