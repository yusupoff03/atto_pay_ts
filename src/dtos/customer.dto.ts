import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
  public phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  public password: string;
}

export class UpdateCustomerDto {
  @IsString()
  public name?: string;
  public image?: any;
  public deleteImage?: boolean;
  public gender?: string;
  public birthDate?: string;
}
export class CustomerLoginDto {
  @IsString()
  @IsNotEmpty()
  public phone: string;
  public password?: string;
  public otp?: string;
}
