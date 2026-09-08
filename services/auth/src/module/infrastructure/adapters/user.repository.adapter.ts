import { PrismaService } from '@infrastructure/prisma';
import { Prisma } from '@infrastructure/prisma/client';
import type { IUserRepositoryPort } from '@module/application/ports';
import { UserEntity } from '@module/domain/entities';
import { Injectable, Optional } from '@nestjs/common';

type PrismaClientType = PrismaService | Prisma.TransactionClient;

@Injectable()
export class UserRepositoryAdapter implements IUserRepositoryPort {
  private readonly client!: PrismaClientType;

  constructor(@Optional() prisma?: PrismaService) {
    if (prisma) {
      this.client = prisma;
    }
  }

  static withTransaction(tx: Prisma.TransactionClient): UserRepositoryAdapter {
    const adapter = new UserRepositoryAdapter();
    (adapter as any).client = tx;
    return adapter;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.client.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!raw) return null;

    return UserEntity.reconstitute({
      id: raw.id,
      email: raw.email,
      name: raw.name,
      emailVerified: raw.emailVerified,
      // phoneNumber: raw.phoneNumber,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.user.delete({
      where: { id },
    });
  }

  async isTwoFactorEnabled(userId: string): Promise<boolean> {
    const user = await this.client.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });
    return user?.twoFactorEnabled ?? false;
  }
}
