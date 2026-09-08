import { PORT_KEYS } from '@repo/common/constants';

export interface ISmsProviderPort {
  send(options: { to: string; body: string }): Promise<void>;
}

export const SMS_PROVIDER: unique symbol = Symbol(PORT_KEYS.PROVIDER.SMS);
export type SMS_PROVIDER = typeof SMS_PROVIDER;
