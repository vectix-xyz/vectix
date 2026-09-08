import { PORT_KEYS } from '@repo/common/constants';
import { IOtpSessionData, TOtpPurpose } from '@repo/common/types';

export interface IOtpServicePort {
  getCode(
    email: string,
    userId?: string,
    purpose?: TOtpPurpose,
  ): Promise<{ code: string }>;
  verify(email: string, code: string): Promise<IOtpSessionData>;
}

export const OTP_SERVICE: unique symbol = Symbol(PORT_KEYS.SERVICE.OTP);
export type OTP_SERVICE = typeof OTP_SERVICE;
