export const PORT_KEYS = {
  UNIT_OF_WORK: 'UnitOfWork',
  TWO_FACTOR_NOTIFICATION: 'TwoFactorNotification',
  REPOSITORY: {
    COMPANY: 'CompanyRepository',
    USER: 'UserRepository',
    AUTH: 'AuthRepository',
    ADMIN: 'AdminRepository',
    OUTBOX: 'OutboxRepository',
    PHONE_VERIFICATION: 'PhoneVerificationRepository',
  },
  SERVICE: {
    OTP: 'OtpService',
    COMPANY: 'CompanyService',
  },
  PROVIDER: {
    MAIL: 'MailProvider',
    SMS: 'SmsProvider',
  },
};
