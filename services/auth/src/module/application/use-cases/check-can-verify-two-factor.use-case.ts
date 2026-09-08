import {
  type IUserRepositoryPort,
  USER_REPOSITORY,
} from '@module/application/ports';
import { TwoFactorAlreadyEnabledException } from '@module/domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CheckCanVerifyTwoFactorUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<void> {
    const isEnabled = await this.userRepository.isTwoFactorEnabled(userId);

    if (isEnabled) {
      throw new TwoFactorAlreadyEnabledException(
        'Two-factor authentication is already verified and enabled.',
      );
    }
  }
}
