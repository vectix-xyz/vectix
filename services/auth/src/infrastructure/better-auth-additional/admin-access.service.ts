import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { authEnvConfig } from '@repo/common/configs';
import { AdminLevel, Role } from '@repo/common/enums';
import type { IAdminCandidate } from '@repo/common/types';

@Injectable()
export class AdminAccessService {
  private readonly superAdminEmails: Set<string>;

  constructor(
    @Inject(authEnvConfig.KEY)
    private readonly authEnv: ConfigType<typeof authEnvConfig>,
  ) {
    this.superAdminEmails = new Set(this.authEnv.superAdmins);
  }

  isDefaultAdmin(candidate: IAdminCandidate): boolean {
    if (candidate.banned) {
      return false;
    }

    const normalizedEmail = candidate.email?.trim().toLowerCase();

    const isWhitelisted = normalizedEmail
      ? this.superAdminEmails.has(normalizedEmail)
      : false;

    const isCorporateDomain =
      normalizedEmail?.endsWith('@vectix.com') ?? false;

    const hasAdminRole = candidate.role === Role.ADMIN;

    return isWhitelisted || isCorporateDomain || hasAdminRole;
  }

  resolveAdminLevel(email?: string): AdminLevel {
    const normalizedEmail = email?.trim().toLowerCase();

    if (normalizedEmail && this.superAdminEmails.has(normalizedEmail)) {
      return AdminLevel.SUPER_ADMIN;
    }

    if (normalizedEmail?.endsWith('@vectix.com')) {
      return AdminLevel.MODERATOR;
    }

    return AdminLevel.SUPPORT;
  }
}