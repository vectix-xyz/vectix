import { MESSAGES } from '@repo/common/constants';
import { DomainException } from '@repo/common/exceptions';

export class Phone {
  private readonly _value: string;

  constructor(rawPhone: string) {
    const cleaned = rawPhone.replace(/\D/g, '');

    if (cleaned.length < 10 || cleaned.length > 15) {
      throw new DomainException(MESSAGES.PHONE.f_INVALID_FORMAT(rawPhone));
    }

    this._value = cleaned;
  }

  get value(): string {
    return this._value;
  }

  get formatted(): string {
    return `+${this._value}`;
  }

  equals(other?: Phone | null): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  toString(): string {
    return this.formatted;
  }
}