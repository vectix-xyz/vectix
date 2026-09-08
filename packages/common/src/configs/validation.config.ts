import { ValidationPipeOptions } from '@nestjs/common';

export function getValidationConfig(): ValidationPipeOptions {
  return {
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  };
}
