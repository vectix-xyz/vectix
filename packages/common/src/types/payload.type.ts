export interface ISendEmailOtpPayload {
  email: string;
  otpCode: string;
}

export interface ISendSmsOtpPayload {
  number: string;
  otpCode: string;
}

export interface ISendTwoFactorQrPayload {
  userId: string;
  email: string;
  totpUri: string;
  backupCodes?: string[];
}

export interface ISendExistingUserSignUpAlertPayload {
  email: string;
  attemptedAt: string;
}
