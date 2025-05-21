import { Type } from 'class-transformer';
import { IsDecimal, IsNumber } from 'class-validator';

export class CreatePlantingDto {
  @IsNumber()
  propertyId: number;

  @IsNumber()
  cropId: number;

  @IsNumber()
  year: number;

  @Type(() => String)
  @IsDecimal()
  area: string;

  @Type(() => String)
  @IsDecimal()
  yeld?: string;
}
