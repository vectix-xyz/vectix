import {
  ADMIN_REPOSITORY,
  type IAdminRepositoryPort,
} from '@module/application/ports';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { EnsureAdminProfileCommand } from '../commands';

@Injectable()
export class EnsureAdminProfileUseCase {
  private readonly logger = new Logger(EnsureAdminProfileUseCase.name);

  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepositoryPort,
  ) {}

  async execute(command: EnsureAdminProfileCommand): Promise<void> {
    this.logger.log(
      `👑 Creating Admin record [${command.level}] for user: ${command.userId}`,
    );
    await this.adminRepository.ensureAdminProfile(
      command.userId,
      command.level,
    );
  }
}
