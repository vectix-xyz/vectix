import { DomainException } from '@repo/common/exceptions';

export class InvalidTaxCodeException extends DomainException {
  constructor(code: string) {
    super(`Tax code '${code}' is invalid. It must be exactly 8 or 10 digits.`);
  }
}
