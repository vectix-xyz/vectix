import { InvalidTaxCodeException } from '../exceptions';

export class TaxCode {
  private readonly value: string;

  constructor(value: string) {
    const cleanValue = value.trim();
    if (!/^\d{8}$/.test(cleanValue) && !/^\d{10}$/.test(cleanValue)) {
      throw new InvalidTaxCodeException(cleanValue);
    }
    this.value = cleanValue;
  }

  get raw(): string {
    return this.value;
  }

  equals(other: TaxCode): boolean {
    return this.value === other.raw;
  }
}
