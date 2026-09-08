import { PORT_KEYS } from '@repo/common/constants';

import { SendTwoFactorQrCommand, SendTwoFactorTotpCommand } from '../commands';

export interface ITwoFactorNotificationPort {
  scheduleQrCodeEmail(command: SendTwoFactorQrCommand): Promise<void>;
  scheduleOtpEmail(command: SendTwoFactorTotpCommand): Promise<void>;
}

export const TWO_FACTOR_NOTIFICATION: unique symbol = Symbol(
  PORT_KEYS.TWO_FACTOR_NOTIFICATION,
);
export type TWO_FACTOR_NOTIFICATION = typeof TWO_FACTOR_NOTIFICATION;
