import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/prisma';
import { IAdminRepositoryPort } from '@module/application/ports';
import { AdminLevel } from '@repo/common/enums';

@Injectable()
export class AdminRepositoryAdapter implements IAdminRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async ensureAdminProfile(userId: string, level: AdminLevel): Promise<void> {
    await this.prisma.admin.upsert({
      where: { userId },
      update: { level },
      create: {
        userId,
				level,
      },
    });
  }
}