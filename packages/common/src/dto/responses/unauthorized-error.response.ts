import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedErrorResponse {
  @ApiProperty({
    example: 'UNAUTHORIZED',
  })
  code!: string;

  @ApiProperty({
    example: 'Unauthorized',
  })
  message!: string;
}
