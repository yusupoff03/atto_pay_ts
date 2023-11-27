import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateCardDto {
  @IsString()
  public name: string;
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  @IsNotEmpty()
  public pan: string;
  @IsString()
  @IsNotEmpty()
  public expiry_month: string;
  @IsNotEmpty()
  @IsString()
  public expiry_year: string;
  public owner_name: string;
  @IsString()
  @IsNotEmpty()
  public id: string;
  @IsString()
  @IsNotEmpty()
  public code: string;
}
export class CardUpdateDto {
  id: string;
  @IsString()
  name: string;
}
export class CardOwner {
  @IsString()
  @IsNotEmpty()
  @Matches(/\b(?:\d[ -]*?){16}\b/)
  public pan: string;
}
export class CardForOtp {
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  @IsNotEmpty()
  public pan: string;
  @IsString()
  @IsNotEmpty()
  public expiry_month: string;
  @IsNotEmpty()
  @IsString()
  public expiry_year: string;
}
