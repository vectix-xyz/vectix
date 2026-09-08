import {
  SendTwoFactorQrCommand,
  SendTwoFactorTotpCommand,
} from '@module/application/commands';
import { ITwoFactorNotificationPort } from '@module/application/ports';
import { ScheduleTwoFactorEmailUseCase } from '@module/application/use-cases';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TwoFactorNotificationAdapter implements ITwoFactorNotificationPort {
  constructor(private readonly useCase: ScheduleTwoFactorEmailUseCase) {}

  async scheduleQrCodeEmail(command: SendTwoFactorQrCommand): Promise<void> {
    await this.useCase.scheduleQr(command);
  }

  async scheduleOtpEmail(command: SendTwoFactorTotpCommand): Promise<void> {
    await this.useCase.scheduleTotp(command);
  }
}
