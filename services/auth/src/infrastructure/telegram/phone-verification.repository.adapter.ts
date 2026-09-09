import { PrismaService } from '@infrastructure/prisma';
import { Injectable, Logger } from '@nestjs/common';

import { IPhoneVerificationRepositoryPort } from './phone-verification.repository.port';
import { MESSAGES } from '@repo/common/constants';

@Injectable()
export class PhoneVerificationRepositoryAdapter implements IPhoneVerificationRepositoryPort {
  private readonly logger = new Logger(PhoneVerificationRepositoryAdapter.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateUserPhone(userId: string, phone: string): Promise<void> {
    this.logger.log(
      `Updating phone number and verified status for user: ${userId}`,
    );

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      this.logger.error(
        `[updateUserPhone] User with id "${userId}" not found in database!`,
      );
      throw new Error(MESSAGES.USER.NOT_FOUND_FOR_ID(userId));
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phone,
        phoneVerified: true,
      },
    });
  }

  async isPhoneTaken(phone: string, excludeUserId?: string): Promise<boolean> {
    const existing = await this.prisma.user.findFirst({
      where: {
        phone,
        ...(excludeUserId && {
          id: {
            not: excludeUserId,
          },
        }),
      },
      select: { id: true },
    });

    return Boolean(existing);
  }
}
