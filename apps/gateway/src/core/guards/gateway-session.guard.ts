import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  COOKIES_KEYS,
  EXCLUDED_ROUTES,
  MESSAGES,
  METADATA,
  REDIS_KEYS,
} from '@repo/common/constants';
import { Role } from '@repo/common/enums';
import { RedisService } from '@repo/infrastructure/redis';

@Injectable()
export class GatewaySessionGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.raw?.url || request.url || '';

    const isExcluded = EXCLUDED_ROUTES.some(route => url.startsWith(route));
    if (isExcluded) {
      return true;
    }

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException(MESSAGES.AUTH_SESSION_TOKEN_MISSING);
    }

    let sessionDataRaw = await this.redisService.get(token);
    if (!sessionDataRaw) {
      sessionDataRaw = await this.redisService.get(
        REDIS_KEYS.BETTER_AUTH.SESSION(token),
      );
    }

    if (!sessionDataRaw) {
      throw new UnauthorizedException(MESSAGES.SESSION_NOT_FOUND);
    }

    try {
      const parsedData = JSON.parse(sessionDataRaw);

      const sessionObj = parsedData.session || parsedData;
      const expiresAt = sessionObj.expiresAt
        ? new Date(sessionObj.expiresAt).getTime()
        : 0;

      if (expiresAt && expiresAt < Date.now()) {
        throw new UnauthorizedException(MESSAGES.SESSION_EXPIRED);
      }

      const user = parsedData.user || {};
      const userId = user.id || sessionObj.userId || parsedData.userId;
      const userRole = user.role || parsedData.role || Role.PASSENGER;

      if (!userId) {
        throw new UnauthorizedException(MESSAGES.INVALID_USER_IN_SESSION);
      }

      request.user = user;
      request.session = sessionObj;

      request.headers[METADATA.USER_ID] = userId;
      request.headers[METADATA.USER_ROLE] = userRole;

      if (request.raw && request.raw.headers) {
        request.raw.headers[METADATA.USER_ID] = userId;
        request.raw.headers[METADATA.USER_ROLE] = userRole;
      }

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException(MESSAGES.FAILED_TO_PROCESS_SESSION);
    }
  }

  private extractToken(request: any): string | null {
    const authHeader =
      request.headers?.authorization || request.headers?.Authorization;
    if (authHeader && typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }

    const sessionHeader = request.headers?.[METADATA.SESSION_TOKEN];
    if (sessionHeader && typeof sessionHeader === 'string') {
      return sessionHeader;
    }

    const cookies =
      request.cookies || this.parseCookieHeader(request.headers?.cookie);
    if (cookies) {
      if (cookies[COOKIES_KEYS.BETTER_AUTH.SESSION_TOKEN])
        return cookies[COOKIES_KEYS.BETTER_AUTH.SESSION_TOKEN];
      if (cookies[COOKIES_KEYS.BETTER_AUTH.SECURE_SESSION_TOKEN])
        return cookies[COOKIES_KEYS.BETTER_AUTH.SECURE_SESSION_TOKEN];
      if (cookies[COOKIES_KEYS.SESSION_TOKEN])
        return cookies[COOKIES_KEYS.SESSION_TOKEN];
    }

    return null;
  }

  private parseCookieHeader(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) return {};
    return Object.fromEntries(
      cookieHeader
        .split(';')
        .map(cookie => cookie.trim().split('='))
        .filter(
          (parts): parts is [string, string] =>
            parts.length >= 2 && Boolean(parts[0]) && Boolean(parts[1]),
        )
        .map(([key, val]) => [key, decodeURIComponent(val)]),
    );
  }
}
