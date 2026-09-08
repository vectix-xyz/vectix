import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('LOG_INTERCEPTOR');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    const { method, url } = req;
    const statusCode = this.getStatusCode(res);
    const now = Date.now();

    const message = (delay: number) =>
      `${statusCode} ${method} ${url} ${delay}ms`;

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(message(delay));
      }),
    );
  }

  private getStatusCode(res: any): number {
    if (!res) return 200;

    if (typeof res.statusCode === 'number') {
      return res.statusCode;
    }

    if (typeof res.status === 'number') {
      return res.status;
    }

    return 200;
  }
}
