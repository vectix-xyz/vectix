const EMAIL_EVENT_PREFIX = 'email';
const SMS_EVENT_PREFIX = 'sms';
const USER_EVENT_PREFIX = 'user';
const COMPANY_EVENT_PREFIX = 'company';

export const EVENTS = {
  COMPANY: {
    CREATE: `${COMPANY_EVENT_PREFIX}.create`,
  },
  EMAIL: {
    SEND_OTP: `${EMAIL_EVENT_PREFIX}.send-otp`,
    SEND_2FA_TOTP: `${EMAIL_EVENT_PREFIX}.send-2fa-totp`,
    SEND_2FA_QR: `${EMAIL_EVENT_PREFIX}.send-2fa-qr`,
  },
  SMS: {
    SEND_OTP: `${SMS_EVENT_PREFIX}.send-otp`,
  },
  USER: {
    REGISTERED: `${USER_EVENT_PREFIX}.registered`,
  },
} as const;

export const EVENT_TYPES = {
  EMIT: 'EMIT',
  SEND: 'SEND',
} as const;
