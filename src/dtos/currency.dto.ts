import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
export class CurrencyCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  name: string;
  abbreviation?: string;
}
export class CurrencyUpdateDto {
  id: string;
  name?: string;
  abbreviation?: string;
}
