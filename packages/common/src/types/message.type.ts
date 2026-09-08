import { MESSAGES } from '../constants';

export type TMessage = typeof MESSAGES;
export type TMessageKeys = keyof TMessage;
export type TMessageValues = (TMessage)[TMessageKeys];
