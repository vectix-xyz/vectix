import { ApiProperty } from '@nestjs/swagger';
import { MESSAGES, STATUSES } from '@repo/common/constants';
import type { TMessageValues, TStatusValues } from '@repo/common/types';

export class GreetingsResponse {
  @ApiProperty({
    example: MESSAGES.GREETINGS,
    enum: MESSAGES,
  })
  message!: TMessageValues;

  @ApiProperty({
    example: STATUSES.OK,
    enum: STATUSES,
  })
  status!: TStatusValues;
}
