import { APP_PORTAL_KEYS } from '@repo/common/constants';
import { Role } from '@repo/common/enums';

import { Email, Phone } from '../../value-objects';

import { IUserProps } from './user.types';

export class UserEntity {
  private constructor(private readonly props: IUserProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
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

  get phone(): Phone | null | undefined {
    return this.props.phone;
  }

  get phoneValue(): string | null {
    return this.props.phone ? this.props.phone.value : null;
  }

  get phoneVerified(): boolean {
    return this.props.phoneVerified;
  }

  get image(): string | null | undefined {
    return this.props.image;
  }

  get role(): Role {
    return this.props.role;
  }

  get twoFactorEnabled(): boolean {
    return this.props.twoFactorEnabled;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isBanned(atDate: Date = new Date()): boolean {
    if (!this.props.ban.isBanned) return false;
    if (!this.props.ban.expiresAt) return true;
    return this.props.ban.expiresAt > atDate;
  }

  get banReason(): string | null {
    return this.isBanned() ? (this.props.ban.reason ?? null) : null;
  }

  canAccessPortal(appType?: string): boolean {
    if (!appType) return true;

    switch (appType) {
      case APP_PORTAL_KEYS.COMPANY_PORTAL:
        return this.props.role === Role.COMPANY;
      case APP_PORTAL_KEYS.DRIVER_APP:
        return this.props.role === Role.DRIVER;
      case APP_PORTAL_KEYS.PASSENGER_WEB:
        return true;
      default:
        return false;
    }
  }

  static reconstitute(props: {
    id: string;
    name: string;
    email: string | Email;
    emailVerified: boolean;
    phone?: string | Phone | null;
    phoneVerified?: boolean;
    image?: string | null;
    role: string;
    twoFactorEnabled?: boolean | null;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): UserEntity {
    return new UserEntity({
      id: props.id,
      name: props.name,
      email:
        props.email instanceof Email ? props.email : new Email(props.email),
      emailVerified: props.emailVerified,
      phone: props.phone
        ? props.phone instanceof Phone
          ? props.phone
          : new Phone(props.phone)
        : null,
      phoneVerified: Boolean(props.phoneVerified),
      image: props.image ?? null,
      role: props.role as Role,
      twoFactorEnabled: Boolean(props.twoFactorEnabled),
      ban: {
        isBanned: Boolean(props.banned),
        reason: props.banReason,
        expiresAt: props.banExpires,
      },
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }
}
