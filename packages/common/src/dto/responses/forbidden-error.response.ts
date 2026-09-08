import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenErrorResponse {
  @ApiProperty({
    example: 'Forbidden',
  })
  error!: string;

  @ApiProperty({
    example: 'You do not have permission to access this ...',
  })
  message!: string;

  @ApiProperty({
    example: 403,
  })
  statusCode!: number;
}
