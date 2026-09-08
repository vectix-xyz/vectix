import {
  GreetingsResponse,
  HealthDbResponse,
  HealthResponse,
} from '@core/dto/responses';
// import { PrismaService } from '@infrastructure/prisma';
import { Injectable } from '@nestjs/common';
import { MESSAGES, STATUSES } from '@repo/common/constants';

@Injectable()
export class HealthService {
  // constructor(private readonly prisma: PrismaService) {}

  getGreetings(): GreetingsResponse {
    return {
      message: MESSAGES.GREETINGS,
      status: STATUSES.OK,
    };
  }

  getHealth(): HealthResponse {
    return {
      status: STATUSES.OK,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  // async getHealthDb(): Promise<HealthDbResponse> {
  //   try {
  //     await this.prisma.$queryRaw`SELECT 1`;
  //     return {
  //       status: STATUS.OK,
  //       uptime: process.uptime(),
  //       timestamp: new Date().toISOString(),
  //       database: 'connected',
  //     };
  //   } catch (e) {
  //     return {
  //       status: STATUS.ERROR,
  //       uptime: process.uptime(),
  //       timestamp: new Date().toISOString(),
  //       database: 'disconnected',
  //       error: e,
  //     };
  //   }
  // }
}
