import { IsCreditCard, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class TransferMoneyDto {
  @IsString()
  @IsNotEmpty()
  public fromCardId: string;
  @IsString()
  @IsNotEmpty()
  // @IsCreditCard()
  @MinLength(16)
  @MaxLength(16)
  public toCardPan: string;
  @IsNotEmpty()
  public amount: number;
}
