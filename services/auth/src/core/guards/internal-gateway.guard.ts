import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MESSAGES, METADATA } from '@repo/common/constants';

@Injectable()
export class InternalGatewayGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers[METADATA.INTERNAL_TOKEN];

    if (!token) {
      throw new UnauthorizedException(
        MESSAGES.ACCESS_DENIED.DIRECT_ACCESS_IS_FORBIDDEN,
      );
    }

    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException(
        MESSAGES.ACCESS_DENIED.INVALID_OR_EXPIRED_GATEWAY_SIGNATURE,
      );
    }
  }
}
