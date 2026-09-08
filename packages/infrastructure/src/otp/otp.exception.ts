import { BadRequestException } from '@nestjs/common';

export class OtpThrottleError extends BadRequestException {
  constructor() {
    super('Please, wait a minute before next request.');
  }
}

export class OtpInvalidCodeError extends BadRequestException {
  constructor() {
    super('Invalid or expired code.');
  }
}

export class OtpLimitError extends BadRequestException {
  constructor() {
    super('The attempt limit has been exceeded. Please request a new code.');
  }
}
