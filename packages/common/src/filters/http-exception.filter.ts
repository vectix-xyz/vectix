import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP-ERROR');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url } = request;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage =
      typeof message === 'object' && message !== null
        ? (message as any).message || JSON.stringify(message)
        : message;

    const formattedError = Array.isArray(errorMessage)
      ? errorMessage.join(', ')
      : errorMessage;

    const stack =
      status >= 500 && exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `${method} ${url} ${status} [ERROR: ${formattedError}]`,
      stack,
    );

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      error: message,
    };

    httpAdapter.reply(response, responseBody, status);
  }
}
