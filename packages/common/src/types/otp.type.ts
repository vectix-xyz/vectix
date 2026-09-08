import { OTP_PURPOSE_KEYS } from "../constants";

export type TOtpPurpose = (typeof OTP_PURPOSE_KEYS)[keyof typeof OTP_PURPOSE_KEYS];

export interface IOtpSessionData {
  hash: string;
  userId?: string;
  purpose: TOtpPurpose;
  createdAt: number;
}