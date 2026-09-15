export const MESSAGES = {
  GREETINGS: 'Welcome to the vectix.com',
  VERIFIED_EMAIL: 'Email verified successfully',
  OTP_SENT: 'OTP sent successfully',
  OTP_RESENT: 'If the account exists, a new OTP will be dispatched.',
  VALIDATION_FAILED: 'Validation failed',
  OTP_INVALID: 'Invalid or expired OTP code',
  SOCIAL_REGISTRATION_NOT_ALLOWED: 'Social registration not allowed',
  ERROR_COMPANY_CREATION: 'Error creating company profile. Check credentials',
  INTERNAL_RPC_ERROR: 'Internal RPC Error',
  RABBITMQ_CONNECTION_ERROR:
    'RabbitMQ connection is down. Cannot dispatch message.',
  f_UNKNOWN_MESSAGE_TYPE: (type: string) => `Unknown message type: ${type}`,
  f_UNKNOWN_SERVICE_TARGET: (target: string) =>
    `Unknown serviceTarget: ${target}`,
  EMAIL: {
    NON_EMPTY: 'Email must be a non-empty string',
    INVALID_FORMAT: 'Invalid email format',
    f_INVALID_FORMAT: (email: string) => `Invalid email format: ${email}`,
    ALREADY_REGISTERED: 'Email already registered',
    NOT_FOUND: 'Email not found',
  },
  PHONE: {
    NON_EMPTY: 'Phone number must be a non-empty string',
    REQUIRED: 'Phone number is required.',
    INVALID_FORMAT: 'Invalid phone number format',
    f_INVALID_FORMAT: (phone: string) =>
      `Invalid phone number format: ${phone}`,
    ALREADY_REGISTERED: 'Phone number already registered',
    NOT_FOUND: 'Phone number not found',
    AUTHENTICATION_REQUIRED: 'Authentication required to verify phone number.',
  },
  PASSWORD: {
    NON_EMPTY: 'Password must be a non-empty string',
    INVALID_LENGTH: 'Password must be at least 8 characters long',
  },
  AUTH_SESSION_TOKEN_MISSING: 'Authentication session token missing',
  SESSION_NOT_FOUND: 'Session not found or invalid',
  SESSION_EXPIRED: 'Session expired',
  INVALID_USER_IN_SESSION: 'Invalid user in session',
  FAILED_TO_PROCESS_SESSION: 'Failed to process session',
  ACCESS_DENIED: {
    DIRECT_ACCESS_IS_FORBIDDEN: 'Access denied: direct access is forbidden',
    INVALID_OR_EXPIRED_GATEWAY_SIGNATURE:
      'Access denied: invalid or expired gateway signature',
  },
  VERIFICATION_TOKEN_REQUIRED: 'Verification token is required.',
  USER: {
    NOT_FOUND_FOR_ID: (id: string) => `User not found for id: ${id}`,
  },
  TELEGRAM: {
    CONTACT_MUST_BELONG_TO_YOUR_ACCOUNT:
      'Contact must belong to your Telegram account',
    PHONE_NUMBER_MISMATCH:
      'Shared phone number does not match registered phone',
    PHONE_NUMBER_ALREADY_TAKEN:
      'Phone number is already associated with another account',
    SESSION_NOT_FOUND: 'Session not found or invalid',
    SESSION_EXPIRED: 'Session expired',
    INVALID_USER_IN_SESSION: 'Invalid user in session',
    FAILED_TO_PROCESS_SESSION: 'Failed to process session',
  },
} as const;
