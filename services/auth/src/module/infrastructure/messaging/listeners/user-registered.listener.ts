import { SendOtpUseCase } from '@module/application/use-cases';
import { UserRegisteredEvent } from '@module/domain/events';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  constructor(private readonly sendOtpUseCase: SendOtpUseCase) {}

  @OnEvent(UserRegisteredEvent.EVENT_NAME, { async: true })
  async handle(event: UserRegisteredEvent): Promise<void> {
    const { user, correlationId } = event;

    try {
      await this.sendOtpUseCase.execute({
        email: user.email,
        correlationId,
      });
    } catch (error) {
      this.logger.error(
        `UserRegisteredListener failed for user: ${user.id}`,
        (error as Error)?.stack,
      );
    }
  }
}
