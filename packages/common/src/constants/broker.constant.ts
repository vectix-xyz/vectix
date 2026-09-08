import { BROKER_KEYS } from './broker-key.constant';

export const COMPANY_SERVICE: unique symbol = Symbol(
  BROKER_KEYS.SERVICE.COMPANY,
);
export const NOTIFICATION_SERVICE: unique symbol = Symbol(
  BROKER_KEYS.SERVICE.NOTIFICATION,
);

export const BROKERS = {
  SERVICE: {
    NOTIFICATION: NOTIFICATION_SERVICE,
    COMPANY: COMPANY_SERVICE,
  },
} as const;
