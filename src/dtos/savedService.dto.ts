import { IsString, IsNotEmpty } from 'class-validator';

export class SavedServiceDto {
  @IsString()
  @IsNotEmpty()
  public serviceId: string;
}
