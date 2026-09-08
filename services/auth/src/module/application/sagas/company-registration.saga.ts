import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { MESSAGES, STATUSES } from '@repo/common/constants';
import { BA_UserResponse } from '@repo/common/dto/responses';
import { APIError } from 'better-auth';

import { CreateCompanyCommand } from '../commands';
import { IRegisterHookPayload } from '../payloads';
import {
  COMPANY_SERVICE,
  type ICompanyServicePort,
  type IUserRepositoryPort,
  USER_REPOSITORY,
} from '../ports';

@Injectable()
export class CompanyRegistrationSaga {
  private readonly logger = new Logger(CompanyRegistrationSaga.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @Inject(COMPANY_SERVICE)
    private readonly companyService: ICompanyServicePort,
  ) {}

  async execute(
    user: BA_UserResponse,
    payload: IRegisterHookPayload,
    correlationId: string,
  ): Promise<void> {
    const command = new CreateCompanyCommand(
      user.id,
      payload.companyName || user.name,
      correlationId,
      payload.taxCode,
    );

    try {
      this.logger.log(`[Saga] Executing company creation for user ${user.id}`);
      await this.companyService.createCompany(command);
      this.logger.log(
        `[Saga] Company successfully created for user ${user.id}`,
      );
    } catch (error) {
      this.logger.error(
        `[Saga] Step failed for user ${user.id}. Starting compensation (rollback)...`,
      );

      await this.compensateUserCreation(user.id);

      const errorMessage =
        error instanceof HttpException
          ? error.message
          : (error as Error).message || MESSAGES.ERROR_COMPANY_CREATION;

      const errorStatusCode =
        error instanceof HttpException ? error.getStatus() : 500;

      throw new APIError(
        errorStatusCode as ConstructorParameters<typeof APIError>[0],
        {
          message: errorMessage,
          code: HttpStatus[errorStatusCode] || STATUSES.INTERNAL_SERVER_ERROR,
        },
      );
    }
  }

  private async compensateUserCreation(userId: string): Promise<void> {
    try {
      await this.userRepository.deleteUser(userId);
      this.logger.log(
        `[Saga Compensation] Successfully deleted user ${userId}`,
      );
    } catch (compensationError) {
      this.logger.fatal(
        `[Saga Compensation Failed] Critical inconsistency! Failed to delete user ${userId}`,
        (compensationError as Error).stack,
      );
    }
  }
}
