import { IsEmail, IsOtpCode } from '@repo/common/validators';

export class ResendOtpRequest {
  @IsEmail()
  email!: string;
}

export class VerifyOtpRequest extends ResendOtpRequest {
  @IsOtpCode()
  code!: string;
}
