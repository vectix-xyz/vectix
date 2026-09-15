import { MESSAGES } from '@repo/common/constants';
import { DomainException } from '@repo/common/exceptions';

export class Email {
  private readonly value: string;

  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(email: string) {
    if (!email || typeof email !== 'string') {
      throw new DomainException(MESSAGES.EMAIL.NON_EMPTY);
    }

    const normalized = email.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(normalized)) {
      throw new DomainException(MESSAGES.EMAIL.INVALID_FORMAT_FOR(email));
    }

    this.value = normalized;
  }

  get raw(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    if (!other || !(other instanceof Email)) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return String(this.value);
  }
}
