import { Type } from 'class-transformer';
import { IsDecimal, IsNumber, IsOptional } from 'class-validator';

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
  @IsOptional()
  @IsDecimal()
  yeld?: string;
}
