import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetPlantingsDto {
  @IsNumber()
  @IsOptional()
  propertyId: number;

  @IsNumber()
  @IsOptional()
  cropId: number;

  @IsNumber()
  @IsOptional()
  year: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  pageSize: number = 10;
}
