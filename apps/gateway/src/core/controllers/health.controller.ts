import {
  AuthHealthResponse,
  GreetingsResponse,
  HealthDbResponse,
  HealthResponse,
} from '@core/dto/responses';
import { HealthService } from '@core/services';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('Health')
@AllowAnonymous()
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Welcome endpoint',
    description: 'Returns a simple API welcome message.',
  })
  @ApiOkResponse({
    type: GreetingsResponse,
  })
  @Get()
  getGreetings(): GreetingsResponse {
    return this.healthService.getGreetings();
  }

  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Checks if the Backend is running.',
  })
  @ApiOkResponse({
    type: HealthResponse,
  })
  @Get('health')
  getHealth(): HealthResponse {
    return this.healthService.getHealth();
  }

  // @ApiOperation({
  //   summary: 'Database health check endpoint',
  //   description: 'Checks if the Database is running.',
  // })
  // @ApiOkResponse({
  //   type: HealthResponse,
  // })
  // @Get('db-health')
  // async getHealthDb(): Promise<HealthDbResponse> {
  //   return await this.healthService.getHealthDb();
  // }

  @ApiOperation({
    summary: 'Auth health check endpoint',
    description: 'Checks if the Auth is running.',
  })
  @ApiOkResponse({
    type: AuthHealthResponse,
  })
  @Get('auth/ok')
  healthAuth(): void {}
}
