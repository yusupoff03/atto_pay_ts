import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  public name: string;
  public phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class UpdateCustomerDto {
  @IsString()
  public name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}
