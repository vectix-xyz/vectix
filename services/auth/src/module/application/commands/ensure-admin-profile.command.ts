import { AdminLevel } from '@repo/common/enums';

export class EnsureAdminProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly level: AdminLevel,
  ) {}
}