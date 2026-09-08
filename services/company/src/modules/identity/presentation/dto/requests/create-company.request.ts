import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCompanyRequest {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @Length(8, 10)
  taxCode!: string;
}
