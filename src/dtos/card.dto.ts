import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

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
}
export class CardUpdateDto {
  id: string;
  @IsString()
  name: string;
}
