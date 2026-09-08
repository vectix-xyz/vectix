import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { brokerEnvConfig, getValidationConfig } from '@repo/common/configs';
import { QUEUES } from '@repo/common/constants';
import { AllExceptionsFilter } from '@repo/common/filters';
import { LoggingInterceptor } from '@repo/common/interceptors';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Company Microservice');

  const rmqUrl = brokerEnvConfig().queue.rabbitMq.url;
  const queueName = QUEUES.COMPANY;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe(getValidationConfig()));
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen();

  logger.log(`Listening to RMQ Queue: ${queueName}`);
}

bootstrap().catch(err => {
  new Logger('Bootstrap').error(err);
  process.exit(1);
});
