import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ForbiddenErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '../dto/responses';

export const ApiAuthenticationErrorResponse = () =>
  applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: UnauthorizedErrorResponse,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden | Casl ability check failed',
      type: ForbiddenErrorResponse,
    }),
  );

export const ApiValidationErrorResponse = () =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'Validation error',
      type: ValidationErrorResponse,
    }),
  );
