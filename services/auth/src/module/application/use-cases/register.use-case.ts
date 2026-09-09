import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { METADATA, ROLES } from '@repo/common/constants';
import { BA_UserResponse } from '@repo/common/dto/responses';
import type { AuthHookContext } from '@thallesp/nestjs-better-auth';

import { UserRegisteredEvent } from '@/module/domain/events';

import { IRegisterHookPayload } from '../payloads';
import { CompanyRegistrationSaga } from '../sagas';

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    private readonly companyRegistrationSaga: CompanyRegistrationSaga,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async afterSignUp(context: AuthHookContext): Promise<void> {
    const body = context.body as IRegisterHookPayload;
    const ctx = context.context as any;

    if (
      ctx?.returned?.status >= 400 ||
      (context as any)?.response?.status >= 400
    ) {
      return;
    }

    const user: BA_UserResponse | undefined =
      ctx?.newSession?.user ??
      ctx?.returned?.user ??
      ctx?.user;

    if (!user) {
      this.logger.warn(
        '[afterSignUp] Could not find user object in context. Skipping saga and event emit.',
      );
      return;
    }

    const correlationId = String(
      context.headers?.get(METADATA.CORRELATION_ID) ?? '',
    );

    if (user.role === ROLES.COMPANY) {
      await this.companyRegistrationSaga.execute(user, body, correlationId);
    }

    this.logger.log(
      `Registration completed for user ${user.id}. Emitting event...`,
    );

    await this.eventEmitter.emitAsync(
      UserRegisteredEvent.EVENT_NAME,
      new UserRegisteredEvent(user, correlationId),
    );
  }
}
