import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCustomerDto {
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
  @IsString()
  @IsNotEmpty()
  public password?: string;
  public image?: any;
  public deleteImage?: boolean;
}
export class CustomerLoginDto {
  public phone: string;
  public password?: string;
  public otp?: string;
}
