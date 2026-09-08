import { Controller, HttpStatus, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { EVENTS } from '@repo/common/constants';
import { DomainException } from '@repo/common/exceptions';

import { CreateCompanyCommand } from '../../application/commands';
import { CompanyUseCase } from '../../application/use-cases';
import { CreateCompanyRequest } from '../dto/requests';
import { CreateCompanyResponse } from '../dto/responses';

@Controller()
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name);
  constructor(private readonly companyUseCase: CompanyUseCase) {}

  @MessagePattern(EVENTS.COMPANY.CREATE)
  async handleCreateProfile(
    @Payload() data: CreateCompanyRequest,
    @Ctx() context: RmqContext,
  ): Promise<CreateCompanyResponse> {
    const message = context.getMessage();
    const correlationId =
      message.properties.headers?.['x-correlation-id'] || 'unknown';

    this.logger.log(`Working on request with Correlation ID: ${correlationId}`);

    try {
      const command = new CreateCompanyCommand(
        data.userId,
        data.companyName,
        data.taxCode,
      );

      const companyId =
        await this.companyUseCase.createCompanyWithOwner(command);

      return {
        success: true,
        companyId,
        statusCode: HttpStatus.CREATED,
      };

      // return await this.companyUseCase.createCompanyWithOwner(data);
    } catch (error: any) {
      // const message: string =
      //   error.code === 'P2002'
      //     ? 'Company with this tax code exist'
      //     : error?.message || 'Internal server error';

      // this.logger.error(message);
      // return { success: false, message, statusCode: HttpStatus.BAD_REQUEST };

      if (error instanceof DomainException) {
        return {
          success: false,
          message: error.message,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        };
      }

      this.logger.error(error?.message || 'Internal server error');
      return {
        success: false,
        message: error?.message || 'Internal server error',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
