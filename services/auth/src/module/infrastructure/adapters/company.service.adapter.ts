import { CreateCompanyCommand } from '@module/application/commands';
import { type ICompanyServicePort } from '@module/application/ports';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import {
  COMPANY_SERVICE,
  EVENTS,
  MESSAGES,
  METADATA,
} from '@repo/common/constants';
import { catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class CompanyServiceAdapter implements ICompanyServicePort {
  private readonly logger = new Logger(CompanyServiceAdapter.name);

  constructor(
    @Inject(COMPANY_SERVICE)
    private readonly companyClient: ClientProxy,
  ) {}

  async createCompany(command: CreateCompanyCommand): Promise<void> {
    const record = new RmqRecordBuilder({
      userId: command.userId,
      companyName: command.companyName,
      taxCode: command.taxCode,
    })
      .setOptions({
        headers: { [METADATA.CORRELATION_ID]: command.correlationId },
      })
      .build();

    this.logger.log(
      `Sending create company RPC. Correlation ID: ${command.correlationId}`,
    );

    const result: any = await lastValueFrom(
      this.companyClient.send(EVENTS.COMPANY.CREATE, record).pipe(
        catchError(err => {
          const rawError = err?.response || err?.message || err?.error || err;
          let message: string = MESSAGES.INTERNAL_RPC_ERROR;
          let statusCode = HttpStatus.BAD_REQUEST;

          if (typeof rawError === 'string') {
            try {
              const parsed = JSON.parse(rawError);
              message = parsed.message || parsed.error || rawError;
              statusCode = parsed.statusCode || statusCode;
            } catch {
              message = rawError;
            }
          } else if (typeof rawError === 'object' && rawError !== null) {
            message = rawError.message || rawError.error || message;
            statusCode = rawError.statusCode || statusCode;
          }

          throw new HttpException(message, statusCode);
        }),
      ),
    );

    if (!result?.success) {
      throw new HttpException(
        result?.message ?? MESSAGES.INTERNAL_RPC_ERROR,
        result?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
