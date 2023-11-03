import { IsString, IsNotEmpty, MinLength, IsEmail, IsAlphanumeric } from 'class-validator';

export class CreateMerchantDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(7)
  public password: string;
}
