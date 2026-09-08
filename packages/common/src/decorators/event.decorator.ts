import { EventPattern as NestEventPattern } from '@nestjs/microservices';

/**
 * Обгортка над оригінальним декоратором NestJS,
 * яка вирішує конфлікт сигнатур у TypeScript 6.
 */
export function EventPattern(pattern: string | object): MethodDecorator {
  return NestEventPattern(pattern) as MethodDecorator;
}
