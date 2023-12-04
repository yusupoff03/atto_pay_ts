import { IsNotEmpty, IsString, Matches } from 'class-validator';
export class CreateTransportCardDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(9987)\d{12}$/)
  public pan: string;
  @IsString()
  @IsNotEmpty()
  public expiry_month: string;
  @IsNotEmpty()
  @IsString()
  public expiry_year: string;
  @IsString()
  @IsNotEmpty()
  public id?: string;
}
export class TopUpCardDto {
  @IsString()
  @IsNotEmpty()
  public fromCardId: string;
  @IsString()
  @IsNotEmpty()
  public toCardId: string;
  @IsNotEmpty()
  public amount: number;
}
