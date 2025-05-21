import { Type } from 'class-transformer';
import { IsDecimal, IsNumber, IsOptional } from 'class-validator';

export class UpdatePlantingDto {
  @IsNumber()
  @IsOptional()
  propertyId?: number;

  @IsNumber()
  @IsOptional()
  cropId?: number;

  @IsNumber()
  @IsOptional()
  year?: number;

  @Type(() => String)
  @IsDecimal()
  @IsOptional()
  area?: string;

  @Type(() => String)
  @IsDecimal()
  @IsOptional()
  yeld?: string;
}
