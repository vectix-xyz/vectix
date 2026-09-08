import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('LOG');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const now = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const delay = Date.now() - now;
      const message = `${statusCode} ${method} ${originalUrl} ${delay}ms`;

      if (statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
