export class TwoFactorAlreadyEnabledException extends Error {
  constructor(
    message: string = 'Two-factor authentication is already verified and enabled.',
  ) {
    super(message);
    this.name = 'TwoFactorAlreadyEnabledException';
  }
}
