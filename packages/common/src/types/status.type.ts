import { STATUSES } from '../constants';

export type TStatus = typeof STATUSES;
export type TStatusKeys = keyof TStatus;
export type TStatusValues = (TStatus)[TStatusKeys];
