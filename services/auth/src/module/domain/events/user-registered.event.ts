import { EVENTS } from '@repo/common/constants';
import { BA_UserResponse } from '@repo/common/dto/responses';

export class UserRegisteredEvent {
  public static readonly EVENT_NAME = EVENTS.USER.REGISTERED;

  constructor(
    public readonly user: BA_UserResponse,
    public readonly correlationId: string,
  ) {}
}
