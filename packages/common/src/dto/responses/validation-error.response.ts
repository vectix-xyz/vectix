import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorResponse {
  @ApiProperty({
    example: 'Bad Request',
  })
  error!: string;

  @ApiProperty({
    example:
      'Name must be at least 2 characters long, Invalid establishment type',
  })
  message!: string;

  @ApiProperty({
    example: 400,
  })
  statusCode!: number;
}
