import { Email } from '../../value-objects';

import { IUserProps } from './user.types';

export class UserEntity {
  private constructor(private readonly props: IUserProps) {}

  get id(): string {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get emailValue(): string {
    return this.props.email.raw;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get name(): string {
    return this.props.name;
  }

  get phone(): string | null | undefined {
    return this.props.phone;
  }

  static reconstitute(props: {
    id: string;
    email: string | Email;
    name: string;
    emailVerified: boolean;
    phone?: string | null;
    phoneVerified?: boolean;
  }): UserEntity {
    return new UserEntity({
      id: props.id,
      email:
        props.email instanceof Email ? props.email : new Email(props.email),
      name: props.name,
      emailVerified: props.emailVerified,
      phone: props.phone,
    });
  }
}
