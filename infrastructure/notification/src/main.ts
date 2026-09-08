import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@repo/common/constants';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('NotificationMicroservice');

  const rmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const queueName = QUEUES.NOTIFICATION;

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

  await app.listen();

  logger.log(`\x1b[42mListening to RMQ Queue: ${queueName}\x1b[0m`);
}

bootstrap().catch(err => {
  new Logger('Bootstrap').error(err);
  process.exit(1);
});
