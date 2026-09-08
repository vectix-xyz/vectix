import { describe, expect, it } from 'bun:test';

import { InvalidTaxCodeException } from '../exceptions';

import { TaxCode } from './tax-code.value-object';

describe('TaxCode Value Object', () => {
  it('should create a valid 8-digit tax code (ЄДРПОУ)', () => {
    const taxCode = new TaxCode('12345678');
    expect(taxCode.raw).toBe('12345678');
  });

  it('should create a valid 10-digit tax code (ФОП)', () => {
    const taxCode = new TaxCode('1234567890');
    expect(taxCode.raw).toBe('1234567890');
  });

  it('should trim whitespaces automatically', () => {
    const taxCode = new TaxCode('  12345678  ');
    expect(taxCode.raw).toBe('12345678');
  });

  it('should throw InvalidTaxCodeException if length is incorrect', () => {
    expect(() => new TaxCode('12345')).toThrow(InvalidTaxCodeException);
    expect(() => new TaxCode('12345678901')).toThrow(InvalidTaxCodeException);
  });

  it('should throw InvalidTaxCodeException if contains letters', () => {
    expect(() => new TaxCode('1234567A')).toThrow(InvalidTaxCodeException);
  });

  it('should correctly compare two tax codes', () => {
    const taxCode1 = new TaxCode('12345678');
    const taxCode2 = new TaxCode('12345678');
    expect(taxCode1.equals(taxCode2)).toBe(true);
  });
});
